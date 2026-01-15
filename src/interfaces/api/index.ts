export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  pagination?: PaginationMeta;
  error?: ApiError;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code?: string; // custom error code
  message: string; // error message
  status?: number; // HTTP status (optional)
  details?: unknown; // optional internal error info
}
