export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  error: string
}

export type Response<T> = SuccessResponse<T> | ErrorResponse

export function response<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  }
}

export function failure(error: string): ErrorResponse {
  return {
    success: false,
    error,
  }
}
