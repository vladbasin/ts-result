import { Combiner } from '../src';
import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.Combine2()', () => {
    test('combines result when success', done => {
        const record = jest.fn();

        executeResult(
            done,
            Combiner.Combine2(Result.Ok(1), Result.Ok(2))
                .onFailure(_ => done('Fail not expected'))
                .onSuccess(payload => {
                    expect(payload).toEqual([1, 2]);
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
            Combiner.Combine2(Result.Ok(1), Result.Fail('error'))
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
