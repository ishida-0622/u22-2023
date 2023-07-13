import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type DeletePuzzleRequest = Pick<Puzzle, "p_id">;

export type DeletePuzzleResponse = ApiResponse;
