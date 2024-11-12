import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.ensure()', () => {
        test('fails when condition is false', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .ensure(payload => payload === 2, 'error')
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    })
                    .onSuccess(_ => done('Success not expected')),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('sucess when condition is true', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .ensure(payload => payload === 1, 'error')
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                    })
                    .onFailure(_ => done('Failure not expected')),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
