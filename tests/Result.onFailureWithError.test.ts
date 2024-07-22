import { Result } from '../src/Result';
import { executeResult } from './executeResult';

jest.setTimeout(30000);

describe('Result', () => {
    describe('.onFailureWithError()', () => {
        test('can be chained', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onFailureWithError(error => {
                        expect(error.message).toBe('error');
                        record();
                    })
                    .onSuccess(_ => done('Success not expected'))
                    .onBoth(() => {
                        return Result.Fail('error');
                    })
                    .onFailureWithError(error => {
                        expect(error.message).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });

        test('handles exception', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onSuccess(_ => {
                        record();
                        throw new Error('error');
                    })
                    .onFailureWithError(error => {
                        expect(error.message).toBe('error');
                        record();
                    })
                    .onFailureWithError(_ => {
                        record();
                        throw new Error('error2');
                    })
                    .onFailureWithError(error => {
                        expect(error.message).toBe('error2');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(4);
                }
            );
        });
    });
});
