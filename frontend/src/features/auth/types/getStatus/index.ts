import { ApiResponse } from "@/types/api";
import { Status } from "@/features/auth/types";

export type GetStatusRequest = {
  u_id: string;
};

export type GetStatusResponse = ApiResponse<Status>;
