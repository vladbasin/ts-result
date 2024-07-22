import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.Wrap()', () => {
        describe.each([
            { value: 0, expectSuccess: true },
            { value: 1, expectSuccess: true },
            { value: null, expectSuccess: false },
            { value: undefined, expectSuccess: false },
            { value: '', expectSuccess: true },
            { value: 'string', expectSuccess: true },
        ])('value: $value, expectSuccess: $expectSuccess', ({ value, expectSuccess }) => {
            test('correctly wraps value', done => {
                const recordHandling = jest.fn();

                executeResult(
                    done,
                    Result.Wrap(value, 'error')
                        .onFailure(error => {
                            if (expectSuccess) {
                                done('Fail not expected');
                            } else {
                                expect(error).toBe('error');
                            }
                            recordHandling();
                        })
                        .onSuccess(payload => {
                            if (expectSuccess) {
                                expect(payload).toBe(value);
                            } else {
                                done('Fail not expected');
                            }
                            recordHandling();
                        }),
                    () => {
                        expect(recordHandling).toBeCalledTimes(1);
                    }
                );
            });
        });
    });
});
