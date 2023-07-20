import { ApiResponse } from "@/types/api";
import { Notice } from "@/features/notice/types";

export type DeleteNoticeRequest = Pick<Notice, "n_id">;

export type DeleteNoticeResponse = ApiResponse;
