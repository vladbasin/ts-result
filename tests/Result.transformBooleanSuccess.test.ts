import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.transformBooleanSuccess()', () => {
        test(`produces true`, done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .transformBooleanSuccess()
                    .onSuccess(result => {
                        expect(result).toBeTruthy();
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test(`produces false`, done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .transformBooleanSuccess()
                    .onSuccess(result => {
                        expect(result).toBeFalsy();
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
