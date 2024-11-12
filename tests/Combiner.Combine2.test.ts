import { Combiner } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Combiner', () => {
    describe('.Combine2()', () => {
        test('combines result when both are successful', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine2(Result.Ok(1), Result.Ok(2))
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload).toEqual([1, 2]);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('fails when the first result is a failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine2(Result.Fail('error'), Result.Ok(2))
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

        test('fails when the second result is a failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine2(Result.Ok(1), Result.Fail('error'))
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

        test('fails when both results are failures', done => {
            const record = jest.fn();

            executeResult(
                done,
                Combiner.Combine2(Result.Fail('error1'), Result.Fail('error2'))
                    .onFailure(error => {
                        expect(error).toBe('error1');
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
