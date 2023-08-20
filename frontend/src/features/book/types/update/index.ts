import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type UpdateBookRequest = Pick<
  Book,
  | "b_id"
  | "title_jp"
  | "title_en"
  | "summary"
  | "author"
  | "thumbnail"
  | "pdf"
  | "voice"
>;
export type UpdateBookResponse = ApiResponse;
