import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onFailureCompensateWithError()', () => {
        test('compensates failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onFailureCompensateWithError(error => {
                        expect(error.message).toBe('error');
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
                    .onFailureCompensateWithError(error => {
                        expect(error.message).toBe('error');
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

        test('does not execute success if compensated is still failure', done => {
            const failureCompensateCall = jest.fn();
            const failureCall = jest.fn();
            const successCall = jest.fn();
            const bothCall = jest.fn();

            executeResult(
                done,
                Result.FromPromise(
                    new Promise(() => {
                        throw new Error('error');
                    })
                )
                    .onFailureCompensateWithError(error => {
                        expect(error.message).toBe('error');
                        failureCompensateCall();

                        return Result.Delay(2000).onSuccess(() => Result.Fail('error'));
                    })
                    .onSuccess(() => {
                        successCall();
                    })
                    .onSuccess(() => {
                        successCall();
                    })
                    .onFailureWithError(() => {
                        failureCall();
                    })
                    .void.onSuccess(() => {
                        successCall();
                    })
                    .onFailure(() => {
                        failureCall();
                    })
                    .onBoth(() => {
                        bothCall();
                        return Result.Fail('error');
                    })
                    .onSuccess(() => {
                        successCall();
                    })
                    .onFailure(() => {
                        failureCall();
                    })
                    .runAsResult(),
                () => {
                    expect(failureCompensateCall).toBeCalledTimes(1);
                    expect(successCall).toBeCalledTimes(0);
                    expect(failureCall).toBeCalledTimes(3);
                    expect(bothCall).toBeCalledTimes(1);
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
                    .onFailureCompensateWithError(error => Result.FailWithError(error))
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
