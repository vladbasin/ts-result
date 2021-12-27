import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.Ok()', () => {
    test('produces success', done => {
        executeResult(
            done,
            Result.Start()
                .onSuccess(payload => {
                    expect(payload).toBeTruthy();
                })
                .onFailure(_ => done('No failure expected'))
        );
    });
});
