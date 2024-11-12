[**@vladbasin/ts-result**](../README.md) • **Docs**

***

[@vladbasin/ts-result](../globals.md) / ProcessedError

# Class: ProcessedError

Error class to distinguish between errors that have been processed and those that have not.

## Extends

- `Error`

## Constructors

### new ProcessedError()

> **new ProcessedError**(`message`, `originalError`): [`ProcessedError`](ProcessedError.md)

#### Parameters

• **message**: `string`

• **originalError**: `Error`

#### Returns

[`ProcessedError`](ProcessedError.md)

#### Overrides

`Error.constructor`

#### Defined in

[src/ProcessedError.ts:5](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/ProcessedError.ts#L5)

### new ProcessedError()

> **new ProcessedError**(`error`, `originalError`): [`ProcessedError`](ProcessedError.md)

#### Parameters

• **error**: `Error`

• **originalError**: `Error`

#### Returns

[`ProcessedError`](ProcessedError.md)

#### Overrides

`Error.constructor`

#### Defined in

[src/ProcessedError.ts:7](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/ProcessedError.ts#L7)

## Properties

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### originalError

> `readonly` **originalError**: `Error`

#### Defined in

[src/ProcessedError.ts:9](https://github.com/vladbasin/ts-result/blob/b4c983b7b4ec06247e6468dfc2ec284523a320b1/src/ProcessedError.ts#L9)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:11

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:4
