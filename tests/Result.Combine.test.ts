import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.Combine()', () => {
        test('combines result when success', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Combine([Result.Ok(1), Result.Ok(2), Result.Ok(3)])
                    .onFailure(_ => done('Fail not expected'))
                    .onSuccess(payload => {
                        expect(payload).toEqual([1, 2, 3]);
                        record();
                    }),
                () => {
                    expect(record).toBeCalledTimes(1);
                }
            );
        });

        test('fails when failure', done => {
            const record = jest.fn();

            executeResult(
                done,
                Result.Combine([Result.Ok(1), Result.Ok(2), Result.Fail('error')])
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
    });
});
