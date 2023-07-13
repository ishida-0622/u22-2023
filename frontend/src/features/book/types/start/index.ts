import { Book } from "@/features/book/types";
import { ApiResponse } from "@/types/api";

export type StartBookRequest = {
  u_id: string;
  b_id: string;
};

export type StartBookResponse = ApiResponse<Book>;
