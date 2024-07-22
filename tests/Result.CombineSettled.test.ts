import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.CombineSettled()', () => {
        test('combines and produces settled promises', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.CombineSettled([Result.Ok(1), Result.Fail('error1'), Result.Ok(2), Result.Fail('error2')])
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload[0].status).toBe('fulfilled');
                        expect((payload[0] as PromiseFulfilledResult<number>).value).toBe(1);
                        expect(payload[1].status).toBe('rejected');
                        expect((payload[1] as PromiseRejectedResult).reason.message).toBe('error1');
                        expect(payload[2].status).toBe('fulfilled');
                        expect((payload[2] as PromiseFulfilledResult<number>).value).toBe(2);
                        expect(payload[3].status).toBe('rejected');
                        expect((payload[3] as PromiseRejectedResult).reason.message).toBe('error2');
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });
    });
});
