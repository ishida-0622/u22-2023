import { ApiResponse } from "@/types/api";
import { LoginLog } from "@/features/log/types";

export type ScanLoginLogRequest = {
  u_id: string;
};

export type ScanLoginLogResponse = ApiResponse<LoginLog[]>;
