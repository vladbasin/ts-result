import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.Retry()', () => {
        describe.each([
            { failFirstCalls: 0, retries: 0, delay: 0, expectSuccess: true },
            { failFirstCalls: 1, retries: 0, delay: 0, expectSuccess: false },
            { failFirstCalls: 1, retries: 1, delay: 0, expectSuccess: true },
            { failFirstCalls: 1, retries: 2, delay: 0, expectSuccess: true },
            { failFirstCalls: 2, retries: 2, delay: 0, expectSuccess: true },
            { failFirstCalls: 1, retries: 2, delay: 1000, expectSuccess: true },
        ])(
            'failFirstCalls: $failFirstCalls, retries: $retries, delay: $delay, expectSuccess: $expectSuccess',
            ({ failFirstCalls, retries, delay, expectSuccess }) => {
                test('correctly retries', done => {
                    const startTime = new Date().getTime();
                    const recordHandling = jest.fn();
                    const recordAttempt = jest.fn();

                    let calls = 0;
                    const targetFactory = () =>
                        Result.FromPromise(
                            new Promise((resolve, reject) => {
                                calls += 1;
                                recordAttempt();
                                if (calls > failFirstCalls) {
                                    resolve(1);
                                } else {
                                    reject(new Error('error'));
                                }
                            })
                        );

                    executeResult(
                        done,
                        Result.Retry(retries, delay, targetFactory)
                            .onFailure(error => {
                                if (expectSuccess) {
                                    done('Fail not expected');
                                } else {
                                    expect(error).toBe('error');
                                }
                                recordHandling();
                            })
                            .onSuccess(payload => {
                                if (expectSuccess) {
                                    expect(payload).toBe(1);
                                } else {
                                    done('Fail not expected');
                                }
                                recordHandling();
                            }),
                        () => {
                            expect(recordHandling).toBeCalledTimes(1);

                            const expectedAttempts = Math.min(retries + 1, failFirstCalls + 1);
                            expect(recordAttempt).toBeCalledTimes(expectedAttempts);
                            expect(new Date().getTime() - startTime).toBeGreaterThanOrEqual(
                                (expectedAttempts - 1) * delay
                            );
                        }
                    );
                });
            }
        );
    });
});
