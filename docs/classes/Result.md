[**@vladbasin/ts-result**](../README.md) • **Docs**

***

[@vladbasin/ts-result](../globals.md) / Result

# Class: Result\<T\>

Represents a wrapper for asynchronous operations with built-in error handling.

## Type Parameters

• **T**

The type of the value wrapped by this Result

## Constructors

### new Result()

> **new Result**\<`T`\>(`promise`): [`Result`](Result.md)\<`T`\>

#### Parameters

• **promise**: `Promise`\<`T`\>

#### Returns

[`Result`](Result.md)\<`T`\>

#### Defined in

[src/Result.ts:18](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L18)

## Accessors

### void

#### Get Signature

> **get** **void**(): [`Result`](Result.md)\<`void`\>

Converts the Result into a void Result.

##### Returns

[`Result`](Result.md)\<`void`\>

New Result object with void value.

#### Defined in

[src/Result.ts:447](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L447)

## Methods

### asPromise()

> **asPromise**(): `Promise`\<`T`\>

Converts the Result instance into a Promise.

#### Returns

`Promise`\<`T`\>

Promise that resolves to the stored value.

#### Defined in

[src/Result.ts:26](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L26)

***

### delay()

> **delay**(`timeout`): [`Result`](Result.md)\<`T`\>

Delays the execution of the Result by a specified timeout.

#### Parameters

• **timeout**: `number`

Milliseconds to delay.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:35](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L35)

***

### ensure()

> **ensure**(`condition`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true, otherwise fails with a specified error message.

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `string`

Error message if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:54](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L54)

***

### ensureAs()

> **ensureAs**\<`V`\>(`condition`, `error`, `action`): [`Result`](Result.md)\<`V`\>

Ensures a condition is true and transforms the result value.

#### Type Parameters

• **V**

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `string`

Error message if the condition is not met.

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `V`\>

Function that transforms the result value.

#### Returns

[`Result`](Result.md)\<`V`\>

The same Result object.

#### Defined in

[src/Result.ts:129](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L129)

***

### ensureAsProcessed()

> **ensureAsProcessed**(`condition`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true, marking any failure as processed.

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `string`

Error message if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:64](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L64)

***

### ensureResult()

> **ensureResult**(`ensurer`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true using a Result-based checker.

#### Parameters

• **ensurer**

Function that returns a Result indicating success or failure.

• **error**: `string`

Error message if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:104](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L104)

***

### ensureResultWithError()

> **ensureResultWithError**(`ensurer`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true using a Result-based checker.

#### Parameters

• **ensurer**

Function that returns a Result indicating success or failure.

• **error**: `Error`

Error object if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:114](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L114)

***

### ensureUnwrap()

> **ensureUnwrap**\<`V`\>(`unwrapper`, `error`): [`Result`](Result.md)\<`V`\>

Unwraps the payload in case of success, failing if the unwrap returns undefined.

#### Type Parameters

• **V**

#### Parameters

• **unwrapper**

Function that unwraps the payload.

• **error**: `string`

Error message if the unwrap fails.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object.

#### Defined in

[src/Result.ts:191](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L191)

***

### ensureUnwrapAsProcessed()

> **ensureUnwrapAsProcessed**\<`V`\>(`unwrapper`, `error`): [`Result`](Result.md)\<`V`\>

Unwraps the payload in case of success, marking any failure as processed.

#### Type Parameters

• **V**

#### Parameters

• **unwrapper**

Function that unwraps the payload.

• **error**: `string`

Error message if the unwrap fails.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object.

#### Defined in

[src/Result.ts:214](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L214)

***

### ensureUnwrapAsProcessedWithError()

> **ensureUnwrapAsProcessedWithError**\<`V`\>(`unwrapper`, `error`): [`Result`](Result.md)\<`V`\>

Unwraps the payload in case of success, marking any failure as processed.

#### Type Parameters

• **V**

#### Parameters

• **unwrapper**

Function that unwraps the payload.

• **error**: `Error`

Error object if the unwrap fails.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object.

#### Defined in

[src/Result.ts:201](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L201)

***

### ensureUnwrapWithError()

> **ensureUnwrapWithError**\<`V`\>(`unwrapper`, `error`): [`Result`](Result.md)\<`V`\>

Unwraps the payload in case of success, failing if the unwrap returns undefined.

#### Type Parameters

• **V**

#### Parameters

• **unwrapper**

Function that unwraps the payload.

• **error**: `Error`

Error object if the unwrap fails.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object.

#### Defined in

[src/Result.ts:178](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L178)

***

### ensureWithError()

> **ensureWithError**(`condition`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true, otherwise fails with a specified error.

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `Error`

Error object if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:74](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L74)

***

### ensureWithErrorAs()

