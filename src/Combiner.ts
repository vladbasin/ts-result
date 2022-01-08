import { Result } from '.';

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
     * Combines multiple Results into one
     * @param results Results which can be executed in parallel
     * @returns New Result which stores the value of other results
     */
    static CombineMany(results: Result<any>[]): Result<any[]> {
        const promises = results.map(result => result.asPromise());

        return new Result(Promise.all(promises));
    }
}
