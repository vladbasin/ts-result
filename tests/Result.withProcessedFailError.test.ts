import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.withProcessedFailError()', () => {
    test('overrides value', done => {
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
});
