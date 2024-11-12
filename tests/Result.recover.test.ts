import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.recover()', () => {
        test('recovers from failure', done => {
            const sucessRecord = jest.fn();
            const failRecord = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onSuccess(_ => {
                        done('Success not expected');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error');
                        failRecord();
                    })
                    .recover()
                    .onSuccess(() => {
                        sucessRecord();
                    })
                    .onFailure(_ => {
                        done('Failure not expected');
                    }),
                () => {
                    expect(failRecord).toBeCalledTimes(1);
                    expect(sucessRecord).toBeCalledTimes(1);
                }
            );
        });
    });
});
