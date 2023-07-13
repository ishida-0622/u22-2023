import { Puzzle } from "@/features/puzzle/types";
import { ApiResponse } from "@/types/api";

export type DeletePuzzleRequest = Pick<Puzzle, "p_id">;

export type DeletePuzzleResponse = ApiResponse;
