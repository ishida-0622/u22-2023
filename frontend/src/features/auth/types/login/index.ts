import { User } from "@/features/auth/types";
import { ApiResponse } from "@/types/api";

export type LoginRequest = Pick<User, "u_id">;

export type LoginResponse = ApiResponse;
