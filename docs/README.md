**@vladbasin/ts-result** • [**Docs**](globals.md)

***

# ts-result

[![Node.js CI](https://github.com/vladbasin/ts-result/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/vladbasin/ts-result/actions/workflows/node.js.yml)

This library brings elements of functional programming to TypeScript/JavaScript. See Use cases section for details.

## Install

### npm
`npm install @vladbasin/ts-result`

### yarn
`yarn add @vladbasin/ts-result`

## Use cases

### Asynchronous code chaining
Let's assume you have to work with a set of async methods, which load data from the backend and return a Promise. Normally you use try\catch, async\await, then\catch, if\then\else to handle results. Readability isn't really good with this approach.

```typescript
showLoader();
try {
    const wallet = await getWalletAsync();
    if (wallet.money < 10) {
        alert("Not enough money");
        return;
    }
    const item = await getItemAsync();
    const response = await purchaseAsync(item);
    if (!response.success) {
        alert(response.error);
        return;
    }
    log("Purchase success");
}
catch (error) {
    alert(error);
}
finally {
    hideLoader();
}
```

However, **with this library instead** you can write nice readable chains of methods:

```typescript
import { Result } from "@vladbasin/ts-result";

showLoader();
Result
    .FromPromise(getWalletAsync())
    .ensure(wallet => wallet.money > 10, "Not enough money")
    .onSuccess(() => getItemAsync(itemId))
    .onSuccess(item => purchaseAsync(item))
    .ensure(response => response.success, response.error)
    .onFailure(error => alert(error))
    .onSuccess(() => log("Purchase success"))
    .onBoth(result => hideLoader())
    .run();
```

### Rid of primitive obsession

Without this library (poor readability, code repeats)

```typescript
const usernameValidation = validateUsername(username);
if (!usernameValidation.success) {
    alert(usernameValidation.error)
    return;
}
const passwordValidation = validatePassword(password);
if (!passwordValidation.success) {
    alert(passwordValidation.error)
    return;
}
const passwordRepeatValidation = validatePasswordRepeat(passwordRepeat, password);
if (!passwordRepeatValidation.success) {
    alert(passwordRepeatValidation.error)
    return;
}
```

With this library (readable code, reusable logic)

```typescript
import { Result } from "@vladbasin/ts-result";

Result
    .Start()
    .onSuccess(() => validateUsername(username))
    .onSuccess(() => validatePassword(password))
    .onSuccess(() => validatePasswordRepeat(passwordRepeat, password))
    .onFailure(error => alert(error))
    .run();
```

### Error processing
In complex systems, it's often necessary to handle errors in a way that avoids multiple processing and overriding, especially when multiple services are involved. For example, errors might be localized, and you need to ensure that an error is processed only once and not overridden by subsequent services.

To achieve this, you can use methods like `withProcessedError` to mark errors as processed. This ensures that subsequent error handling logic does not override the already processed error.

Below code processes failure from `getDataAsync()` call and ensures that error is processed by next service only if it was not processed before:

```typescript
import { Result, ProcessedError } from "@vladbasin/ts-result";

Result
    .FromPromise(getDataAsync())
    .withProcessedFail(response => accountService.processErrors(response))
    .withProcessedFail(response => walletService.processErrors(response)) // will not be called if accountService.processErrors() already processed response and found error
    .onFailure((error) => {
        // do something with errors
    })
    .onSuccess((data) => {
        // execute logic if getDataAsync call was successful
    })
```

### Use as Promises
If you don't want to use `Result` as a return type and continue using `Promise` while benefiting from `Result` functionality, you can always:

- Convert `Result` to `Promise`: `result.asPromise()`
- Convert `Promise` to `Result`: `Result.FromPromise(YOUR_PROMISE)`

### Using Combiner
The `Combiner` class provides several methods to combine multiple `Result` instances into one. This is useful when you need to execute multiple asynchronous operations in parallel and handle their results collectively.

#### Combining Two Results
```typescript
import { Result, Combiner } from "@vladbasin/ts-result";

const result1 = Result.FromPromise(fetchData1());
const result2 = Result.FromPromise(fetchData2());

Combiner.Combine2(result1, result2)
    .onSuccess(([data1, data2]) => {
        console.log("Data1:", data1);
        console.log("Data2:", data2);
    })
    .onFailure(error => {
        console.error("Error:", error);
    })
    .run();
```

#### Combining Multiple Results

```typescript
import { Result, Combiner } from "@vladbasin/ts-result";

const results = [
    Result.FromPromise(fetchData1()),
    Result.FromPromise(fetchData2()),
    Result.FromPromise(fetchData3())
];

Combiner.CombineMany(results)
    .onSuccess(dataArray => {
        dataArray.forEach((data, index) => {
            console.log(`Data${index + 1}:`, data);
        });
    })
    .onFailure(error => {
        console.error("Error:", error);
    })
    .run();
```

### Controlled Parallel Execution

You can execute multiple actions with given parallelism level (concurrency)

```typescript
import { Result } from "@vladbasin/ts-result";

const factories = [
    () => Result.FromPromise(fetchData1()),
    () => Result.FromPromise(fetchData2()),
    () => Result.FromPromise(fetchData3())
];

Result.CombineFactories(factories, { concurrency: 2 })
    .onSuccess(dataArray => {
        dataArray.forEach((data, index) => {
            console.log(`Data${index + 1}:`, data);
        });
    })
    .onFailure(error => {
        console.error("Error:", error);
    })
    .run();
```

### Other handy API
This library also provides API to **retry(), delay() and others**. See inline comments for more documentation
