# Content Negotiation

MIME types are an important foundation for RESTful services, and often misunderstood. Most web developers understand that the server returns a 'Content-Type' along with a response entity. Many forget that the client is responsible for expressing what MIME types the client is able to handle, and what its preferred MIME types are. This dance between the client and server to settle on the type of the response is known as content negotiation. Content negotiation is a fundamental aspect of REST and differentiates rest.js from many other HTTP clients that do not embrace content negotiation.

rest.js provides support for encoding and decoding request and response entities based on the 'Content-Type'.  The response is not presumed to be XML or JSON or any other type. When making a request, the 'Accept' header is used to indicate the types the client understand and the relative preference of different types. A typical accept header from a browser may look like:

`text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`.

This string indicates that HTML and XHTML are the most preferred, weighted at 1.0 on a scale between 0 and 1. XML is next at 0.9 and everything else is last at 0.8. Using this info the server will figure out for the resource requested, what MIME types it's able to render the resource as and finds the best match to send to the client.


<a name="module-rest/mime/registry"></a>
## MIME Registry

`rest/mime/registry` ([src](../mime/registry.js))

A registry of converters for MIME types is provided. Each time a request or response entity needs to be encoded or decoded, the 'Content-Type' is used to lookup a converted from the registry. The converter is then used to serialize/deserialize the entity across the wire.

Registry lookups may be asynchronous as converters are lazily loaded. As such a promise for the converter is returned for all lookups.

```javascript
registry.lookup('application/json').then(function (jsonConverter) {
    ...
});
```


<a name="mime-converters"></a>
## MIME Converters

Several common MIME types are supported out of the box including:

- text/plain
- application/hal+json
- application/json
- application/x-www-form-urlencoded
- multipart/form-data *

These converters are loaded lazily and are located under `rest/mime/type/*`. So 'text/plain' is resolved to `rest/mime/type/text/plain`. The main MIME registry knows how to fetch these converters. Child registries extend from the main registry hierarchically and thus also get access to these provided converters.

* Multipart support is only available for requests from browsers that have implemented XMLHttpRequest 2. This includes most modern browsers with the exception of IE <=9.

<a name="mime-converters-custom"></a>
### Custom Converters

A converter is fundamentally a object with two methods: `read` and `write`. The read method accepts the entity as a string and returns an object. The write method accepts the entity as an object and returns a string. While not strictly required, the read and write methods are typically reflexive. A convert may implement either the read or write methods, but that limits the converters ability to handle response or request entities, respectively.

The `read` and `write` methods may additionally accept an `opts` argument. Common opts include the `request` or `response`, parsed `mime` type, and a `client` to make further requests if needed. Either a raw value or a promise may be returned.

```javascript
numberConverter = {
    read: function (str, opts) {
        return parseFloat(str);
    },
    write: function (obj, opts) {
        return obj.toString();
    }
};

registry.register('application/vnd.numbers', numberConverter);
```

Converters registered within the registry will be available to all consumers of the registry. If a custom converter needs to be installed to override a well known MIME type, or different parts of the application need different converters for the same MIME type, a child registry should be used instead. The custom registry can be provided to the mime interceptor to override using the main registry.

```javascript
childRegistry = registry.child();
childRegistry.register('application/json', fauxJsonConverter);

registry.lookup('application/json').then(function (jsonConverter) {
    // the real converter
    refute.same(jsonConverter, fauxJsonConverter);
});

childRegistry.lookup('application/json').then(function (jsonConverter) {
    // the faux converter
    assert.same(jsonConverter, fauxJsonConverter);
});
```

Converters need to be registered for a MIME type. MIME types are well known and [registered with IANA](http://www.iana.org/assignments/media-types). It's frowned upon to use a MIME type that is not registered, or use a registered MIME for an incompatible format.

Vendor MIMEs '\*/vnd.*' are unreserved and available for internal use and experimentation. Application may use vendor MIMEs to provide additional knowledge about the type of object an entity represents, or to vary the rendering of the same object. As an example, 'application/json' provides a strong structure for the entity, but does nothing to indicate what the entity represents. Vendor MIMEs can provide that extra semantic meaning, but requires both the client and server understand and establish that meaning out-of-band.


<a name="custom-json-converters"></a>
## Custom JSON Converters

Advanced JSON serialization often leverages custom revivers and replacers. The JSON converter can be extended to use custom revivers and replacers.

```javascript
var json = require('rest/mime/type/application/json');
var customJson = json.extend(reviver, replacer);
```

In order to use the extended converter, it must be [registered in a MIME registry](#mime-converters-custom). It's generally recommended to use a custom vendored MIME type when overriding a common converter. If that is not possible, using a child registry is highly recommended to avoid conflicts.

```javascript
registry.register('application/json', customJson);
```


<a name="mime-interceptor"></a>
## MIME Interceptor

`rest/interceptor/mime` ([src](../interceptor/mime.js))

The [MIME interceptor](interceptors.md#module-rest/interceptor/mime) utilizes the mime registry to convert request and response entities between objects and text strings. A custom registry
