import { ApiResponse } from "@/types/api";
import { User } from "@/features/auth/types";

export type ScanUserRequest = {
  u_id: string;
};

export type ScanUserResponse = ApiResponse<User>;
