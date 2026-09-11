// Restore the simple v1 share flow: native share first, clipboard fallback.
async function shareV1() {
  const final = lastFinalScore || Math.floor(score);
  const text = `${currentUsername || 'Ja'} je napravio ${formatScore(final)} u AP Jumpu. Možeš bolje?`;
  const payload = `${text} ${SHARE_URL}`;

  try {
    if (navigator.share) {
      await navigator.share({ title: 'AP Jump', text, url: SHARE_URL });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(payload);
      shareButton.textContent = 'KOPIRANO';
      setTimeout(() => { shareButton.textContent = 'PODIJELI'; }, 1400);
      return;
    }

    window.prompt('Kopiraj rezultat i podijeli:', payload);
  } catch (error) {
    if (error?.name !== 'AbortError') {
      window.prompt('Kopiraj rezultat i podijeli:', payload);
    }
  }
}

document.addEventListener('click', event => {
  if (event.target?.id !== 'shareButton') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  shareV1();
}, true);
