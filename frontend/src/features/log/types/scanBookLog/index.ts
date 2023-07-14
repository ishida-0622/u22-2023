import { ApiResponse } from "@/types/api";
import { BookLog } from "@/features/log/types";

export type ScanBookLogRequest = {
  u_id: string;
  /** 省略すると全てのログを取得する */
  b_id?: string;
};

export type ScanBookLogResponse = ApiResponse<BookLog[]>;
