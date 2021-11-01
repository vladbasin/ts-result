# ts-result

Wrapper around promise for functional programming

## Install

`npm install @vladbasin/ts-result --save`

## Getting Started

Let's assume you have `loadDataFromBackendAsync()` method, which loads data from backend and returns Promise.
Normally you use try\catch, async\await, then\catch, if\then\else to handle results. With this library you can write nice readable chains of methods instead:

```typescript

import { Result } from "@vladbasin/Result";

const result = Result
    .FromPromise(loadDataFromBackendAsync())
    .onSuccess(data => console.log(data))
    .ensure(data => data.money > 10, "Not enough money")
    .onFailure(error => alert(error))
    .onSuccess(data => purchase(data.item))
    //and so on...
    //.onFailure(error => );
    //.onSuccess(() => redirectToPage("/home")))
    .run();
```

See inline comments for more documentation