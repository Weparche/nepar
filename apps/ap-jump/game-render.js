function draw() {
  const sx = shake ? (Math.random() - .5) * shake : 0;
  const sy = shake ? (Math.random() - .5) * shake * .6 : 0;

  ctx.save();
  ctx.translate(sx, sy);
  drawSky();
  drawMountains();
  drawVillage();
  drawRoadside();
  drawGround();
  drawDust();
  drawObstacles();
  drawPlayer();
  drawPopups();
  ctx.restore();

  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(201,44,44,${hitFlash * .16})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  gradient.addColorStop(0, '#e7eef1');
  gradient.addColorStop(.62, '#f1eee4');
  gradient.addColorStop(1, '#f6f1e4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  const cloudShift = (bgDistance * .05) % 430;
  ctx.fillStyle = 'rgba(255,255,255,.72)';
  for (let i = -1; i < 4; i++) {
    const x = i * 430 - cloudShift + 90;
    const y = 55 + (i % 2) * 25;
    ctx.fillRect(x, y + 7, 86, 11);
    ctx.fillRect(x + 18, y, 35, 11);
    ctx.fillRect(x + 51, y + 3, 28, 11);
  }
}

function drawMountains() {
  const shift = (bgDistance * .12) % 640;
  ctx.save();
  ctx.translate(-shift, 0);

  for (let r = 0; r < 3; r++) {
    const base = r * 640;
    ctx.fillStyle = '#c7cec9';
    ctx.beginPath();
    ctx.moveTo(base - 100, GROUND_Y);
    ctx.lineTo(base + 55, 208);
    ctx.lineTo(base + 125, 230);
    ctx.lineTo(base + 226, 145);
    ctx.lineTo(base + 295, 189);
    ctx.lineTo(base + 365, 157);
    ctx.lineTo(base + 475, 226);
    ctx.lineTo(base + 585, 180);
    ctx.lineTo(base + 730, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e8e8e0';
    ctx.beginPath();
    ctx.moveTo(base + 195, 171);
    ctx.lineTo(base + 226, 145);
    ctx.lineTo(base + 251, 162);
    ctx.lineTo(base + 235, 158);
    ctx.lineTo(base + 224, 173);
    ctx.lineTo(base + 214, 161);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawVillage() {
  const shift = (bgDistance * .27) % 920;
  ctx.save();
  ctx.translate(-shift, 0);

  for (let r = 0; r < 3; r++) {
    const base = r * 920;
    ctx.fillStyle = '#aeb3a0';
    ctx.fillRect(base - 20, 252, 940, 42);

    drawHouse(base + 130, 243, '#a94f3d');
    drawHouse(base + 350, 249, '#9a4939');
    drawHouse(base + 585, 241, '#af5d43');

    ctx.fillStyle = '#d9d5c8';
    ctx.strokeStyle = '#64675f';
    ctx.lineWidth = 2;
    ctx.fillRect(base + 730, 214, 31, 54);
    ctx.strokeRect(base + 730, 214, 31, 54);
    ctx.beginPath();
    ctx.moveTo(base + 726, 214);
    ctx.lineTo(base + 746, 182);
    ctx.lineTo(base + 766, 214);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (let p = 0; p < 4; p++) {
      const px = base + 65 + p * 220;
      ctx.strokeStyle = '#555a52';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, 220);
      ctx.lineTo(px, GROUND_Y);
      ctx.moveTo(px - 13, 231);
      ctx.lineTo(px + 13, 231);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawHouse(x, y, roof) {
  ctx.fillStyle = '#ddd3be';
  ctx.strokeStyle = '#65675f';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, 56, 30);
  ctx.strokeRect(x, y, 56, 30);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 28, y - 20);
  ctx.lineTo(x + 61, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#687475';
  ctx.fillRect(x + 8, y + 9, 11, 10);
  ctx.fillStyle = '#6d5947';
  ctx.fillRect(x + 37, y + 9, 9, 21);
}

function drawRoadside() {
  const shift = (bgDistance * .62) % 1180;
  for (let r = -1; r < 2; r++) {
    const base = r * 1180 - shift;
    const signX = base + 840;
    ctx.strokeStyle = '#20231f';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ece3b5';
    ctx.fillRect(signX, 146, 112, 48);
    ctx.strokeRect(signX, 146, 112, 48);
    ctx.fillStyle = '#20231f';
    ctx.font = '700 18px Courier New';
    ctx.fillText('LIKA', signX + 31, 176);
    ctx.beginPath();
    ctx.moveTo(signX + 56, 194);
    ctx.lineTo(signX + 56, GROUND_Y);
    ctx.stroke();
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
}

function drawDust() {
  for (const p of dust) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2.8));
    ctx.fillStyle = '#7f8178';
    ctx.fillRect(p.x, p.y, p.size || 4, Math.max(2, (p.size || 4) - 1));
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
      ctx.moveTo(4, o.h); ctx.lineTo(10, 15); ctx.lineTo(21, 6); ctx.lineTo(30, 14);
      ctx.lineTo(39, 5); ctx.lineTo(51, 14); ctx.lineTo(56, o.h); ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (o.kind === 'tire') {
      ctx.fillStyle = '#3f413c';
      ctx.beginPath(); ctx.arc(22, 22, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#d8d3c5';
      ctx.beginPath(); ctx.arc(22, 22, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (o.kind === 'fridge') {
      ctx.fillStyle = '#d3d6cf';
      ctx.fillRect(2, 2, o.w - 4, o.h - 2); ctx.strokeRect(2, 2, o.w - 4, o.h - 2);
      ctx.beginPath(); ctx.moveTo(2, 30); ctx.lineTo(o.w - 2, 30); ctx.stroke();
      ctx.fillStyle = '#20231f'; ctx.fillRect(7, 13, 4, 11); ctx.fillRect(7, 39, 4, 15);
    } else if (o.kind === 'sofa') {
      ctx.fillStyle = '#8a6958';
      ctx.fillRect(3, 15, o.w - 6, 30); ctx.strokeRect(3, 15, o.w - 6, 30);
      ctx.fillRect(9, 3, 24, 24); ctx.strokeRect(9, 3, 24, 24);
      ctx.fillRect(49, 3, 24, 24); ctx.strokeRect(49, 3, 24, 24);
    } else if (o.kind === 'washer') {
      ctx.fillStyle = '#cfd4d0';
      ctx.fillRect(2, 2, 50, 54); ctx.strokeRect(2, 2, 50, 54);
      ctx.fillStyle = '#727b79'; ctx.beginPath(); ctx.arc(27, 32, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dfe6e2'; ctx.beginPath(); ctx.arc(27, 32, 8, 0, Math.PI * 2); ctx.fill();
    } else if (o.kind === 'mattress') {
      ctx.fillStyle = '#d9cbb0'; ctx.fillRect(2, 3, 84, 31); ctx.strokeRect(2, 3, 84, 31);
      ctx.strokeStyle = '#8a6c5d';
      for (let x = 10; x < 84; x += 18) { ctx.beginPath(); ctx.moveTo(x, 5); ctx.lineTo(x + 10, 32); ctx.stroke(); }
    } else if (o.kind === 'radioactive') {
      ctx.fillStyle = '#d9c835';
      for (let i = 0; i < 2; i++) {
        const bx = 2 + i * 29;
        ctx.fillRect(bx, 7, 27, 49); ctx.strokeRect(bx, 7, 27, 49);
        ctx.fillStyle = '#20231f'; ctx.fillRect(bx, 14, 27, 5); ctx.fillRect(bx, 45, 27, 5);
        ctx.fillStyle = '#d9c835';
      }
      drawRadiationSymbol(16, 32); drawRadiationSymbol(45, 32);
    } else if (o.kind === 'medical') {
      ctx.fillStyle = '#e7e5dc'; ctx.fillRect(3, 6, 48, 44); ctx.strokeRect(3, 6, 48, 44);
      ctx.fillStyle = '#c92c2c'; ctx.fillRect(22, 14, 10, 28); ctx.fillRect(13, 23, 28, 10);
    } else if (o.kind === 'ewaste') {
      ctx.fillStyle = '#80837a'; ctx.fillRect(4, 5, 34, 29); ctx.strokeRect(4, 5, 34, 29);
      ctx.fillStyle = '#c9d2cc'; ctx.fillRect(9, 10, 24, 16); ctx.strokeRect(9, 10, 24, 16);
      ctx.fillStyle = '#5f625a'; ctx.fillRect(40, 19, 22, 27); ctx.strokeRect(40, 19, 22, 27);
    } else if (o.kind === 'oil') {
      ctx.fillStyle = '#705f4b'; ctx.fillRect(3, 4, 40, 54); ctx.strokeRect(3, 4, 40, 54);
      ctx.fillStyle = '#20231f'; ctx.fillRect(3, 12, 40, 5); ctx.fillRect(3, 45, 40, 5);
    } else if (o.kind === 'asbestos') {
      ctx.fillStyle = '#a9aaa0';
      for (let i = 0; i < 4; i++) { const yy = 6 + i * 8; ctx.fillRect(3 + i * 2, yy, 64, 8); ctx.strokeRect(3 + i * 2, yy, 64, 8); }
    } else if (o.kind === 'skip') {
      ctx.fillStyle = '#b47a36';
      ctx.beginPath(); ctx.moveTo(4, 8); ctx.lineTo(88, 8); ctx.lineTo(80, 54); ctx.lineTo(12, 54); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }
}

function drawPlayer() {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  const phase = Number.isFinite(player.frame) ? Math.sin(player.frame * Math.PI) : 0;
  const legA = player.grounded ? phase * 7 : -3;
  const legB = player.grounded ? -phase * 7 : 4;

  ctx.save();
  ctx.translate(x, y);

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
  ctx.moveTo(12, 24); ctx.lineTo(39, 24); ctx.lineTo(37, 58); ctx.lineTo(15, 58); ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#f3f2ec';
  ctx.beginPath(); ctx.moveTo(21, 25); ctx.lineTo(30, 25); ctx.lineTo(28, 45); ctx.lineTo(23, 45); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a72a2a';
  ctx.beginPath(); ctx.moveTo(25, 28); ctx.lineTo(28, 32); ctx.lineTo(25, 47); ctx.lineTo(22, 32); ctx.closePath(); ctx.fill();

  ctx.strokeStyle = '#222a42';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(14, 31); ctx.lineTo(4, 43 + (player.grounded ? phase * 2 : -4));
  ctx.moveTo(38, 31); ctx.lineTo(46, 43 - (player.grounded ? phase * 2 : 5));
  ctx.stroke();

  ctx.fillStyle = '#efc9a8';
  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 3;
  ctx.fillRect(15, 4, 22, 22); ctx.strokeRect(15, 4, 22, 22);

  ctx.fillStyle = '#777b80';
  ctx.fillRect(14, 2, 24, 7); ctx.fillRect(17, 0, 4, 6); ctx.fillRect(23, 0, 4, 7); ctx.fillRect(30, 1, 4, 6);

  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 2;
  ctx.strokeRect(17, 11, 7, 5); ctx.strokeRect(28, 11, 7, 5);
  ctx.beginPath(); ctx.moveTo(24, 13); ctx.lineTo(28, 13); ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 10px Courier New';
  ctx.fillText('AP', 20, 56);
  ctx.restore();
}

function drawPopups() {
  ctx.textAlign = 'center';
  for (const popup of popups || []) {
    ctx.globalAlpha = Math.max(0, Math.min(1, (popup.life || 0) / .85));
    ctx.fillStyle = '#20231f';
    ctx.font = '900 25px Courier New';
    ctx.fillText(popup.text || '', popup.x || W * .5, popup.y || 92);
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