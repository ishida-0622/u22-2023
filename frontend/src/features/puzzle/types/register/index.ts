import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type RegisterPuzzleRequest = Pick<
  Puzzle,
  "title" | "description" | "icon" | "words"
>;

export type RegisterPuzzleResponse = ApiResponse;
