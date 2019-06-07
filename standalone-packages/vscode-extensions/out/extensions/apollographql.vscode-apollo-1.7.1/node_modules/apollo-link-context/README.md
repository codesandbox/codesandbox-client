---
title: apollo-link-context
description: Easily set a context on your operation, which is used by other links further down the chain.
---

The `setContext` function takes a function that returns either an object or a promise that returns an object to set the new context of a request.

It receives two arguments: the GraphQL request being executed, and the previous context. This link makes it easy to perform async look up of things like authentication tokens and more!

```js
import { setContext } from "apollo-link-context";

const setAuthorizationLink = setContext((request, previousContext) => ({
  headers: {authorization: "1234"}
}));

const asyncAuthLink = setContext(
  request =>
    new Promise((success, fail) => {
      // do some async lookup here
      setTimeout(() => {
        success({ token: "async found token" });
      }, 10);
    })
);
```

<h2 id="caching-async">Caching lookups</h2>

Typically async actions can be expensive and may not need to be called for every request, especially when a lot of request are happening at once. You can setup your own caching and invalidation outside of the link to make it faster but still flexible!

Take for example a user auth token being found, cached, then removed on a 401 response:

```js
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";

// cached storage for the user token
let token;
const withToken = setContext(() => {
  // if you have a cached value, return it immediately
  if (token) return { token };

  return AsyncTokenLookup().then(userToken => {
    token = userToken;
    return { token };
  });
});

const resetToken = onError(({ networkError }) => {
  if (networkError && networkError.name ==='ServerError' && networkError.statusCode === 401) {
    // remove cached token on 401 from the server
    token = null;
  }
});

const authFlowLink = withToken.concat(resetToken);
```
