import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".withOverridenError()", () => {
    test("overrides value", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Fail("error")
            .withOverridenError("newError")
            .onFailure(error => {
                expect(error).toBe("newError");
                record();
            }),
            () => {
                expect(record).toBeCalledTimes(1);
            }
        );
    });
});