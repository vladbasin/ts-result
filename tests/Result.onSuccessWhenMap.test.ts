import { Result } from '../src/Result';
import { executeResult } from './executeResult';

describe('Result', () => {
    describe('.onSuccessWhenMap()', () => {
        describe.each([
            { success: true, condition: true, expectSuccess: true },
            { success: true, condition: false, expectSuccess: true },
            { success: false, condition: true, expectSuccess: false },
            { success: false, condition: false, expectSuccess: false },
        ])(
            'checks success: $success, condition: $condition, expectSuccess: $expectSuccess',
            ({ success, condition, expectSuccess }) => {
                test(`produces ${expectSuccess}`, done => {
                    const successRecord = jest.fn();
                    const failRecord = jest.fn();

                    const result = success ? Result.Ok(1) : Result.Fail('error');

                    executeResult(
                        done,
                        result
                            .onSuccessWhenMap(
                                _ => condition,
                                _ => Result.Ok(1)
                            )
                            .onFailure(error => {
                                expect(expectSuccess).toBeFalsy();
                                expect(error).toBe('error');
                                failRecord();
                            })
                            .onSuccess(payload => {
                                expect(expectSuccess).toBeTruthy();
                                expect(payload).toBe(1);
                                successRecord();
                                return payload;
                            }),
                        () => {
                            expect(successRecord).toBeCalledTimes(expectSuccess ? 1 : 0);
                            expect(failRecord).toBeCalledTimes(expectSuccess ? 0 : 1);
                        }
                    );
                });
            }
        );
    });
});
