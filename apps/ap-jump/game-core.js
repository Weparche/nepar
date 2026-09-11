const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const startOverlay = document.querySelector('#startOverlay');
const gameOverOverlay = document.querySelector('#gameOverOverlay');
const startButton = document.querySelector('#startButton');
const restartButton = document.querySelector('#restartButton');
const shareButton = document.querySelector('#shareButton');
const soundButton = document.querySelector('#soundButton');
const scoreEl = document.querySelector('#score');
const bestScoreEl = document.querySelector('#bestScore');
const difficultyEl = document.querySelector('#difficulty');
const finalScoreEl = document.querySelector('#finalScore');
const gameOverTitle = document.querySelector('#gameOverTitle');
const usernameInput = document.querySelector('#username');
const usernameError = document.querySelector('#usernameError');
const submitStatus = document.querySelector('#submitStatus');
const leaderboardList = document.querySelector('#leaderboardList');
const leaderboardStatus = document.querySelector('#leaderboardStatus');
const refreshLeaderboardButton = document.querySelector('#refreshLeaderboard');

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 294;
const BEST_KEY = 'ap-jump-best-v1';
const USERNAME_KEY = 'ap-jump-username-v1';
const SOUND_KEY = 'ap-jump-sound-v1';
const SHARE_URL = 'https://apjump.nepar.hr/';

const BASE_SPEED = 390;
const MAX_SPEED = 1120;
const PLAYER_W = 52;
const PLAYER_H = 78;

let running = false;
let dead = false;
let lastTime = 0;
let score = 0;
let lastFinalScore = 0;
let distance = 0;
let speed = BASE_SPEED;
let spawnTimer = 0;
let nextSpawn = 1.12;
let bgDistance = 0;
let dust = [];
let obstacles = [];
let birds = [];
let popups = [];
let shake = 0;
let hitFlash = 0;
let milestone = 100;
let best = Number(localStorage.getItem(BEST_KEY) || 0);
let currentUsername = localStorage.getItem(USERNAME_KEY) || '';
let soundEnabled = localStorage.getItem(SOUND_KEY) !== 'off';
let audioCtx = null;

bestScoreEl.textContent = formatScore(best);
usernameInput.value = currentUsername;
updateSoundButton();

const player = {
  x: 126,
  y: GROUND_Y - PLAYER_H,
  w: PLAYER_W,
  h: PLAYER_H,
  vy: 0,
  gravity: 2220,
  jump: -825,
  grounded: true,
  frame: 0,
};

const obstacleTypes = [
  { kind: 'bags', w: 58, h: 46, label: 'VREĆE SMEĆA', minTier: 0 },
  { kind: 'tire', w: 44, h: 44, label: 'STARA GUMA', minTier: 0 },
  { kind: 'fridge', w: 46, h: 78, label: 'FRIŽIDER', minTier: 0 },
  { kind: 'sofa', w: 82, h: 48, label: 'KAUČ', minTier: 0 },
  { kind: 'washer', w: 54, h: 58, label: 'PERILICA', minTier: 1 },
  { kind: 'mattress', w: 88, h: 36, label: 'MADRAC', minTier: 1 },
  { kind: 'radioactive', w: 62, h: 58, label: 'RADIOAKTIVNI OTPAD', minTier: 1 },
  { kind: 'medical', w: 54, h: 52, label: 'MEDICINSKI OTPAD', minTier: 2 },
  { kind: 'ewaste', w: 66, h: 49, label: 'ELEKTRONIČKI OTPAD', minTier: 2 },
  { kind: 'oil', w: 46, h: 60, label: 'BAČVA OTPADA', minTier: 2 },
  { kind: 'asbestos', w: 72, h: 42, label: 'AZBESTNE PLOČE', minTier: 3 },
  { kind: 'skip', w: 92, h: 56, label: 'RAZVALJENI KONTEJNER', minTier: 4 },
];

