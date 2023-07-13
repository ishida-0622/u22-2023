import { ApiResponse } from "@/types/api";

export type RestartPuzzleRequest = {
  u_id: string;
};

export type RestartPuzzleResponse = ApiResponse<{
  p_id: string;
  words: string[];
}>;
