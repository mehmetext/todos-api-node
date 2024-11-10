export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: unknown;
}
