import { Puzzle } from "@/features/puzzle/types";
import { ApiResponse } from "@/types/api";

export type UpdatePuzzleRequest = Pick<
  Puzzle,
  "p_id" | "title" | "description" | "icon" | "words"
>;

export type UpdatePuzzleResponse = ApiResponse;
