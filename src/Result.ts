import { isNil } from 'lodash';

export type ResultActionType<T, V> = (arg: T) => V | Promise<V> | Result<V>;
export type ResultCompleteActionType<T, V> = (arg: Result<T>) => V | Promise<V> | Result<V>;

export class Result<T> {
    private _promise: Promise<T>;
    private _context?: any;

    constructor(promise: Promise<T>, context?: any) {
        this._promise = promise;
        this._context = context;
    }

    /**
     * Converts Result instance into Promise
     * @returns Promise with stored value
     */
    public asPromise(): Promise<T> {
        return this._promise;
    }

    /**
     * Sets the context which will be used to call actions passed to other Result methods
     * @param context Target context
     * @returns Same Result object
     */
    public withContext(context: any) {
        this._context = context;

        return this;
    }

    /**
     * Delays the execution
     * @param timeout Milliseconds of the delay
     * @returns Same Result object
     */
    public delay(timeout: number): Result<T> {
        this._promise = this._promise.then(value => new Promise(resolve => setTimeout(() => resolve(value), timeout)));

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
            condition.call(this._context, value) ? Promise.resolve(value) : Promise.reject(error)
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
                .run()
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
    public ensureWithErrorAs<V>(condition: (arg: T) => boolean, error: Error, action: ResultActionType<T, V>): Result<V> {
        return this.onSuccess(value => {
            if (condition(value)) {
                return this.execute(action, value);
            }

            this.ignorePromiseError();

            return Result.FailWithError<V>(error);
        });
    }

    /**
     * Executes action in case of success (same as onSuccessMap)
     * @param action Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccess<V>(action: ResultActionType<T, V>): Result<V> {
        const newPromise = this._promise.then(value => this.execute(action, value));

        return new Result(newPromise, this._context);
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
     * Executes action in case of success. Payload from previous result is NOT transformed by action result.
     * @param action Action to execute in case of success
     * @returns If previous Result is success, return new Result from action. If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessExecute(action: ResultActionType<T, any>): Result<T> {
        var previousPayload: any = undefined;

        return this.onSuccess(payload => {
            previousPayload = payload;
            return action(payload);
        }).onSuccess(() => previousPayload as T);
    }

    /**
     * Executes action in case of success when condition is true. Payload changes to action's result.
     * @param condition Condition to check
     * @param action Action to execute in case of success
     * @returns If previous Result is success and condition is true, then return new Result from action. If previous Result is success and condition is false, does nothing (returns previous Result). If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessWhenMap(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessMap(arg => (!!!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes action in case of success when condition is true. Payload from previous result is NOT transformed by action result.
     * @param condition Condition to check
     * @param action Action to execute in case of success
     * @returns If previous Result is success and condition is true, then return new Result from action. If previous Result is success and condition is false, does nothing (returns previous Result). If previous Result is failure, does nothing (returns previous Result)
     */
    public onSuccessWhenExecute(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccessExecute(arg => (!!!condition(arg) ? arg : action(arg)));
    }

    /**
     * Executes action in case of failure
     * @param action Action to execute in case of failure. Accepts error message as argument
     * @returns Same Result object
     */
    public onFailure(action: (arg: string) => void): Result<T> {
        return this.onFailureWithError(error => {
            action.call(this._context, this.getErrorString(error));
        });
    }

    /**
     * Executes action in case of failure
     * @param action Action to execute in case of failure. Accepts error object as argument
     * @returns Same Result object
     */
    public onFailureWithError(action: (arg: Error) => void): Result<T> {
        this._promise = this._promise.catch(error => {
            action.call(this._context, error);

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
        return this.onFailureCompensateWithError(error => action.call(this._context, this.getErrorString(error)));
    }

    /**
     * Tries to compensate failure
     * @param action Action to execute in case of failure. Accepts error as argument
     * @returns If previous Result is success, then does nothing. If previouse Result is failure, then tries to execute action and returns promise from this action.
     */
    public onFailureCompensateWithError(action: ResultActionType<Error, T>): Result<T> {
        const prevPromise = this._promise;

        const newPromise = new Promise<T>((resolve, reject) => {
            prevPromise
                .then(value => resolve(value))
                .catch(error => {
                    try {
                        this.execute(action, error)
                            .then(compensatedValue => resolve(compensatedValue))
                            .catch(error => reject(error));
                    } catch (error) {
                        reject(error);
                    }
                });
        });

        return new Result(newPromise, this._context);
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

            return action.call(this._context, this);
        }).onFailureCompensate(error => {
            this.ignorePromiseError();

            if (!isExecuted) {
                return action.call(this._context, this);
            }

            return Result.Fail(error);
        });
    }

    /**
     * Overrides current value
     * @param value New value
     * @returns New Result which stores new value
     */
    public withOverridenValue<V>(value: V): Result<V> {
        return this.onSuccess(_ => Result.Ok(value));
    }

    /**
     * Overrides current error
     * @param value New error
     * @returns New Result which stores new error
     */
    public withOverridenFail(newError: string): Result<T> {
        return this.withOverridenFailError(new Error(newError));
    }

    /**
     * Overrides current error
     * @param value New error
     * @returns New Result which stores new error
     */
    public withOverridenFailError(newError: Error): Result<T> {
        return this.onFailureCompensate(_ => Result.FailWithError(newError, this._context));
    }

    /**
     * Processes error
     * @param factory Function which accepts error and transforms into a new one
     * @returns New failed Result object, which contains processed error
     */
    public withProcessedFail(factory: (error: string) => string): Result<T> {
        return this.onFailureCompensate(error => Result.Fail(factory(error), this._context));
    }

    /**
     * Processes error
     * @param factory Function which accepts error and transforms into a new one
     * @returns New failed Result object, which contains processed error
     */
    public withProcessedFailError(factory: (error: Error) => Error): Result<T> {
        return this.onFailureCompensateWithError(error => Result.FailWithError(factory(error), this._context));
    }

    /**
     * Executes commands in Result
     * @returns Promise which represents the result
     */
    public run(): Promise<T> {
        return this.runAsResult()._promise;
    }

    /**
     * Executes commands in Result
     * @returns Result with promise
     */
    public runAsResult(): Result<T> {
        this.ignorePromiseError();

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
     * @param context Context to execute actions in
     * @returns New Promise with true value
     */
    static Start(context?: any): Result<boolean> {
        return Result.Ok(true, context);
    }

    /**
     * Creates Result with value and optional context
     * @param value Value to store in Result
     * @param context Context to execute actions in
     * @returns New Promise with stored value
     */
    static Ok<T>(value: T, context?: any): Result<T> {
        return new Result(Promise.resolve(value), context);
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
     * @param context Context to execute actions in
     * @returns New Result object with failure
     */
    static Fail<T>(error: string, context?: any): Result<T> {
        return Result.FailWithError(new Error(error), context);
    }

    /**
     * Creates Result with failure
     * @param error Error of the failure
     * @param context Context to execute actions in
     * @returns New Result object with failure
     */
    static FailWithError<T>(error: Error, context?: any): Result<T> {
        return new Result(Promise.reject(error), context);
    }

    /**
     * Creates Result from promise
     * @param promise Promise to track
     * @param context Context to execute actions in
     * @returns New Result object from Promise
     */
    static FromPromise<T>(promise: Promise<T>, context?: any): Result<T> {
        return new Result(promise, context);
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine<T>(results: Result<T>[]): Result<T[]> {
        let promises = results.map(result => result.asPromise());

        return new Result(Promise.all(promises));
    }

    /**
     * Combines multiple Result factories into one
     * @param factories Factories which create Results to be executed in parallel
     * @returns New Result which stores the value of produced results
     */
    static JoinFactories<T>(factories: (() => Result<T>)[]): Result<T[]> {
        let joinedResult = Result.Ok<T[]>([]);

        factories.forEach(factory => {
            joinedResult = joinedResult.onSuccess(items => factory().onSuccess(item => items.concat([item])));
        });

        return joinedResult;
    }

    /**
     * Creates Result
     * @param isSuccess Indicates whether the Result is failure or success
     * @param error Error in for new Result in case it is failure
     * @param context Context to execute actions in
     * @returns New Result with true or false value
     */
    static Create(isSuccess: Boolean, error: string, context?: any): Result<boolean> {
        return this.CreateWithError(isSuccess, new Error(error), context);
    }

    /**
     * Creates Result
     * @param isSuccess Indicates whether the Result is failure or success
     * @param error Error in for new Result in case it is failure
     * @param context Context to execute actions in
     * @returns New Result with true or false value
     */
    static CreateWithError(isSuccess: Boolean, error: Error, context?: any): Result<boolean> {
        return isSuccess ? Result.Ok(true, context) : Result.FailWithError(error, context);
    }

    /**
     * Retries execution of any action
     * @param times Number of attempts
     * @param delay Delay between attempts
     * @param retryResultAction Action to execute and retry
     * @param context  Context to execute actions in
     * @returns New Result which represents either failure or success
     */
    static Retry<T>(times: number, delay: number, retryResultAction: () => Result<T>, context?: any): Result<T> {
        let promise = new Promise<T>((resolve, reject) => {
            retryResultAction()
                .onSuccess(value => resolve(value))
                .onFailureWithError(error => this.retryInternal(times, 0, delay, retryResultAction, error, resolve, reject))
                .run();
        });

        return Result.FromPromise(promise, context);
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

    private getErrorString(error: any) {
        return error instanceof Error ? error.message : `${error}`;
    }

    private ignorePromiseError<T>() {
        this._promise.catch(_ => { });
    }

    private execute<T, V>(action: (input: T) => V | Promise<V> | Result<V>, argument: T): Promise<V> {
        this.run();

        const actionResult = action.call(this._context, argument);

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
