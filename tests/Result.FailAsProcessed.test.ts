import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.FailAsProcessed()', () => {
        test('produces fail that is not overridden', done => {
            executeResult(
                done,
                Result.FailAsProcessed('original')
                    .onSuccess(_ => done('No success expected'))
                    .withProcessedFail(() => 'overridden')
                    .onFailure(error => {
                        expect(error).toBe('original');
                    })
            );
        });
    });
});
