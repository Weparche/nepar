const SOUND_FREQUENCIES = {
  "Muuu!": 180,
  "Vau vau!": 320,
  "Mijau!": 520,
  "I-ha-ha!": 280,
  "Kva kva!": 440,
  "Beee!": 360,
  "Kikiriki!": 620,
  "Grok grok!": 240,
  "Ribbit!": 480,
  "Zzzzz!": 700,
};

let audioContext = null;
let userHasInteracted = false;
let activeAnimalAudio = null;

function getAudioContext() {
  if (!userHasInteracted) return null;

  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  } catch {
    return null;
  }
}

export function markUserInteraction() {
  userHasInteracted = true;
}

export function stopAnimalSound() {
  try {
    if (activeAnimalAudio) {
      activeAnimalAudio.pause();
      activeAnimalAudio.currentTime = 0;
      activeAnimalAudio = null;
    }
  } catch {
    /* ignore */
  }
}

function playBeep({ frequency, duration, type = "sine", volume = 0.12 }) {
  try {
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
  } catch {
    /* Browser blocked audio or Web Audio unavailable */
  }
}

function playAnimalSoundBeep(soundText) {
  const frequency = SOUND_FREQUENCIES[soundText] ?? 400;
  playBeep({ frequency, duration: 0.32, type: "sawtooth", volume: 0.08 });
  setTimeout(() => {
    playBeep({
      frequency: frequency * 1.12,
      duration: 0.18,
      type: "sine",
      volume: 0.06,
    });
  }, 120);
}

export function playCorrectSound() {
  playBeep({ frequency: 660, duration: 0.12, type: "sine", volume: 0.1 });
  setTimeout(() => {
    playBeep({ frequency: 880, duration: 0.14, type: "sine", volume: 0.1 });
  }, 90);
}

export function playWrongSound() {
  playBeep({ frequency: 340, duration: 0.16, type: "triangle", volume: 0.06 });
}

export function playAnimalSound(soundText, soundSrc) {
  if (!userHasInteracted) return;

  stopAnimalSound();

  if (!soundSrc) {
    playAnimalSoundBeep(soundText);
    return;
  }

  try {
    const audio = new Audio(soundSrc);
    audio.volume = 0.85;
    activeAnimalAudio = audio;

    const fallbackToBeep = () => {
      playAnimalSoundBeep(soundText);
    };

    audio.addEventListener("error", fallbackToBeep, { once: true });

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(fallbackToBeep);
    }
  } catch {
    playAnimalSoundBeep(soundText);
  }
}
