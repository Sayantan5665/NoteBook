/** Enumeration of all structured error codes used across the application. */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INFRA_ERROR = 'INFRA_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

/** Structured application error returned inside Result<T, AppError>. */
export interface AppError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: unknown;
}
