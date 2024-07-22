/**
 * Error class to distinguish between errors that have been processed and those that have not.
 */
export class ProcessedError extends Error {
    constructor(message: string, originalError: Error);

    constructor(error: Error, originalError: Error);

    constructor(processedError: string | Error, public readonly originalError: Error) {
        super(typeof processedError === 'string' ? processedError : processedError.message);
        this.name = 'ProcessedError';

        // Capture current stack trace, excluding constructor call
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProcessedError);
        } else {
            this.stack = new Error().stack;
        }

        // Append original error stack to the new error stack
        if (originalError.stack) {
            this.stack += `\nCaused by: ${originalError.stack}`;
        }
    }
}
