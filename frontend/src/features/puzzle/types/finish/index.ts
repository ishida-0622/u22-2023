import { ApiResponse } from "@/types/api";

export type FinishPuzzleRequest = {
  u_id: string;
  p_id: string;
};

export type FinishPuzzleResponse = ApiResponse;
