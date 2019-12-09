# Clients

- Provided Clients
  - [Default Client](#module-rest)
  - [XMLHttpReqest Client](#module-rest/client/xhr)
  - [Node Client](#module-rest/client/node)
  - [JSONP Client](#module-rest/client/jsonp)
  - [IE XDomainRequest Client](#module-rest/client/xdr)


## Overview

A rest.js [client](interfaces.md#interface-client) is simply a function that accepts an argument as the [request](interfaces.md#interface-request) and returns a promise for the [response](interfaces.md#interface-response).

Clients are typically extended by wrapping interceptors that wrap the client core behavior providing additional functionality and returning an enriched client.

```javascript
client = rest.wrap(interceptor);
assert.same(rest, client.skip());
```

See the [interceptor docs](interceptors.md) for more information on interceptors and wrapping.


## Provided Clients

The provided clients are the root of the interceptor chain.  They are responsible for the lowest level mechanics of making requests and handling responses.  In most cases, the developer doesn't need to be concerned with the particulars of the client, as the best client for the available environment will be chosen automatically.


<a name="module-rest"></a>
### Default Client

`rest` ([src](../rest.js))

The default client is also the main module for the rest.js package.  It's not a client implementation, but an alias to the best client for a platform.  When running within a browser, the XHR client is used; when running within Node.js, the Node client is used.  As other JavaScript environments are supported, the default client will continue to map directly to the most appropriate client implementation.

The default client is used internally when no custom client is configured.  There are times, when it's useful to change the default client; such as when the automatic environment sniffing is wrong, or you want to add support for a new environment that rest.js doesn't yet understand. In these cases, you can set, get and reset the default client using the `rest.setDefaultClient(client)`, `rest.getDefaultClient()` and `rest.resetDefaultClient()` methods respectively.

While it may be tempting to change the default client for application level concerns, changing the default will impact all consumers.  In just about every case, using an [Interceptor](./interceptors.md) is preferred.


<a name="module-rest/client/xhr"></a>
### XMLHttpReqest Client

`rest/client/xhr` ([src](../client/xhr.js))

The default client for browsers.  The XHR client utilizes the XMLHttpRequest object provided by many browsers.  Most every browser has direct support for XHR today.  The `rest/interceptor/ie/xhr` interceptor can provided fall back support for older IE without native XHR.

**Special Properties**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>request.engine</td>
  <td>optional</td>
  <td>window.XMLHttpRequest</td>
  <td>The XMLHttpRequest instance to use</td>
</tr>
<tr>
  <td>request.mixin</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>Additional properties to mix into the XHR object</td>
</tr>
</table>

**Know limitations**

The XHR client has the same security restrictions as the traditional XMLHttpRequest object.  For browsers that support XHR v1, that means that requests may only be made to the same origin as the web page.  The origin being defined by the scheme, host and port.  XHR v2 clients have support for Cross-origin Resource Sharing (CORS).  CORS enabled clients have the ability to make requests to any HTTP based service assuming the server is willing to participate in the [CORS dance](http://www.html5rocks.com/en/tutorials/cors/).


<a name="module-rest/client/node"></a>
### Node Client

`rest/client/node` ([src](../client/node.js))

The default client for Node.js.  The Node client uses the 'http' and 'https' modules.

Node specific settings may be modified via the `mixin` request property. Adding new certificate authorities to trust or changing the agent pool are rare, but sometimes necessary. See the [Node docs](http://nodejs.org/api/https.html#https_https_request_options_callback) for details about supported properties.

**Special Properties**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>request.mixin</td>
  <td>optional</td>
  <td><em>empty</em></td>
  <td>Additional Node.js only parameters</td>
</tr>
</table>


<a name="module-rest/client/jsonp"></a>
### JSONP Client

`rest/client/jsonp` ([src](../client/jsonp.js))

JSONP client for browsers.  Allows basic cross-origin GETs via script tags.  This client is typically employed via the `rest/interceptor/jsonp` interceptor.  Never used as the default client.

**Special Properties**

<table>
<tr>
  <th>Property</th>
  <th>Required?</th>
  <th>Default</th>
  <th>Description</th>
</tr>
<tr>
  <td>request.callback.param</td>
  <td>optional</td>
  <td>'callback'</td>
  <td>URL parameter that contains the JSONP callback function's name</td>
</tr>
<tr>
  <td>request.callback.prefix</td>
  <td>optional</td>
  <td>'jsonp'</td>
  <td>common prefix for callback function names as they are placed on the window object</td>
</tr>
<tr>
  <td>request.callback.name</td>
  <td>optional</td>
  <td><em>generated</em></td>
  <td>pins the name of the callback function, useful for cases where the server doesn't allow custom callback names. Generally not recommended.</td>
</tr>
</table>


<a name="module-rest/client/xdr"></a>
### IE XDomainRequest Client

`rest/client/xdr` ([src](../client/xdr.js))

Cross-origin support available within IE, in particular IE 8 and 9.  This client is typically employed via the `rest/interceptor/ie/xdomain` interceptor.  Never used as the default client.

**Know limitations**

- only GET and POST methods are available
- must use same scheme as origin http-to-http, https-to-https
- no headers, request or response (the response Content-Type is available)
- no response status code

[Limitation details](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx)
