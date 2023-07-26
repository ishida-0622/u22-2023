export type ApiResponse<T = { [key: string]: never }> = {
  response_status: ResponseStatus;
  result: T;
  error?: string;
};

type ResponseStatus = "success" | "fail";
