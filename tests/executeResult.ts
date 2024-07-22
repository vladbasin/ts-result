import { Result } from '../src/Result';

export const executeResult = (done: jest.DoneCallback, result: Result<any>, successCallback?: () => void) => {
    result
        .asPromise()
        .then(() => {
            successCallback?.();
            done();
        })
        .catch(error => {
            if (error.matcherResult) {
                done(error);
            } else {
                successCallback?.();
                done();
            }
        });
};
