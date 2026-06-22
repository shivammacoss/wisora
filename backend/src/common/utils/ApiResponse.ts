import type { Response } from 'express';

/** Standard envelope returned by every endpoint: { success, data, error, meta }. */
export interface ApiMeta {
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { message: string; details?: unknown } | null;
  meta?: ApiMeta;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200, meta?: ApiMeta): Response {
    const body: ApiEnvelope<T> = { success: true, data, error: null, meta };
    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data: T, meta?: ApiMeta): Response {
    return ApiResponse.success(res, data, 201, meta);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    details?: unknown,
  ): Response {
    const body: ApiEnvelope<null> = {
      success: false,
      data: null,
      error: { message, details },
    };
    return res.status(statusCode).json(body);
  }
}
