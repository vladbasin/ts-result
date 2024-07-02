import { ProcessedError } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.withProcessedFailError()', () => {
    test('overrides error', done => {
        const record = jest.fn();

        executeResult(
            done,
            Result.Fail('error')
                .withProcessedFailError(_ => new Error('newError'))
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
                .withProcessedFailError(_ => new Error('newError'))
                .withProcessedFailError(_ => new Error('newErrorOverridden'))
                .onFailureWithError(error => {
                    expect(error.message).toBe('newError');
                    expect(error instanceof ProcessedError).toBe(true);
                    record();
                }),
            () => {
                expect(record).toBeCalledTimes(1);
            }
        );
    });
});
