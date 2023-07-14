import { ApiResponse } from "@/types/api";

export type FinishBookRequest = {
  u_id: string;
  b_id: string;
};

export type FinishBookResponse = ApiResponse;
