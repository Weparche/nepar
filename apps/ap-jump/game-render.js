function draw() {
  const sx = shake ? (Math.random() - .5) * shake : 0;
  const sy = shake ? (Math.random() - .5) * shake * .6 : 0;

  ctx.save();
  ctx.translate(sx, sy);

  drawSky();
  drawFarMountains();
  drawVillage();
  drawBirds();
  drawRoadside();
  drawGround();
  drawDust();
  drawObstacles();
  drawPlayer();
  drawPopups();

  ctx.restore();

  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(201,44,44,${hitFlash * .22})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  gradient.addColorStop(0, '#e6edf0');
  gradient.addColorStop(.62, '#f3f1e8');
  gradient.addColorStop(1, '#f6f2e6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  const cloudShift = (bgDistance * .055) % 430;
  ctx.fillStyle = 'rgba(255,255,255,.78)';
  for (let i = -1; i < 4; i++) {
    const x = i * 430 - cloudShift + 80;
    const y = 52 + (i % 2) * 28;
    pixelCloud(x, y, 1 + (i % 2) * .18);
  }
}

function pixelCloud(x, y, scale = 1) {
  ctx.fillRect(x, y + 8 * scale, 92 * scale, 12 * scale);
  ctx.fillRect(x + 18 * scale, y, 38 * scale, 12 * scale);
  ctx.fillRect(x + 52 * scale, y + 4 * scale, 28 * scale, 12 * scale);
}

function drawFarMountains() {
  const shift = (bgDistance * .12) % 640;
  ctx.save();
  ctx.translate(-shift, 0);

  for (let r = 0; r < 3; r++) {
    const base = r * 640;
    ctx.fillStyle = '#c9d0cb';
    ctx.beginPath();
    ctx.moveTo(base - 100, GROUND_Y);
    ctx.lineTo(base + 40, 204);
    ctx.lineTo(base + 118, 232);
    ctx.lineTo(base + 220, 134);
    ctx.lineTo(base + 288, 181);
    ctx.lineTo(base + 352, 150);
    ctx.lineTo(base + 455, 229);
    ctx.lineTo(base + 565, 172);
    ctx.lineTo(base + 720, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e8e9e2';
    ctx.beginPath();
    ctx.moveTo(base + 185, 169);
    ctx.lineTo(base + 220, 134);
    ctx.lineTo(base + 247, 154);
    ctx.lineTo(base + 234, 151);
    ctx.lineTo(base + 220, 166);
    ctx.lineTo(base + 209, 154);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawVillage() {
  const shift = (bgDistance * .32) % 900;
  ctx.save();
  ctx.translate(-shift, 0);

  for (let r = 0; r < 3; r++) {
    const base = r * 900;
    ctx.fillStyle = '#aeb3a0';
    ctx.fillRect(base - 30, 245, 930, 48);

    for (let t = 0; t < 16; t++) {
      const tx = base + t * 61 + (t % 3) * 8;
      const ty = 232 + (t % 2) * 7;
      ctx.fillStyle = t % 2 ? '#7c856e' : '#899079';
      ctx.fillRect(tx, ty, 13, 34);
      ctx.fillRect(tx - 7, ty + 4, 28, 20);
    }

    drawHouse(base + 110, 235, '#a84f3d');
    drawHouse(base + 290, 243, '#b25b43');
    drawHouse(base + 510, 238, '#9f4b39');

    ctx.fillStyle = '#ddd9cb';
    ctx.strokeStyle = '#575b54';
    ctx.lineWidth = 2;
    ctx.fillRect(base + 700, 207, 34, 58);
    ctx.strokeRect(base + 700, 207, 34, 58);
    ctx.beginPath();
    ctx.moveTo(base + 696, 207);
    ctx.lineTo(base + 717, 174);
    ctx.lineTo(base + 738, 207);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#575b54';
    ctx.fillRect(base + 714, 184, 6, 9);

    for (let p = 0; p < 4; p++) {
      const px = base + 55 + p * 220;
      ctx.strokeStyle = '#555a52';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, 215);
      ctx.lineTo(px, 292);
      ctx.moveTo(px - 15, 228);
      ctx.lineTo(px + 15, 228);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawHouse(x, y, roof) {
  ctx.fillStyle = '#ddd3be';
  ctx.strokeStyle = '#65675f';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, 58, 31);
  ctx.strokeRect(x, y, 58, 31);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + 29, y - 21);
  ctx.lineTo(x + 64, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b7777';
  ctx.fillRect(x + 9, y + 10, 12, 11);
  ctx.fillStyle = '#6d5947';
  ctx.fillRect(x + 37, y + 10, 10, 21);
}

function drawBirds() {
  ctx.strokeStyle = '#4e524c';
  ctx.lineWidth = 2;
  for (const b of birds) {
    const flap = Math.sin(b.phase) * 4;
    ctx.beginPath();
    ctx.moveTo(b.x - 10, b.y + flap);
    ctx.quadraticCurveTo(b.x - 3, b.y - 4, b.x, b.y);
    ctx.quadraticCurveTo(b.x + 4, b.y - 5, b.x + 11, b.y + flap);
    ctx.stroke();
  }
}

function drawRoadside() {
  const shift = (bgDistance * .72) % 1180;

  for (let r = -1; r < 2; r++) {
    const base = r * 1180 - shift;
    const signX = base + 830;
    ctx.strokeStyle = '#20231f';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#e9dfae';
    ctx.fillRect(signX, 145, 118, 50);
    ctx.strokeRect(signX, 145, 118, 50);
    ctx.fillStyle = '#20231f';
    ctx.font = '700 19px Courier New';
    ctx.fillText('LIKA', signX + 34, 177);
    ctx.beginPath();
    ctx.moveTo(signX + 59, 195);
    ctx.lineTo(signX + 59, GROUND_Y);
    ctx.stroke();

    ctx.strokeStyle = '#77796f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(base + 80, 270);
    ctx.lineTo(base + 430, 270);
    ctx.moveTo(base + 100, 252);
    ctx.lineTo(base + 100, 292);
    ctx.moveTo(base + 230, 252);
    ctx.lineTo(base + 230, 292);
    ctx.moveTo(base + 360, 252);
    ctx.lineTo(base + 360, 292);
    ctx.stroke();

    ctx.fillStyle = '#777a71';
    ctx.fillRect(base + 520, 279, 18, 8);
    ctx.fillRect(base + 555, 284, 11, 5);
  }
}

function drawGround() {
  ctx.fillStyle = '#ded7c6';
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 1);
  ctx.lineTo(W, GROUND_Y + 1);
  ctx.stroke();

  ctx.strokeStyle = '#8a8d82';
  ctx.lineWidth = 2;
  const stripeShift = distance % 92;
  for (let x = -92; x < W + 92; x += 92) {
    ctx.beginPath();
    ctx.moveTo(x - stripeShift, GROUND_Y + 29);
    ctx.lineTo(x + 38 - stripeShift, GROUND_Y + 29);
    ctx.stroke();
  }

  const grassShift = (distance * .8) % 70;
  ctx.strokeStyle = '#707669';
  ctx.lineWidth = 2;
  for (let x = -70; x < W + 70; x += 70) {
    const gx = x - grassShift;
    ctx.beginPath();
    ctx.moveTo(gx, GROUND_Y - 1);
    ctx.lineTo(gx + 4, GROUND_Y - 10);
    ctx.moveTo(gx + 4, GROUND_Y - 1);
    ctx.lineTo(gx + 9, GROUND_Y - 8);
    ctx.stroke();
  }
}

function drawDust() {
  for (const p of dust) {
    ctx.globalAlpha = clamp(p.life * 2.8, 0, 1);
    ctx.fillStyle = '#7f8178';
    ctx.fillRect(p.x, p.y, p.size, Math.max(2, p.size - 1));
  }
  ctx.globalAlpha = 1;
}

function drawRadiationSymbol(cx, cy) {
  ctx.fillStyle = '#20231f';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / 3);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a - .34) * 7, cy + Math.sin(a - .34) * 7);
    ctx.arc(cx, cy, 16, a - .34, a + .34);
    ctx.lineTo(cx + Math.cos(a + .34) * 7, cy + Math.sin(a + .34) * 7);
    ctx.arc(cx, cy, 7, a + .34, a - .34, true);
    ctx.closePath();
    ctx.fill();
  }
}

