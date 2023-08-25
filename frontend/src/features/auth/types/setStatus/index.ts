import { ApiResponse } from "@/types/api";

export type SetStatusRequest = {
  u_id: string;
  game_status: "0" | "1" | "2" | "3" | "4";
};

export type SetStatusResponse = ApiResponse;
