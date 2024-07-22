import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.ensureWithErrorAs()', () => {
        test('fails when condition is false', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .ensureWithErrorAs(
                        payload => payload === 2,
                        new Error('error'),
                        () => {
                            done('Not expected to be called');
                            return Result.Ok(true);
                        }
                    )
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
                    .ensureWithErrorAs(
                        payload => payload === 1,
                        new Error('error'),
                        () => {
                            record();
                            return Result.Ok(true);
                        }
                    )
                    .onSuccess(payload => {
                        expect(payload).toBeTruthy();
                        record();
                    })
                    .onFailure(_ => done('Failure not expected')),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });
    });
});
