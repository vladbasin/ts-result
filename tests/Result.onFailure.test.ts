import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".onFailure()", () => {
    test("can be chained", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Fail("error")
            .onFailure(error => {
                expect(error).toBe("error");
                record();
            })
            .onSuccess(_ => done("Success not expected"))
            .onBoth(_ => { return _ })
            .onFailure(error => {
                expect(error).toBe("error");
                record();
            }),
            () => {
                expect(record).toBeCalledTimes(2);
            }
        );
    });
});