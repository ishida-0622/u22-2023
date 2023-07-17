import { ApiResponse } from "@/types/api";
import { User } from "@/features/auth/types";

export type SignUpRequest = Pick<
  User,
  | "family_name"
  | "first_name"
  | "family_name_roma"
  | "first_name_roma"
  | "email"
  | "password"
  | "child_lock"
  | "account_name"
>;

export type SignUpResponse = ApiResponse;
