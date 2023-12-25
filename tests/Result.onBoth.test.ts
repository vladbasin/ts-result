import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.onBoth()', () => {
    test('is called when failure', done => {
        const record = jest.fn();

        executeResult(
            done,
            Result.Fail('error')
                .onBoth(() => {
                    record();
                    return Result.Fail('error');
                })
                .onFailure(_ => undefined)
                .onSuccess(_ => undefined)
                .onBoth(() => {
                    record();
                    return Result.Fail('error');
                }),
            () => {
                expect(record).toBeCalledTimes(2);
            }
        );
    });

    test('is called when success', done => {
        const record = jest.fn();

        executeResult(
            done,
            Result.Ok(1)
                .onBoth(() => {
                    record();
                    return Result.Ok(1);
                })
                .onFailure(_ => undefined)
                .onSuccess(_ => undefined)
                .onBoth(() => {
                    record();
                    return Result.Ok(1);
                }),
            () => {
                expect(record).toBeCalledTimes(2);
            }
        );
    });
});
