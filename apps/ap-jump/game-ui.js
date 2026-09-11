function handleAction(event) {
  if (event?.target === usernameInput) return;

  if (event?.type === 'keydown') {
    if (!['Space', 'ArrowUp', 'KeyW'].includes(event.code)) return;
    event.preventDefault();
  }

  if (!running && !dead) {
    attemptStart();
    return;
  }
  if (dead) return;
  jump();
}

async function loadLeaderboard() {
  leaderboardStatus.textContent = '';
  refreshLeaderboardButton.disabled = true;
  try {
    const response = await fetch('/api/leaderboard', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Leaderboard nije dostupan.');
    renderLeaderboard(Array.isArray(data.scores) ? data.scores : []);
  } catch (error) {
    leaderboardList.innerHTML = '<li class="leaderboard-empty">Scoreboard još nije dostupan.</li>';
    leaderboardStatus.textContent = error?.message || 'Pokušaj ponovno kasnije.';
  } finally {
    refreshLeaderboardButton.disabled = false;
  }
}

function renderLeaderboard(scores) {
  leaderboardList.replaceChildren();
  if (!scores.length) {
    const empty = document.createElement('li');
    empty.className = 'leaderboard-empty';
    empty.textContent = 'Još nema rezultata. Budi prvi.';
    leaderboardList.append(empty);
    return;
  }
  for (const entry of scores) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    const points = document.createElement('span');
    name.className = 'leaderboard-name';
    points.className = 'leaderboard-score';
    name.textContent = entry.username;
    points.textContent = formatScore(entry.score);
    item.append(name, points);
    leaderboardList.append(item);
  }
}

async function submitScore(final) {
  if (!currentUsername) return;
  submitStatus.textContent = 'Upisujem rezultat na scoreboard…';
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username: currentUsername, score: final }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Rezultat nije spremljen.');
    submitStatus.textContent = data.updated ? 'Rezultat spremljen.' : 'Tvoj postojeći rekord je veći.';
    if (Array.isArray(data.scores)) renderLeaderboard(data.scores);
  } catch (error) {
    submitStatus.textContent = error?.message || 'Scoreboard trenutačno nije dostupan.';
  }
}

async function createShareFile() {
  const shareCanvas = document.createElement('canvas');
  shareCanvas.width = 1080;
  shareCanvas.height = 1350;
  const g = shareCanvas.getContext('2d');

  const grad = g.createLinearGradient(0, 0, 0, 1350);
  grad.addColorStop(0, '#edf1f0');
  grad.addColorStop(.58, '#f3efe4');
  grad.addColorStop(1, '#d9d0ba');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1080, 1350);

  g.fillStyle = '#bac2bd';
  g.beginPath();
  g.moveTo(0, 850); g.lineTo(140, 590); g.lineTo(270, 690); g.lineTo(430, 460);
  g.lineTo(550, 590); g.lineTo(690, 500); g.lineTo(850, 700); g.lineTo(1080, 560);
  g.lineTo(1080, 1000); g.lineTo(0, 1000); g.closePath(); g.fill();

  g.fillStyle = '#20231f';
  g.font = '900 82px Courier New';
  g.fillText('AP JUMP', 70, 120);
  g.font = '700 30px Courier New';
  g.fillText('PRESKOČI PROBLEM.', 74, 170);

  g.fillStyle = '#fffdf7';
  g.strokeStyle = '#20231f';
  g.lineWidth = 8;
  g.fillRect(70, 235, 940, 340);
  g.strokeRect(70, 235, 940, 340);

  g.fillStyle = '#676b61';
  g.font = '700 28px Courier New';
  g.fillText('REZULTAT', 115, 315);
  g.fillStyle = '#20231f';
  g.font = '900 138px Courier New';
  g.fillText(formatScore(lastFinalScore), 108, 460);
  g.font = '800 34px Courier New';
  g.fillText(currentUsername || 'IGRAČ', 116, 525);

  g.imageSmoothingEnabled = false;
  g.drawImage(playerSprites.run1, 700, 690, 250, 344);

  g.fillStyle = '#d9c835';
  g.fillRect(150, 870, 170, 170);
  g.strokeStyle = '#20231f';
  g.lineWidth = 10;
  g.strokeRect(150, 870, 170, 170);
  g.fillStyle = '#20231f';
  g.beginPath();
  g.arc(235, 955, 18, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 3;
    g.beginPath();
    g.moveTo(235 + Math.cos(a - .34) * 32, 955 + Math.sin(a - .34) * 32);
    g.arc(235, 955, 70, a - .34, a + .34);
    g.lineTo(235 + Math.cos(a + .34) * 32, 955 + Math.sin(a + .34) * 32);
    g.arc(235, 955, 32, a + .34, a - .34, true);
    g.closePath();
    g.fill();
  }

  g.fillStyle = '#20231f';
  g.font = '700 34px Courier New';
  g.fillText('Možeš bolje?', 70, 1180);
  g.font = '800 32px Courier New';
  g.fillText('apjump.nepar.hr', 70, 1245);

  const blob = await new Promise(resolve => shareCanvas.toBlob(resolve, 'image/png'));
  if (!blob) return null;
  return new File([blob], `ap-jump-${formatScore(lastFinalScore)}.png`, { type: 'image/png' });
}

async function shareResult() {
  const final = lastFinalScore || Math.floor(score);
  const text = `${currentUsername || 'Ja'} je napravio ${formatScore(final)} u AP Jumpu. Možeš bolje?`;
  try {
    const file = await createShareFile();
    if (file && navigator.canShare?.({ files: [file] }) && navigator.share) {
      await navigator.share({ title: 'AP Jump', text, url: SHARE_URL, files: [file] });
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: 'AP Jump', text, url: SHARE_URL });
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
      shareButton.textContent = 'KOPIRANO';
      setTimeout(() => { shareButton.textContent = 'PODIJELI'; }, 1400);
      return;
    }
    window.prompt('Kopiraj rezultat i podijeli:', `${text} ${SHARE_URL}`);
  } catch (error) {
    if (error?.name !== 'AbortError') window.prompt('Kopiraj rezultat i podijeli:', `${text} ${SHARE_URL}`);
  }
}

function ensureAudio() {
  if (!soundEnabled) return;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx?.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration = .05, type = 'square', volume = .02) {
  if (!soundEnabled) return;
  ensureAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playCrash() {
  if (!soundEnabled) return;
  playTone(115, .12, 'sawtooth', .035);
  setTimeout(() => playTone(78, .18, 'square', .026), 42);
}

function updateSoundButton() {
  soundButton.textContent = soundEnabled ? 'ZVUK ON' : 'ZVUK OFF';
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
}

soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off');
  updateSoundButton();
  if (soundEnabled) {
    ensureAudio();
    playTone(520, .06, 'square', .02);
  }
});

window.addEventListener('keydown', handleAction, { passive: false });
canvas.addEventListener('pointerdown', handleAction);
startButton.addEventListener('click', attemptStart);
restartButton.addEventListener('click', resetGame);
shareButton.addEventListener('click', shareResult);
refreshLeaderboardButton.addEventListener('click', loadLeaderboard);

usernameInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    attemptStart();
  }
});

usernameInput.addEventListener('input', () => {
  usernameError.classList.add('hidden');
  usernameError.textContent = '';
});

updateSoundButton();
draw();
loadLeaderboard();
