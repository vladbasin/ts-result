import { MaybeNullable } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { Combiner, ProcessedError } from '.';
import { CombineFactoriesOptionsType } from './CombineFactoriesOptionsType';

// eslint-disable-next-line no-use-before-define
export type ResultActionType<T, V> = (arg: T) => V | Promise<V> | Result<V>;
// eslint-disable-next-line no-use-before-define
export type ResultCompleteActionType<T, V> = () => V | Promise<V> | Result<V>;

export class Result<T> {
    private _promise: Promise<T>;

    constructor(promise: Promise<T>) {
        this._promise = promise;
    }

    /**
     * Converts Result instance into Promise
     * @returns Promise with stored value
     */
    public asPromise(): Promise<T> {
        return this._promise;
    }

    /**
     * Delays the execution
     * @param timeout Milliseconds of the delay
     * @returns Same Result object
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
     * Ensures condition is true
     * @param condition Condition to check
     * @param error Error to store if condition isn't true
     * @returns Failed Result in case condition isn't true. Successful Result in case condition is true.
     */
    public ensure(condition: (arg: T) => boolean, error: string): Result<T> {
        return this.ensureWithError(condition, new Error(error));
    }

    /**
     * Ensures condition is true
     * @param condition Condition to check
     * @param error Error to store if condition isn't true
     * @returns Failed Result in case condition isn't true. Successful Result in case condition is true.
     */
    public ensureWithError(condition: (arg: T) => boolean, error: Error): Result<T> {
        this._promise = this._promise.then(value =>
            condition(value) ? Promise.resolve(value) : Promise.reject(error)
        );

        return this;
    }

    /**
     * Ensures condition is true
     * @param ensurer Result condition to check to be true
     * @param error Error to store if condition isn't true
     * @returns Failed Result in case condition isn't true or failed. Successful Result in case condition is true.
     */
    public ensureResult(ensurer: (value: T) => Result<boolean>, error: string): Result<T> {
        return this.ensureResultWithError(ensurer, new Error(error));
    }

    /**
     * Ensures condition is true
     * @param ensurer Result condition to check to be true
     * @param error Error to store if condition isn't true
     * @returns Failed Result in case condition isn't true or failed. Successful Result in case condition is true.
     */
    public ensureResultWithError(ensurer: (value: T) => Result<boolean>, error: Error): Result<T> {
        return this.onSuccess(value =>
            ensurer(value)
                .onSuccess(condition => (condition ? Result.Ok(value) : Result.FailWithError<T>(error)))
                .onFailureCompensate(_ => Result.FailWithError<T>(error))
        );
    }

    /**
     * Ensures condition is true and then transforms result value
     * @param condition Condition to check
     * @param error Error to store if condition isn't true
     * @param action Action which transforms result value
     * @returns Failed Result in case condition isn't true or failed. Successful Result in case condition is true.
     */
    public ensureAs<V>(condition: (arg: T) => boolean, error: string, action: ResultActionType<T, V>): Result<V> {
        return this.ensureWithErrorAs(condition, new Error(error), action);
    }

    /**
     * Ensures condition is true and then transforms result value
     * @param condition Condition to check
     * @param error Error to store if condition isn't true
     * @param action Action which transforms result value
     * @returns Failed Result in case condition isn't true or failed. Successful Result in case condition is true.
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
     * Executes action in case of success (same as onSuccessMap)
     * @param action Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccess<V>(action: ResultActionType<T, V>): Result<V> {
        return new Result(this._promise.then(value => this.execute(action, value)));
    }

    /**
     * Executes action in case of success. Payload changes to action's result.
     * @param action Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessMap<V>(action: ResultActionType<T, V>): Result<V> {
        return this.onSuccess(action);
    }

    /**
     * Unwraps payload in case of success. In case unwrap fails (returns undefined) returns failure.
     * @param transform Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public ensureUnwrapWithError<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: Error): Result<V> {
        return this.onSuccess(payload => {
            const unwrapped = unwrapper(payload);
            return isNil(unwrapped) ? Result.FailWithError(error) : Result.Ok(unwrapped);
        });
    }

    /**
     * Unwraps payload in case of success. In case unwrap fails (returns undefined) returns failure.
     * @param transform Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public ensureUnwrap<V>(unwrapper: (arg: T) => MaybeNullable<V>, error: string): Result<V> {
        return this.ensureUnwrapWithError(unwrapper, new Error(error));
    }

    /**
     * Executes action in case of success. Payload from previous result is NOT transformed by action result.
     * @param action Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessExecute(action: ResultActionType<T, unknown>): Result<T> {
        let previousPayload: T;

        return this.onSuccess(payload => {
            previousPayload = payload;
            return action(payload);
        }).onSuccess(() => previousPayload);
    }

    /**
     * Executes action in case of success when condition is true. Payload changes to action's result.
     * @param condition Condition to check
     * @param action Action to execute in case of success
     * @returns If previous Result is success and condition is true, then return new Result from action. If previous Result is success and condition is false, does nothing (returns previous Result). If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessWhenMap(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessMap(arg => (!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes action in case of success when condition is true. Payload from previous result is NOT transformed by action result.
     * @param condition Condition to check
     * @param action Action to execute in case of success
     * @returns If previous Result is success and condition is true, then return new Result from action. If previous Result is success and condition is false, does nothing (returns previous Result). If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessWhenExecute(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessExecute(arg => (!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes action in case of failure
     * @param action Action to execute in case of failure. Accepts error message as argument
     * @returns Same Result object
     */
    public onFailure(action: (arg: string) => void): Result<T> {
        return this.onFailureWithError(error => {
            action(this.getErrorString(error));
        });
    }

