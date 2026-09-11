(() => {
  const dailyList = document.querySelector('#dailyLeaderboardList');
  const dayLabel = document.querySelector('#leaderboardDay');
  const onlineCount = document.querySelector('#onlineCount');
  if (!dailyList || !onlineCount) return;

  function renderDaily(scores) {
    dailyList.replaceChildren();
    if (!scores.length) {
      const empty = document.createElement('li');
      empty.className = 'leaderboard-empty';
      empty.textContent = 'Danas još nema rezultata. Budi prvi.';
      dailyList.append(empty);
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
      dailyList.append(item);
    }
  }

  async function refreshDaily() {
    try {
      const response = await fetch('/api/leaderboard', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) return;
      renderDaily(Array.isArray(data.today) ? data.today : []);

      if (data.day && dayLabel) {
        const [year, month, day] = data.day.split('-');
        dayLabel.textContent = `${day}.${month}.${year}.`;
      }
    } catch {
      // All-time scoreboard remains usable if this extra fetch fails.
    }
  }

  const key = 'ap-jump-session-v1';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto?.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sessionId);
  }

  async function pingOnline() {
    if (document.visibilityState !== 'visible') return;
    try {
      const response = await fetch('/api/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ sessionId }),
        cache: 'no-store',
      });
      const data = await response.json();
      if (response.ok && Number.isFinite(Number(data.online))) {
        onlineCount.textContent = String(data.online);
      }
    } catch {
      onlineCount.textContent = '—';
    }
  }

  let timer = null;
  function startHeartbeat() {
    clearInterval(timer);
    pingOnline();
    timer = setInterval(pingOnline, 20000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') startHeartbeat();
    else clearInterval(timer);
  });

  const observer = new MutationObserver(() => {
    if (!gameOverOverlay.classList.contains('hidden')) {
      setTimeout(refreshDaily, 500);
    }
  });
  observer.observe(gameOverOverlay, { attributes: true, attributeFilter: ['class'] });

  refreshDaily();
  startHeartbeat();
  setInterval(refreshDaily, 15000);
})();
