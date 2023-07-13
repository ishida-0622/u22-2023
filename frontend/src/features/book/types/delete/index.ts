import { Book } from "@/features/book/types";
import { ApiResponse } from "@/types/api";

export type DeleteBookRequest = Pick<Book, "b_id">;

export type DeleteBookResponse = ApiResponse;
