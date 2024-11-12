import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.withOverriddenFail()', () => {
        test('overrides error and marks it as processed', done => {
            const failCall = jest.fn();
            const processFailCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .withOverriddenFail('newError')
                    .onFailure(error => {
                        expect(error).toBe('newError');
                        failCall();
                    })
                    .withProcessedFail(() => {
                        processFailCall();
                        return 'processed';
                    }),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                    expect(processFailCall).toBeCalledTimes(0);
                }
            );
        });

        test('overrides even processed error', done => {
            const failCall = jest.fn();
            const processFailCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .withProcessedFail(() => {
                        processFailCall();
                        return 'processed1';
                    })
                    .withOverriddenFail('overridden')
                    .withProcessedFail(() => {
                        processFailCall();
                        return 'processed2';
                    })
                    .onFailure(error => {
                        expect(error).toBe('overridden');
                        failCall();
                    }),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                    expect(processFailCall).toBeCalledTimes(1);
                }
            );
        });

        test('overrides overridden error', done => {
            const failCall = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .withOverriddenFail('overridden1')
                    .withOverriddenFail('overridden2')
                    .onFailure(error => {
                        expect(error).toBe('overridden2');
                        failCall();
                    }),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                }
            );
        });
    });
});
