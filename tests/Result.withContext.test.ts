import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.withContext()', () => {
    test('executes actions in context', done => {
        const context = {
            prop: 'prop',
        };

        executeResult(
            done,
            Result.Ok(1)
                .withContext(context)
                .onSuccess(function (this: typeof context) {
                    expect(this.prop).toBe('prop');
                })
                .onBoth(function (this: typeof context) {
                    expect(this.prop).toBe('prop');
                    return Result.Fail('error');
                })
                .onFailure(function (this: typeof context) {
                    expect(this.prop).toBe('prop');
                })
        );
    });
});
