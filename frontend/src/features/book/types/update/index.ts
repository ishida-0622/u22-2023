import { Book } from "@/features/book/types";
import { ApiResponse } from "@/types/api";

export type UpdateBookRequest = Pick<
  Book,
  | "b_id"
  | "title_ja"
  | "title_en"
  | "summary"
  | "author"
  | "thumbnail"
  | "pdf"
  | "voice"
>;

export type UpdateBookResponse = ApiResponse;
