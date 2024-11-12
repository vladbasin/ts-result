import { Nullable } from '@vladbasin/ts-types';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.ensureUnwrapAsProcessedWithError()', () => {
        test('success if unwrapped', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok<Nullable<number>>(1)
                    .ensureUnwrapAsProcessedWithError(payload => payload, new Error('error'))
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
                    .ensureUnwrapAsProcessedWithError(payload => payload, new Error('error'))
                    .onSuccessMap(_ => done('Success not expected'))
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('marks failure as processed', done => {
            const failCall = jest.fn();

            executeResult(
                done,
                Result.Ok<Nullable<number>>(null)
                    .ensureUnwrapAsProcessedWithError(payload => payload, new Error('error'))
                    .withProcessedFail(() => 'processed')
                    .onFailure(error => {
                        expect(error).toBe('error');
                        failCall();
                    }),
                () => {
                    expect(failCall).toBeCalledTimes(1);
                }
            );
        });
    });
});