> **ensureWithErrorAs**\<`V`\>(`condition`, `error`, `action`): [`Result`](Result.md)\<`V`\>

Ensures a condition is true and transforms the result value.

#### Type Parameters

• **V**

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `Error`

Error object if the condition is not met.

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `V`\>

Function that transforms the result value.

#### Returns

[`Result`](Result.md)\<`V`\>

The same Result object.

#### Defined in

[src/Result.ts:140](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L140)

***

### ensureWithErrorAsProcessed()

> **ensureWithErrorAsProcessed**(`condition`, `error`): [`Result`](Result.md)\<`T`\>

Ensures a condition is true, marking any failure as processed.

#### Parameters

• **condition**

Function that checks a condition.

• **error**: `Error`

Error object if the condition is not met.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:88](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L88)

***

### onBoth()

> **onBoth**\<`V`\>(`action`): [`Result`](Result.md)\<`V`\>

Executes an action regardless of success or failure.

#### Type Parameters

• **V**

#### Parameters

• **action**: [`ResultCompleteActionType`](../type-aliases/ResultCompleteActionType.md)\<`T`, `V`\>

Function to execute in both cases.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object from the action.

#### Defined in

[src/Result.ts:318](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L318)

***

### onBothExecute()

> **onBothExecute**(`action`): [`Result`](Result.md)\<`T`\>

Executes an action regardless of success or failure, without transforming the payload.

#### Parameters

• **action**: [`ResultCompleteActionType`](../type-aliases/ResultCompleteActionType.md)\<`T`, `unknown`\>

Function to execute in both cases.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:339](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L339)

***

### onFailure()

> **onFailure**(`action`): [`Result`](Result.md)\<`T`\>

Executes an action in case of failure.

#### Parameters

• **action**

Function to execute in case of failure, accepts an error message as an argument.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:257](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L257)

***

### onFailureCompensate()

> **onFailureCompensate**(`action`): [`Result`](Result.md)\<`T`\>

Tries to compensate for failure.

#### Parameters

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`string`, `T`\>

Function to execute in case of failure, accepts an error message as an argument.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:283](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L283)

***

### onFailureCompensateWithError()

> **onFailureCompensateWithError**(`action`): [`Result`](Result.md)\<`T`\>

Tries to compensate for failure.

#### Parameters

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`Error`, `T`\>

Function to execute in case of failure, accepts an error object as an argument.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:292](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L292)

***

### onFailureWithError()

> **onFailureWithError**(`action`): [`Result`](Result.md)\<`T`\>

Executes an action in case of failure.

#### Parameters

• **action**

Function to execute in case of failure, accepts an error object as an argument.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:268](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L268)

***

### onSuccess()

> **onSuccess**\<`V`\>(`action`): [`Result`](Result.md)\<`V`\>

Executes an action in case of success, similar to onSuccessMap.

#### Type Parameters

• **V**

#### Parameters

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `V`\>

Function to execute in case of success.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object from the action.

#### Defined in

[src/Result.ts:159](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L159)

***

### onSuccessExecute()

> **onSuccessExecute**(`action`): [`Result`](Result.md)\<`T`\>

Executes an action in case of success without transforming the payload.

#### Parameters

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `unknown`\>

Function to execute in case of success.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:223](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L223)

***

### onSuccessMap()

> **onSuccessMap**\<`V`\>(`action`): [`Result`](Result.md)\<`V`\>

Executes an action in case of success, transforming the payload.

#### Type Parameters

• **V**

#### Parameters

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `V`\>

Function to execute in case of success.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object from the action.

#### Defined in

[src/Result.ts:168](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L168)

***

### onSuccessWhenExecute()

> **onSuccessWhenExecute**(`condition`, `action`): [`Result`](Result.md)\<`T`\>

Executes an action in case of success when a condition is true without transforming the payload.

#### Parameters

• **condition**

Function that checks a condition.

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `T`\>

Function to execute in case of success.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:248](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L248)

***

### onSuccessWhenMap()

> **onSuccessWhenMap**(`condition`, `action`): [`Result`](Result.md)\<`T`\>

Executes an action in case of success when a condition is true, transforming the payload.

#### Parameters

• **condition**

Function that checks a condition.

• **action**: [`ResultActionType`](../type-aliases/ResultActionType.md)\<`T`, `T`\>

Function to execute in case of success.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:238](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L238)

***

### recover()

> **recover**(): [`Result`](Result.md)\<`void`\>

Ignores any previous errors.

#### Returns

[`Result`](Result.md)\<`void`\>

New success Result with void value.

#### Defined in

[src/Result.ts:309](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L309)

***

### run()

> **run**(): `Promise`\<`T`\>

Runs the Result, ignoring uncaught errors.

#### Returns

`Promise`\<`T`\>

Promise that represents the result.

