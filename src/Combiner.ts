import pMap from 'p-map';
import { Result } from '.';
import { CombineFactoriesOptionsType } from './CombineFactoriesOptionsType';

export class Combiner {
    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine2<T1, T2>(r1: Result<T1>, r2: Result<T2>): Result<[T1, T2]> {
        return new Result(Promise.all([r1.asPromise(), r2.asPromise()]));
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine3<T1, T2, T3>(r1: Result<T1>, r2: Result<T2>, r3: Result<T3>): Result<[T1, T2, T3]> {
        return new Result(Promise.all([r1.asPromise(), r2.asPromise(), r3.asPromise()]));
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine4<T1, T2, T3, T4>(
        r1: Result<T1>,
        r2: Result<T2>,
        r3: Result<T3>,
        r4: Result<T4>
    ): Result<[T1, T2, T3, T4]> {
        return new Result(Promise.all([r1.asPromise(), r2.asPromise(), r3.asPromise(), r4.asPromise()]));
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine5<T1, T2, T3, T4, T5>(
        r1: Result<T1>,
        r2: Result<T2>,
        r3: Result<T3>,
        r4: Result<T4>,
        r5: Result<T5>
    ): Result<[T1, T2, T3, T4, T5]> {
        return new Result(
            Promise.all([r1.asPromise(), r2.asPromise(), r3.asPromise(), r4.asPromise(), r5.asPromise()])
        );
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine6<T1, T2, T3, T4, T5, T6>(
        r1: Result<T1>,
        r2: Result<T2>,
        r3: Result<T3>,
        r4: Result<T4>,
        r5: Result<T5>,
        r6: Result<T6>
    ): Result<[T1, T2, T3, T4, T5, T6]> {
        return new Result(
            Promise.all([
                r1.asPromise(),
                r2.asPromise(),
                r3.asPromise(),
                r4.asPromise(),
                r5.asPromise(),
                r6.asPromise(),
            ])
        );
    }

    /**
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static Combine7<T1, T2, T3, T4, T5, T6, T7>(
        r1: Result<T1>,
        r2: Result<T2>,
        r3: Result<T3>,
        r4: Result<T4>,
        r5: Result<T5>,
        r6: Result<T6>,
        r7: Result<T7>
    ): Result<[T1, T2, T3, T4, T5, T6, T7]> {
        return new Result(
            Promise.all([
                r1.asPromise(),
                r2.asPromise(),
                r3.asPromise(),
                r4.asPromise(),
                r5.asPromise(),
                r6.asPromise(),
                r7.asPromise(),
            ])
        );
    }

    /**
     * Combines multiple Results into one. Fails if any of the promise fails.
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static CombineMany<T>(results: Result<T>[]): Result<T[]> {
        const promises = results.map(result => result.asPromise());

        return new Result(Promise.all(promises));
    }

    /**
     * Combines multiple Results into one. Never fails and returns information about which results where successful and which aren't
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static CombineSettled<T>(results: Result<T>[]) {
        return new Result(Promise.allSettled(results.map(result => result.asPromise())));
    }

    /**
     * Combines multiple Result factories into one with concurrency and error handling.
     * @param factories Factories which create Results to be executed
     * @returns New Result which stores the value of produced results
     */
    static CombineFactories<T>(factories: (() => Result<T>)[], options?: CombineFactoriesOptionsType): Result<T[]> {
        return Result.FromPromise(
            pMap(Array.from(Array(factories.length).keys()), index => factories[index]().asPromise(), options)
        );
    }
}
