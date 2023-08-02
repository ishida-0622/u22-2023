import { ApiResponse } from "@/types/api";
import { Notice } from "@/features/notice/types";

export type GetAllNoticeRequest = {};

export type GetAllNoticeResponse = ApiResponse<Notice[]>;
