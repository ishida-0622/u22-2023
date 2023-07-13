import { ApiResponse } from "@/types/api";
import { Book } from "@/features/book/types";

export type DeleteBookRequest = Pick<Book, "b_id">;

export type DeleteBookResponse = ApiResponse;