#### Defined in

[src/Result.ts:420](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L420)

***

### runAsResult()

> **runAsResult**(): [`Result`](Result.md)\<`T`\>

Runs the Result, ignoring uncaught errors.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object.

#### Defined in

[src/Result.ts:429](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L429)

***

### transformBooleanSuccess()

> **transformBooleanSuccess**(): [`Result`](Result.md)\<`boolean`\>

Transforms the Result into a boolean based on success or failure.

#### Returns

[`Result`](Result.md)\<`boolean`\>

New Result object with true or false value.

#### Defined in

[src/Result.ts:439](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L439)

***

### withOverriddenFail()

> **withOverriddenFail**(`newError`): [`Result`](Result.md)\<`T`\>

Overrides the current error, marking it as processed.

#### Parameters

• **newError**: `string`

New error message.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object with the new error.

#### Defined in

[src/Result.ts:371](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L371)

***

### withOverriddenFailError()

> **withOverriddenFailError**(`newError`): [`Result`](Result.md)\<`T`\>

Overrides the current error, marking it as processed.

#### Parameters

• **newError**: `Error`

New error object.

#### Returns

[`Result`](Result.md)\<`T`\>

The same Result object with the new error.

#### Defined in

[src/Result.ts:380](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L380)

***

### withOverriddenValue()

> **withOverriddenValue**\<`V`\>(`value`): [`Result`](Result.md)\<`V`\>

Overrides the current value with a new one.

#### Type Parameters

• **V**

#### Parameters

• **value**: `V`

New value.

#### Returns

[`Result`](Result.md)\<`V`\>

New Result object with the overridden value.

#### Defined in

[src/Result.ts:362](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L362)

***

### withProcessedFail()

> **withProcessedFail**(`factory`): [`Result`](Result.md)\<`T`\>

Processes the error, ensuring subsequent errors are not overridden.

#### Parameters

• **factory**

Function that transforms the error.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with the processed error.

#### Defined in

[src/Result.ts:389](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L389)

***

### withProcessedFailError()

> **withProcessedFailError**(`factory`): [`Result`](Result.md)\<`T`\>

Processes the error, ensuring subsequent errors are not overridden.

#### Parameters

• **factory**

Function that transforms the error.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with the processed error.

#### Defined in

[src/Result.ts:402](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L402)

***

### Combine()

> `static` **Combine**\<`T`\>(`results`): [`Result`](Result.md)\<`T`[]\>

Combines multiple Results into one, failing if any of the promises fail.

#### Type Parameters

• **T**

#### Parameters

• **results**: [`Result`](Result.md)\<`T`\>[]

Array of Results to be combined.

#### Returns

[`Result`](Result.md)\<`T`[]\>

New Result object that stores the combined values.

#### Defined in

[src/Result.ts:537](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L537)

***

### CombineFactories()

> `static` **CombineFactories**\<`T`\>(`factories`, `options`?): [`Result`](Result.md)\<`T`[]\>

Combines multiple Result factories into one with concurrency and error handling.

#### Type Parameters

• **T**

#### Parameters

• **factories**: () => [`Result`](Result.md)\<`T`\>[]

Array of functions that create Results.

• **options?**: [`CombineFactoriesOptionsType`](../type-aliases/CombineFactoriesOptionsType.md)

Optional settings for combining factories.

#### Returns

[`Result`](Result.md)\<`T`[]\>

New Result object that stores the combined values.

#### Defined in

[src/Result.ts:556](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L556)

***

### CombineSettled()