    /**
     * Executes action in case of failure
     * @param action Action to execute in case of failure. Accepts error object as argument
     * @returns Same Result object
     */
    public onFailureWithError(action: (arg: Error) => void): Result<T> {
        this._promise = this._promise.catch(error => {
            action(error);

            throw error;
        });

        return this;
    }

    /**
     * Tries to compensate failure
     * @param action Action to execute in case of failure. Accepts error as argument
     * @returns If previous Result is success, then does nothing. If previouse Result is failure, then tries to execute action and returns promise from this action.
     */
    public onFailureCompensate(action: ResultActionType<string, T>): Result<T> {
        return this.onFailureCompensateWithError(error => action(this.getErrorString(error)));
    }

    /**
     * Tries to compensate failure
     * @param action Action to execute in case of failure. Accepts error as argument
     * @returns If previous Result is success, then does nothing. If previouse Result is failure, then tries to execute action and returns promise from this action.
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
     * Ignores previous errors
     * @returns New success Result
     */
    public recover(): Result<void> {
        return this.void.onFailureCompensate(_ => undefined);
    }

    /**
     * Executes action in both fail and success cases
     * @returns New Result from action
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
     * Executes action in both fail and success cases. Payload from previous result is NOT transformed by action result.
     * @returns New Result from action
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
     * Overrides current value
     * @param value New value
     * @returns New Result which stores new value
     */
    public withOverriddenValue<V>(value: V): Result<V> {
        return this.onSuccess(_ => Result.Ok(value));
    }

    /**
     * Overrides current error. Marks it as processed, so that subsequent processing calls don't override it
     * @param value New error
     * @returns New Result which stores new error
     */
    public withOverriddenFail(newError: string): Result<T> {
        return this.withOverriddenFailError(new Error(newError));
    }

    /**
     * Overrides current error. Marks it as processed, so that subsequent processing calls don't override it
     * @param value New error
     * @returns New Result which stores new error
     */
    public withOverriddenFailError(newError: Error): Result<T> {
        return this.onFailureCompensate(_ => Result.FailAsProcessedWithError(newError));
    }

    /**
     * Processes error. Ensures that subsequent errors are not overridden
     * @param factory Function which accepts error and transforms into a new one
     * @returns New failed Result object, which contains processed error
     */
    public withProcessedFail(factory: (error: string) => string): Result<T> {
        return this.onFailureCompensateWithError(originalError =>
            originalError instanceof ProcessedError
                ? Result.FailWithError(originalError)
                : Result.FailWithError(new ProcessedError(factory(this.getErrorString(originalError)), originalError))
        );
    }

    /**
     * Processes error. Ensures that subsequent errors are not overridden
     * @param factory Function which accepts error and transforms into a new one
     * @returns New failed Result object, which contains processed error
     */
    public withProcessedFailError(factory: (error: Error) => Error): Result<T> {
        return this.onFailureCompensateWithError(originalError =>
            originalError instanceof ProcessedError
                ? Result.FailWithError<T>(originalError)
                : Result.FailWithError<T>(new ProcessedError(factory(originalError), originalError))
        );
    }

    /**
     * Executes commands in Result ignoring uncached errors
     * @returns Promise which represents the result
     */
    public run(): Promise<T> {
        // eslint-disable-next-line no-underscore-dangle
        return this.runAsResult()._promise;
    }

    /**
     * Executes commands in Result ignoring uncached errors
     * @returns Result with promise
     */
    public runAsResult(): Result<T> {
        this._promise.catch(_ => undefined);

        return this;
    }

    /**
     * Transoforms Promise into true\false Result based on success or failure
     * @returns Result with true or false value
     */
    public transformBooleanSuccess(): Result<boolean> {
        return this.onSuccess(_ => true).onFailureCompensate(_ => false);
    }

