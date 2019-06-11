# Common Interfaces

Types in rest.js are based on duck typing; there are no concrete types that need to be constructed.  Any JavaScript object matching the general characterisitc for the type can be used.  Most of the properties are defined as optional, so even an empty or undefined object may be valid.  Clients and interceptors will provided default values as appropriate.


<a name="interface-request"></a>
## Common Request Properties

A request may be represented by either a string or an object.  Strings are coerced to an object as soon as they are encountered, where the string's value becomes the value of the path property on the object.

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
  <td>'GET' if no entity, 'POST' with entity</td>
  <td>HTTP method, commonly GET, POST, PUT, DELETE or HEAD</td>
</tr>
<tr>
  <td>path</td>
  <td>optional</td>
  <td><em>empty string</em></td>
  <td>path template with optional path variables</td>
</tr>
<tr>
  <td>params</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>name-value parameters for the path template and query string</td>
</tr>
<tr>
  <td>headers</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>name-value custom HTTP headers to send, in addition to the client provided headers</td>
</tr>
<tr>
  <td>entity</td>
  <td>optional</td>
  <td><em>none</em></td>
  <td>HTTP entity, request/response body</td>
</tr>
<tr>
  <td>canceled</td>
  <td>provided</td>
  <td><em>n/a</em></td>
  <td>indicates if the request was canceled, defined by the root client</td>
</tr>
<tr>
  <td>cancel</td>
  <td>provided</td>
  <td><em>n/a</em></td>
  <td>function that will cancel the request if invoked, defined by the root client</td>
</tr>
<tr>
  <td>originator</td>
  <td>provided</td>
  <td><em>n/a</em></td>
  <td>the first client to handle this request in the interceptor chain, often the outter most wrapped client</td>
</tr>
</table>

Interceptors and clients may define additional properties.


<a name="interface-response"></a>
## Common Response Properties

<table>
<tr>
  <th>Property</th><th>Description</td>
</tr>
<tr>
  <td>request</td>
  <td>the request object as received by the root client</td>
</tr>
<tr>
  <td>raw</td>
  <td>the underlying request object, like XMLHttpRequest in a browser</td>
</tr>
<tr>
  <td>url</td>
  <td>the actual URL requested. In some cases this value may be misleading, such as after a redirect in a browser. The value reported is URL for the request before the redirect.</td>
</tr>
<tr>
  <td>status.code</td>
  <td>status code of the response (i.e. 200, 404)</td>
</tr>
<tr>
  <td>status.text</td>
  <td>status phrase of the response (if available)</td>
</tr>
<tr>
  <td>headers</td>
  <td>response headers hash of normalized name, value pairs</td>
</tr>
<tr>
  <td>entity</td>
  <td>the response body</td>
</tr>
</table>

Interceptors and clients may define additional properties.


<a name="interface-client"></a>
## Client Methods

[Usage](clients.md)

<table>
<tr>
  <th>Method</th>
  <th>Arguments</th>
  <th>Return</th>
  <th>Description</th>
</tr>
<tr>
  <td><em>self</em></td>
  <td>request</td>
  <td>Promise for Response</td><td>propagates the request retuning a promise for the response</td>
</tr>
<tr>
  <td>skip</td>
  <td><em>none</em></td>
  <td>Client</td>
  <td>returns the parent client. Not available for the root client, a client may also elect to not be skipable.</td>
</tr>
<tr>
  <td>wrap</td>
  <td>interceptor, config (optional)</td>
  <td>Client</td>
  <td>wraps the client with an interceptor returning the resulting client</td>
</tr>
</table>


<a name="interave-responsepromise"></a>
## Response Promise Methods

Clients return a promise for a response. In addition to the standard methods for a promise, and the supplimental methods when.js provides, rest.js adds additional methods for easy asynchronous access to parts of the response.

These methods assume a standard response object. If an interceptor or client returns an alternate response object, the behavior of these methods will be unpredictable.

<table>
<tr>
  <th>Method</th>
  <th>Arguments</th>
  <th>Return</th>
  <th>Description</th>
</tr>
<tr>
  <td>entity</td>
  <td><em>none</em></td>
  <td>Promise&lt;*&gt;</td>
  <td>Promise for the HTTP response entity</td>
</tr>
<tr>
  <td>status</td>
  <td><em>none</em></td>
  <td>Promise&lt;number&gt;</td>
  <td>Promise for the HTTP response status code</td>
</tr>
<tr>
  <td>headers</td>
  <td><em>none</em></td>
  <td>Promise&lt;Headers&gt;</td>
  <td>Promise for the HTTP response headers map</td>
</tr>
<tr>
  <td>header</td>
  <td>headerName</td>
  <td>Promise&lt;Header&gt;</td>
  <td>Promise for a specific HTTP response headers. A Header may be a string or an array of strings depending on the number of the header name occurrences in the response</td>
</tr>
<tr>
  <td>follow</td>
  <td>relationship</td>
  <td>ResponsePromise&lt;Response&gt;</td>
  <td>Traverse to the resource identified by the relationship. An array of relationships will traverse deep into the API following each relationship in turn. Params for templated URIs can be express in the form `{ rel: relationship, params: { ... } }`</td>
</tr>
</table>


<a name="interface-interceptor"></a>
## Interceptor Methods

[Usage](interceptors.md)

<table>
<tr>
  <th>Method</th>
  <th>Arguments</th>
  <th>Return</th>
  <th>Description</th>
</tr>
<tr>
  <td><em>self</em></td>
  <td>parent Client (optional), config (optional)</td>
  <td>Client</td>
  <td>creates a new client wrapping the parent client with the interceptor and provided configuration.</td>
</tr>
</table>

Both the parent and config arguments are typically optional. The default client is commonly used if a parent client is not specified. An interceptor may require certain config properties, in which case the config object is no longer optional.


<a name="interface-converter"></a>
## MIME Converter

[Usage](mime.md#mime-converters-custom)

<table>
<tr>
  <th>Method</th>
  <th>Arguments</th>
  <th>Return</th>
  <th>Description</th>
</tr>
<tr>
  <td>read</td>
  <td>string</td>
  <td><em>any</em> | Promise&lt;*&gt;</td>
  <td>reads a response entity as a string converting it into any other type</td>
</tr>
<tr>
  <td>write</td>
  <td><em>any</em></td>
  <td>string | Promise&lt;string&gt;</td>
  <td>writes a request entity as a string converting it from any other type</td>
</tr>
</table>
