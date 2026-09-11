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
const usernameInput = document.querySelector('#username');
const usernameError = document.querySelector('#usernameError');
const submitStatus = document.querySelector('#submitStatus');
const leaderboardList = document.querySelector('#leaderboardList');
const leaderboardStatus = document.querySelector('#leaderboardStatus');
const refreshLeaderboardButton = document.querySelector('#refreshLeaderboard');

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 292;
const BASE_SPEED = 390;
const MAX_SPEED = 1020;
const BEST_KEY = 'ap-jump-best-v1';
const USERNAME_KEY = 'ap-jump-username-v1';
const SHARE_URL = 'https://apjump.nepar.hr/';

let running = false;
let dead = false;
let lastTime = 0;
let score = 0;
let lastFinalScore = 0;
let distance = 0;
let speed = BASE_SPEED;
let spawnTimer = 0;
let nextSpawn = 1.1;
let bgOffset = 0;
let dust = [];
let obstacles = [];
let best = Number(localStorage.getItem(BEST_KEY) || 0);
let currentUsername = localStorage.getItem(USERNAME_KEY) || '';

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
  { kind:'bags', w:58, h:46, label:'VREĆE SMEĆA', minScore:0, weight:7 },
  { kind:'tire', w:44, h:44, label:'STARA GUMA', minScore:0, weight:6 },
  { kind:'fridge', w:46, h:78, label:'FRIŽIDER', minScore:45, weight:4 },
  { kind:'washer', w:54, h:58, label:'PERILICA', minScore:70, weight:4 },
  { kind:'sofa', w:82, h:48, label:'KAUČ', minScore:90, weight:4 },
  { kind:'mattress', w:92, h:34, label:'MADRAC', minScore:120, weight:4 },
  { kind:'tv', w:58, h:49, label:'STARI TV', minScore:150, weight:4 },
  { kind:'toilet', w:50, h:55, label:'WC ŠKOLJKA', minScore:180, weight:3 },
  { kind:'ewaste', w:68, h:50, label:'ELEKTRONIČKI OTPAD', minScore:210, weight:4 },
  { kind:'oil', w:46, h:60, label:'BAČVA OTPADA', minScore:240, weight:4 },
  { kind:'chemical', w:50, h:62, label:'KEMIJSKI OTPAD', minScore:280, weight:3 },
  { kind:'medical', w:54, h:52, label:'MEDICINSKI OTPAD', minScore:320, weight:3 },
  { kind:'radioactive', w:62, h:58, label:'RADIOAKTIVNI OTPAD', minScore:360, weight:3 },
  { kind:'asbestos', w:76, h:40, label:'AZBESTNE PLOČE', minScore:420, weight:3 },
  { kind:'scrap', w:78, h:48, label:'METALNI OTPAD', minScore:470, weight:3 },
  { kind:'skip', w:96, h:56, label:'RAZVALJENI KONTEJNER', minScore:540, weight:2 },
];

bestScoreEl.textContent = formatScore(best);
usernameInput.value = currentUsername;

function formatScore(value) {
  return Math.floor(value).toString().padStart(5, '0');
}

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function validateUsername(value) {
  const normalized = normalizeUsername(value);
  const length = Array.from(normalized).length;
  if (length < 2 || length > 20) return { ok:false, message:'Ime mora imati 2–20 znakova.' };
  if (!/^[\p{L}\p{N} _.-]+$/u.test(normalized)) return { ok:false, message:'Koristi slova, brojeve, razmak, _, - ili točku.' };
  return { ok:true, value:normalized };
}

function tier() {
  if (score >= 700) return 5;
  if (score >= 500) return 4;
  if (score >= 330) return 3;
  if (score >= 200) return 2;
  if (score >= 100) return 1;
  return 0;
}

function currentTargetSpeed() {
  const boosts = [0, 25, 50, 80, 105, 125];
  return Math.min(MAX_SPEED, BASE_SPEED + score * 0.9 + boosts[tier()]);
}

