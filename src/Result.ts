import { MaybeNullable } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { Combiner, ProcessedError } from '.';
import { CombineFactoriesOptionsType } from './CombineFactoriesOptionsType';

// eslint-disable-next-line no-use-before-define
export type ResultActionType<T, V> = (arg: T) => V | Promise<V> | Result<V>;
// eslint-disable-next-line no-use-before-define
export type ResultCompleteActionType<T, V> = () => V | Promise<V> | Result<V>;

/**
 * Represents a wrapper for asynchronous operations with built-in error handling.
 * @template T The type of the value wrapped by this Result
 */
export class Result<T> {
    private _promise: Promise<T>;

    constructor(promise: Promise<T>) {
        this._promise = promise;
    }

    /**
     * Converts the Result instance into a Promise.
     * @returns Promise that resolves to the stored value.
     */
    public asPromise(): Promise<T> {
        return this._promise;
    }

    /**
     * Delays the execution of the Result by a specified timeout.
     * @param timeout Milliseconds to delay.
     * @returns The same Result object.
     */
    public delay(timeout: number): Result<T> {
        this._promise = this._promise.then(
            value =>
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve(value);
                    }, timeout);
                })
        );

        return this;
    }

    /**
     * Ensures a condition is true, otherwise fails with a specified error message.
     * @param condition Function that checks a condition.
     * @param error Error message if the condition is not met.
     * @returns The same Result object.
     */
    public ensure(condition: (arg: T) => boolean, error: string): Result<T> {
        return this.ensureWithError(condition, new Error(error));
    }

    /**
     * Ensures a condition is true, marking any failure as processed.
     * @param condition Function that checks a condition.
     * @param error Error message if the condition is not met.
     * @returns The same Result object.
     */
    public ensureAsProcessed(condition: (arg: T) => boolean, error: string): Result<T> {
        return this.ensureWithErrorAsProcessed(condition, new Error(error));
    }

    /**
     * Ensures a condition is true, otherwise fails with a specified error.
     * @param condition Function that checks a condition.
     * @param error Error object if the condition is not met.
     * @returns The same Result object.
     */
    public ensureWithError(condition: (arg: T) => boolean, error: Error): Result<T> {
        this._promise = this._promise.then(value =>
            condition(value) ? Promise.resolve(value) : Promise.reject(error)
        );

        return this;
    }

    /**
     * Ensures a condition is true, marking any failure as processed.
     * @param condition Function that checks a condition.
     * @param error Error object if the condition is not met.
     * @returns The same Result object.
     */
    public ensureWithErrorAsProcessed(condition: (arg: T) => boolean, error: Error): Result<T> {
        this._promise = this._promise.then(value =>
            condition(value)
                ? Promise.resolve(value)
                : Promise.reject(error instanceof ProcessedError ? error : new ProcessedError(error, new Error()))
        );

        return this;
    }

    /**
     * Ensures a condition is true using a Result-based checker.
     * @param ensurer Function that returns a Result indicating success or failure.
     * @param error Error message if the condition is not met.
     * @returns The same Result object.
     */
    public ensureResult(ensurer: (value: T) => Result<boolean>, error: string): Result<T> {
        return this.ensureResultWithError(ensurer, new Error(error));
    }

    /**
     * Ensures a condition is true using a Result-based checker.
     * @param ensurer Function that returns a Result indicating success or failure.
     * @param error Error object if the condition is not met.
     * @returns The same Result object.
     */
    public ensureResultWithError(ensurer: (value: T) => Result<boolean>, error: Error): Result<T> {
        return this.onSuccess(value =>
            ensurer(value)
                .onSuccess(condition => (condition ? Result.Ok(value) : Result.FailWithError<T>(error)))
                .onFailureCompensate(_ => Result.FailWithError<T>(error))
        );
    }

    /**
     * Ensures a condition is true and transforms the result value.
     * @param condition Function that checks a condition.
     * @param error Error message if the condition is not met.
     * @param action Function that transforms the result value.
     * @returns The same Result object.
     */
    public ensureAs<V>(condition: (arg: T) => boolean, error: string, action: ResultActionType<T, V>): Result<V> {
        return this.ensureWithErrorAs(condition, new Error(error), action);
    }

    /**
     * Ensures a condition is true and transforms the result value.
     * @param condition Function that checks a condition.
     * @param error Error object if the condition is not met.
     * @param action Function that transforms the result value.
     * @returns The same Result object.
     */
    public ensureWithErrorAs<V>(
        condition: (arg: T) => boolean,
        error: Error,
        action: ResultActionType<T, V>
    ): Result<V> {
        return this.onSuccess(value => {
            if (condition(value)) {
                return this.execute(action, value);
            }

            return Result.FailWithError<V>(error);
        });
    }

    /**
     * Executes an action in case of success, similar to onSuccessMap.
     * @param action Function to execute in case of success.
     * @returns New Result object from the action.
     */
    public onSuccess<V>(action: ResultActionType<T, V>): Result<V> {
        return new Result(this._promise.then(value => this.execute(action, value)));
    }

    /**
     * Executes an action in case of success, transforming the payload.
     * @param action Function to execute in case of success.
     * @returns New Result object from the action.
     */
    public onSuccessMap<V>(action: ResultActionType<T, V>): Result<V> {
        return this.onSuccess(action);
    }

    /**
     * Unwraps the payload in case of success, failing if the unwrap returns undefined.
     * @param unwrapper Function that unwraps the payload.
     * @param error Error object if the unwrap fails.
     * @returns New Result object.
     */
    public ensureUnwrapWithError<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: Error): Result<V> {
        return this.onSuccess(payload => {
            const unwrapped = unwrapper(payload);
            return isNil(unwrapped) ? Result.FailWithError(error) : Result.Ok(unwrapped);
        });
    }

    /**
     * Unwraps the payload in case of success, failing if the unwrap returns undefined.
     * @param unwrapper Function that unwraps the payload.
     * @param error Error message if the unwrap fails.
     * @returns New Result object.
     */
    public ensureUnwrap<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: string): Result<V> {
        return this.ensureUnwrapWithError(unwrapper, new Error(error));
    }

    /**
     * Unwraps the payload in case of success, marking any failure as processed.
     * @param unwrapper Function that unwraps the payload.
     * @param error Error object if the unwrap fails.
     * @returns New Result object.
     */
    public ensureUnwrapAsProcessedWithError<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: Error): Result<V> {
        return this.ensureUnwrapWithError(
            unwrapper,
            error instanceof ProcessedError ? error : new ProcessedError(error.message, error)
        );
    }

    /**
     * Unwraps the payload in case of success, marking any failure as processed.
     * @param unwrapper Function that unwraps the payload.
     * @param error Error message if the unwrap fails.
     * @returns New Result object.
     */
    public ensureUnwrapAsProcessed<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: string): Result<V> {
        return this.ensureUnwrapAsProcessedWithError(unwrapper, new Error(error));
    }

    /**
     * Executes an action in case of success without transforming the payload.
     * @param action Function to execute in case of success.
     * @returns The same Result object.
     */
    public onSuccessExecute(action: ResultActionType<T, unknown>): Result<T> {
        let previousPayload: T;

        return this.onSuccess(payload => {
            previousPayload = payload;
            return action(payload);
        }).onSuccess(() => previousPayload);
    }

    /**
     * Executes an action in case of success when a condition is true, transforming the payload.
     * @param condition Function that checks a condition.
     * @param action Function to execute in case of success.
     * @returns The same Result object.
     */
    public onSuccessWhenMap(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessMap(arg => (!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes an action in case of success when a condition is true without transforming the payload.
     * @param condition Function that checks a condition.
     * @param action Function to execute in case of success.
     * @returns The same Result object.
     */
    public onSuccessWhenExecute(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessExecute(arg => (!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes an action in case of failure.
     * @param action Function to execute in case of failure, accepts an error message as an argument.
     * @returns The same Result object.
     */
    public onFailure(action: (arg: string) => void): Result<T> {
        return this.onFailureWithError(error => {
            action(this.getErrorString(error));
        });
    }

    /**
     * Executes an action in case of failure.
     * @param action Function to execute in case of failure, accepts an error object as an argument.
     * @returns The same Result object.
     */
    public onFailureWithError(action: (arg: Error) => void): Result<T> {
        this._promise = this._promise.catch(error => {
            action(error);

            throw error;
        });

        return this;
    }

    /**
     * Tries to compensate for failure.
     * @param action Function to execute in case of failure, accepts an error message as an argument.
     * @returns The same Result object.
     */
    public onFailureCompensate(action: ResultActionType<string, T>): Result<T> {
        return this.onFailureCompensateWithError(error => action(this.getErrorString(error)));
    }

    /**
     * Tries to compensate for failure.
     * @param action Function to execute in case of failure, accepts an error object as an argument.
     * @returns The same Result object.
     */
    public onFailureCompensateWithError(action: ResultActionType<Error, T>): Result<T> {
        this._promise = this._promise.catch(error => {
            try {
                const result = this.execute(action, error);
                return result;
            } catch (e) {
                return Promise.reject(e);
            }
        });

        return this;
    }

    /**
     * Ignores any previous errors.
     * @returns New success Result with void value.
     */
    public recover(): Result<void> {
        return this.void.onFailureCompensate(_ => undefined);
    }

    /**
     * Executes an action regardless of success or failure.
     * @param action Function to execute in both cases.
     * @returns New Result object from the action.
     */
    public onBoth<V>(action: ResultCompleteActionType<T, V>): Result<V> {
        let isExecuted = false;

        return this.onSuccess(_ => {
            isExecuted = true;

            return action();
        }).onFailureCompensateWithError(error => {
            if (!isExecuted) {
                return action();
            }

            return Result.FailWithError(error);
        });
    }

    /**
     * Executes an action regardless of success or failure, without transforming the payload.
     * @param action Function to execute in both cases.
     * @returns The same Result object.
     */
    public onBothExecute(action: ResultCompleteActionType<T, unknown>): Result<T> {
        let isExecuted = false;

        return this.onSuccessExecute(() => {
            isExecuted = true;

            return action();
        }).onFailureCompensateWithError(error => {
            if (!isExecuted) {
                return Result.FailWithError<unknown>(error)
                    .onFailureCompensate(() => action())
                    .onSuccess(() => Result.FailWithError<T>(error));
            }

            return Result.FailWithError<T>(error);
        });
    }

    /**
     * Overrides the current value with a new one.
     * @param value New value.
     * @returns New Result object with the overridden value.
     */
    public withOverriddenValue<V>(value: V): Result<V> {
        return this.onSuccess(_ => Result.Ok(value));
    }

    /**
     * Overrides the current error, marking it as processed.
     * @param newError New error message.
     * @returns The same Result object with the new error.
     */
    public withOverriddenFail(newError: string): Result<T> {
        return this.withOverriddenFailError(new Error(newError));
    }

    /**
     * Overrides the current error, marking it as processed.
     * @param newError New error object.
     * @returns The same Result object with the new error.
     */
    public withOverriddenFailError(newError: Error): Result<T> {
        return this.onFailureCompensate(_ => Result.FailAsProcessedWithError(newError));
    }

    /**
     * Processes the error, ensuring subsequent errors are not overridden.
     * @param factory Function that transforms the error.
     * @returns New Result object with the processed error.
     */
    public withProcessedFail(factory: (error: string) => string): Result<T> {
        return this.onFailureCompensateWithError(originalError =>
            originalError instanceof ProcessedError
                ? Result.FailWithError(originalError)
                : Result.FailWithError(new ProcessedError(factory(this.getErrorString(originalError)), originalError))
        );
    }

    /**
     * Processes the error, ensuring subsequent errors are not overridden.
     * @param factory Function that transforms the error.
     * @returns New Result object with the processed error.
     */
    public withProcessedFailError(factory: (error: Error) => Error): Result<T> {
        return this.onFailureCompensateWithError(originalError => {
            if (originalError instanceof ProcessedError) {
                return Result.FailWithError(originalError);
            }

            const factoryError = factory(originalError);

            return Result.FailWithError<T>(
                factoryError instanceof ProcessedError ? factoryError : new ProcessedError(factoryError, originalError)
            );
        });
    }

    /**
     * Runs the Result, ignoring uncaught errors.
     * @returns Promise that represents the result.
     */
    public run(): Promise<T> {
        // eslint-disable-next-line no-underscore-dangle
        return this.runAsResult()._promise;
    }

    /**
     * Runs the Result, ignoring uncaught errors.
     * @returns The same Result object.
     */
    public runAsResult(): Result<T> {
        this._promise.catch(_ => undefined);

        return this;
    }

    /**
     * Transforms the Result into a boolean based on success or failure.
     * @returns New Result object with true or false value.
     */
    public transformBooleanSuccess(): Result<boolean> {
        return this.onSuccess(_ => true).onFailureCompensate(_ => false);
    }

    /**
     * Converts the Result into a void Result.
     * @returns New Result object with void value.
     */
    public get void(): Result<void> {
        return this.onSuccess(_ => undefined);
    }

    /**
     * Starts a new Result with an optional context.
     * @returns New Result object with true value.
     */
    static Start(): Result<boolean> {
        return Result.Ok(true);
    }

    /**
     * Creates a new Result with a specified value.
     * @param value Value to store in the Result.
     * @returns New Result object with the stored value.
     */
    static Ok<T>(value: T): Result<T> {
        return new Result(Promise.resolve(value));
    }

    /**
     * Creates a new Result with void value.
     * @returns New Result object with void value.
     */
    static Void(): Result<void> {
        return Result.Ok(undefined);
    }

    /**
     * Creates a new Result with a specified delay.
     * @param timeout Milliseconds to delay.
     * @returns New Result object.
     */
    static Delay(timeout: number): Result<void> {
        return Result.Void().delay(timeout);
    }

    /**
     * Creates a new Result with a failure.
     * @param error Error message of the failure.
     * @returns New Result object with failure.
     */
    static Fail<T>(error: string): Result<T> {
        return Result.FailWithError(new Error(error));
    }

    /**
     * Creates a new Result with a failure.
     * @param error Error object of the failure.
     * @returns New Result object with failure.
     */
    static FailWithError<T>(error: Error): Result<T> {
        return new Result(Promise.reject(error));
    }

    /**
     * Creates a new Result with a processed failure.
     * @param error Error message of the failure.
     * @returns New Result object with failure.
     */
    static FailAsProcessed<T>(error: string): Result<T> {
        return Result.FailAsProcessedWithError(new Error(error));
    }

    /**
     * Creates a new Result with a processed failure.
     * @param error Error object of the failure.
     * @returns New Result object with failure.
     */
    static FailAsProcessedWithError<T>(error: Error): Result<T> {
        return new Result(
            Promise.reject(error instanceof ProcessedError ? error : new ProcessedError(error.message, error))
        );
    }

    /**
     * Creates a new Result from a promise.
     * @param promise Promise to track.
     * @returns New Result object from the promise.
     */
    static FromPromise<T>(promise: Promise<T>): Result<T> {
        return new Result(promise);
    }

    /**
     * Combines multiple Results into one, failing if any of the promises fail.
     * @param results Array of Results to be combined.
     * @returns New Result object that stores the combined values.
     */
    static Combine<T>(results: Result<T>[]): Result<T[]> {
        return Combiner.CombineMany(results);
    }

    /**
     * Combines multiple Results into one, returning information about successes and failures.
     * @param results Array of Results to be combined.
     * @returns New Result object that stores the combined values.
     */
    static CombineSettled<T>(results: Result<T>[]) {
        return Combiner.CombineSettled(results);
    }

    /**
     * Combines multiple Result factories into one with concurrency and error handling.
     * @param factories Array of functions that create Results.
     * @param options Optional settings for combining factories.
     * @returns New Result object that stores the combined values.
     */
    static CombineFactories<T>(factories: (() => Result<T>)[], options?: CombineFactoriesOptionsType): Result<T[]> {
        return Combiner.CombineFactories(factories, options);
    }

    /**
     * Creates a new Result based on success or failure.
     * @param isSuccess Indicates if the Result is successful.
     * @param error Error message if the Result is a failure.
     * @returns New Result object with true or false value.
     */
    static Create(isSuccess: boolean, error: string): Result<boolean> {
        return this.CreateWithError(isSuccess, new Error(error));
    }

    /**
     * Creates a new Result based on success or failure.
     * @param isSuccess Indicates if the Result is successful.
     * @param error Error object if the Result is a failure.
     * @returns New Result object with true or false value.
     */
    static CreateWithError(isSuccess: boolean, error: Error): Result<boolean> {
        return isSuccess ? Result.Ok(true) : Result.FailWithError(error);
    }

    /**
     * Retries the execution of an action a specified number of times.
     * @param times Number of retry attempts.
     * @param delay Delay between attempts in milliseconds.
     * @param retryResultAction Action to execute and retry.
     * @returns New Result object representing either success or failure.
     */
    static Retry<T>(times: number, delay: number, retryResultAction: () => Result<T>): Result<T> {
        const promise = new Promise<T>((resolve, reject) => {
            retryResultAction()
                .onSuccess(value => resolve(value))
                .onFailureWithError(error =>
                    this.retryInternal(times, 0, delay, retryResultAction, error, resolve, reject)
                )
                .run();
        });

        return Result.FromPromise(promise);
    }

    /**
     * Creates a new Result based on the presence of a value.
     * @param value Value to store in the Result.
     * @param error Error message if the value is null or undefined.
     * @returns New success Result if there is a value, otherwise a failure Result.
     */
    static Wrap<T>(value: T | null | undefined, error: string): Result<T> {
        return this.WrapWithError(value, new Error(error));
    }

    /**
     * Creates a new Result based on the presence of a value.
     * @param value Value to store in the Result.
     * @param error Error object if the value is null or undefined.
     * @returns New success Result if there is a value, otherwise a failure Result.
     */
    static WrapWithError<T>(value: T | null | undefined, error: Error): Result<T> {
        return !isNil(value) ? Result.Ok(value) : Result.FailWithError<T>(error);
    }

    private getErrorString(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }

    private execute<K, V>(action: (input: K) => V | Promise<V> | Result<V>, argument: K): Promise<V> {
        const actionResult = action(argument);

        if (actionResult instanceof Promise) {
            return actionResult;
        }

        if (actionResult instanceof Result) {
            return actionResult.asPromise();
        }

        return Promise.resolve(actionResult);
    }

    private static retryInternal<T>(
        times: number,
        retriedTimes: number,
        delay: number,
        retryResultAction: () => Result<T>,
        error: Error,
        resolve: (arg: T) => void,
        reject: (arg: Error) => void
    ) {
        if (times === retriedTimes) {
            reject(error);

            return;
        }

        setTimeout(
            () =>
                retryResultAction()
                    .onSuccess(value => resolve(value))
                    .onFailure(_ =>
                        this.retryInternal(times, retriedTimes + 1, delay, retryResultAction, error, resolve, reject)
                    )
                    .run(),
            delay
        );
    }
}
