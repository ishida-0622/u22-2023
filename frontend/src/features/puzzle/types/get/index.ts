import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type GetAllPuzzleRequest = {};

export type GetAllPuzzleResponse = ApiResponse<
  Pick<
    Puzzle,
    "title" | "description" | "icon" | "words" | "create_date" | "update_date"
  >[]
>;
