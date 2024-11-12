import { ProcessedError } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
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

        test('should capture stack trace in non-V8 environments', async () => {
            // Mocking Error.captureStackTrace to simulate non-V8 environment
            const originalCaptureStackTrace = Error.captureStackTrace;
            Error.captureStackTrace = undefined as any;

            const initialError = new Error('Initial error');

            const result = Result.FailWithError<number>(initialError)
                .withProcessedFailError(error => new ProcessedError('Processed error', error))
                .run();

            try {
                await result;
            } catch (error) {
                if (error instanceof ProcessedError) {
                    expect(error).toBeInstanceOf(ProcessedError);
                    expect(error.message).toBe('Processed error');
                    expect(error.stack).toBeDefined();
                    expect(error.stack).toContain('Initial error');
                    expect(error.stack).toContain('ProcessedError');
                } else {
                    throw new Error('Expected ProcessedError');
                }
            }

            Error.captureStackTrace = originalCaptureStackTrace;
        });
    });
});
