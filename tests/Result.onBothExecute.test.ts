import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onBothExecute()', () => {
        test('is called when failure', done => {
            const bothCall = jest.fn();
            const failCall = jest.fn();
            const successCall = jest.fn();
            const asyncCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onBothExecute(() => {
                        bothCall();
                        return Result.Void().onSuccess(() => asyncCall());
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall())
                    .onBothExecute(() => {
                        bothCall();
                        return Result.Void().onSuccess(() => asyncCall());
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall()),
                () => {
                    expect(bothCall).toBeCalledTimes(2);
                    expect(failCall).toBeCalledTimes(2);
                    expect(successCall).toBeCalledTimes(0);
                    expect(asyncCall).toBeCalledTimes(2);
                }
            );
        });

        test('is called when success', done => {
            const bothCall = jest.fn();
            const failCall = jest.fn();
            const successCall = jest.fn();
            const asyncCall = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onBothExecute(() => {
                        bothCall();
                        return Result.Void().onSuccess(() => asyncCall());
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall())
                    .onBothExecute(() => {
                        bothCall();
                        return Result.Void().onSuccess(() => asyncCall());
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall()),
                () => {
                    expect(bothCall).toBeCalledTimes(2);
                    expect(failCall).toBeCalledTimes(0);
                    expect(successCall).toBeCalledTimes(2);
                    expect(asyncCall).toBeCalledTimes(2);
                }
            );
        });

        test('returns new error', done => {
            const failCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error1')
                    .onBothExecute(() => Result.Fail('error2'))
                    .onFailure(error => failCall(error)),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                    expect(failCall).toBeCalledWith('error2');
                }
            );
        });

        test('returns same result', done => {
            const successCall = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onBothExecute(() => Result.Ok(2))
                    .onSuccess(value => successCall(value)),
                () => {
                    expect(successCall).toBeCalledTimes(1);
                    expect(successCall).toBeCalledWith(1);
                }
            );
        });

        test('returns error if success, but execution fails', done => {
            const failCall = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onBothExecute(() => Result.Fail('error'))
                    .onFailure(error => failCall(error)),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                    expect(failCall).toBeCalledWith('error');
                }
            );
        });
    });
});
