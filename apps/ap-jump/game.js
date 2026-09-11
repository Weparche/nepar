const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const startOverlay = document.querySelector('#startOverlay');
const gameOverOverlay = document.querySelector('#gameOverOverlay');
const startButton = document.querySelector('#startButton');
const restartButton = document.querySelector('#restartButton');
const shareButton = document.querySelector('#shareButton');
const scoreEl = document.querySelector('#score');
const bestScoreEl = document.querySelector('#bestScore');
const finalScoreEl = document.querySelector('#finalScore');
const gameOverTitle = document.querySelector('#gameOverTitle');

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 292;
const BEST_KEY = 'ap-jump-best-v1';

let running = false;
let dead = false;
let lastTime = 0;
let score = 0;
let distance = 0;
let speed = 390;
let spawnTimer = 0;
let nextSpawn = 1.1;
let bgOffset = 0;
let dust = [];
let obstacles = [];
let best = Number(localStorage.getItem(BEST_KEY) || 0);

bestScoreEl.textContent = formatScore(best);

const player = {
  x: 125,
  y: GROUND_Y - 74,
  w: 48,
  h: 74,
  vy: 0,
  gravity: 2150,
  jump: -790,
  grounded: true,
  frame: 0,
};

const obstacleTypes = [
  { kind: 'bags', w: 58, h: 46, label: 'VREĆE' },
  { kind: 'tire', w: 44, h: 44, label: 'GUMA' },
  { kind: 'fridge', w: 46, h: 78, label: 'FRIŽIDER' },
  { kind: 'sofa', w: 82, h: 48, label: 'KAUČ' },
];

function formatScore(value) {
  return Math.floor(value).toString().padStart(5, '0');
}

