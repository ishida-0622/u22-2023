import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type RegisterBookRequest = Pick<
  Book,
  "title_ja" | "title_en" | "summary" | "author" | "thumbnail" | "pdf" | "voice"
>;

export type RegisterBookResponse = ApiResponse;
