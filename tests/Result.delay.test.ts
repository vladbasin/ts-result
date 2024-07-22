import { Result } from '../src/Result';
import { executeResult } from './executeResult';

const delay = 2000;

describe('Result', () => {
    describe('.delay()', () => {
        describe.each([() => Result.Delay(delay), () => Result.Ok(1).void.delay(delay)])('delay', getTargetResult => {
            test('delays execution', done => {
                const record = jest.fn();
                const time = new Date().getTime();

                executeResult(
                    done,
                    getTargetResult().onSuccess(_ => {
                        expect(new Date().getTime() - time).toBeGreaterThanOrEqual(delay);
                        record();
                    }),
                    () => {
                        expect(record).toBeCalledTimes(1);
                    }
                );
            });
        });
    });
});