function resetGame() {
  running = true;
  dead = false;
  score = 0;
  distance = 0;
  speed = 390;
  spawnTimer = 0;
  nextSpawn = 1.05;
  bgOffset = 0;
  dust = [];
  obstacles = [];
  player.y = GROUND_Y - player.h;
  player.vy = 0;
  player.grounded = true;
  scoreEl.textContent = '00000';
  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function jump() {
  if (!running || dead) return;
  if (player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
    for (let i = 0; i < 4; i++) {
      dust.push({ x: player.x + 12 + i * 7, y: GROUND_Y - 2, life: .35 + Math.random() * .2, vx: -45 - Math.random() * 55 });
    }
  }
}

function spawnObstacle() {
  const t = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  obstacles.push({
    ...t,
    x: W + 25,
    y: GROUND_Y - t.h,
  });
  const minGap = Math.max(.78, 1.22 - (speed - 390) / 1000);
  nextSpawn = minGap + Math.random() * .62;
}

function update(dt) {
  distance += speed * dt;
  score += dt * (speed / 31);
  speed = Math.min(760, 390 + score * 1.55);
  bgOffset = (bgOffset + speed * dt * .19) % W;
  scoreEl.textContent = formatScore(score);

  player.vy += player.gravity * dt;
  player.y += player.vy * dt;
  if (player.y >= GROUND_Y - player.h) {
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.grounded = true;
  }
  player.frame += dt * (speed / 95);

  spawnTimer += dt;
  if (spawnTimer >= nextSpawn) {
    spawnTimer = 0;
    spawnObstacle();
  }

  for (const o of obstacles) o.x -= speed * dt;
  obstacles = obstacles.filter(o => o.x + o.w > -30);

  for (const p of dust) {
    p.x += p.vx * dt;
    p.life -= dt;
  }
  dust = dust.filter(p => p.life > 0);

  const hitbox = {
    x: player.x + 10,
    y: player.y + 7,
    w: player.w - 17,
    h: player.h - 9,
  };

  for (const o of obstacles) {
    const padX = o.kind === 'sofa' ? 6 : 4;
    const box = { x: o.x + padX, y: o.y + 4, w: o.w - padX * 2, h: o.h - 4 };
    if (rectsOverlap(hitbox, box)) {
      endGame(o.label);
      return;
    }
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function endGame(label) {
  running = false;
  dead = true;
  const final = Math.floor(score);
  if (final > best) {
    best = final;
    localStorage.setItem(BEST_KEY, String(best));
    bestScoreEl.textContent = formatScore(best);
    gameOverTitle.textContent = 'Novi rekord. Problem ipak ostaje.';
  } else {
    gameOverTitle.textContent = `Zaustavio te: ${label.toLowerCase()}.`;
  }
  finalScoreEl.textContent = `Rezultat: ${formatScore(final)}`;
  gameOverOverlay.classList.remove('hidden');
  draw();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawSky();
  drawMountains();
  drawSigns();
  drawGround();
  drawDust();
  drawObstacles();
  drawPlayer();
}

function drawSky() {
  ctx.fillStyle = '#fbfaf4';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d7d9cf';
  for (let i = 0; i < 5; i++) {
    const x = ((i * 247 - bgOffset * .2) % (W + 240)) - 100;
    ctx.fillRect(x, 72 + (i % 2) * 24, 46, 4);
    ctx.fillRect(x + 18, 68 + (i % 2) * 24, 55, 4);
  }
}

function drawMountains() {
  const shift = bgOffset * .42;
  ctx.save();
  ctx.translate(-(shift % 480), 0);
  for (let r = 0; r < 3; r++) {
    const baseX = r * 480;
    ctx.fillStyle = '#d6d3c8';
    ctx.beginPath();
    ctx.moveTo(baseX - 120, GROUND_Y);
    ctx.lineTo(baseX + 55, 184);
    ctx.lineTo(baseX + 120, 225);
    ctx.lineTo(baseX + 202, 156);
    ctx.lineTo(baseX + 302, 223);
    ctx.lineTo(baseX + 386, 181);
    ctx.lineTo(baseX + 520, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#777b70';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(baseX + 167, 187);
    ctx.lineTo(baseX + 202, 156);
    ctx.lineTo(baseX + 228, 175);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSigns() {
  const x = 770 - (bgOffset * .9 % 1320);
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.fillStyle = '#ece4b7';
  ctx.fillRect(x, 108, 118, 55);
  ctx.strokeRect(x, 108, 118, 55);
  ctx.fillStyle = '#20231f';
  ctx.font = '700 20px Courier New';
  ctx.fillText('LIKA', x + 33, 142);
  ctx.beginPath();
  ctx.moveTo(x + 58, 163);
  ctx.lineTo(x + 58, GROUND_Y);
  ctx.stroke();
}

function drawGround() {
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 1);
  ctx.lineTo(W, GROUND_Y + 1);
  ctx.stroke();

  ctx.strokeStyle = '#8a8d82';
  ctx.lineWidth = 2;
  const stripeShift = distance % 90;
  for (let x = -90; x < W + 90; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x - stripeShift, GROUND_Y + 26);
    ctx.lineTo(x + 38 - stripeShift, GROUND_Y + 26);
    ctx.stroke();
  }
}

function drawDust() {
  ctx.fillStyle = '#888a80';
  for (const p of dust) ctx.fillRect(p.x, p.y, 5, 3);
}

function drawObstacles() {
  for (const o of obstacles) {
    ctx.save();
    ctx.translate(Math.round(o.x), Math.round(o.y));
    ctx.strokeStyle = '#20231f';
    ctx.fillStyle = '#5f625a';
    ctx.lineWidth = 3;

    if (o.kind === 'bags') {
      ctx.beginPath();
      ctx.moveTo(4, o.h);
      ctx.lineTo(10, 15);
      ctx.lineTo(21, 6);
      ctx.lineTo(30, 14);
      ctx.lineTo(39, 5);
      ctx.lineTo(51, 14);
      ctx.lineTo(56, o.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 16); ctx.lineTo(21, 20);
      ctx.moveTo(31, 14); ctx.lineTo(40, 18);
      ctx.stroke();
    } else if (o.kind === 'tire') {
      ctx.beginPath();
      ctx.arc(22, 22, 20, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fbfaf4';
      ctx.beginPath();
      ctx.arc(22, 22, 8, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    } else if (o.kind === 'fridge') {
      ctx.fillStyle = '#d3d6cf';
      ctx.fillRect(2, 2, o.w - 4, o.h - 2);
      ctx.strokeRect(2, 2, o.w - 4, o.h - 2);
      ctx.beginPath();
      ctx.moveTo(2, 30); ctx.lineTo(o.w - 2, 30);
      ctx.stroke();
      ctx.fillStyle = '#20231f';
      ctx.fillRect(7, 13, 4, 11);
      ctx.fillRect(7, 39, 4, 15);
    } else {
      ctx.fillStyle = '#8a6958';
      ctx.fillRect(3, 15, o.w - 6, 30);
      ctx.strokeRect(3, 15, o.w - 6, 30);
      ctx.fillRect(9, 3, 24, 24);
      ctx.strokeRect(9, 3, 24, 24);
      ctx.fillRect(49, 3, 24, 24);
      ctx.strokeRect(49, 3, 24, 24);
      ctx.fillStyle = '#20231f';
      ctx.fillRect(10, 45, 6, 3);
      ctx.fillRect(o.w - 16, 45, 6, 3);
    }
    ctx.restore();
  }
}

function drawPlayer() {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  const runningPhase = Math.sin(player.frame * Math.PI);
  const legA = player.grounded ? runningPhase * 7 : -3;
  const legB = player.grounded ? -runningPhase * 7 : 4;

  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 3;

  ctx.strokeStyle = '#252a3c';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(20, 53); ctx.lineTo(14 + legA, 70); ctx.lineTo(9 + legA, 73);
  ctx.moveTo(31, 53); ctx.lineTo(36 + legB, 69); ctx.lineTo(43 + legB, 72);
  ctx.stroke();

  ctx.fillStyle = '#222a42';
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(12, 24);
  ctx.lineTo(39, 24);
  ctx.lineTo(37, 58);
  ctx.lineTo(15, 58);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#f3f2ec';
  ctx.beginPath();
  ctx.moveTo(21, 25); ctx.lineTo(30, 25); ctx.lineTo(28, 45); ctx.lineTo(23, 45); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a72a2a';
  ctx.beginPath();
  ctx.moveTo(25, 28); ctx.lineTo(28, 32); ctx.lineTo(25, 47); ctx.lineTo(22, 32); ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#222a42';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(14, 31); ctx.lineTo(4, 43 + (player.grounded ? runningPhase * 2 : -4));
  ctx.moveTo(38, 31); ctx.lineTo(46, 43 - (player.grounded ? runningPhase * 2 : 5));
  ctx.stroke();

  ctx.fillStyle = '#efc9a8';
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 3;
  ctx.fillRect(15, 4, 22, 22);
  ctx.strokeRect(15, 4, 22, 22);

  ctx.fillStyle = '#777b80';
  ctx.fillRect(14, 2, 24, 7);
  ctx.fillRect(17, 0, 4, 6);
  ctx.fillRect(23, 0, 4, 7);
  ctx.fillRect(30, 1, 4, 6);

  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 2;
  ctx.strokeRect(17, 11, 7, 5);
  ctx.strokeRect(28, 11, 7, 5);
  ctx.beginPath(); ctx.moveTo(24, 13); ctx.lineTo(28, 13); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 10px Courier New';
  ctx.fillText('AP', 20, 56);

  ctx.restore();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min((now - lastTime) / 1000, 0.032);
  lastTime = now;
  update(dt);
  draw();
  if (running) requestAnimationFrame(loop);
}

function handleAction(event) {
  if (event?.type === 'keydown') {
    if (!['Space', 'ArrowUp', 'KeyW'].includes(event.code)) return;
    event.preventDefault();
  }

  if (!running && !dead) {
    resetGame();
    return;
  }
  if (dead) return;
  jump();
}

window.addEventListener('keydown', handleAction, { passive: false });
canvas.addEventListener('pointerdown', handleAction);
startButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', resetGame);

shareButton.addEventListener('click', async () => {
  const text = `Napravio sam ${formatScore(score)} u AP Jumpu. Možeš bolje?`;
  const url = 'https://lika.nepar.hr/';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'AP Jump', text, url });
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      shareButton.textContent = 'KOPIRANO';
      setTimeout(() => { shareButton.textContent = 'PODIJELI'; }, 1400);
    }
  } catch {
    // Sharing can be cancelled by the user; no further action needed.
  }
});

draw();
