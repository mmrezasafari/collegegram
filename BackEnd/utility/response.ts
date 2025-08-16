import { ApiResponse } from "./api_response";

export function successResponse<T>(data?: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message?: string): ApiResponse<null> {
  return {
    success: false,
    message
  };
}