import { Puzzle } from "@/features/puzzle/types";
import { ApiResponse } from "@/types/api";

export type RegisterPuzzleRequest = Pick<
  Puzzle,
  "title" | "description" | "icon" | "words"
>;

export type RegisterPuzzleResponse = ApiResponse;
