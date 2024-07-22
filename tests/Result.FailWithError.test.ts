import { ProcessedError } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.FailWithError()', () => {
        test('produces fail', done => {
            executeResult(
                done,
                Result.FailWithError(new Error('text'))
                    .onSuccess(_ => done('No success expected'))
                    .onFailure(error => {
                        expect(error).toBe('text');
                    })
                    .onFailureWithError(error => {
                        expect(error.message).toBe('text');
                    })
            );
        });

        test('handles process fail', done => {
            executeResult(
                done,
                Result.FailWithError(new ProcessedError('processed1', new Error()))
                    .withProcessedFail(() => 'processed2')
                    .onFailure(error => {
                        expect(error).toBe('processed1');
                    })
                    .onFailureWithError(error => {
                        expect(error.message).toBe('processed1');
                    })
            );
        });
    });
});
