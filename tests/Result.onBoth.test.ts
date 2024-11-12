import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onBoth()', () => {
        test('is called when failure', done => {
            const bothCall = jest.fn();
            const failCall = jest.fn();
            const successCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onBoth(() => {
                        bothCall();
                        return Result.Fail('error');
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall())
                    .onBoth(() => {
                        bothCall();
                        return Result.Fail('error');
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall()),
                () => {
                    expect(bothCall).toBeCalledTimes(2);
                    expect(failCall).toBeCalledTimes(2);
                    expect(successCall).toBeCalledTimes(0);
                }
            );
        });

        test('is called when success', done => {
            const bothCall = jest.fn();
            const failCall = jest.fn();
            const successCall = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onBoth(() => {
                        bothCall();
                        return Result.Ok(1);
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall())
                    .onBoth(() => {
                        bothCall();
                        return Result.Ok(1);
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall()),
                () => {
                    expect(bothCall).toBeCalledTimes(2);
                    expect(failCall).toBeCalledTimes(0);
                    expect(successCall).toBeCalledTimes(2);
                }
            );
        });

        test('is called when success, but handler fails', done => {
            const bothCall = jest.fn();
            const failCall = jest.fn();
            const successCall = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onBoth(() => {
                        bothCall();
                        return Result.Fail('error');
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall())
                    .onBoth(() => {
                        bothCall();
                        return Result.Ok(1);
                    })
                    .onFailure(_ => failCall())
                    .onSuccess(_ => successCall()),
                () => {
                    expect(bothCall).toBeCalledTimes(2);
                    expect(failCall).toBeCalledTimes(1);
                    expect(successCall).toBeCalledTimes(1);
                }
            );
        });
    });
});
