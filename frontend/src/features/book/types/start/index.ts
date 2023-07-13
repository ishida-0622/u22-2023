import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type StartBookRequest = {
  u_id: string;
  b_id: string;
};

export type StartBookResponse = ApiResponse<Book>;
