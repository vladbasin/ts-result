import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".withProcessedError()", () => {
    test("overrides value", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Fail("error")
            .withProcessedError(_ => "newError")
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