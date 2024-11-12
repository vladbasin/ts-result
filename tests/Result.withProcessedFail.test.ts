import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.withProcessedFail()', () => {
        test('overrides error', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .withProcessedFail(_ => 'newError')
                    .onFailure(error => {
                        expect(error).toBe('newError');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('doesnt override if called more than once', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .withProcessedFail(_ => 'newError')
                    .withProcessedFail(_ => 'newErrorOverridden')
                    .onFailure(error => {
                        expect(error).toBe('newError');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
