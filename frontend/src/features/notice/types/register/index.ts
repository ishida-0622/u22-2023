import { ApiResponse } from "@/types/api";
import { Notice } from "@/features/notice/types";

export type RegisterNoticeRequest = Pick<Notice, "title" | "content">;

export type RegisterNoticeResponse = ApiResponse;
