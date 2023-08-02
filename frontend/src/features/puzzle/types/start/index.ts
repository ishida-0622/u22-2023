import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type StartPuzzleRequest = {
  u_id: string;
  p_id: string;
};

export type StartPuzzleResponse = ApiResponse<Puzzle>;
