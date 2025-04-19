export class ApiError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    // Operational errors (expected errors)
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  } else if (error instanceof Error) {
    // Unexpected errors
    console.error("Unexpected error:", error)
    return {
      message: "An unexpected error occurred",
      statusCode: 500,
    }
  } else {
    // Unknown errors
    console.error("Unknown error:", error)
    return {
      message: "An unknown error occurred",
      statusCode: 500,
    }
  }
}
