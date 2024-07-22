import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onFailure()', () => {
        test('can be chained', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Fail('error')
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    })
                    .onSuccess(_ => done('Success not expected'))
                    .onBoth(() => {
                        return Result.Fail('error');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });

        test('handles exception', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onSuccess(_ => {
                        record();
                        throw new Error('error');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error');
                        record();
                    })
                    .onFailure(_ => {
                        record();
                        throw new Error('error2');
                    })
                    .onFailure(error => {
                        expect(error).toBe('error2');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(4);
                }
            );
        });
    });
});
