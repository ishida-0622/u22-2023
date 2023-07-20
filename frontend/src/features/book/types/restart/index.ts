import { ApiResponse } from "@/types/api";

export type RestartBookRequest = {
  u_id: string;
};

export type RestartBookResponse = ApiResponse<{
  b_id: string;
  page: number;
}>;
