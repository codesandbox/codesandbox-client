rest.js
=======

Just enough client, as you need it.  Make HTTP requests from a browser or Node.js applying only the client features you need.  Configure a client once, and share it safely throughout your application.  Easily extend with interceptors that wrap the request and/or response, or MIME type converters for rich data formats.


Build Status
------------

<table>
  <tr><td>Master</td><td><a href="http://travis-ci.org/cujojs/rest" target="_blank"><img src="https://secure.travis-ci.org/cujojs/rest.png?branch=master" /></a></tr>
  <tr><td>Development</td><td><a href="http://travis-ci.org/cujojs/rest" target="_blank"><img src="https://secure.travis-ci.org/cujojs/rest.png?branch=dev" /></a></tr>
</table>


Usage
-----

Using rest.js is easy.  The core clients provide limited functionality around the request and response lifecycle.  The request and response objects are normalized to support portability between different JavaScript environments.

The return value from a client is a promise that is resolved with the response when the remote request finishes.

The core client behavior can be augmented with [interceptors](docs/interceptors.md#interceptor-principals).  An interceptor wraps the client and transforms the request and response.  For example: an interceptor may authenticate a request, or reject the promise if an error is encountered.  Interceptors may be combined to create a client with the desired behavior.  A configured interceptor acts just like a client.  The core clients are basic, they only know the low level mechanics of making a request and parsing the response.  All other behavior is applied and configured with interceptors.

Interceptors are applied to a client by wrapping.  To wrap a client with an interceptor, call the `wrap` method on the client providing the interceptor and optionally a configuration object.  A new client is returned containing the interceptor's behavior applied to the parent client.  It's important to note that the behavior of the original client is not modified, in order to use the new behavior, you must use the returned client.


### Making a basic request: ###

```javascript
var rest = require('rest');

rest('/').then(function(response) {
    console.log('response: ', response);
});
```

In this example, you can see that the request object is very simple, it just a string representing the path.  The request may also be a proper [object containing other HTTP properties](docs/interfaces.md#interface-request).

The response should look familiar as well, it contains all the fields you would expect, including the response headers (many clients ignore the headers).


### Working with JSON: ###

If you paid attention when executing the previous example, you may have noticed that the response.entity is a string.  Often we work with more complex data types.  For this, rest.js supports a rich set of [MIME type conversions](docs/mime.md) with the [MIME Interceptor](docs/interceptors.md#module-rest/interceptor/mime).  The correct converter will automatically be chosen based on the `Content-Type` response header.  Custom converts can be registered for a MIME type, more on that later...

```javascript
var rest, mime, client;

rest = require('rest'),
mime = require('rest/interceptor/mime');

client = rest.wrap(mime);
client({ path: '/data.json' }).then(function(response) {
    console.log('response: ', response);
});
```

Before an interceptor can be used, it needs to be configured.  In this case, we will accept the default configuration, and obtain a client.  Now when we see the response, the entity will be a JS object instead of a String.


### Composing Interceptors: ###

```javascript
var rest, mime, errorCode, client;

rest = require('rest'),
mime = require('rest/interceptor/mime');
errorCode = require('rest/interceptor/errorCode');

client = rest.wrap(mime)
             .wrap(errorCode, { code: 500 });
client({ path: '/data.json' }).then(
    function(response) {
        console.log('response: ', response);
    },
    function(response) {
        console.error('response error: ', response);
    }
);
```

In this example, we take the client create by the [MIME Interceptor](docs/interceptors.md#module-rest/interceptor/mime), and wrap it with the [Error Code Interceptor](docs/interceptors.md#module-rest/interceptor/errorCode).  The error code interceptor accepts a configuration object that indicates what status codes should be considered an error.  In this case we override the default value of <=400, to only reject with 500 or greater status code.

Since the error code interceptor can reject the response promise, we also add a second handler function to receive the response for requests in error.

Clients can continue to be composed with interceptors as needed.  At any point the client as configured can be shared.  It is safe to share clients and allow other parts of your application to continue to compose other clients around the shared core.  Your client is protected from additional interceptors that other parts of the application may add.


### Declarative Interceptor Composition: ###

First class support is provided for [declaratively composing interceptors using wire.js](docs/wire.md).  wire.js is an dependency injection container; you specify how the parts of your application interrelate and wire.js takes care of the dirty work to make it so.

Let's take the previous example and configure the client using a wire.js specification instead of imperative code.

```javascript
{
	...,
	client: {
		rest: [
			{ module: 'rest/interceptor/mime' },
			{ module: 'rest/interceptor/errorCode', config: { code: 500 } }
		]
	},
	$plugins: [{ module: 'rest/wire' }]
}
```

There are a couple things to notice.  First is the '$plugins' section, by declaring the `rest/wire` module, the `rest` factory becomes available within the specification.  The second thing to notice is that we no longer need to individually `require()` interceptor modules; wire.js is smart enough to automatically fetch the modules.  The interceptors are then wrapped in the order they are defined and provided with the corresponding config object, if it's defined.  The resulting client can then be injected into any other object using standard wire.js facilities.


### Custom MIME Converters: ###

```javascript
var registry = require('rest/mime/registry');

registry.register('application/vnd.com.example', {
    read: function(str) {
        var obj;
        // do string to object conversions
        return obj;
    },
    write: function(obj) {
        var str;
        // do object to string conversions
        return str;
    }
});
```

Registering a custom converter is a simple as calling the register function on the [mime registry](docs/mime.md#module-rest/mime/registry) with the type and converter.  A converter has just two methods: `read` and `write`.  Read converts a String to a more complex Object.  Write converts an Object back into a String to be sent to the server.  HTTP is fundamentally a text based protocol after all.

Built in converters are available under `rest/mime/type/{type}`, as an example, JSON support is located at `rest/mime/type/application/json`.  You never need to know this as a consumer, but it's a good place to find examples.


Supported Environments
----------------------

Our goal is to work in every major JavaScript environment; Node.js and major browsers are actively tested and supported.

If your preferred environment is not supported, please let us know. Some features may not be available in all environments.

Tested environments:
- Node.js (0.6, 0.8. 0.10, 4, 5)
- Chrome (stable)
- Firefox (stable, ESR, should work in earlier versions)
- Edge
- IE (6-11)
- Safari (5-9, iOS 4-9.2, should work in earlier versions)
- Android (4.0-5.1, should work in earlier versions)
- Opera (11, 12, should work in earlier versions)

Specific browser test are provided by [Travis CI](https://travis-ci.org/cujojs/rest) and [Sauce Labs' Open Sauce Plan](https://saucelabs.com/opensource). You can see [specific browser test results](https://saucelabs.com/u/cujojs-rest), although odds are they do not reference this specific release/branch/commit.


Getting Started
---------------

rest.js can be installed via [npm](https://npmjs.org/), [Bower](http://bower.io/), [jspm](http://jspm.io/), or from source.

To install without source:

    $ npm install --save rest

or

    $ bower install --save rest

or

    $ jspm install rest

From source:

    $ npm install

rest.js is designed to run in a browser environment, utilizing [AMD modules](https://github.com/amdjs/amdjs-api/wiki/AMD), or within [Node.js](http://nodejs.org/) as CommonJS modules. Any module loader capable of loading either AMD or CommonJS modules should be able to load rest.js. cujoJS [curl.js](https://github.com/cujojs/curl) is actively tested.

An ECMAScript 5 compatible environment is assumed.  Older browsers, ::cough:: IE, that do not support ES5 natively can be shimmed.  Any shim should work, although we test with cujoJS [poly.js](https://github.com/cujojs/poly)


Documentation
-------------

Full project documentation is available in the [docs directory](docs).


Running the Tests
-----------------

The test suite can be run in two different modes: in node, or in a browser.  We use [npm](https://npmjs.org/) and [Buster.JS](http://busterjs.org/) as the test driver, buster is installed automatically with other dependencies.

Before running the test suite for the first time:

    $ npm install

To run the suite in node:

    $ npm test

To run the suite in a browser:

    $ npm start
    browse to http://localhost:8282/ in the browser(s) you wish to test.  It can take a few seconds to start.


Get in Touch
------------

You can find us on the [cujojs mailing list](https://groups.google.com/forum/#!forum/cujojs), or the #cujojs IRC channel on freenode.

Please report issues on [GitHub](https://github.com/cujojs/rest/issues).  Include a brief description of the error, information about the runtime (including shims) and any error messages.

Feature requests are also welcome.


Contributors
------------

- Scott Andrews <scothis@gmail.com>
- Jeremy Grelle <jeremy.grelle@gmail.com>
- John Hann <john@unscriptable.com>
- Michael Jackson <mjijackson@gmail.com>

Please see CONTRIBUTING.md for details on how to contribute to this project.


Copyright
---------

Copyright 2012-2015 the original author or authors

rest.js is made available under the MIT license.  See LICENSE.txt for details.


Change Log
----------

1.3.2
- fix to correctly url encode character codes 0-15, such as \n
- include requested URL on response object
- Update tested environments. Removing Firefox 3.6, Safari 5 and iOS 4.3 (no longer supported by SauceLabs). Adding Node 5, Node 4, Edge, Firefox 38 ESR, iOS 9.2, iOS 8.4 and Android 5.1.

1.3.1
- fix to allow numbers and boolean values as parameters to URI Template expansion.

1.3.0
- response.follow() for easy traversal of hypermedia APIs
- application/hal mime converter supports templated URLs, and resource.requestFor('relationship', request)
- full URI Template (rfc6570) support in rest/util/uriTemplate
- section aware URI encoding in rest/util/uriEncoder
- best fit MIME type resolution, including by suffix (i.e. '+json'). Parsed MIME type provided to converters
- installation via jspm and loader support for System.js
- support for Android 4.0-5.0 (no code changes required, now actively testing)
- support for Safari 8, iOS 8.0 and 8.1 (no code changes required, now actively testing)
- raw configuration objects are retained by interceptors, config objects are no longer begotten
- transient timeouts via config.transient on rest/interceptor/timeout, allows retry interceptor to wrap timeout
- extend JSON converter for custom reviver and replacers
- request.mixin properties attempt setting before before and after opening the request. Some browsers (IE) are sensitive to when the properties are set.
- wire.js rest factory interceptors now wire configuration objects
- normalize responses for linked and embedded resources from application/hal mime converter to always be a ResponsePromise

1.2.0
- deprecated rest/interceptor/entity: instead use response.entity()
- deprecated and removed wire.js reference resolves 'client!' and 'resource!', instead use the 'rest/wire' factory
- deprecated and removed Dojo store support
- separate browser and node main modules, browser consumers should switch their main module from 'rest/rest' to 'rest/browser'. This allows tools such as browerify and webpack to more intelligently reason about the module structure.
- Multipart requests for browsers that support FormData (sorry IE 6-9). Thanks @mjackson
- mixin property support in defaultRequest interceptor. Thanks @jiangtyd
- allow location interceptor to be applied based on the status code. Thanks @phillipj
- better support for file:// URL via the XHR client

1.1.1
- support for IE 11, Safari 7 and iOS 7 (no code changes required, now actively testing)
- Node specific configuration options via request.mixin. Particularly useful for https clients. Thanks @wwwdata
- basic support for Browserify. Note: Browserify is not yet a tested environment

1.1.0
- bump when.js version to ~3, 2.x is no longer supported
- perfer `client.wrap()` to `client.chain()`, `chain` is now deprecated
- add HTTP specific methods to the promises returned from clients: .entity(), .status(), .headers(), .header(name)
- mime converters may return a promise. Thanks @phillipj
- removed 'rest/util/beget' favor Object.create

1.0.3
- add moduleType for bower (node and amd). Thanks @briancavalier
- doc polish. Thanks @gogamoga

1.0.2
- restore client.chain() to the default client

1.0.1
- handle exceptions thrown from MIME converters
- allow overriding the default client
- allow AMD loaders to load node client. Useful when using an AMD loader with Node. Thanks @unscriptable

1.0.0
- JSON HAL mime serializer for application/hal+json
- the third argument to the interceptor request/response callbacks is not an object instead of the client, the client is a property on that object
- HATEOAS interceptor defaults to indexing relationships directly on the host entity instead of the '_links' child object.  A child object may still be configured.
- HATEOAS interceptor returns same promise on multiple relationship property accesses
- 'file:' scheme URL support in rest/UrlBuilder
- bump when.js version to 2.x
- drop support for bower  pre 1.0

0.9.4
- CSRF protection interceptor
- support bower 0.10+, older versions of bower continue to work

0.9.3
- fixes issues with uglified JSONP client in IE 8

0.9.2
- allow strings to represent request objects, the string value is treated as the path property
- parsing 'Link' response headers in hateoas interceptor (rfc5988)

0.9.1
- add Node 0.10 as a tested environment
- restore when.js 1.8 compat, when.js 2.0 is still preferred

0.9.0
- moving from the 's2js' to the 'cujojs' organization
- new reference documentation in the docs directory
- Interceptor configuration chaining `rest.chain(interceptor, config).chain(interceptor, config)...`
- wire.js factory
- hateoas and location interceptors default to use request.originator
- defaultRequest interceptor, provide default values for any portion of a request
- XDomainRequest support for IE 8 and 9
- XHR fall back interceptor for older IE
- allow child MIME registries and configurable registry for the mime interceptor
- SimpleRestStore that provides the functionality of RestStore without Dojo's QueryResults
- rename UrlBuilder's 'absolute()' to 'fullyQualify()'
- added 'isAbsolute()', 'isFullyQualified()', 'isCrossOrigin()' and 'parts()' to UrlBuilder
- access to the originating client as request.originator
- shared 'this' between request/response phases of a single interceptor per request
- 'init' phase for interceptors, useful for defaulting config properties
- interceptor config object is now begotten, local modifications will not collide between two interceptors with the same config obj
- cleaned up interceptor's request handler for complex requests
- mutli-browser testing with Sauce Labs

0.8.4
- Bower installable, with dependencies
- node client's response.raw includes ClientResquest and ClientResponse objects
- basicAuth interceptor correctly indicates auth method

0.8.3
- moving from the 'scothis' to the 's2js' organization, no functional changes

0.8.2
- requests may be canceled
- timeout incerceptor that cancels the request unless it finishes before the timeout
- retry interceptor handles error respones by retrying the request after an elapsed period
- error interceptor handlers may recover from errors, a rejected promise must be returned in order to preserve the error state
- response objects, with an error property, are used for client errors instead of the thrown value
- interceptor response handlers recieve the interceptor's client rather then the next client in the chain
- interceptor request handlers may provide a response
- convert modules to UMD format; no functional impact
- replaced rest/util/base64 with an MIT licenced impl; no functional impact

0.8.1
- fixed bug where http method may be overwritten

0.8.0
- npm name change 'rest-template' -> 'rest'
- introduced experimental HATEOAS support
- introduced 'location' interceptor which follows Location response headers, issuing a GET for the specified URL
- default method to POST when request contains an entity
- response handlers now have access to the request client to issue subsequent requests
- interceptors may specify their default client
- renamed `rest/interceptor/_base` to `rest/interceptor`

0.7.5
- Initial release, everything is new
