import { ApiResponse } from "@/types/api";
import { PuzzleLog } from "@/features/log/types";

export type ScanPuzzleLogRequest = {
  u_id: string;
  /** 省略すると全てのログを取得する */
  p_id?: string;
};

export type ScanPuzzleLogResponse = ApiResponse<PuzzleLog[]>;
