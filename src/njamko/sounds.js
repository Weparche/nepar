import { assetPath } from "./assetPath.js";

const SOUND_FREQUENCIES = {
  "Muuu!": 180,
  "Vau vau!": 320,
  "Mijau!": 520,
  "I-ha-ha!": 280,
  "I-ha!": 280,
  "Kva kva!": 440,
  "Beee!": 360,
  "Kukuriku!": 620,
  "Grok grok!": 240,
  "Kre kre!": 480,
  "Ribbit!": 480,
  "Bzzzz!": 700,
  "Kokoda!": 560,
  "Meeeh!": 340,
  "Ga ga!": 420,
  "Njihaha!": 300,
  "Ciju ciju!": 640,
  "Piju piju!": 580,
  "Šššš!": 200,
  "Hu hu!": 260,
  "Roooar!": 120,
  "Auuu!": 220,
  "Truuu!": 160,
  "Grrr!": 140,
  "Klap klap!": 380,
  "Kri kri!": 500,
};

let audioContext = null;
let userHasInteracted = false;
let activeAnimalAudio = null;
let backgroundMusicAudio = null;
let backgroundMusicVolume = 0.42;
let backgroundMusicDuckingTimer = null;

const BACKGROUND_MUSIC_DUCKED_VOLUME = 0.12;
const ANIMAL_BEEP_DUCK_MS = 750;

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

export function startBackgroundMusic(src, { volume = 0.42 } = {}) {
  if (!userHasInteracted || !src) return;

  try {
    if (!backgroundMusicAudio || backgroundMusicAudio.dataset.src !== src) {
      stopBackgroundMusic();
      const audio = new Audio(src);
      audio.dataset.src = src;
      audio.loop = true;
      audio.volume = volume;
      backgroundMusicAudio = audio;
    }

    backgroundMusicVolume = volume;
    if (backgroundMusicAudio.volume > BACKGROUND_MUSIC_DUCKED_VOLUME) {
      backgroundMusicAudio.volume = volume;
    }

    const playPromise = backgroundMusicAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch {
    /* ignore */
  }
}

export function stopBackgroundMusic() {
  try {
    clearTimeout(backgroundMusicDuckingTimer);
    backgroundMusicDuckingTimer = null;
    if (backgroundMusicAudio) {
      backgroundMusicAudio.pause();
      backgroundMusicAudio.currentTime = 0;
      backgroundMusicAudio = null;
    }
  } catch {
    /* ignore */
  }
}

function restoreBackgroundMusicVolume() {
  clearTimeout(backgroundMusicDuckingTimer);
  backgroundMusicDuckingTimer = null;

  try {
    if (backgroundMusicAudio) {
      backgroundMusicAudio.volume = backgroundMusicVolume;
    }
  } catch {
    /* ignore */
  }
}

function duckBackgroundMusic(durationMs = ANIMAL_BEEP_DUCK_MS) {
  if (!backgroundMusicAudio) return;

  try {
    clearTimeout(backgroundMusicDuckingTimer);
    backgroundMusicAudio.volume = Math.min(
      backgroundMusicAudio.volume,
      BACKGROUND_MUSIC_DUCKED_VOLUME,
    );
    if (durationMs) {
      backgroundMusicDuckingTimer = setTimeout(
        restoreBackgroundMusicVolume,
        durationMs,
      );
    }
  } catch {
    /* ignore */
  }
}

export function setBackgroundMusicEnabled(enabled) {
  if (!backgroundMusicAudio) return;

  try {
    if (enabled) {
      const playPromise = backgroundMusicAudio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      backgroundMusicAudio.pause();
    }
  } catch {
    /* ignore */
  }
}

export function stopAnimalSound() {
  try {
    if (activeAnimalAudio) {
      activeAnimalAudio.pause();
      activeAnimalAudio.currentTime = 0;
      activeAnimalAudio = null;
    }
    restoreBackgroundMusicVolume();
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
    duckBackgroundMusic();
    playAnimalSoundBeep(soundText);
    return;
  }

  try {
    const audio = new Audio(assetPath(soundSrc));
    audio.volume = 0.85;
    activeAnimalAudio = audio;

    const fallbackToBeep = () => {
      duckBackgroundMusic();
      playAnimalSoundBeep(soundText);
    };
    const handleAnimalSoundDone = () => {
      if (activeAnimalAudio === audio) {
        activeAnimalAudio = null;
      }
      restoreBackgroundMusicVolume();
    };

    audio.addEventListener("error", fallbackToBeep, { once: true });
    audio.addEventListener("ended", handleAnimalSoundDone, { once: true });

    duckBackgroundMusic(null);
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        handleAnimalSoundDone();
        fallbackToBeep();
      });
    }
  } catch {
    duckBackgroundMusic();
    playAnimalSoundBeep(soundText);
  }
}
