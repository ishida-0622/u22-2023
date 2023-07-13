import { ApiResponse } from "@/types/api";
import { User } from "@/features/auth/types";

export type QuitRequest = Pick<User, "u_id">;

export type QuitResponse = ApiResponse;
