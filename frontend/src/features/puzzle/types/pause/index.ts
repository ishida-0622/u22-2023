import { ApiResponse } from "@/types/api";

export type PausePuzzleRequest = {
  u_id: string;
  p_id: string;
  words: string[];
};

export type PausePuzzleResponse = ApiResponse;
