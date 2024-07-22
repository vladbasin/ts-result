import { Nullable } from '@vladbasin/ts-types';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.ensureUnwrapWithError()', () => {
        test('success if unwrapped', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok<Nullable<number>>(1)
                    .ensureUnwrapWithError(payload => payload, new Error('error'))
                    .onSuccessMap(payload => {
                        expect(payload).toBe(1);
                        record();
                        return payload;
                    })
                    .onFailure(_ => done('Fail not expected')),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('failure if not unwrapped', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok<Nullable<number>>(null)
                    .ensureUnwrapWithError(payload => payload, new Error('error'))
                    .onSuccessMap(_ => done('Fail not expected'))
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
