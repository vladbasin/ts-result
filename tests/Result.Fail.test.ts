import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.Fail()', () => {
        test('produces fail', done => {
            executeResult(
                done,
                Result.Fail('text')
                    .onSuccess(_ => done('No success expected'))
                    .onFailure(error => {
                        expect(error).toBe('text');
                    })
            );
        });
    });
});
