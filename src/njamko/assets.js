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
  return `/njamko/assets/animals/${slugify(animalName)}.png`;
}

export function getFoodImageSrc(foodName) {
  return `/njamko/assets/foods/${slugify(foodName)}.png`;
}

export const BACKGROUND_IMAGES = {
  start: "/njamko/assets/backgrounds/start.png",
  game: "/njamko/assets/backgrounds/game.png",
  finish: "/njamko/assets/backgrounds/finish.png",
};

export const UI_IMAGES = {
  medal: "/njamko/assets/ui/medal.png",
  star: "/njamko/assets/ui/star.png",
};