> `static` **CombineSettled**\<`T`\>(`results`): [`Result`](Result.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\>\>[]\>

Combines multiple Results into one, returning information about successes and failures.

#### Type Parameters

• **T**

#### Parameters

• **results**: [`Result`](Result.md)\<`T`\>[]

Array of Results to be combined.

#### Returns

[`Result`](Result.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\>\>[]\>

New Result object that stores the combined values.

#### Defined in

[src/Result.ts:546](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L546)

***

### Create()

> `static` **Create**(`isSuccess`, `error`): [`Result`](Result.md)\<`boolean`\>

Creates a new Result based on success or failure.

#### Parameters

• **isSuccess**: `boolean`

Indicates if the Result is successful.

• **error**: `string`

Error message if the Result is a failure.

#### Returns

[`Result`](Result.md)\<`boolean`\>

New Result object with true or false value.

#### Defined in

[src/Result.ts:566](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L566)

***

### CreateWithError()

> `static` **CreateWithError**(`isSuccess`, `error`): [`Result`](Result.md)\<`boolean`\>

Creates a new Result based on success or failure.

#### Parameters

• **isSuccess**: `boolean`

Indicates if the Result is successful.

• **error**: `Error`

Error object if the Result is a failure.

#### Returns

[`Result`](Result.md)\<`boolean`\>

New Result object with true or false value.

#### Defined in

[src/Result.ts:576](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L576)

***

### Delay()

> `static` **Delay**(`timeout`): [`Result`](Result.md)\<`void`\>

Creates a new Result with a specified delay.

#### Parameters

• **timeout**: `number`

Milliseconds to delay.

#### Returns

[`Result`](Result.md)\<`void`\>

New Result object.

#### Defined in

[src/Result.ts:481](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L481)

***

### Fail()

> `static` **Fail**\<`T`\>(`error`): [`Result`](Result.md)\<`T`\>

Creates a new Result with a failure.

#### Type Parameters

• **T**

#### Parameters

• **error**: `string`

Error message of the failure.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with failure.

#### Defined in

[src/Result.ts:490](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L490)

***

### FailAsProcessed()

> `static` **FailAsProcessed**\<`T`\>(`error`): [`Result`](Result.md)\<`T`\>

Creates a new Result with a processed failure.

#### Type Parameters

• **T**

#### Parameters

• **error**: `string`

Error message of the failure.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with failure.

#### Defined in

[src/Result.ts:508](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L508)

***

### FailAsProcessedWithError()

> `static` **FailAsProcessedWithError**\<`T`\>(`error`): [`Result`](Result.md)\<`T`\>

Creates a new Result with a processed failure.

#### Type Parameters

• **T**

#### Parameters

• **error**: `Error`

Error object of the failure.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with failure.

#### Defined in

[src/Result.ts:517](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L517)

***

### FailWithError()

> `static` **FailWithError**\<`T`\>(`error`): [`Result`](Result.md)\<`T`\>

Creates a new Result with a failure.

#### Type Parameters

• **T**

#### Parameters

• **error**: `Error`

Error object of the failure.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with failure.

#### Defined in

[src/Result.ts:499](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L499)

***

### FromPromise()

> `static` **FromPromise**\<`T`\>(`promise`): [`Result`](Result.md)\<`T`\>

Creates a new Result from a promise.

#### Type Parameters

• **T**

#### Parameters

• **promise**: `Promise`\<`T`\>

Promise to track.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object from the promise.

#### Defined in

[src/Result.ts:528](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L528)

***

### Ok()

> `static` **Ok**\<`T`\>(`value`): [`Result`](Result.md)\<`T`\>

Creates a new Result with a specified value.

#### Type Parameters

• **T**

#### Parameters

• **value**: `T`

Value to store in the Result.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object with the stored value.

#### Defined in

[src/Result.ts:464](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L464)

***

### Retry()

> `static` **Retry**\<`T`\>(`times`, `delay`, `retryResultAction`): [`Result`](Result.md)\<`T`\>

Retries the execution of an action a specified number of times.

#### Type Parameters

• **T**

#### Parameters

• **times**: `number`

Number of retry attempts.

• **delay**: `number`

Delay between attempts in milliseconds.

• **retryResultAction**

Action to execute and retry.

#### Returns

[`Result`](Result.md)\<`T`\>

New Result object representing either success or failure.

#### Defined in

[src/Result.ts:587](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L587)

***

### Start()

> `static` **Start**(): [`Result`](Result.md)\<`boolean`\>

Starts a new Result with an optional context.

#### Returns

[`Result`](Result.md)\<`boolean`\>

New Result object with true value.

#### Defined in

[src/Result.ts:455](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L455)

***

### Void()

> `static` **Void**(): [`Result`](Result.md)\<`void`\>

Creates a new Result with void value.

#### Returns

[`Result`](Result.md)\<`void`\>

New Result object with void value.

#### Defined in

[src/Result.ts:472](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L472)

***

### Wrap()

> `static` **Wrap**\<`T`\>(`value`, `error`): [`Result`](Result.md)\<`T`\>

Creates a new Result based on the presence of a value.

#### Type Parameters

• **T**

#### Parameters

• **value**: `undefined` \| `null` \| `T`

Value to store in the Result.

• **error**: `string`

Error message if the value is null or undefined.

#### Returns

[`Result`](Result.md)\<`T`\>

New success Result if there is a value, otherwise a failure Result.

#### Defined in

[src/Result.ts:606](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L606)

***

### WrapWithError()

> `static` **WrapWithError**\<`T`\>(`value`, `error`): [`Result`](Result.md)\<`T`\>

Creates a new Result based on the presence of a value.

#### Type Parameters

• **T**

#### Parameters

• **value**: `undefined` \| `null` \| `T`

Value to store in the Result.

• **error**: `Error`

Error object if the value is null or undefined.

#### Returns

[`Result`](Result.md)\<`T`\>

New success Result if there is a value, otherwise a failure Result.

#### Defined in

[src/Result.ts:616](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/Result.ts#L616)
