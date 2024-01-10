import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.withOverriddenFail()', () => {
    test('overrides value', done => {
        const record = jest.fn();

        executeResult(
            done,
            Result.Fail('error')
                .withOverriddenFail('newError')
                .onFailure(error => {
                    expect(error).toBe('newError');
                    record();
                }),
            () => {
                expect(record).toBeCalledTimes(1);
            }
        );
    });
});