function formatScore(value) {
  return Math.floor(value).toString().padStart(5, '0');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function validateUsername(value) {
  const normalized = normalizeUsername(value);
  const length = Array.from(normalized).length;
  if (length < 2 || length > 20) {
    return { ok: false, message: 'Ime mora imati 2–20 znakova.' };
  }
  if (!/^[\p{L}\p{N} _.-]+$/u.test(normalized)) {
    return { ok: false, message: 'Koristi slova, brojeve, razmak, _, - ili točku.' };
  }
  return { ok: true, value: normalized };
}

function difficultyTier() {
  if (score >= 900) return 5;
  if (score >= 600) return 4;
  if (score >= 360) return 3;
  if (score >= 180) return 2;
  if (score >= 70) return 1;
  return 0;
}

function difficultyLabel() {
  return ['LAGANO', 'BRŽE', 'NAPETO', 'TEŠKO', 'BRUTALNO', 'KAOS'][difficultyTier()];
}

function targetSpeed() {
  const linear = BASE_SPEED + score * 1.42;
  const tierBoost = difficultyTier() * 36;
  return Math.min(MAX_SPEED, linear + tierBoost);
}

function spawnWindow() {
  const tier = difficultyTier();
  const min = Math.max(0.50, 1.08 - tier * 0.095 - (speed - BASE_SPEED) / 2600);
  const jitter = Math.max(0.20, 0.56 - tier * 0.055);
  return min + Math.random() * jitter;
}

function eligibleObstacles(tier = difficultyTier()) {
  return obstacleTypes.filter(item => item.minTier <= tier);
}

function randomObstacle(tier = difficultyTier()) {
  const pool = eligibleObstacles(tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pushObstacle(type, x) {
  obstacles.push({
    ...type,
    x,
    y: GROUND_Y - type.h,
    phase: Math.random() * Math.PI * 2,
  });
}

function spawnObstaclePattern() {
  const tier = difficultyTier();
  const first = randomObstacle(tier);
  pushObstacle(first, W + 32);

  const comboChance =
    tier >= 5 ? 0.34 :
    tier >= 4 ? 0.26 :
    tier >= 3 ? 0.17 :
    tier >= 2 ? 0.08 : 0;

  if (Math.random() < comboChance) {
    const secondPool = eligibleObstacles(Math.max(0, tier - 1))
      .filter(item => item.kind !== 'skip' && item.h <= 60);
    const second = secondPool[Math.floor(Math.random() * secondPool.length)];
    const comboGap = clamp(160 + (MAX_SPEED - speed) * 0.11 + Math.random() * 55, 138, 245);
    pushObstacle(second, W + 32 + first.w + comboGap);
  }

  nextSpawn = spawnWindow();
}

function attemptStart() {
  const result = validateUsername(usernameInput.value);
  if (!result.ok) {
    usernameError.textContent = result.message;
    usernameError.classList.remove('hidden');
    usernameInput.focus();
    return;
  }

  currentUsername = result.value;
  usernameInput.value = currentUsername;
  localStorage.setItem(USERNAME_KEY, currentUsername);
  usernameError.textContent = '';
  usernameError.classList.add('hidden');
  resetGame();
}

function resetGame() {
  ensureAudio();
  running = true;
  dead = false;
  score = 0;
  lastFinalScore = 0;
  distance = 0;
  bgDistance = 0;
  speed = BASE_SPEED;
  spawnTimer = 0;
  nextSpawn = 1.08;
  dust = [];
  obstacles = [];
  birds = [];
  popups = [];
  shake = 0;
  hitFlash = 0;
  milestone = 100;

  player.y = GROUND_Y - player.h;
  player.vy = 0;
  player.grounded = true;
  player.frame = 0;

  scoreEl.textContent = '00000';
  difficultyEl.textContent = difficultyLabel();
  submitStatus.textContent = '';
  shareButton.textContent = 'PODIJELI';
  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');

  playTone(260, 0.055, 'square', 0.025);
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function jump() {
  if (!running || dead || !player.grounded) return;

  player.vy = player.jump;
  player.grounded = false;

  for (let i = 0; i < 6; i++) {
    dust.push({
      x: player.x + 12 + i * 5,
      y: GROUND_Y - 2,
      life: .3 + Math.random() * .22,
      vx: -55 - Math.random() * 90,
      vy: -12 - Math.random() * 25,
      size: 3 + Math.random() * 3,
    });
  }

  playTone(420, 0.045, 'square', 0.018);
}

function update(dt) {
  distance += speed * dt;
  bgDistance += speed * dt;
  score += dt * (speed / 31);
  speed += (targetSpeed() - speed) * Math.min(1, dt * 1.8);

  scoreEl.textContent = formatScore(score);
  difficultyEl.textContent = difficultyLabel();

  if (score >= milestone) {
    popups.push({ text: `${milestone}!`, x: W * .5, y: 92, life: .85 });
    playTone(720, .055, 'square', .018);
    milestone += 100;
  }

  player.vy += player.gravity * dt;
  player.y += player.vy * dt;
  if (player.y >= GROUND_Y - player.h) {
    if (!player.grounded && player.vy > 180) {
      for (let i = 0; i < 3; i++) {
        dust.push({
          x: player.x + 15 + i * 9,
          y: GROUND_Y - 2,
          life: .22 + Math.random() * .12,
          vx: -25 - Math.random() * 40,
          vy: -10 - Math.random() * 12,
          size: 3,
        });
      }
    }
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.grounded = true;
  }
  player.frame += dt * (speed / 92);

  spawnTimer += dt;
  if (spawnTimer >= nextSpawn) {
    spawnTimer = 0;
    spawnObstaclePattern();
  }

  for (const o of obstacles) {
    o.x -= speed * dt;
    o.phase += dt * 3;
  }
  obstacles = obstacles.filter(o => o.x + o.w > -50);

  for (const p of dust) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 80 * dt;
    p.life -= dt;
  }
  dust = dust.filter(p => p.life > 0);

  for (const b of birds) {
    b.x -= (speed * .16 + 28) * dt;
    b.phase += dt * 8;
  }
  birds = birds.filter(b => b.x > -60);
  if (birds.length < 2 && Math.random() < dt * .07) {
    birds.push({ x: W + 40, y: 75 + Math.random() * 75, phase: Math.random() * Math.PI * 2 });
  }

  for (const popup of popups) {
    popup.y -= 22 * dt;
    popup.life -= dt;
  }
  popups = popups.filter(p => p.life > 0);

  if (shake > 0) shake = Math.max(0, shake - dt * 18);
  if (hitFlash > 0) hitFlash = Math.max(0, hitFlash - dt * 4.8);

  const hitbox = {
    x: player.x + 11,
    y: player.y + 7,
    w: player.w - 19,
    h: player.h - 10,
  };

  for (const o of obstacles) {
    const padX = ['sofa', 'ewaste', 'radioactive', 'skip', 'mattress'].includes(o.kind) ? 7 : 4;
    const padY = o.kind === 'mattress' ? 7 : 4;
    const box = {
      x: o.x + padX,
      y: o.y + padY,
      w: o.w - padX * 2,
      h: o.h - padY,
    };

    if (rectsOverlap(hitbox, box)) {
      endGame(o.label);
      return;
    }
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function endGame(label) {
  running = false;
  dead = true;
  shake = 8;
  hitFlash = 1;

  const final = Math.floor(score);
  lastFinalScore = final;

  playCrash();

  if (final > best) {
    best = final;
    localStorage.setItem(BEST_KEY, String(best));
    bestScoreEl.textContent = formatScore(best);
    gameOverTitle.textContent = 'Novi rekord. Problem ipak ostaje.';
  } else {
    gameOverTitle.textContent = `Zaustavio te: ${label.toLowerCase()}.`;
  }

  finalScoreEl.textContent = `Rezultat: ${formatScore(final)} · ${difficultyLabel()}`;
  setTimeout(() => gameOverOverlay.classList.remove('hidden'), 220);
  submitScore(final);

  const finish = performance.now();
  const impactFrame = now => {
    draw();
    if (now - finish < 220) requestAnimationFrame(impactFrame);
  };
  requestAnimationFrame(impactFrame);
}
