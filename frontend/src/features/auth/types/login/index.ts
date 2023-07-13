import { ApiResponse } from "@/types/api";
import { User } from "@/features/auth/types";

export type LoginRequest = Pick<User, "u_id" | "password">;

export type LoginResponse = ApiResponse;
