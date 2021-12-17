import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".withOverridenValue()", () => {
    test("overrides value", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Ok(1)
            .withOverridenValue(2)
            .onSuccess(payload => {
                expect(payload).toBe(2);
                record();
            }),
            () => {
                expect(record).toBeCalledTimes(1);
            }
        );
    });
});