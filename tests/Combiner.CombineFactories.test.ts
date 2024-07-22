import { Combiner } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Combiner', () => {
    describe('.CombineFactories()', () => {
        test('combines results respecting options', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.CombineFactories(
                    [
                        () => Result.Delay(3000).onSuccess(() => 1),
                        () => Result.Delay(3000).onSuccess(() => 1),
                        () => Result.Ok(2),
                        () => Result.Ok(2),
                        () => Result.Delay(2000).onSuccess(() => 3),
                    ],
                    {
                        concurrency: 2,
                    }
                )
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload).toEqual([1, 1, 2, 2, 3]);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        }, 10000);
    });
});
