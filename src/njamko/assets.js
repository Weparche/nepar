import { assetPath } from "./assetPath.js";

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/đ/g, "d")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

export function getAnimalImageSrc(animalName) {
  return assetPath(`/assets/animals/${slugify(animalName)}.png`);
}

export function getFoodImageSrc(foodName) {
  return assetPath(`/assets/foods/${slugify(foodName)}.png`);
}

export const BACKGROUND_IMAGES = {
  start: null,
  game: null,
  finish: null,
};

export const UI_IMAGES = {
  medal: assetPath("/assets/ui/medal.png"),
  star: assetPath("/assets/ui/star.png"),
};

export const MUSIC = {
  campaignMap: assetPath("/assets/music/Njam njam Njamko.mp3"),
  food: assetPath("/assets/music/Njam njam Njamko.mp3"),
  home: assetPath("/assets/music/Njam njam Njamko - dom.mp3"),
  sound: assetPath("/assets/music/Njam njam Njamko  - zvuk.mp3"),
  baby: assetPath("/assets/music/Njam njam Njamko - beba.mp3"),
  counting: assetPath("/assets/music/Njamko plaza.mp3"),
};
