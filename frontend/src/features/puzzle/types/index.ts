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

export type PuzzleWord = {
  word: string;
  /** 影のURI */
  shadow: string;
  /** イラストのURI */
  illustration: string;
  voice: string;
  /** be動詞などのイラストとして表示されないものかどうか */
  is_displayed: boolean;
  /* ダミーピースか否か */
  is_dummy: boolean;
};
