import { Combiner } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Combiner', () => {
    describe('.Combine5()', () => {
        test('combines result when success', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine5(Result.Ok(1), Result.Ok(2), Result.Ok(3), Result.Ok(4), Result.Ok(5))
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload).toEqual([1, 2, 3, 4, 5]);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('fails when failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine5(Result.Ok(1), Result.Ok(2), Result.Ok(3), Result.Ok(4), Result.Fail('error'))
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    })
                    .onSuccess(_ => done('Success not expected')),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
