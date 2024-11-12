import { ProcessedError } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.FailAsProcessedWithError()', () => {
        test('produces fail that is not overridden', done => {
            executeResult(
                done,
                Result.FailAsProcessedWithError(new Error('original'))
                    .onSuccess(_ => done('No success expected'))
                    .withProcessedFail(() => 'overridden')
                    .onFailure(error => {
                        expect(error).toBe('original');
                    })
            );
        });

        test('produces fail that is not overridden from ProcessedError', done => {
            executeResult(
                done,
                Result.FailAsProcessedWithError(new ProcessedError('original', new Error()))
                    .onSuccess(_ => done('No success expected'))
                    .withProcessedFail(() => 'overridden')
                    .onFailure(error => {
                        expect(error).toBe('original');
                    })
            );
        });
    });
});
