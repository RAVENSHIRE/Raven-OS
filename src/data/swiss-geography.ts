export type SwissCategory = "cities" | "mountains" | "lakes" | "rivers";

type SwissData = Record<SwissCategory, string[]>;

const SWISS_DATA: SwissData = {
  cities: [
    "Aarau",
    "Aigle",
    "Arbon",
    "Baden",
    "Basel",
    "Bellinzona",
    "Bern",
    "Biel",
    "Bulle",
    "Chur",
    "Davos",
    "Fribourg",
    "Geneva",
    "Glarus",
    "Lausanne",
    "Lugano",
    "Lucerne",
    "Neuchatel",
    "Olten",
    "Schaffhausen",
    "Sion",
    "Solothurn",
    "St Gallen",
    "Thun",
    "Uster",
    "Vevey",
    "Winterthur",
    "Yverdon",
    "Zermatt",
    "Zurich",
  ],
  mountains: [
    "Albis",
    "Bachtel",
    "Badus",
    "Breithorn",
    "Dammastock",
    "Dom",
    "Eiger",
    "Finsteraarhorn",
    "Fluela",
    "Galenstock",
    "Jungfrau",
    "Lyskamm",
    "Matterhorn",
    "Monte Rosa",
    "Napf",
    "Niesen",
    "Pilatus",
    "Piz Bernina",
    "Piz Kesch",
    "Rigi",
    "Santis",
    "Titlis",
    "Uetliberg",
    "Weisshorn",
  ],
  lakes: [
    "Aegeri",
    "Brienz",
    "Constance",
    "Geneva",
    "Greifen",
    "Hallwil",
    "Joux",
    "Lucerne",
    "Lugano",
    "Maggiore",
    "Murten",
    "Neuchatel",
    "Oeschinen",
    "Sarnen",
    "Sihl",
    "Thun",
    "Walen",
    "Zug",
    "Zurich",
  ],
  rivers: [
    "Aare",
    "Albula",
    "Birs",
    "Doubs",
    "Emme",
    "Glatt",
    "Inn",
    "Limmat",
    "Linth",
    "Muota",
    "Reuss",
    "Rhine",
    "Rhone",
    "Sarine",
    "Sihl",
    "Thur",
    "Ticino",
    "Toess",
  ],
};

function normalizeValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function startsWithLetter(value: string, letter: string) {
  const normalized = normalizeValue(value);
  return normalized.startsWith(normalizeValue(letter));
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();
  const list: string[] = [];

  for (const value of values) {
    const key = normalizeValue(value);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    list.push(value);
  }

  return list;
}

export function answersForLetter(category: SwissCategory, letter: string) {
  return uniqueValues(SWISS_DATA[category].filter((entry) => startsWithLetter(entry, letter)));
}

export function isValidAnswer(category: SwissCategory, letter: string, answer: string) {
  const normalizedAnswer = normalizeValue(answer);
  if (!normalizedAnswer) {
    return false;
  }

  if (!startsWithLetter(normalizedAnswer, letter)) {
    return false;
  }

  return answersForLetter(category, letter).some((entry) => normalizeValue(entry) === normalizedAnswer);
}

export function playableLetters() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return alphabet.filter((letter) => {
    const playableCategoryCount = (Object.keys(SWISS_DATA) as SwissCategory[]).filter(
      (category) => answersForLetter(category, letter).length >= 3
    ).length;

    return playableCategoryCount >= 3;
  });
}

export const CATEGORY_LABELS: Record<SwissCategory, string> = {
  cities: "Cities",
  mountains: "Mountains",
  lakes: "Lakes",
  rivers: "Rivers",
};

export const SWISS_CATEGORIES: SwissCategory[] = ["cities", "mountains", "lakes", "rivers"];
