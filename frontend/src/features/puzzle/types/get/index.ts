import { Puzzle } from "@/features/puzzle/types";
import { ApiResponse } from "@/types/api";

export type GetAllPuzzleRequest = {};

export type GetAllPuzzleResponse = ApiResponse<
  Pick<
    Puzzle,
    "title" | "description" | "icon" | "words" | "create_date" | "update_date"
  >[]
>;
