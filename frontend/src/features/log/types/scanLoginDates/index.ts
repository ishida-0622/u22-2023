import { ApiResponse } from "@/types/api";
import { LoginLog } from "@/features/log/types";

export type ScanLoginDatesRequest = {
  u_id: string;
  /** yyyyMMdd */
  start_date: string;
  /** yyyyMMdd */
  end_date: string;
};

export type ScanLoginDatesResponse = ApiResponse<LoginLog[]>;
