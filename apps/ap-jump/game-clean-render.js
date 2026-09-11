// Replace the busy colorful scenery with a low-noise, Dino-style monochrome background.
drawSky = function () {
  ctx.fillStyle = '#f8f8f4';
  ctx.fillRect(0, 0, W, H);
};

drawFarMountains = function () {
  const shift = (bgDistance * .09) % 700;
  ctx.save();
  ctx.translate(-shift, 0);
  for (let r = 0; r < 3; r++) {
    const base = r * 700;
    ctx.fillStyle = '#ddddD6';
    ctx.beginPath();
    ctx.moveTo(base - 120, GROUND_Y);
    ctx.lineTo(base + 80, 205);
    ctx.lineTo(base + 190, 230);
    ctx.lineTo(base + 315, 155);
    ctx.lineTo(base + 420, 225);
    ctx.lineTo(base + 560, 185);
    ctx.lineTo(base + 780, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

drawVillage = function () {
  const shift = (bgDistance * .22) % 980;
  ctx.save();
  ctx.translate(-shift, 0);
  for (let r = 0; r < 3; r++) {
    const base = r * 980;
    ctx.fillStyle = '#c8c8c1';
    ctx.fillRect(base + 150, 252, 55, 28);
    ctx.fillRect(base + 430, 258, 48, 22);
    ctx.beginPath();
    ctx.moveTo(base + 143, 252);
    ctx.lineTo(base + 177, 232);
    ctx.lineTo(base + 212, 252);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(base + 424, 258);
    ctx.lineTo(base + 454, 241);
    ctx.lineTo(base + 484, 258);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

drawBirds = function () {};

drawRoadside = function () {
  const shift = (bgDistance * .55) % 1200;
  for (let r = -1; r < 2; r++) {
    const x = r * 1200 - shift + 860;
    ctx.strokeStyle = '#3a3d38';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#efefe9';
    ctx.fillRect(x, 151, 108, 44);
    ctx.strokeRect(x, 151, 108, 44);
    ctx.fillStyle = '#20231f';
    ctx.font = '700 18px Courier New';
    ctx.fillText('LIKA', x + 30, 179);
    ctx.beginPath();
    ctx.moveTo(x + 54, 195);
    ctx.lineTo(x + 54, GROUND_Y);
    ctx.stroke();
  }
};

drawGround = function () {
  ctx.fillStyle = '#eeeeE8';
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.strokeStyle = '#20231f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 1);
  ctx.lineTo(W, GROUND_Y + 1);
  ctx.stroke();

  ctx.strokeStyle = '#9a9c95';
  ctx.lineWidth = 2;
  const stripeShift = distance % 100;
  for (let x = -100; x < W + 100; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x - stripeShift, GROUND_Y + 31);
    ctx.lineTo(x + 40 - stripeShift, GROUND_Y + 31);
    ctx.stroke();
  }
};
