import { Result } from '../src/Result';
import { executeResult } from './executeResult';

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
});
