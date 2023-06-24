export * from "./puzzleSeal";

export type PuzzleType = {
  puzzleId: string;
  title: string;
  description: string;
  icon: string;
  words: string[];
  shape_keys: string[];
  illust_keys: string[];
  voice_keys: string[];
  create_date: string;
  update_date: string;
};