    /**
     * Converts to void Result
     * @returns Result with void value
     */
    public get void(): Result<void> {
        return this.onSuccess(_ => undefined);
    }

    /**
     * Creates Result with optional context
     * @returns New Promise with true value
     */
    static Start(): Result<boolean> {
        return Result.Ok(true);
    }

    /**
     * Creates Result with value and optional context
     * @param value Value to store in Result
     * @returns New Promise with stored value
     */
    static Ok<T>(value: T): Result<T> {
        return new Result(Promise.resolve(value));
    }

    /**
     * Creates Result with empty value
     * @returns Result with void value
     */
    static Void(): Result<void> {
        return Result.Ok(undefined);
    }

    /**
     * Creates Results which delays execution
     * @param timeout Milliseconds of the delay
     * @returns New Result object
     */
    static Delay(timeout: number): Result<void> {
        return Result.Void().delay(timeout);
    }

    /**
     * Creates Result with failure
     * @param error Error message of the failure
     * @returns New Result object with failure
     */
    static Fail<T>(error: string): Result<T> {
        return Result.FailWithError(new Error(error));
    }

    /**
     * Creates Result with failure
     * @param error Error of the failure
     * @returns New Result object with failure
     */
    static FailWithError<T>(error: Error): Result<T> {
        return new Result(Promise.reject(error));
    }

    /**
     * Creates Result with failure. Ensures that processing methods don't override this error
     * @param error Error of the failure
     * @returns New Result object with failure
     */
    static FailAsProcessed<T>(error: string): Result<T> {
        return Result.FailAsProcessedWithError(new Error(error));
    }

    /**
     * Creates Result with failure. Ensures that processing methods don't override this error
     * @param error Error of the failure
     * @returns New Result object with failure
     */
    static FailAsProcessedWithError<T>(error: Error): Result<T> {
        return new Result(Promise.reject(new ProcessedError(error.message, error)));
    }

    /**
     * Creates Result from promise
     * @param promise Promise to track
     * @returns New Result object from Promise
     */
    static FromPromise<T>(promise: Promise<T>): Result<T> {
        return new Result(promise);
    }

    /**
     * Combines multiple Results into one. Fails if any of the promise fails.
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine<T>(results: Result<T>[]): Result<T[]> {
        return Combiner.CombineMany(results);
    }

    /**
     * Combines multiple Results into one. Never fails and returns information about which results where successful and which aren't
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static CombineSettled<T>(results: Result<T>[]) {
        return Combiner.CombineSettled(results);
    }

    /**
     * Combines multiple Result factories into one with concurrency and error handling.
     * @param factories Factories which create Results to be executed
     * @returns New Result which stores the value of produced results
     */
    static CombineFactories<T>(factories: (() => Result<T>)[], options?: CombineFactoriesOptionsType): Result<T[]> {
        return Combiner.CombineFactories(factories, options);
    }

    /**
     * Creates Result
     * @param isSuccess Indicates whether the Result is failure or success
     * @param error Error in for new Result in case it is failure
     * @returns New Result with true or false value
     */
    static Create(isSuccess: boolean, error: string): Result<boolean> {
        return this.CreateWithError(isSuccess, new Error(error));
    }

    /**
     * Creates Result
     * @param isSuccess Indicates whether the Result is failure or success
     * @param error Error in for new Result in case it is failure
     * @returns New Result with true or false value
     */
    static CreateWithError(isSuccess: boolean, error: Error): Result<boolean> {
        return isSuccess ? Result.Ok(true) : Result.FailWithError(error);
    }

    /**
     * Retries execution of any action
     * @param times Number of attempts
     * @param delay Delay between attempts
     * @param retryResultAction Action to execute and retry
     * @returns New Result which represents either failure or success
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
     * Creates Result based on value
     * @param value Value to store
     * @param error Error in case value is empty
     * @returns New success Result in case there is a value or fail Result
     */
    static Wrap<T>(value: T | null | undefined, error: string): Result<T> {
        return this.WrapWithError(value, new Error(error));
    }

    /**
     * Creates Result based on value
     * @param value Value to store
     * @param error Error in case value is empty
     * @returns New success Result in case there is a value or fail Result
     */
    static WrapWithError<T>(value: T | null | undefined, error: Error): Result<T> {
        return !isNil(value) ? Result.Ok(value) : Result.FailWithError<T>(error);
    }

    private getErrorString(error: unknown): string {
        const errorAsRecord = error as Record<string, unknown>;

        return typeof error === 'object' && 'message' in errorAsRecord ? `${errorAsRecord.message}` : `${error}`;
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
