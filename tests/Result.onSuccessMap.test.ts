import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onSuccessMap()', () => {
        test('can be chained', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccessMap(payload => {
                        expect(payload).toBe(1);
                        record();
                        return payload;
                    })
                    .onFailure(_ => done('Fail not expected'))
                    .onBoth(() => {
                        return Result.Ok(1);
                    })
                    .onSuccessMap(payload => {
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