function nextSpawnDelay() {
  const t = tier();
  const mins = [1.00, .92, .84, .76, .68, .60];
  const jitters = [.62, .56, .50, .44, .38, .34];
  return mins[t] + Math.random() * jitters[t];
}

function pickWeightedObstacle() {
  const available = obstacleTypes.filter(o => score >= o.minScore);
  const total = available.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * total;
  for (const o of available) {
    roll -= o.weight;
    if (roll <= 0) return o;
  }
  return available[available.length - 1];
}

function pushObstacle(type, x) {
  obstacles.push({ ...type, x, y: GROUND_Y - type.h });
}

function spawnObstacle() {
  const first = pickWeightedObstacle();
  pushObstacle(first, W + 26);

  const t = tier();
  const comboChance = [0, 0, .03, .08, .14, .20][t];
  if (Math.random() < comboChance) {
    const comboPool = obstacleTypes.filter(o => score >= o.minScore && o.kind !== 'skip' && o.kind !== 'fridge' && o.h <= 60);
    const second = comboPool[Math.floor(Math.random() * comboPool.length)];
    const gap = 185 + Math.random() * 65;
    pushObstacle(second, W + 26 + first.w + gap);
  }

  nextSpawn = nextSpawnDelay();
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
  running = true;
  dead = false;
  score = 0;
  lastFinalScore = 0;
  distance = 0;
  speed = BASE_SPEED;
  spawnTimer = 0;
  nextSpawn = 1.05;
  bgOffset = 0;
  dust = [];
  obstacles = [];
  player.y = GROUND_Y - player.h;
  player.vy = 0;
  player.grounded = true;
  player.frame = 0;
  scoreEl.textContent = '00000';
  submitStatus.textContent = '';
  shareButton.textContent = 'PODIJELI';
  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function jump() {
  if (!running || dead || !player.grounded) return;
  player.vy = player.jump;
  player.grounded = false;
  for (let i = 0; i < 5; i++) dust.push({ x:player.x + 10 + i * 7, y:GROUND_Y - 2, life:.28 + Math.random() * .18, vx:-45 - Math.random() * 75 });
}

function update(dt) {
  distance += speed * dt;
  score += dt * (speed / 31);
  const target = currentTargetSpeed();
  speed += (target - speed) * Math.min(1, dt * 1.5);
  bgOffset = (bgOffset + speed * dt * .19) % 3000;
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
  obstacles = obstacles.filter(o => o.x + o.w > -40);

  for (const p of dust) { p.x += p.vx * dt; p.life -= dt; }
  dust = dust.filter(p => p.life > 0);

  const hitbox = { x:player.x + 10, y:player.y + 7, w:player.w - 17, h:player.h - 9 };
  for (const o of obstacles) {
    const padX = ['sofa','ewaste','radioactive','skip','mattress','scrap','asbestos'].includes(o.kind) ? 6 : 4;
    const box = { x:o.x + padX, y:o.y + 4, w:o.w - padX * 2, h:o.h - 4 };
    if (rectsOverlap(hitbox, box)) { endGame(o.label); return; }
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function endGame(label) {
  running = false;
  dead = true;
  const final = Math.floor(score);
  lastFinalScore = final;
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
  submitScore(final);
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
  const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  g.addColorStop(0, '#e8eef0');
  g.addColorStop(.66, '#f4f0e6');
  g.addColorStop(1, '#f8f5ed');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const shift = (bgOffset * .12) % 420;
  ctx.fillStyle = 'rgba(255,255,255,.78)';
  for (let i = -1; i < 4; i++) {
    const x = i * 420 - shift + 90;
    const y = 56 + (i % 2) * 24;
    ctx.fillRect(x, y + 8, 86, 10);
    ctx.fillRect(x + 18, y, 34, 10);
    ctx.fillRect(x + 49, y + 4, 28, 10);
  }
}

function drawMountains() {
  const farShift = (bgOffset * .16) % 700;
  ctx.save();
  ctx.translate(-farShift, 0);
  for (let r = 0; r < 3; r++) {
    const b = r * 700;
    ctx.fillStyle = '#d3dad7';
    ctx.beginPath();
    ctx.moveTo(b - 140, GROUND_Y); ctx.lineTo(b + 50, 214); ctx.lineTo(b + 125, 232); ctx.lineTo(b + 245, 138); ctx.lineTo(b + 315, 186); ctx.lineTo(b + 385, 150); ctx.lineTo(b + 520, 224); ctx.lineTo(b + 650, 170); ctx.lineTo(b + 790, GROUND_Y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#edf0ea';
    ctx.beginPath(); ctx.moveTo(b + 209, 167); ctx.lineTo(b + 245, 138); ctx.lineTo(b + 275, 159); ctx.lineTo(b + 257, 156); ctx.lineTo(b + 245, 174); ctx.lineTo(b + 231, 159); ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  const nearShift = (bgOffset * .28) % 860;
  ctx.save();
  ctx.translate(-nearShift, 0);
  for (let r = 0; r < 3; r++) {
    const b = r * 860;
    ctx.fillStyle = '#b7c0b4';
    ctx.beginPath();
    ctx.moveTo(b - 100, GROUND_Y); ctx.lineTo(b + 70, 248); ctx.lineTo(b + 180, 220); ctx.lineTo(b + 290, 252); ctx.lineTo(b + 410, 205); ctx.lineTo(b + 535, 246); ctx.lineTo(b + 700, 218); ctx.lineTo(b + 940, GROUND_Y); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawSigns() {
  const x = 760 - ((bgOffset * .78) % 1450);
  ctx.save();
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.fillStyle = '#d2c99f';
  ctx.fillRect(x + 5, 112, 132, 60);
  ctx.fillStyle = '#f3edcf';
  ctx.fillRect(x, 106, 132, 60);
  ctx.strokeRect(x, 106, 132, 60);
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 6, 112, 120, 48);
  ctx.fillStyle = '#20231f';
  ctx.font = '900 24px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIKA', x + 66, 136);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + 30, 166); ctx.lineTo(x + 30, GROUND_Y);
  ctx.moveTo(x + 102, 166); ctx.lineTo(x + 102, GROUND_Y);
  ctx.stroke();
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function drawGround() {
  ctx.fillStyle = '#ded8c9';
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 1); ctx.lineTo(W, GROUND_Y + 1); ctx.stroke();
  ctx.strokeStyle = '#8a8d82'; ctx.lineWidth = 2;
  const stripeShift = distance % 90;
  for (let x = -90; x < W + 90; x += 90) {
    ctx.beginPath(); ctx.moveTo(x - stripeShift, GROUND_Y + 27); ctx.lineTo(x + 38 - stripeShift, GROUND_Y + 27); ctx.stroke();
  }
}

function drawDust() {
  ctx.fillStyle = '#888a80';
  for (const p of dust) ctx.fillRect(p.x, p.y, 5, 3);
}

function drawRadiationSymbol(cx, cy) {
  ctx.fillStyle = '#20231f';
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / 3);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - .34) * 7, cy + Math.sin(a - .34) * 7); ctx.arc(cx, cy, 16, a - .34, a + .34); ctx.lineTo(cx + Math.cos(a + .34) * 7, cy + Math.sin(a + .34) * 7); ctx.arc(cx, cy, 7, a + .34, a - .34, true); ctx.closePath(); ctx.fill();
  }
}

