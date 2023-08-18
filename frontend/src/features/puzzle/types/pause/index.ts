import { ApiResponse } from "@/types/api";

export type PausePuzzleRequest = {
  u_id: string;
  p_id: string;
  saved_data: string[];
};

export type PausePuzzleResponse = ApiResponse;
