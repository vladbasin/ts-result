import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('.onBoth()', () => {
    test('is called when failure', done => {
        const record = jest.fn();

        executeResult(
            done,
            Result.Fail('error')
                .onBoth(result => {
                    record();
                    return result;
                })
                .onFailure(_ => undefined)
                .onSuccess(_ => undefined)
                .onBoth(result => {
                    record();
                    return result;
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
                .onBoth(result => {
                    record();
                    return result;
                })
                .onFailure(_ => undefined)
                .onSuccess(_ => undefined)
                .onBoth(result => {
                    record();
                    return result;
                }),
            () => {
                expect(record).toBeCalledTimes(2);
            }
        );
    });
});
