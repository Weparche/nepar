// Bootstrap stubs used before the later game scripts load.
function updateSoundButton() {}
function draw() {}

window.addEventListener('load', () => {
  const script = document.createElement('script');
  script.src = './game-live.js';
  document.body.append(script);
});
