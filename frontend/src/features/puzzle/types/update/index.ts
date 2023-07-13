import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type UpdatePuzzleRequest = Pick<
  Puzzle,
  "p_id" | "title" | "description" | "icon" | "words"
>;

export type UpdatePuzzleResponse = ApiResponse;
