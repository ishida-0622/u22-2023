import { ApiResponse } from "@/types/api";

export type PauseBookRequest = {
  u_id: string;
  b_id: string;
  page: number;
};

export type PauseBookResponse = ApiResponse;
