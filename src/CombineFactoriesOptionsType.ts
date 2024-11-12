/**
 * Defines join behavior
 */
export type CombineFactoriesOptionsType = {
    /**
     * Maximum level of parallel execution
     */
    concurrency?: number;
    /**
     * Stop the process and fail if any of the underlying result fails
     */
    stopOnError?: boolean;
    /**
     * Pass a signal to stop the process
     */
    abortSignal?: AbortSignal;
};
