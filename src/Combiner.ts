import pMap from 'p-map';
import { Result } from '.';
import { CombineFactoriesOptionsType } from './CombineFactoriesOptionsType';

export class Combiner {
    /**
     * Combines two Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @returns New Result storing an array with values from the two Results.
     */
    static Combine2<T1, T2>(r1: Result<T1>, r2: Result<T2>): Result<[T1, T2]> {
        return new Result(Promise.all([r1.asPromise(), r2.asPromise()]));
    }

    /**
     * Combines three Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @param r3 Third Result.
     * @returns New Result storing an array with values from the three Results.
     */
    static Combine3<T1, T2, T3>(r1: Result<T1>, r2: Result<T2>, r3: Result<T3>): Result<[T1, T2, T3]> {
        return new Result(Promise.all([r1.asPromise(), r2.asPromise(), r3.asPromise()]));
    }

    /**
     * Combines four Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @param r3 Third Result.
     * @param r4 Fourth Result.
     * @returns New Result storing an array with values from the four Results.
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
     * Combines five Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @param r3 Third Result.
     * @param r4 Fourth Result.
     * @param r5 Fifth Result.
     * @returns New Result storing an array with values from the five Results.
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
     * Combines six Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @param r3 Third Result.
     * @param r4 Fourth Result.
     * @param r5 Fifth Result.
     * @param r6 Sixth Result.
     * @returns New Result storing an array with values from the six Results.
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
     * Combines seven Results into one.
     * @param r1 First Result.
     * @param r2 Second Result.
     * @param r3 Third Result.
     * @param r4 Fourth Result.
     * @param r5 Fifth Result.
     * @param r6 Sixth Result.
     * @param r7 Seventh Result.
     * @returns New Result storing an array with values from the seven Results.
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
     * Combines an array of Results into one, failing if any of the promises fail.
     * @param results Array of Results to combine.
     * @returns New Result storing an array with values from the Results.
     */
    static CombineMany<T>(results: Result<T>[]): Result<T[]> {
        const promises = results.map(result => result.asPromise());
        return new Result(Promise.all(promises));
    }

    /**
     * Combines an array of Results into one, never failing and returning information about which Results succeeded and which failed.
     * @param results Array of Results to combine.
     * @returns New Result storing an array of PromiseSettledResult objects.
     */
    static CombineSettled<T>(results: Result<T>[]) {
        return new Result(Promise.allSettled(results.map(result => result.asPromise())));
    }

    /**
     * Combines multiple Result factories into one, handling concurrency and errors.
     * @param factories Array of functions that create Results.
     * @param options Optional settings for combining factories.
     * @returns New Result storing an array of values produced by the factories.
     */
    static CombineFactories<T>(factories: (() => Result<T>)[], options?: CombineFactoriesOptionsType): Result<T[]> {
        return Result.FromPromise(
            pMap(Array.from(Array(factories.length).keys()), index => factories[index]().asPromise(), options)
        );
    }
}
