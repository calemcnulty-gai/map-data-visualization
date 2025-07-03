/**
 * @fileoverview Comprehensive error handling framework
 * @module lib/errors/error-handler
 */

// Custom error classes
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super('RATE_LIMIT_ERROR', message, 429);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: unknown) {
    super(
      'EXTERNAL_SERVICE_ERROR',
      `External service error: ${service}`,
      503,
      originalError
    );
    this.name = 'ExternalServiceError';
  }
}

// Error response formatter
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    },
  };
}

// Error logging
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      }),
    } : error,
  };

  // In production, this would send to a logging service
  console.error('[ERROR]', JSON.stringify(errorDetails, null, 2));
}

// API error handler wrapper
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  context?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
}

// Client-side error handler
export function handleClientError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for common client-side errors
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('aborted')) {
      return 'Request was cancelled. Please try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

// Validation error formatter
export function formatValidationErrors(errors: any[]): string {
  return errors
    .map((error) => {
      const field = error.path?.join('.') || 'field';
      return `${field}: ${error.message}`;
    })
    .join(', ');
} 