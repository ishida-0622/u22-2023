import { ApiResponse } from "@/types/api";
import { Puzzle } from "@/features/puzzle/types";

export type ScanPuzzleRequest = Pick<Puzzle, "p_id">;

export type ScanPuzzleResponse = ApiResponse<Puzzle>;
