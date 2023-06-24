export type PuzzleSealType = {
  puzzleId: string;
  title: string;
  description: string;
  icon: string;
};

export type GetPuzzlesResponse = {
  items: PuzzleSealType[];
};
