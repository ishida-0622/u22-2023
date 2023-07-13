import { Book } from "@/features/book/types";
import { ApiResponse } from "@/types/api";

export type GetAllBookRequest = {};

export type GetAllBookResponse = ApiResponse<Book[]>;
