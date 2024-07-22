import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onFailureCompensate()', () => {
        test('compensates failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onFailureCompensate(error => {
                        expect(error).toBe('error');
                        record();

                        return 1;
                    })
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });

        test('does nothing if success', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onFailureCompensate(error => {
                        expect(error).toBe('error');
                        record();

                        return 1;
                    })
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('handles exception payload', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onSuccess(() => {
                        throw new Error('error');
                    })
                    .onFailureCompensate(error => Result.Fail(error))
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('handles exception', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('fail')
                    .onFailureCompensate(_ => {
                        record();
                        throw new Error('error');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });
    });
});
