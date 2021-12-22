import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".FailWithError()", () => {
    test("produces fail", done => {
        executeResult(done, Result
            .FailWithError(new Error("text"))
            .onSuccess(_ => done("No success expected"))
            .onFailure(error => {
                expect(error).toBe("text");
            })
            .onFailureWithError(error => {
                expect(error.message).toBe("text");
            })
        );
    });
});

