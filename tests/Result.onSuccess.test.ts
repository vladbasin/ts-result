import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onSuccess()', () => {
        test('can be chained', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                        return payload;
                    })
                    .onFailure(_ => done('Fail not expected'))
                    .onBoth(() => {
                        return Result.Ok(1);
                    })
                    .onSuccess(payload => {
                        expect(payload).toBe(1);
                        record();
                        return payload;
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });
    });
});
