# ts-result

This library brings elements of functional programming to TypeScript/JavaScript. See Use cases section for details

## Install

### npm
`npm install @vladbasin/ts-result`

### yarn
`yarn add @vladbasin/ts-result`

## Use cases

### Asynchronous code chaining
Let's assume you have to work with the set of async methods, which load data from backend and return Promise.
Normally you use try\catch, async\await, then\catch, if\then\else to handle results. Readability isn't really good with this approach.

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
import { Result } from "@vladbasin/Result";

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
import { Result } from "@vladbasin/Result";

Result
    .Ok(username)
    .onSuccess(() => validateUsername(username))
    .onSuccess(() => validatePassword(password))
    .onSuccess(() => validatePasswordRepeat(passwordRepeat, password))
    .onFailure(error => alert(error))
    .run();
```

See inline comments for more documentation