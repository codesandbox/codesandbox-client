# wire.js

[wire.js](https://github.com/cujojs/wire/) is an Inversion of Control container that allows applications to be composed together at runtime based on a declarative configuration. A rest.js plugin is provided for wire.js that enables declarative configuration of rest.js clients, including chaning interceptors with their configuration.


<a name="module-rest/wire"></a>
## Wire Plugin

`rest/wire` ([src](../wire.js))

**TIP:** In each of these examples, `{ module: 'rest/wire' }` is loaded as it provides the 'rest' factory to the wire.js spec.  Without this module being loaded into the spec, the facilities below will silently fail.


<a name="wire-rest-factory"></a>
### 'rest' Factory

The `rest` factory provides a declarative way to define a client with an interceptor chain that is nearly identical in capability to imperative JavaScript. The factory access two main config properties, a parent client, and an array of interceptors. Each entry in the interceptor array contains a reference to the interceptor module, and the configuration for that interceptor. The array of interceptors is chained off the client in order returning the resulting client as the wire.js component.

In it's basic form, the array of interceptors is processed in order, wrapping the parent client.

```javascript
client: {
    rest: {
        parent: { $ref: 'baseClient' },
        interceptors: [
            { module: 'rest/interceptor/mime', config: { mime: 'application/json' } },
            { module: 'rest/interceptor/location' },
            { module: 'rest/interceptor/entity' },
            { module: 'rest/interceptor/hateoas', config: { target: '' } }
        ]
    }
},
baseClient: { module: 'rest' },
$plugins: [{ module: 'rest/wire' }]
```

If parent is not defined, or is not a function, the default client is used as the parent. In that case, the interceptors array can replace the whole factory object

```javascript
client: {
    rest: [
        { module: 'rest/interceptor/mime', config: { mime: 'application/json' } },
        { module: 'rest/interceptor/location' },
        { module: 'rest/interceptor/entity' },
        { module: 'rest/interceptor/hateoas', config: { target: '' } }
    ]
},
$plugins: [{ module: 'rest/wire' }]
```

If a configuration element isn't needed, a string can be provided to represent the module

```javascript
client: {
    rest: [
        { module: 'rest/interceptor/mime', config: { mime: 'application/json' } },
        'rest/interceptor/location',
        'rest/interceptor/entity',
        { module: 'rest/interceptor/hateoas', config: { target: '' } }
    ]
},
$plugins: [{ module: 'rest/wire' }]
```

An individual interceptors array entry can use any facility available within wire.js, including $ref.

```javascript
client: {
    rest: [
        { $ref: 'mime', config: { mime: 'application/json' } },
        'rest/interceptor/location',
        'rest/interceptor/entity',
        { $ref: 'hateoas', config: { target: '' } }
    ]
},
mime: { module: 'rest/interceptor/mime' },
hateoas: { module: 'rest/interceptor/hateoas' },
$plugins: [{ module: 'rest/wire' }]
```

The 'config' object for an interceptor may also use any wire.js facility. If a literal config object is desired, but is being wired in an undesirable way, use the 'literal' wire.js factory to provide the literal config.

```javascript
client: {
    rest: [
        { $ref: 'myInterceptor', config: { literal: { module: 'not/a/wire/module/factory' } } },
    ]
},
myInterceptor: { ... },
$plugins: [{ module: 'rest/wire' }]
```
