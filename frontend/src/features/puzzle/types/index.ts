export * from "./puzzleSeal";

export type Puzzle = {
  p_id: string;
  title: string;
  description: string;
  icon: string;
  words: PuzzleWord[];
  create_date: string;
  update_date: string;
};

/** 単語, シルエット, イラスト, 音声 */
export type PuzzleWord = [string, string, string, string];
