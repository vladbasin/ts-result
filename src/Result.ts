export type ResultActionType<T, V> = (arg: T) => (V | Promise<V> | Result<V>);
export type ResultCompleteActionType<T, V> = (arg: Result<T>) => (V | Promise<V> | Result<V>);

export class Result<T> {
    private _promise: Promise<T>;
    private _context?: any;

    constructor(promise: Promise<T>, context?: any) {
        this._promise = promise;
        this._context = context;
    }

    public asPromise(): Promise<T> {
        return this._promise;
    }

    public withContext(context: any) {
        this._context = context;

        return this;
    }

    public delay(timeout: number) {
        this._promise = this._promise
            .then(value => new Promise(resolve => setTimeout(() => resolve(value), timeout)));

        return this;
    }

    public ensure(condition: (arg: T) => boolean, error: string): Result<T> {
        if (!error) {
            throw Error("Cannot ensure condition, since error is not defined")
        }

        this._promise = this._promise
            .then(value => condition.call(this._context, value) ?
                Promise.resolve(value) :
                Promise.reject(error))

        return this
    }

    public ensureAsResult(ensurer: (value: T) => Result<boolean>, error: string): Result<T> {
        return this.onSuccess(value => ensurer(value)
            .onSuccess(condition => condition ? Result.Ok(value) : Result.Fail<T>(error))
            .onFailure(_ => Result.Fail<T>(error))
            .run());
    }

    public ensureAs<V>(condition: (arg: T) => boolean, error: string, action: ResultActionType<T, V>): Result<V> {
        return this.onSuccess(value => {
            if (condition(value)) {
                return this.execute(action, value);
            }

            this.ignorePromiseError();

            return Result.Fail<V>(error);
        });
    }

    public onSuccess<V>(action: ResultActionType<T, V>): Result<V> {
        const newPromise = this._promise
            .then(value => this.execute(action, value))

        return new Result(newPromise, this._context);
    }

    public onSuccessWhen(condition: (arg: T) => boolean, action: ResultActionType<T, T>): Result<T> {
        return this.onSuccess(arg => !!!condition(arg) ? arg : action(arg));
    }

    public onFailure(action: (arg: string) => void): Result<T> {
        this._promise = this._promise
            .catch(error => {
                action.call(this._context, error);

                throw error;
            });

        return this;
    }

    public onFailureCompensate(action: ResultActionType<string, T>): Result<T> {
        const prevPromise = this._promise;

        const newPromise = new Promise<T>((resolve, reject) => {
            prevPromise
                .then(value => resolve(value))
                .catch(error => {
                    let errorMessage = `${error}`;

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    return this.execute(action, errorMessage)
                        .then(compensatedValue => resolve(compensatedValue))
                        .catch(error => reject(error))
                });
        });

        return new Result(newPromise, this._context);
    }

    public recover(): Result<void> {
        return this.void.onFailureCompensate(_ => undefined);
    }

    public onBoth<V>(action: ResultCompleteActionType<T, V>): Result<V> {
        let isExecuted = false;

        return this
            .onSuccess(_ => {
                isExecuted = true;

                return action.call(this._context, this)
            })
            .onFailureCompensate(error => {
                if (!isExecuted) {
                    return action.call(this._context, this)
                }

                return Result.Fail(error);
            });
    }

    public withOverridenValue<V>(value: V): Result<V> {
        return this.onSuccess(_ => Result.Ok(value));
    }

    public withOverridenError(newError: string): Result<T> {
        return this.onFailureCompensate(_ => Result.Fail(newError, this._context));
    }

    public withProcessedError(factory: (error: string) => string): Result<T> {
        return this.onFailureCompensate(error => Result.Fail(factory(error), this._context));
    }

    public run(): Promise<T> {
        return this.runAsResult()._promise;
    }

    public runAsResult(): Result<T> {
        this.ignorePromiseError();

        return this;
    }

    public transformBooleanSuccess(): Result<boolean> {
        return this
            .onSuccess(_ => true)
            .onFailureCompensate(_ => false);
    }

    public get void(): Result<void> {
        return this.onSuccess(_ => undefined);
    }

    static Start(context?: any): Result<boolean> {
        return Result.Ok(true, context);
    }

    static Ok<T>(value: T, context?: any): Result<T> {
        return new Result(Promise.resolve(value), context);
    }

    static Void(): Result<void> {
        return Result.Ok(undefined);
    }

    static Delay(timeout: number): Result<void> {
        return Result.Void().delay(timeout);
    }

    static Fail<T>(error: string, context?: any): Result<T> {
        return new Result(Promise.reject(error), context);
    }

    static FromPromise<T>(promise: Promise<T>, context?: any): Result<T> {
        return new Result(promise, context);
    }

    static Combine<T>(results: Result<T>[]): Result<T[]> {
        let promises = results.map(result => result.asPromise());

        return new Result(Promise.all(promises));
    }

    static JoinFactories<T>(factories: (() => Result<T>)[]): Result<T[]> {
        let joinedResult = Result.Ok<T[]>([]);

        factories.forEach(factory => {
            joinedResult = joinedResult
                .onSuccess(items => factory().onSuccess(item => items.concat([item])));
        });

        return joinedResult;
    }

    static Create(isSuccess: Boolean, error: string, context?: any): Result<boolean> {
        return isSuccess ?
            Result.Ok(true, context) :
            Result.Fail(error, context);
    }

    static Retry<T>(times: number, delay: number, retryResultAction: () => Result<T>, context?: any): Result<T> {
        let promise = new Promise<T>((resolve, reject) => {
            retryResultAction()
                .onSuccess(value => resolve(value))
                .onFailure(error => this.retryInternal(times, 0, delay, retryResultAction, error, resolve, reject))
                .run();
        });

        return Result.FromPromise(promise, context);
    }

    static Wrap<T>(value: T | null | undefined, error: string): Result<T> {
        return value
            ? Result.Ok(value)
            : Result.Fail<T>(error);
    }

    private ignorePromiseError<T>() {
        this._promise.catch(_ => { });
    }

    private execute<T, V>(action: (input: T) => (V | Promise<V> | Result<V>), argument: T): Promise<V> {
        this.run();

        const actionResult = action.call(this._context, argument)

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
        error: string,
        resolve: (arg: T) => void,
        reject: (arg: string) => void) {
        if (times === retriedTimes) {
            reject(error);

            return;
        }

        setTimeout(() =>
            retryResultAction()
                .onSuccess(value => resolve(value))
                .onFailure(_ => this.retryInternal(times, retriedTimes + 1, delay, retryResultAction, error, resolve, reject))
                .run(),
            delay);
    }
}