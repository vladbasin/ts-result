import { Result } from "../src/Result";
import { executeResult } from "./executeResult";

describe(".onFailureCompensate()", () => {
    test("compensates failure", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Fail("error")
            .onFailureCompensate(error => {
                expect(error).toBe("error");
                record();

                return 1;
            })
            .onSuccess(payload => { 
                expect(payload).toBe(1);
                record();
            }),
            () => {
                expect(record).toBeCalledTimes(2);
            }
        );
    });

    test("does nothing if success", done => {
        const record = jest.fn();

        executeResult(done, Result
            .Ok(1)
            .onFailureCompensate(error => {
                expect(error).toBe("error");
                record();

                return 1;
            })
            .onSuccess(payload => { 
                expect(payload).toBe(1);
                record();
            }),
            () => {
                expect(record).toBeCalledTimes(1);
            }
        );
    });

});