function drawObstacles() {
  for (const o of obstacles) {
    ctx.save();
    ctx.translate(Math.round(o.x), Math.round(o.y));
    ctx.strokeStyle = '#20231f';
    ctx.lineWidth = 3;

    switch (o.kind) {
      case 'bags':
        ctx.fillStyle = '#555950'; ctx.beginPath(); ctx.moveTo(4,o.h); ctx.lineTo(10,15); ctx.lineTo(21,6); ctx.lineTo(30,14); ctx.lineTo(39,5); ctx.lineTo(51,14); ctx.lineTo(56,o.h); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
      case 'tire':
        ctx.fillStyle = '#3f413c'; ctx.beginPath(); ctx.arc(22,22,20,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f7f4eb'; ctx.beginPath(); ctx.arc(22,22,8,0,Math.PI*2); ctx.fill(); ctx.stroke(); break;
      case 'fridge':
        ctx.fillStyle = '#d3d6cf'; ctx.fillRect(2,2,o.w-4,o.h-2); ctx.strokeRect(2,2,o.w-4,o.h-2); ctx.beginPath(); ctx.moveTo(2,30); ctx.lineTo(o.w-2,30); ctx.stroke(); ctx.fillStyle='#20231f'; ctx.fillRect(7,13,4,11); ctx.fillRect(7,39,4,15); break;
      case 'washer':
        ctx.fillStyle='#cfd4d0'; ctx.fillRect(2,2,50,54); ctx.strokeRect(2,2,50,54); ctx.fillStyle='#727b79'; ctx.beginPath(); ctx.arc(27,32,15,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle='#dfe6e2'; ctx.beginPath(); ctx.arc(27,32,8,0,Math.PI*2); ctx.fill(); break;
      case 'sofa':
        ctx.fillStyle='#8a6958'; ctx.fillRect(3,15,o.w-6,30); ctx.strokeRect(3,15,o.w-6,30); ctx.fillRect(9,3,24,24); ctx.strokeRect(9,3,24,24); ctx.fillRect(49,3,24,24); ctx.strokeRect(49,3,24,24); break;
      case 'mattress':
        ctx.fillStyle='#d9cbb0'; ctx.fillRect(2,3,88,29); ctx.strokeRect(2,3,88,29); ctx.strokeStyle='#8a6c5d'; for(let x=8;x<84;x+=18){ctx.beginPath();ctx.moveTo(x,5);ctx.lineTo(x+10,30);ctx.stroke();} break;
      case 'tv':
        ctx.fillStyle='#5d605a'; ctx.fillRect(2,4,54,39); ctx.strokeRect(2,4,54,39); ctx.fillStyle='#aeb7b3'; ctx.fillRect(8,10,40,24); ctx.strokeRect(8,10,40,24); ctx.fillStyle='#20231f'; ctx.fillRect(22,43,5,6); ctx.fillRect(33,43,5,6); break;
      case 'toilet':
        ctx.fillStyle='#e6e2d8'; ctx.fillRect(17,2,26,22); ctx.strokeRect(17,2,26,22); ctx.beginPath(); ctx.ellipse(26,35,20,13,0,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillRect(18,34,16,19); ctx.strokeRect(18,34,16,19); break;
      case 'ewaste':
        ctx.fillStyle='#80837a'; ctx.fillRect(3,6,36,29); ctx.strokeRect(3,6,36,29); ctx.fillStyle='#c9d2cc'; ctx.fillRect(8,11,26,17); ctx.strokeRect(8,11,26,17); ctx.fillStyle='#5f625a'; ctx.fillRect(43,18,21,29); ctx.strokeRect(43,18,21,29); break;
      case 'oil':
        ctx.fillStyle='#705f4b'; ctx.fillRect(3,4,40,54); ctx.strokeRect(3,4,40,54); ctx.fillStyle='#20231f'; ctx.fillRect(3,12,40,5); ctx.fillRect(3,45,40,5); break;
      case 'chemical':
        ctx.fillStyle='#9d7f46'; ctx.fillRect(3,4,44,56); ctx.strokeRect(3,4,44,56); ctx.fillStyle='#20231f'; ctx.fillRect(3,13,44,5); ctx.fillRect(3,46,44,5); ctx.font='700 10px Courier New'; ctx.fillText('CHEM',8,36); break;
      case 'medical':
        ctx.fillStyle='#e7e5dc'; ctx.fillRect(3,6,48,44); ctx.strokeRect(3,6,48,44); ctx.fillStyle='#c92c2c'; ctx.fillRect(22,14,10,28); ctx.fillRect(13,23,28,10); break;
      case 'radioactive':
        ctx.fillStyle='#d9c835'; for(let i=0;i<2;i++){const bx=2+i*29;ctx.fillRect(bx,7,27,49);ctx.strokeRect(bx,7,27,49);ctx.fillStyle='#20231f';ctx.fillRect(bx,14,27,5);ctx.fillRect(bx,45,27,5);ctx.fillStyle='#d9c835';} drawRadiationSymbol(16,32); drawRadiationSymbol(45,32); break;
      case 'asbestos':
        ctx.fillStyle='#a9aaa0'; for(let i=0;i<4;i++){const y=5+i*8;ctx.fillRect(4+i*2,y,66,8);ctx.strokeRect(4+i*2,y,66,8);} ctx.fillStyle='#20231f';ctx.font='700 8px Courier New';ctx.fillText('AZBEST',18,37); break;
      case 'scrap':
        ctx.strokeStyle='#555a52'; ctx.lineWidth=5; ctx.beginPath();ctx.moveTo(5,45);ctx.lineTo(22,12);ctx.lineTo(36,44);ctx.lineTo(52,8);ctx.lineTo(72,46);ctx.stroke(); ctx.lineWidth=3;ctx.strokeRect(8,35,62,10); break;
      case 'skip':
        ctx.fillStyle='#b47a36';ctx.beginPath();ctx.moveTo(4,8);ctx.lineTo(92,8);ctx.lineTo(82,54);ctx.lineTo(13,54);ctx.closePath();ctx.fill();ctx.stroke(); for(let x=20;x<88;x+=22){ctx.beginPath();ctx.moveTo(x,13);ctx.lineTo(x-7,49);ctx.stroke();} break;
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
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = '#252a3c'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(20,53); ctx.lineTo(14+legA,70); ctx.lineTo(9+legA,73); ctx.moveTo(31,53); ctx.lineTo(36+legB,69); ctx.lineTo(43+legB,72); ctx.stroke();
  ctx.fillStyle='#222a42'; ctx.strokeStyle='#20231f'; ctx.lineWidth=3; ctx.beginPath();ctx.moveTo(12,24);ctx.lineTo(39,24);ctx.lineTo(37,58);ctx.lineTo(15,58);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#f3f2ec'; ctx.beginPath();ctx.moveTo(21,25);ctx.lineTo(30,25);ctx.lineTo(28,45);ctx.lineTo(23,45);ctx.closePath();ctx.fill();
  ctx.fillStyle='#a72a2a'; ctx.beginPath();ctx.moveTo(25,28);ctx.lineTo(28,32);ctx.lineTo(25,47);ctx.lineTo(22,32);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#222a42';ctx.lineWidth=7; ctx.beginPath();ctx.moveTo(14,31);ctx.lineTo(4,43+(player.grounded?runningPhase*2:-4));ctx.moveTo(38,31);ctx.lineTo(46,43-(player.grounded?runningPhase*2:5));ctx.stroke();
  ctx.fillStyle='#efc9a8';ctx.strokeStyle='#20231f';ctx.lineWidth=3;ctx.fillRect(15,4,22,22);ctx.strokeRect(15,4,22,22);
  ctx.fillStyle='#777b80';ctx.fillRect(14,2,24,7);ctx.fillRect(17,0,4,6);ctx.fillRect(23,0,4,7);ctx.fillRect(30,1,4,6);
  ctx.strokeStyle='#20231f';ctx.lineWidth=2;ctx.strokeRect(17,11,7,5);ctx.strokeRect(28,11,7,5);ctx.beginPath();ctx.moveTo(24,13);ctx.lineTo(28,13);ctx.stroke();
  ctx.fillStyle='#ffffff';ctx.font='700 10px Courier New';ctx.fillText('AP',20,56);ctx.restore();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min((now - lastTime) / 1000, .032);
  lastTime = now;
  update(dt);
  draw();
  if (running) requestAnimationFrame(loop);
}

function handleAction(event) {
  if (event?.target === usernameInput) return;
  if (event?.type === 'keydown') {
    if (!['Space','ArrowUp','KeyW'].includes(event.code)) return;
    event.preventDefault();
  }
  if (!running && !dead) { attemptStart(); return; }
  if (dead) return;
  jump();
}

async function loadLeaderboard() {
  leaderboardStatus.textContent = '';
  refreshLeaderboardButton.disabled = true;
  try {
    const response = await fetch('/api/leaderboard', { headers:{Accept:'application/json'}, cache:'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Leaderboard nije dostupan.');
    renderLeaderboard(Array.isArray(data.scores) ? data.scores : []);
  } catch (error) {
    leaderboardList.innerHTML = '<li class="leaderboard-empty">Scoreboard trenutačno nije dostupan.</li>';
    leaderboardStatus.textContent = error?.message || 'Pokušaj ponovno kasnije.';
  } finally {
    refreshLeaderboardButton.disabled = false;
  }
}

function renderLeaderboard(scores) {
  leaderboardList.replaceChildren();
  if (!scores.length) {
    const empty = document.createElement('li'); empty.className = 'leaderboard-empty'; empty.textContent = 'Još nema rezultata. Budi prvi.'; leaderboardList.append(empty); return;
  }
  for (const entry of scores) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    const points = document.createElement('span');
    name.className='leaderboard-name'; points.className='leaderboard-score'; name.textContent=entry.username; points.textContent=formatScore(entry.score); item.append(name, points); leaderboardList.append(item);
  }
}

async function submitScore(final) {
  if (!currentUsername) return;
  submitStatus.textContent = 'Upisujem rezultat na scoreboard…';
  try {
    const response = await fetch('/api/leaderboard', { method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json'}, body:JSON.stringify({username:currentUsername,score:final}) });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Rezultat nije spremljen.');
    submitStatus.textContent = data.updated ? 'Rezultat spremljen.' : 'Tvoj postojeći rekord je veći.';
    if (Array.isArray(data.scores)) renderLeaderboard(data.scores);
  } catch (error) {
    submitStatus.textContent = error?.message || 'Scoreboard trenutačno nije dostupan.';
  }
}

async function shareResult() {
  const final = lastFinalScore || Math.floor(score);
  const text = `${currentUsername || 'Ja'} je napravio ${formatScore(final)} u AP Jumpu. Možeš bolje?`;
  const payload = `${text} ${SHARE_URL}`;
  try {
    if (navigator.share) { await navigator.share({ title:'AP Jump', text, url:SHARE_URL }); return; }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
      shareButton.textContent='KOPIRANO';
      setTimeout(() => { shareButton.textContent='PODIJELI'; }, 1400);
      return;
    }
    window.prompt('Kopiraj rezultat i podijeli:', payload);
  } catch (error) {
    if (error?.name !== 'AbortError') window.prompt('Kopiraj rezultat i podijeli:', payload);
  }
}

window.addEventListener('keydown', handleAction, { passive:false });
canvas.addEventListener('pointerdown', handleAction);
startButton.addEventListener('click', attemptStart);
restartButton.addEventListener('click', resetGame);
shareButton.addEventListener('click', shareResult);
refreshLeaderboardButton.addEventListener('click', loadLeaderboard);
usernameInput.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); attemptStart(); } });
usernameInput.addEventListener('input', () => { usernameError.classList.add('hidden'); usernameError.textContent = ''; });

draw();
loadLeaderboard();
