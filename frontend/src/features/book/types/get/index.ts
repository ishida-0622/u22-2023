import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type GetAllBookRequest = {};

export type GetAllBookResponse = ApiResponse<Book[]>;
