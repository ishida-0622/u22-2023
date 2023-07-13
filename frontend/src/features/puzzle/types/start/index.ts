import { Puzzle } from "@/features/puzzle/types";
import { ApiResponse } from "@/types/api";

export type StartPuzzleRequest = {
  u_id: string;
  p_id: string;
};

export type StartPuzzleResponse = ApiResponse<
  Pick<
    Puzzle,
    "title" | "description" | "icon" | "words" | "create_date" | "update_date"
  >
>;
