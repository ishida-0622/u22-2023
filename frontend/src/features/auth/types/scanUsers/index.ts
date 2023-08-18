import { ApiResponse } from "@/types/api";
import { User } from "@/features/auth/types";

export type ScanUsersRequest = {
  u_id: string[];
};

export type ScanUsersResponse = ApiResponse<User[]>;
