# Interceptors

- [Interceptor Principals](#interceptor-principals)
- [Provided Interceptors](#interceptor-provided)
    - [Common Interceptors](#interceptor-provided-common)
        - [Default Request Interceptor](#module-rest/interceptor/defaultRequest)
        - [Hypermedia As The Engine Of Application State (HATEOAS) Interceptor](#module-rest/interceptor/hateoas)
        - [Location Interceptor](#module-rest/interceptor/location)
        - [MIME Interceptor](#module-rest/interceptor/mime)
        - [Path Prefix Interceptor](#module-rest/interceptor/pathPrefix)
        - [Template Interceptor](#module-rest/interceptor/template)
    - [Authentication Interceptors](#interceptor-provided-auth)
        - [Basic Auth Interceptor](#module-rest/interceptor/basicAuth)
        - [OAuth Interceptor](#module-rest/interceptor/oAuth)
        - [CSRF Interceptor](#module-rest/interceptor/csrf)
    - [Error Detection and Recovery Interceptors](#interceptor-provided-error)
        - [Error Code Interceptor](#module-rest/interceptor/errorCode)
        - [Retry Interceptor](#module-rest/interceptor/retry)
        - [Timeout Interceptor](#module-rest/interceptor/timeout)
    - [Fallback Interceptors](#interceptor-provided-fallback)
        - [JSONP Interceptor](#module-rest/interceptor/jsonp)
        - [Cross Domain Request for IE Interceptor](#module-rest/interceptor/ie/xdomain)
        - [ActiveX XHR for IE Interceptor](#module-rest/interceptor/ie/xhr)
- [Custom Interceptors](#interceptor-custom)
    - [Interceptor Best Practices](#interceptor-custom-practices)
    - [Example Interceptors by Concept](#interceptor-custom-concepts)
        - [Augmented Request/Response](#interceptor-custom-concepts-augment)
        - [Config Initialization](#interceptor-custom-concepts-config)
        - [Replaced Request/Response](#interceptor-custom-concepts-replace)
        - [Reentrent Clients](#interceptor-custom-concepts-reentrent)
        - [Error Creators](#interceptor-custom-concepts-error)
        - [Error Recovery](#interceptor-custom-concepts-recovery)
        - [Cancellation](#interceptor-custom-concepts-cancellation)
        - [Shared Request/Response Context](#interceptor-custom-concepts-context)
        - [Async Request/Response](#interceptor-custom-concepts-async)
        - [Override Parent Client (ComplexRequest)](#interceptor-custom-concepts-parent)
        - [Abort Request (ComplexRequest)](#interceptor-custom-concepts-abort)


<a name="interceptor-principals"></a>
## Interceptor Principals

rest.js distinguishes itself from other HTTP client libraries by providing a minimal core that can be wrapped by more advanced behavior.  These configured clients can then be consumed by our application.  If a portion of our application needs more advanced behavior, it can continue to wrap the client without impacting other portions of the application.  Functional programming FTW.

Each [interceptor](interfaces.md#interface-interceptor) is a function that optionally accepts a parent [client](interfaces.md#interface-client) and some configuration returning a new [client](interfaces.md#interface-client).

```javascript
// don't do this, there's a better way
pathPrefix = require('rest/interceptor/pathPrefix');
errorCode = require('rest/interceptor/errorCode');
mime = require('rest/interceptor/mime');

client = pathPrefix(errorCode(mime(), { code: 500 }), { prefix: 'http://example.com' });
```

That works, but it's a mess, don't do it.  The configuration is visually separated from the interceptor it belongs to.  Glancing at the code, it's hard to know what's going on, never mind the fun of debugging when you give an interceptor the wrong config.

```javascript
// better, but can still be improved
pathPrefix = require('rest/interceptor/pathPrefix');
errorCode = require('rest/interceptor/errorCode');
mime = require('rest/interceptor/mime');

client = mime();
client = errorCode(client, { code: 500 });
client = pathPrefix(client, { prefix: 'http://example.com' });
```

This example is much more clear.  The configuration is now related to it's interceptor.  However, it's a bit difficult to follow the `client` var.  If we forget to provide the parent client to the next interceptor in the chain, the chain is broken and reset with the default client.

```javascript
// here we go
rest = require('rest');
pathPrefix = require('rest/interceptor/pathPrefix');
errorCode = require('rest/interceptor/errorCode');
mime = require('rest/interceptor/mime');

client = rest.wrap(mime)
             .wrap(errorCode, { code: 500 })
             .wrap(pathPrefix, { prefix: 'http://example.com' });
```

In this last example, we're no longer redefining the `client` var, there's no confusion about what the `client` does and we can't forget to pass it along.  It's clearly the combination of the default client, and the mime, errorCode and pathPrefix interceptors.  The configuration for each interceptor is still directly linked with the interceptor.

It's important to consider the order that interceptors are applied, as some interceptors are more ideal near the root of the chain, while others are better being last.  The request phase of the interceptors is applied from the last chained to the root, while the response phase flows in the opposite direction.

Clients may be [declaratively configured using wire.js](wire.md).


<a name="interceptor-provided"></a>
## Provided Interceptors


<a name="interceptor-provided-common"></a>
### Common Interceptors


<a name="module-rest/interceptor/defaultRequest"></a>
#### Default Request Interceptor

`rest/interceptor/defaultRequest` ([src](../interceptor/defaultRequest.js))

Provide default values for the request object.  Default values can be provided for the `method`, `path`, `params`, `headers`, `entity`, and/or `mixin`.  If the value does not exist in the request already, then the default value is utilized.  The `method`, `path` and `entity` values are direct copies, while the `params`, `headers`, and `mixin` values are mixed into the request.  In no case will the interceptor overwrite a value in the request.

**Phases**

- request

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>method</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default HTTP method</td>
</tr>
<tr>
  <td>path</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default path</td>
</tr>
<tr>
  <td>params</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default params, mixed into request</td>
</tr>
<tr>
  <td>headers</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default headers, mixed into request</td>
</tr>
<tr>
  <td>entity</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default entity</td>
</tr>
<tr>
  <td>mixin</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>default extra parameters for the <a href="clients.md#module-rest/client/xhr">XHR object</a> or <a href="clients.md#module-rest/client/node">Node.js</a>.
</tr>
</table>

**Example**

```javascript
client = rest.wrap(defaultRequest, { method: 'PUT', entity: 'defaulted' });

client({});
// resulting request { method: 'PUT', entity: 'defaulted' }

client({ entity: 'custom' });
// resulting request { method: 'PUT', entity: 'custom' }
```

```javascript
client = rest.wrap(defaultRequest, { headers: { 'X-Requested-With': 'rest.js' } });

client({});
// resulting request { headers: { 'X-Requested-With': 'rest.js' } }

client({ headers: { 'Some-Other-Header': 'still here' } });
// resulting request { headers: { 'Some-Other-Header': 'still here', 'X-Requested-With': 'rest.js' } }

client({ headers: { 'X-Requested-With': 'it a secret' } });
// resulting request { headers: { 'X-Requested-With': 'it a secret' } }
```


<a name="module-rest/interceptor/hateoas"></a>
#### Hypermedia As The Engine Of Application State (HATEOAS) Interceptor

`rest/interceptor/hateoas` ([src](../interceptor/hateoas.js))

Indexes `links` properties inside an entity to make accessing the related resources easier to access.

Links are index in two ways:

1. as link's `rel` which when accessed issues a request for the linked resource. A promise for the related resource is expected to be returned.
2. as link's `rel` with 'Link' appended, as a reference to the link object.

The 'Link' response header is also parsed for related resources following rfc5988. The values parsed from the headers are indexed into the response.links object.

Also defines a `clientFor` factory function that creates a new client configured to communicate with a related resource.

The client for the resource reference and the `clientFor` function can be provided by the `client` config property.  This method is also useful if the request for the resource

Index links are exposed by default on the entity.  A child object may be configed by the 'target' config property.

The entire response object graph will be inspected looking for an Array property names `links`; object cycles are detected and not reindexed.

**TIP:** The MIME interceptor should be installed before the HATEOAS interceptor to convert the response entity from a string into proper JS Objects.

**NOTE:** Native EcmaScript 5 support is required to access related resources implicitly.  Polyfills and shims are insufficient.  Non-native environment can be supported by using the `clientFor(rel)` method, invoking the return client as normal.

**WARNING:** This interceptor is considered experimental, the behavior may change at any time

**Phases**

- response

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>target</td>
  <td>optional</td>
  <td>''</td>
  <td>property to create on the entity and parse links into. If empty, the response entity is used directly.</td>
</tr>
<tr>
  <td>client</td>
  <td>optional</td>
  <td><em>this client</em></td>
  <td>client to use for subsequent requests</td>
</tr>
</table>

**Example**

```javascript
// assuming a native ES5 environment
client = rest.wrap(mime).wrap(hateoas);
client({ path: '/people/scott' }).then(function (response) {
    // assuming response for /people/scott: { entity: '{ "name": "Scott", "links": [ { "rel": "father", "href": "/peopele/ron" } ], ...  }', ... }
    // assuming response for /people/ron: { entity: '{ "name": "Ron", ... }', ... }

    assert.same('Scott', response.entity.name);
    return response.entity.father;
}).then(function (response) {
    assert.same('Ron', response.entity.name);
});
```

```javascript
// fallback for non-native ES5 environments
client = rest.wrap(mime).wrap(hateoas);
client({ path: '/people/scott' }).then(function (response) {
    // assuming response for /people/scott: { entity: '{ "name": "Scott", "links": [ { "rel": "father", "href": "/peopele/ron" } ], ...  }', ... }
    // assuming response for /people/ron: { entity: '{ "name": "Ron", ... }', ... }

    assert.same('Scott', response.entity.name);
    response.entity.clientFor('father')({}).then(function (father) {
        assert.same('Ron', father.entity.name);
    });
});
```


<a name="module-rest/interceptor/location"></a>
#### Location Interceptor

`rest/interceptor/location` ([src](../interceptor/location.js))

Follows the `Location` header, returning the response of the subsequent request.  Browsers will typically automatically follow the location header for redirect in the 300s range, however, they will not follow the Location for a response in the 200s range.  Other clients may not follow 300s redirects.  This interceptor will always follow a redirect for the original request by default. If configured with `code` the response status code has to be equal or greater than `code` the be treated as a redirect.

Subsequent redirects can be automatically followed by including this interceptor twice in the client chain.  However, in this situation, redirect loops will not be detected.

**Phases**

- success

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>client</td>
  <td>optional</td>
  <td><em>parent client</em></td>
  <td>client to use for subsequent requests</td>
</tr>
<tr>
  <td>code</td>
  <td>optional</td>
  <td>0</td>
  <td>status code if equal or greater indicates a redirect</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(location);
client({ method: 'POST', path: 'http://example.com/messages', entity: 'hello world' }).then(function (response) {
    // assuming response for POST: { status: { code: 201 }, headers: { Location: 'http://example.com/messages/1' } }
    // assuming response for GET: { status: { code: 200 }, entity: 'hello world', ... }

    assert.same('hello wold', response.entity);
    assert.same('GET', response.request.method);
    assert.same('http://example.com/messages/1', response.request.path);
});
```


<a name="module-rest/interceptor/mime"></a>
#### MIME Interceptor

`rest/interceptor/mime` ([src](../interceptor/mime.js))

Converts request and response entities using the MIME converter registry.  Converters are looked up by the `Content-Type` header value.  Content types without a converter default to plain text.

See the docs for the MIME registry for more information on available converters and how to register custom converters.

**Phases**

- request
- response

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>mime</td>
  <td>optional</td>
  <td><code>Content-Type</code> request header, or 'text/plain'</td>
  <td>MIME type for request entities</td>
</tr>
<tr>
  <td>accept</td>
  <td>optional</td>
  <td>mime + ', application/json;q=0.8, text/plain;q=0.5, */*;q=0.2'</td>
  <td><code>Accept</code> header to use for the request</td>
</tr>
<tr>
  <td>registry</td>
  <td>optional</td>
  <td><em>default registry</em></td>
  <td>custom MIME registry</td>
</tr>
<tr>
  <td>permissive</td>
  <td>optional</td>
  <td><em>false</em></td>
  <td>allow an unknown mime type for a request</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(mime);
client({ path: 'data.json' }).then(function (response) {
    // for the response: { entity: '{ "key": "value" }', headers: { 'Content-Type': 'application/json', ... } }
    assert.same('value', response.entity.key);
});
```

```javascript
client = rest.wrap(mime, { mime: 'application/json' });
client({ method: 'POST', entity: { key: 'value' } }).then(function (response) {
    assert.same('{ "key": "value" }', response.request.entity);
    assert.same('application/json, application/json;q=0.8, text/plain;q=0.5, */*;q=0.2', response.request.headers['Content-Type']);
});
```


<a name="module-rest/interceptor/pathPrefix"></a>
#### Path Prefix Interceptor

`rest/interceptor/pathPrefix` ([src](../interceptor/pathPrefix.js))

The path prefix interceptor prepends its value to the path provided in the request.  The prefix can be used as a base path that the request path is then made relative to.  A slash will be inserted between the prefix and path values if needed.

**Phases**

- request

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>prefix</td>
  <td>optional</td>
  <td><em>empty string</em></td>
  <td>value to prepend to the request path</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(pathPrefix, { prefix: 'http://example.com/messages' });
client({ path: '1' }).then(function (response) {
    assert.same('http://example.com/messages/1', response.request.path);
});
```


<a name="module-rest/interceptor/template"></a>
#### Template Interceptor

`rest/interceptor/template` ([src](../interceptor/template.js))

The template interceptor fully defines the request URI by expending the path as a URI Template with the request params. Params defined by the template that are missing as well as additional params are ignored. After the template interceptor, the request.params are removed from the request object, as the URI is fully defined.

The [URI Template RFC](https://tools.ietf.org/html/rfc6570) has many good examples that fully demonstrate its power and potential.

Note: primitive templating is provided by `rest/UrlBuilder`, however, its behavior is non-standard and less powerful.

**Phases**

- request

**Configuration**

<table>
<tr>
<th>Property</th>
<th>Required?</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td>template</td>
<td>optional</td>
<td><em>empty string</em></td>
<td>default template if request.path is undefined</td>
</tr>
<tr>
<td>params</td>
<td>optional</td>
<td><em>empty object</em></td>
<td>default params to be combined with request.params</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(template, { params: { lang: 'en-us' } });
client({ path: '/dictionary{/term:1,term}{?lang}', params: { term: 'hypermedia' } }).then(function (response) {
    assert.same('/dictionary/h/hypermedia?lang=en-us', response.request.path);
    assert.same(undefined, response.request.params);
});
```


<a name="interceptor-provided-auth"></a>
### Authentication Interceptors


<a name="module-rest/interceptor/basicAuth"></a>
#### Basic Auth Interceptor

`rest/interceptor/basicAuth` ([src](../interceptor/basicAuth.js))

Apply HTTP Basic Authentication to the request.  The username and password can either be provided by the interceptor configuration, or the request.

**Phases**

- request

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>username</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>username for the authentication</td>
</tr>
<tr>
  <td>password</td>
  <td>optional</td>
  <td><em>empty string</em></td>
  <td>password for the authentication</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(basicAuth, { username: 'admin', password: 'letmein' });
// interceptor config
client({}).then(function (response) {
    assert.same('Basic YWRtaW46bGV0bWVpbg==', response.request.headers.Authorization);
});
```

```javascript
client = rest.wrap(basicAuth);
// request config
client({ username: 'admin', password: 'letmein' }).then(function (reponse) {
    assert.same('Basic YWRtaW46bGV0bWVpbg==', response.request.headers.Authorization);
});
```


<a name="module-rest/interceptor/oAuth"></a>
#### OAuth Interceptor

`rest/interceptor/oAuth` ([src](../interceptor/oAuth.js))

Support for the OAuth implicit flow.  In a separate window users are redirected to the authentication server when a new access token is required.  That authentication server may prompt the user to authenticate and/or grant access to the application requesting an access token.  The authentication server then redirects the user back to the application which then needs to parse the access token from the URL and pass it back to the intercept via a callback function placed on the window.

**TIP:** A client request may take a very long time to respond while the user is being prompted to authenticate.  Once the user returns to the app, the original request is made with the new access token.  If an access token expires, the next request may take a similarly long time to respond as a new token is obtained from the authorization server.  The oAuth interceptor should typically be after time sensitive interceptors such as timeout.

**IMPORTANT:** rest.js is only able to provide part of the client flow.  When the user is redirected back from the authentication server, the application server must handle the initial request and provide an HTML page with the scripts to parse the URL fragment containing the access token and provide the token to the callback function.  As rest.js is not a server side web framework, it is unable to provide support for this part of the oAuth flow.

**Phases**

- request
- response

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>token</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>pre-configured authorization token obtained by some other means, using this property is uncommon</td>
</tr>
<tr>
  <td>clientId</td>
  <td>required</td>
  <td><em>none</em></td>
  <td>the authentication server clientId, this is given to you by the auth server owner</td>
</tr>
<tr>
  <td>scope</td>
  <td>required</td>
  <td><em>none</em></td>
  <td>comma separated list of resource server scopes to request an access token for,</td>
</tr>
<tr>
  <td>authorizationUrl</td>
  <td>required</td>
  <td><em>none</em></td>
  <td>base URL for the authorization server</td>
</tr>
<tr>
  <td>redirectUrl</td>
  <td>requried</td>
  <td><em>none</em></td>
  <td>URL within this page's origin that the authorization server should redirect back to providing the access token</td>
</tr>
<tr>
  <td>windowStrategy</td>
  <td>optional</td>
  <td>window.open</td>
  <td>strategy for opening the browser window to the authorization server</td>
</tr>
<tr>
  <td>oAuthCallback</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>callback function to receive the access token, typically used with a custom windowStrategy</td>
</tr>
<tr>
  <td>oAuthCallbackName</td>
  <td>optional</td>
  <td>'oAuthCallback'</td>
  <td>name to register the callback function as on the window</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(oAuth, {
    clientId: 'assignedByAuthServer',
    scope: 'read, write, openid',
    authorizationUrl: 'http://authserver.example.com/oauth',
    redirectUrl: 'http://myapp.example.com/oauthhandler'
});
client({ path: 'http://resourceserver.example.com' }).then(function (response) {
    // authenticated response from the resource server
});
```


<a name="module-rest/interceptor/csrf"></a>
#### CSRF Interceptor

`rest/interceptor/csrf` ([src](../interceptor/csrf.js))

Applies a Cross-Site Request Forgery protection header to a request

CSRF protection helps a server verify that a request came from a trusted client and not another client that was able to masquerade as an authorized client. Sites that use cookie based authentication are particularly vulnerable to request forgeries without extra protection.

**Phases**

- request

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>name</td>
  <td>optional</td>
  <td>'X-Csrf-Token'</td>
  <td>name of the request header, may be overridden by `request.csrfTokenName`</td>
</tr>
<tr>
  <td>token</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>CSRF token, may be overridden by `request.csrfToken`</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(csrf, { token: 'abc123xyz789' });
// interceptor config
client({}).then(function (response) {
    assert.same('abc123xyz789', response.request.headers['X-Csrf-Token']);
});
```

```javascript
client = rest.wrap(csrf);
// request config
client({ csrfToken: 'abc123xyz789' }).then(function (reponse) {
    assert.same('abc123xyz789', response.request.headers['X-Csrf-Token']);
});
```


<a name="interceptor-provided-error"></a>
### Error Detection and Recovery Interceptors


<a name="module-rest/interceptor/errorCode"></a>
#### Error Code Interceptor

`rest/interceptor/errorCode` ([src](../interceptor/errorCode.js))

Marks a response as an error based on the status code.  According to the HTTP spec, 500s status codes are server errors, 400s codes are client errors.  rest.js by default will treat any response from a server as successful, this allows interceptors to define what constitutes an error.  The errorCode interceptor will mark a request in error if the status code is equal or greater than the configured value.

**Phases**

- response

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>code</td>
  <td>optional</td>
  <td>400</td>
  <td>status code if equal or greater indicates an error</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(errorCode);
client({}).then(
    function (response) {
        // not called
    },
    function (response) {
        assert.same(500, response.status.code);
    }
);
```


<a name="module-rest/interceptor/retry"></a>
#### Retry Interceptor

`rest/interceptor/retry` ([src](../interceptor/retry.js))

Reattempts an errored request after a delay.  Attempts are scheduled after a failed response is received, the period between requests is the duration of request plus the delay.

**Phases**

- error

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>initial</td>
  <td>optional</td>
  <td>100</td>
  <td>initial delay in milliseconds after the first error response</td>
</tr>
<tr>
  <td>multiplier</td>
  <td>optional</td>
  <td>2</td>
  <td>multiplier for the delay on each subsequent failure used for exponential back offs</td>
</tr>
<tr>
  <td>max</td>
  <td>optional</td>
  <td>Infinity</td>
  <td>max delay in milliseconds</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(retry, { initial: 1e3, max: 10e3 });
client({}).then(function (response) {
    // assuming it takes a minute from the first request to a successful response
    // requests occur at 0s, 1s, 3s, 7s, 15s, 25s, 35s, 45s, 55s, 65s
});
```

Commonly combined with the timeout interceptor to define a max period to wait

```javascript
client = rest.wrap(retry, { initial: 1e3, max: 10e3 }).wrap(timeout, { timeout 120e3 });
client({}).then(
    function (response) {
        // called once a request succeeds
    },
    function (response) {
        // called after two minutes waiting, no further retry attempts are made
    }
);
```


<a name="module-rest/interceptor/timeout"></a>
#### Timeout Interceptor

`rest/interceptor/timeout` ([src](../interceptor/timeout.js))

Rejects a request that takes longer than the timeout.  If a request is in-flight, it is canceled by default.  The timeout value may be specified in the request or the interceptor config.

**Phases**

- request
- response

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>timeout</td>
  <td>optional</td>
  <td><em>disabled</em></td>
  <td>duration in milliseconds before canceling the request. Non-positive values disable the timeout.</td>
</tr>
<tr>
  <td>transient</td>
  <td>optional</td>
  <td>false</td>
  <td>disables the cancellation of timed out requests, allowing additional interceptors to gracefully handle the timeout.</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(timeout, { timeout: 10e3 });
client({}).then(
    function (response) {
        // called if the response took less then 10 seconds
    },
    function (response) {
        // called if the response took greater then 10 seconds
    }
);
```


<a name="interceptor-provided-fallback"></a>
### Fallback Interceptors


<a name="module-rest/interceptor/jsonp"></a>
#### JSONP Interceptor

`rest/interceptor/jsonp` ([src](../interceptor/jsonp.js))

Configures a request to use the [JSONP client](clients.md#module-rest/client/jsonp).  For most JSONP services, the interceptor defaults are adequate.  The script tag and callback function used to load the response, is automatically cleaned up after a response.  The callback function may remain after a cancellation in order to avoid script errors in the response if the server responds.

**Phases**

- request

**Configuration**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>callback.param</td>
  <td>optional</td>
  <td>'callback'</td>
  <td>request param containing the jsonp callback function name</td>
</tr>
<tr>
  <td>callback.prefix</td>
  <td>optional</td>
  <td>'jsonp'</td>
  <td>prefix for the jsonp callback function name</td>
</tr>
<tr>
  <td>callback.name</td>
  <td>optional</td>
  <td><em>generated</em></td>
  <td>pins the name of the callback function, useful for cases where the server doesn't allow custom callback names. Generally not recommended.</td>
</tr>
</table>

**Example**

```javascript
client = rest.wrap(jsonp);
client({ path: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0', params: { q: 'javascript' } }).then(function (response) {
    // results from google
});
```


<a name="module-rest/interceptor/ie/xdomain"></a>
#### Cross Domain Request for IE Interceptor

`rest/interceptor/ie/xdomain` ([src](../interceptor/ie/xdomain.js))

Utilizes IE's XDomainRequest support via the [XDomainRequest client](clients.md#module-rest/client/xdr) for making cross origin requests if needed, available and a CORS enabled XMLHttpRequest is not available.  XDR request have a number of limitations, see the [XDR client](clients.md#module-rest/client/xdr) for limitation details.  Will not interfere if installed in other environments.

This interceptor should be installed as close to the root of the interceptor chain as possible.  When a XDomainRequest client is needed, the normal parent client will not be invoked.

**Phases**

- request

**Configuration**

*none*

**Example**

```javascript
client = rest.wrap(xdomain)
    .wrap(defaultRequest, { params: { api_key: '95f41bfa4faa0f43bf7c24795eabbed4', format: 'rest' } });
client({ params: { method: 'flickr.test.echo' } }).then(function (response) {
    // response from flickr
});
```


<a name="module-rest/interceptor/ie/xhr"></a>
#### ActiveX XHR for IE Interceptor

`rest/interceptor/ie/xhr` ([src](../interceptor/ie/xhr.js))

Attempts to use an ActiveX XHR replacement if a native XMLHttpRequest object is not available. Useful for IE < 9, which does not natively support XMLHttpRequest.  Will not interfere if installed in other environments.

**Phases**
- request

**Configuration**

*none*

**Example**

```javascript
client = rest.wrap(xhr);
client({}).then(function (response) {
    // normal XHR response, even in IE without XHR
});
```


<a name="interceptor-custom"></a>
## Custom Interceptors

Creating a custom interceptor is easy.  Fundamentally, an interceptor is a function that accepts a client and a configuration object and returns a new client.  While not required, it's highly recommended that interceptor authors use the interceptor factory available in `rest/interceptor`.

The interceptor factory allows for interception of the request and/or response.  Once the interceptor has a handle on the request or response, it can pass through, manipulate or replace the request/response.

There are five phases that may be intercepted

<table>
<tr>
  <th>Phase</th>
  <th>Description</th>
</tr>
<tr>
  <td>init</td>
  <td>one time setup of the interceptor config</td>
</tr>
<tr>
  <td>request</td>
  <td>as the request is initiated, before the socket is opened</td>
</tr>
<tr>
  <td>response</td>
  <td>after the response is fully received, success or error</td>
</tr>
<tr>
  <td>success</td>
  <td>a response in a successful state (all responses from servers are successful until an interceptor puts them into an error state)</td>
</tr>
<tr>
  <td>error</td>
  <td>a response in an error state (either a socket/api level error, or a server response handled as an error)</td>
</tr>
</table>

The `response` phase is a catchall for the `success` and `error` phases; if both `response` and `success` handlers are defined, and the request responds normally, then only the `success` phase fires.

Request handlers are functions that accept the request object and interceptor config. Response handlers are provided with the same arguments as request handlers, in addition to the client for the handler.  The value returned by a handler becomes the request/response for the next handler in the interceptor chain.

```javascript
interceptor = require('rest/interceptor');
noopInterceptor = interceptor({
    init: function (config) {
        // do stuff with the config
        return config;
    },
    request: function (request, config, meta) {
        // do stuff with the request
        return request;
    },
    response: function (response, config, meta) {
        // do stuff with the response
        return response;
    },
    success: function (response, config, meta) {
        // do stuff with the response
        return response;
    },
    error: function (response, config, meta) {
        // do stuff with the response
        return response;
    }
});
```

Promisses representing the request/response may be returned.

```javascript
interceptor = require('rest/interceptor');
when = require('when');
delayRequestInterceptor = interceptor({
    request: function (request, config) {
        return when(request).delay(config.delay || 0);
    }
});
```

The `meta` argument contains additional information about the context of the request. It contains the `client`, which can be used to make subsequent requests, and the raw `arguments` provided to the client.

For interceptors that need to track state between request and response handlers, the context of each handler is shared and unique to each invocation.

```javascript
interceptor = require('rest/interceptor');
counter = 0;
countLoggingInterceptor = interceptor({
    request: function (request) {
        this.count = counter++;
        return request;
    },
    response: function (response) {
        console.log('invocation count: ', this.count);
        return response;
    }
});
```

Success responses can be converted into errors by returning a rejected promise for the response.

```javascript
interceptor = require('rest/interceptor');
when = require('when');
alwaysErrorInterceptor = interceptor({
    success: function (response) {
        return when.reject(response);
    }
});
```

Error responses can be converted into successes by returning a resolved promise for the response.  This is a special ability of the `error` handler and is not applicable to the `response` handler.

```javascript
interceptor = require('rest/interceptor');
when = require('when');
alwaysErrorInterceptor = interceptor({
    error: function (response) {
        return when(response);
    }
});
```

Interceptors may also override the default client if a parent client is not provided when instantiating the interceptor.

```javascript
interceptor = require('rest/interceptor');
customDefaultClient = require(...);
customDefaultClientInterceptor = interceptor({
    client: customDefaultClient
});
```

Default configuration values can be provided in the `init` phase. The config object provided is begotten from the config object provided to the interceptor when created. This means that all the properties of the configuration are available, but updates are protected from causing side effects in other interceptors configured with the same config object.

```javascript
interceptor = require('rest/interceptor');
defaultedConfigInterceptor = interceptor({
    init: function (config) {
        config.prop = config.prop || 'default-value';
        return config;
    }
});
```


<a name="interceptor-custom-practices"></a>
### Interceptor Best Practices

- keep interceptors simple, focus on one thing
- avoid replacing the request object, augment it instead
- make properties configurable
- provide sane defaults for configuration properties, avoid required config
- allow a request to override configured values
- provide default configuration values in the 'init' handler


<a name="interceptor-custom-concepts"></a>
### Example Interceptors by Concept

The interceptors provided with rest.js provide are also good examples.  Here are a few interceptors that demonstrate a particular capability.  The order of examples within a topic is simple to complex.

<a name="interceptor-custom-concepts-augment"></a>
**Augmented Request/Response**

- [rest/interceptor/basicAuth](#module-rest/interceptor/basicAuth)
- [rest/interceptor/pathPrefix](#module-rest/interceptor/pathPrefix)
- [rest/interceptor/defaultRequest](#module-rest/interceptor/defaultRequest)
- [rest/interceptor/mime](#module-rest/interceptor/mime)
- [rest/interceptor/hateoas](#module-rest/interceptor/hateoas)

<a name="interceptor-custom-concepts-config"></a>
**Config Initialization**

- [rest/interceptor/errorCode](#module-rest/interceptor/errorCode)
- [rest/interceptor/hateoas](#module-rest/interceptor/hateoas)
- [rest/interceptor/oAuth](#module-rest/interceptor/oAuth)

<a name="interceptor-custom-concepts-replace"></a>
**Replaced Request/Response**

- [rest/interceptor/entity](#module-rest/interceptor/entity)

<a name="interceptor-custom-concepts-reentrent"></a>
**Reentrent Clients**

- [rest/interceptor/location](#module-rest/interceptor/location)
- [rest/interceptor/retry](#module-rest/interceptor/retry)
- [rest/interceptor/hateoas](#module-rest/interceptor/hateoas)
- [rest/interceptor/oAuth](#module-rest/interceptor/oAuth)

<a name="interceptor-custom-concepts-error"></a>
**Error Creators**

- [rest/interceptor/errorCode](#module-rest/interceptor/errorCode)
- [rest/interceptor/timeout](#module-rest/interceptor/timeout)

<a name="interceptor-custom-concepts-recovery"></a>
**Error Recovery**

- [rest/interceptor/retry](#module-rest/interceptor/retry)

<a name="interceptor-custom-concepts-cancellation"></a>
**Cancellation**

- [rest/interceptor/timeout](#module-rest/interceptor/timeout)

<a name="interceptor-custom-concepts-context"></a>
**Sharred Request/Response Context**

- [rest/interceptor/timeout](#module-rest/interceptor/timeout)

<a name="interceptor-custom-concepts-async"></a>
**Async Request/Response**

- [rest/interceptor/mime](#module-rest/interceptor/mime)

<a name="interceptor-custom-concepts-parent"></a>
**Override Parent Client (ComplexRequest)**

- [rest/interceptor/ie/xdomain](#module-rest/interceptor/ie/xdomain)

<a name="interceptor-custom-concepts-abort"></a>
**Abort Request (ComplexRequest)**

- [rest/interceptor/timeout](#module-rest/interceptor/timeout)
