import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.FromPromise()', () => {
        test('handles success', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.FromPromise(
                    new Promise(resolve => {
                        resolve(1);
                    })
                )
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                    })
                    .onFailure(_ => done('Fail not expected')),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('handles fail', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.FromPromise(
                    new Promise((_, reject) => {
                        reject(new Error('error'));
                    })
                )
                    .onSuccess(payload => {
                        done('Fail not expected');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
