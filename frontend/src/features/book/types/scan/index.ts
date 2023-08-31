import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type ScanBookRequest = {
  b_id: string;
};

export type ScanBookResponse = ApiResponse<Book>;
