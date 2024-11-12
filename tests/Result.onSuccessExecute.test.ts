import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onSuccessExecute()', () => {
        test('can be chained', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Ok(1)
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccessExecute(payload => {
                        expect(payload).toBe(1);
                        record();
                    })
                    .onFailure(_ => done('Fail not expected'))
                    .onBoth(() => {
                        return Result.Ok(1);
                    })
                    .onSuccessExecute(payload => {
                        expect(payload).toBe(1);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(2);
                }
            );
        });
    });
});
