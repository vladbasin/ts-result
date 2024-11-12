import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.Ok()', () => {
        test('produces success', done => {
            executeResult(
                done,
                Result.Ok(1)
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                    })
                    .onFailure(_ => done('No failure expected'))
            );
        });
    });
});
