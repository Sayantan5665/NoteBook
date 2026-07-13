import type { AppError } from './errors';

/**
 * Discriminated union representing the outcome of an operation.
 * All use cases and IPC handlers return this type — never throw.
 */
export type Result<T, E = AppError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/** Constructs a successful Result. */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/** Constructs a failed Result. */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}
