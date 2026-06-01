const SOUND_FREQUENCIES = {
  "Muuu!": 180,
  "Vau vau!": 320,
  "Mijau!": 520,
  "I-ha-ha!": 280,
};

let audioContext = null;
let userHasInteracted = false;

function getAudioContext() {
  if (!userHasInteracted) return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export function markUserInteraction() {
  userHasInteracted = true;
}

function playBeep({ frequency, duration, type = "sine", volume = 0.12 }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playCorrectSound() {
  playBeep({ frequency: 660, duration: 0.12, type: "sine", volume: 0.1 });
  setTimeout(() => {
    playBeep({ frequency: 880, duration: 0.14, type: "sine", volume: 0.1 });
  }, 90);
}

export function playWrongSound() {
  playBeep({ frequency: 320, duration: 0.18, type: "triangle", volume: 0.08 });
}

export function playAnimalSound(soundText) {
  const frequency = SOUND_FREQUENCIES[soundText] ?? 400;
  playBeep({ frequency, duration: 0.35, type: "sawtooth", volume: 0.09 });
  setTimeout(() => {
    playBeep({
      frequency: frequency * 1.15,
      duration: 0.2,
      type: "sine",
      volume: 0.07,
    });
  }, 120);
}
