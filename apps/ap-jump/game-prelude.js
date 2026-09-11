// Bootstrap stub used before the UI module loads. The real implementation replaces it in game-ui.js.
function updateSoundButton() {}

window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src = './game-live.js';
  document.body.append(script);
});