function drawObstacles() {
  for (const o of obstacles) {
    ctx.save();
    ctx.translate(Math.round(o.x), Math.round(o.y));
    ctx.strokeStyle = '#20231f';
    ctx.lineWidth = 3;

    if (o.kind === 'bags') {
      ctx.fillStyle = '#555950';
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
      ctx.fillStyle = '#3f413c';
      ctx.beginPath();
      ctx.arc(22, 22, 20, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d8d3c5';
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
    } else if (o.kind === 'sofa') {
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
    } else if (o.kind === 'washer') {
      ctx.fillStyle = '#cfd4d0';
      ctx.fillRect(2, 2, 50, 54);
      ctx.strokeRect(2, 2, 50, 54);
      ctx.fillStyle = '#727b79';
      ctx.beginPath();
      ctx.arc(27, 32, 15, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dfe6e2';
      ctx.beginPath();
      ctx.arc(27, 32, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#20231f';
      ctx.fillRect(8, 8, 7, 5);
      ctx.fillRect(19, 8, 5, 5);
    } else if (o.kind === 'mattress') {
      ctx.fillStyle = '#d9cbb0';
      ctx.fillRect(2, 3, 84, 31);
      ctx.strokeRect(2, 3, 84, 31);
      ctx.strokeStyle = '#8a6c5d';
      for (let x = 10; x < 84; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 5); ctx.lineTo(x + 10, 32);
        ctx.stroke();
      }
    } else if (o.kind === 'radioactive') {
      const wobble = Math.sin(o.phase) * 1.5;
      ctx.translate(0, wobble);
      ctx.fillStyle = '#d9c835';
      for (let i = 0; i < 2; i++) {
        const bx = 2 + i * 29;
        ctx.fillRect(bx, 7, 27, 49);
        ctx.strokeRect(bx, 7, 27, 49);
        ctx.fillStyle = '#20231f';
        ctx.fillRect(bx, 14, 27, 5);
        ctx.fillRect(bx, 45, 27, 5);
        ctx.fillStyle = '#d9c835';
      }
      drawRadiationSymbol(16, 32);
      drawRadiationSymbol(45, 32);
    } else if (o.kind === 'medical') {
      ctx.fillStyle = '#e7e5dc';
      ctx.fillRect(3, 6, 48, 44);
      ctx.strokeRect(3, 6, 48, 44);
      ctx.fillStyle = '#c92c2c';
      ctx.fillRect(22, 14, 10, 28);
      ctx.fillRect(13, 23, 28, 10);
      ctx.fillStyle = '#20231f';
      ctx.font = '700 7px Courier New';
      ctx.fillText('BIO', 4, 11);
    } else if (o.kind === 'ewaste') {
      ctx.fillStyle = '#80837a';
      ctx.fillRect(4, 5, 34, 29);
      ctx.strokeRect(4, 5, 34, 29);
      ctx.fillStyle = '#c9d2cc';
      ctx.fillRect(9, 10, 24, 16);
      ctx.strokeRect(9, 10, 24, 16);
      ctx.fillStyle = '#20231f';
      ctx.fillRect(18, 34, 5, 8);
      ctx.fillRect(11, 41, 20, 4);
      ctx.fillStyle = '#5f625a';
      ctx.fillRect(40, 19, 22, 27);
      ctx.strokeRect(40, 19, 22, 27);
      ctx.beginPath();
      ctx.moveTo(48, 19);
      ctx.bezierCurveTo(49, 4, 62, 7, 60, 17);
      ctx.stroke();
    } else if (o.kind === 'oil') {
      ctx.fillStyle = '#705f4b';
      ctx.fillRect(3, 4, 40, 54);
      ctx.strokeRect(3, 4, 40, 54);
      ctx.fillStyle = '#20231f';
      ctx.fillRect(3, 12, 40, 5);
      ctx.fillRect(3, 45, 40, 5);
      ctx.font = '700 9px Courier New';
      ctx.fillText('OTPAD', 7, 34);
    } else if (o.kind === 'asbestos') {
      ctx.fillStyle = '#a9aaa0';
      for (let i = 0; i < 4; i++) {
        const y = 6 + i * 8;
        ctx.fillRect(3 + i * 2, y, 64, 8);
        ctx.strokeRect(3 + i * 2, y, 64, 8);
      }
      ctx.fillStyle = '#20231f';
      ctx.font = '700 8px Courier New';
      ctx.fillText('AZBEST', 17, 39);
    } else if (o.kind === 'skip') {
      ctx.fillStyle = '#b47a36';
      ctx.beginPath();
      ctx.moveTo(4, 8);
      ctx.lineTo(88, 8);
      ctx.lineTo(80, 54);
      ctx.lineTo(12, 54);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#20231f';
      for (let x = 18; x < 85; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, 13); ctx.lineTo(x - 6, 49); ctx.stroke();
      }
    }

    ctx.restore();
  }
}

const playerSprites = createPlayerSprites();

function createPlayerSprites() {
  const frames = {};
  const names = ['run0', 'run1', 'run2', 'run3', 'jump', 'fall', 'hit'];
  for (const name of names) {
    const off = document.createElement('canvas');
    off.width = 64;
    off.height = 88;
    const g = off.getContext('2d');
    g.imageSmoothingEnabled = false;
    renderPlayerSprite(g, name);
    frames[name] = off;
  }
  return frames;
}

function renderPlayerSprite(g, pose) {
  const isAir = pose === 'jump' || pose === 'fall';
  const isHit = pose === 'hit';
  const runIndex = Number(pose.replace('run', '')) || 0;
  const step = [0, 5, 1, -5][runIndex] || 0;
  const arm = [3, -3, -5, 4][runIndex] || 0;

  g.fillStyle = 'rgba(32,35,31,.18)';
  g.fillRect(14, 80, 36, 4);

  g.fillStyle = '#1d2639';
  if (isHit) {
    g.fillRect(19, 61, 10, 10);
    g.fillRect(28, 67, 22, 8);
    g.fillStyle = '#151816';
    g.fillRect(45, 71, 11, 6);
  } else if (isAir) {
    g.fillRect(19, 59, 9, 18);
    g.fillRect(31, 57, 9, 17);
    g.fillStyle = '#151816';
    g.fillRect(14, 74, 15, 6);
    g.fillRect(35, 70, 15, 6);
  } else {
    g.fillRect(19, 58, 9, 17 + Math.max(0, step));
    g.fillRect(32, 58, 9, 17 + Math.max(0, -step));
    g.fillStyle = '#151816';
    g.fillRect(13 + step, 74, 16, 6);
    g.fillRect(32 - step, 74, 16, 6);
  }

  g.fillStyle = '#202a43';
  g.fillRect(15, 28, 31, 34);
  g.fillStyle = '#172035';
  g.fillRect(15, 28, 7, 34);
  g.fillRect(39, 28, 7, 34);

  g.fillStyle = '#f2f0e9';
  g.fillRect(27, 30, 8, 25);
  g.fillStyle = '#a8272c';
  g.fillRect(30, 31, 3, 16);
  g.fillRect(28, 45, 7, 5);

  g.fillStyle = '#34415f';
  g.fillRect(22, 30, 5, 18);
  g.fillRect(35, 30, 5, 18);

  g.fillStyle = '#202a43';
  if (isHit) {
    g.fillRect(7, 37, 16, 8);
    g.fillRect(40, 33, 16, 8);
  } else if (isAir) {
    g.fillRect(7, 31, 12, 8);
    g.fillRect(43, 36, 12, 8);
  } else {
    g.fillRect(7, 36 + arm, 13, 8);
    g.fillRect(42, 36 - arm, 13, 8);
  }

  g.fillStyle = '#e9bea0';
  g.fillRect(5, isAir ? 30 : 37 + arm, 5, 7);
  g.fillRect(54, isAir ? 38 : 37 - arm, 5, 7);

  g.fillStyle = '#e7bea0';
  g.fillRect(20, 8, 25, 21);
  g.fillStyle = '#dba88b';
  g.fillRect(20, 22, 25, 7);
  g.fillStyle = '#dfaf91';
  g.fillRect(17, 14, 4, 8);
  g.fillRect(45, 14, 4, 8);

  g.fillStyle = '#73777b';
  g.fillRect(19, 5, 27, 7);
  g.fillRect(21, 2, 6, 6);
  g.fillRect(28, 1, 6, 7);
  g.fillRect(36, 3, 7, 6);
  g.fillStyle = '#a5a8aa';
  g.fillRect(22, 4, 5, 3);
  g.fillRect(35, 4, 5, 3);

  g.strokeStyle = '#20231f';
  g.lineWidth = 2;
  g.strokeRect(22, 14, 8, 6);
  g.strokeRect(35, 14, 8, 6);
  g.beginPath();
  g.moveTo(30, 17);
  g.lineTo(35, 17);
  g.stroke();

  g.fillStyle = '#383a37';
  g.fillRect(23, 12, 7, 2);
  g.fillRect(36, 12, 7, 2);
  if (isHit) {
    g.fillRect(29, 24, 8, 2);
    g.fillRect(31, 22, 4, 2);
  } else {
    g.fillRect(30, 24, 7, 2);
  }

  g.fillStyle = '#c92c2c';
  g.fillRect(39, 33, 3, 3);
  g.fillStyle = '#f0eee8';
  g.fillRect(42, 33, 3, 3);
  g.fillStyle = '#31548a';
  g.fillRect(39, 36, 6, 2);

  g.fillStyle = '#ffffff';
  g.font = '700 8px Courier New';
  g.fillText('AP', 24, 59);
}

function currentPlayerSprite() {
  if (dead) return playerSprites.hit;
  if (!player.grounded) return player.vy < 0 ? playerSprites.jump : playerSprites.fall;
  const frame = Math.floor(player.frame) % 4;
  return playerSprites[`run${frame}`];
}

function drawPlayer() {
  const sprite = currentPlayerSprite();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, Math.round(player.x - 6), Math.round(player.y - 7), 64, 88);
}

function drawPopups() {
  ctx.textAlign = 'center';
  for (const popup of popups) {
    ctx.globalAlpha = clamp(popup.life / .85, 0, 1);
    ctx.fillStyle = '#20231f';
    ctx.font = '900 25px Courier New';
    ctx.fillText(popup.text, popup.x, popup.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'start';
}

function loop(now) {
  if (!running) return;
  const dt = Math.min((now - lastTime) / 1000, 0.032);
  lastTime = now;
  update(dt);
  draw();
  if (running) requestAnimationFrame(loop);
}
