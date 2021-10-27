# Application Insights for Node.js

[![npm version](https://badge.fury.io/js/applicationinsights.svg)](http://badge.fury.io/js/applicationinsights)
[![Build Status](https://travis-ci.org/Microsoft/ApplicationInsights-node.js.svg?branch=master)](https://travis-ci.org/Microsoft/ApplicationInsights-node.js)

[Azure Application Insights][] monitors your backend services and components after
you deploy them to help you [discover and rapidly diagnose performance and other
issues][]. Add this SDK to your Node.js services to include deep info about Node.js
processes and their external dependencies such as database and cache services.
You can use this SDK for your Node.js services hosted anywhere: your datacenter,
Azure VMs and Web Apps, and even other public clouds.

[Azure Application Insights]: https://azure.microsoft.com/documentation/articles/app-insights-overview/
[discover and rapidly diagnose performance and other issues]: https://docs.microsoft.com/azure/application-insights/app-insights-detect-triage-diagnose

This library tracks the following out-of-the-box:
- Incoming and outgoing HTTP requests
- Important system metrics such as CPU usage
- Unhandled exceptions
- Events from many popular third-party libraries ([see Automatic third-party instrumentation](#automatic-third-party-instrumentation))

You can manually track more aspects of your app and system using the API described in the
[Track custom telemetry](#track-custom-telemetry) section.

## Getting Started

1. Create an Application Insights resource in Azure by following [these instructions][].
2. Grab the _Instrumentation Key_ (aka "ikey") from the resource you created in
   step 1. Later, you'll either add it to your app's environment variables or
   use it directly in your scripts.
3. Add the Application Insights Node.js SDK to your app's dependencies and
   package.json:
     ```bash
     npm install --save applicationinsights
     ```
     > *Note:* If you're using TypeScript, do not install a separate "typings" package.
     > This NPM package contains built-in typings.
4. As early as possible in your app's code, load the Application Insights
   package:
     ```javascript
     let appInsights = require('applicationinsights');
     ```
5. Configure the local SDK by calling `appInsights.setup('_your_ikey_');`, using
   the ikey you grabbed in step 2. Or put this ikey in the
   `APPINSIGHTS_INSTRUMENTATIONKEY` environment variable and call
   `appInsights.setup()` without parameters.
   > For more configuration options see below.
6. Finally, start automatically collecting and sending data by calling
   `appInsights.start();`.

[these instructions]: https://docs.microsoft.com/azure/application-insights/app-insights-nodejs


## Basic Usage

For out-of-the-box collection of HTTP requests, popular third-party library events,
unhandled exceptions, and system metrics:

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("_your_ikey_").start();
```

* If the instrumentation key is set in the environment variable
  APPINSIGHTS\_INSTRUMENTATIONKEY, `.setup()` can be called with no
  arguments. This makes it easy to use different ikeys for different
  environments.

Load the Application Insights library (i.e. `require("applicationinsights")`) as
early as possible in your scripts, before loading other packages. This is needed
so that the Application Insights libary can prepare later packages for tracking.
If you encounter conflicts with other libraries doing similar preparation, try
loading the Application Insights library after those.

Because of the way JavaScript handles callbacks, additional work is necessary to
track a request across external dependencies and later callbacks. By default
this additional tracking is enabled; disable it by calling
`setAutoDependencyCorrelation(false)` as described in the
Configuration section below.

## Migrating from versions prior to 0.22

There are breaking changes between releases prior to version 0.22 and after. These
changes are designed to bring consistency with other Application Insights SDKs and
allow future extensibility. Please review this README for new method and property names.

In general, you can migrate with the following:
- Replace references to `appInsights.client` with `appInsights.defaultClient`
- Replace references to `appInsights.getClient()` with `new appInsights.TelemetryClient()`
- Replace all arguments to client.track* methods with a single object containing named
properties as arguments. See your IDE's built-in type hinting, or [TelemetryTypes](https://github.com/Microsoft/ApplicationInsights-node.js/tree/develop/Declarations/Contracts/TelemetryTypes), for
the expected object for each type of telemetry.

If you access SDK configuration functions without chaining them to `appInsights.setup()`,
you can now find these functions at appInsights.Configuration
(eg. `appInsights.Configuration.setAutoCollectDependencies(true)`).
Take care to review the changes to the default configuration in the next section.

## Configuration

The appInsights object provides a number of configuration methods. They are
listed in the following snippet with their default values.

```javascript
let appInsights = require("applicationinsights");
appInsights.setup("<instrumentation_key>")
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
```

Please review their descriptions in your IDE's built-in type hinting, or [applicationinsights.ts](https://github.com/Microsoft/ApplicationInsights-node.js/tree/develop/applicationinsights.ts) for
detailed information on what these control, and optional secondary arguments.

Note that by default `setAutoCollectConsole` is configured to *exclude* calls to `console.log`
(and other `console` methods). By default, only calls to supported third-party loggers
(e.g. `winston`, `bunyan`) will be collected. You can change this behavior to *include* calls
to `console` methods by using `setAutoCollectConsole(true, true)`.

### Sampling

By default, the SDK will send all collected data to the Application Insights service. If you collect a lot of data, you might want to enable sampling to reduce the amount of data sent. Set the `samplingPercentage` field on the Config object of a Client to accomplish this. Setting `samplingPercentage` to 100 (the default) means all data will be sent, and 0 means nothing will be sent.

If you are using automatic correlation, all data associated with a single request will be included or excluded as a unit.

Add code such as the following to enable sampling:

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("<instrumentation_key>");
appInsights.defaultClient.config.samplingPercentage = 33; // 33% of all telemetry will be sent to Application Insights
appInsights.start();
```

### Multiple roles for multi-component applications

If your application consists of multiple components that you wish to instrument all with the same Instrumentation Key and still see these components as separate units in the Portal as if they were using separate Instrumentation Keys (for example, as separate nodes on the Application Map) you may need to manually configure the RoleName field to distinguish one component's telemetry from other components sending data to your Application Insights resource. (See [Monitor multi-component applications with Application Insights (preview)](https://docs.microsoft.com/azure/application-insights/app-insights-monitor-multi-role-apps))

Use the following to set the RoleName field:

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("<instrumentation_key>");
appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "MyRoleName";
appInsights.start();
```

### Automatic third-party instrumentation

In order to track context across asynchronous calls, some changes are required in third party libraries such as mongodb and redis.
By default ApplicationInsights will use [`diagnostic-channel-publishers`](https://github.com/Microsoft/node-diagnostic-channel/tree/master/src/diagnostic-channel-publishers)
to monkey-patch some of these libraries.
This can be disabled by setting the `APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL` environment variable. Note that by setting that
environment variable, events may no longer be correctly associated with the right operation. Individual monkey-patches can be
disabled by setting the `APPLICATION_INSIGHTS_NO_PATCH_MODULES` environment variable to a comma separated list of packages to
disable, e.g. `APPLICATION_INSIGHTS_NO_PATCH_MODULES=console,redis` to avoid patching the `console` and `redis` packages.

Currently there are 9 packages which are instrumented: `bunyan`, `console`, `mongodb`, `mongodb-core`, `mysql`, `redis`, `winston`,
`pg`, and `pg-pool`. Visit the [diagnostic-channel-publishers' README](https://github.com/Microsoft/node-diagnostic-channel/blob/master/src/diagnostic-channel-publishers/README.md)
for information about exactly which versions of these packages are patched.

The `bunyan`, `winston`, and `console` patches will generate Application Insights Trace events based on whether `setAutoCollectConsole` is enabled.
The rest will generate Application Insights Dependency events based on whether `setAutoCollectDependencies` is enabled.

## Track custom telemetry

You can track any request, event, metric or exception using the Application
Insights client. Examples follow:

```javascript
let appInsights = require("applicationinsights");
appInsights.setup().start(); // assuming ikey in env var. start() can be omitted to disable any non-custom data
let client = appInsights.defaultClient;
client.trackEvent({name: "my custom event", properties: {customProperty: "custom property value"}});
client.trackException({exception: new Error("handled exceptions can be logged with this method")});
client.trackMetric({name: "custom metric", value: 3});
client.trackTrace({message: "trace message"});
client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
client.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true});

let http = require("http");
http.createServer( (req, res) => {
  client.trackNodeHttpRequest({request: req, response: res}); // Place at the beginning of your request handler
});
```

An example utility using `trackMetric` to measure how long event loop scheduling takes:

```javascript
function startMeasuringEventLoop() {
  var startTime = process.hrtime();
  var sampleSum = 0;
  var sampleCount = 0;

  // Measure event loop scheduling delay
  setInterval(() => {
    var elapsed = process.hrtime(startTime);
    startTime = process.hrtime();
    sampleSum += elapsed[0] * 1e9 + elapsed[1];
    sampleCount++;
  }, 0);

  // Report custom metric every second
  setInterval(() => {
    var samples = sampleSum;
    var count = sampleCount;
    sampleSum = 0;
    sampleCount = 0;

    if (count > 0) {
      var avgNs = samples / count;
      var avgMs = Math.round(avgNs / 1e6);
      client.trackMetric({name: "Event Loop Delay", value: avgMs});
    }
  }, 1000);
}
```

## Preprocess data with Telemetry Processors

```javascript
public addTelemetryProcessor(telemetryProcessor: (envelope: Contracts.Envelope, context: { http.RequestOptions, http.ClientRequest, http.ClientResponse, correlationContext }) => boolean)
```

You can process and filter collected data before it is sent for retention using
_Telemetry Processors_. Telemetry processors are called one by one in the
order they were added before the telemetry item is sent to the cloud.

If a telemetry processor returns false that telemetry item will not be sent.

All telemetry processors receive the telemetry data and its envelope to inspect and
modify. They also receive a context object. The contents of this object is defined by
the `contextObjects` parameter when calling a track method for manually tracked telemetry.
For automatically collected telemetry, this object is filled with available request information
and the persistent request context as provided by `appInsights.getCorrelationContext()` (if
automatic dependency correlation is enabled).

The TypeScript type for a telemetry processor is:

```typescript
telemetryProcessor: (envelope: ContractsModule.Contracts.Envelope, context: { http.RequestOptions, http.ClientRequest, http.ClientResponse, correlationContext }) => boolean;
```

For example, a processor that removes stack trace data from exceptions might be
written and added as follows:

```javascript
function removeStackTraces ( envelope, context ) {
  if (envelope.data.baseType === "Microsoft.ApplicationInsights.ExceptionData") {
    var data = envelope.data.baseData;
    if (data.exceptions && data.exceptions.length > 0) {
      for (var i = 0; i < data.exceptions.length; i++) {
        var exception = data.exceptions[i];
        exception.parsedStack = null;
        exception.hasFullStack = false;
      }
    }
  }
  return true;
}

appInsights.defaultClient.addTelemetryProcessor(removeStackTraces);
```

More info on the telemetry API is available in [the docs][].

[the docs]: https://azure.microsoft.com/documentation/articles/app-insights-api-custom-events-metrics/

## Use multiple instrumentation keys

You can create multiple Azure Application Insights resources and send different
data to each by using their respective instrumentation keys ("ikey"). For
example:

```javascript
let appInsights = require("applicationinsights");

// configure auto-collection under one ikey
appInsights.setup("_ikey-A_").start();

// track some events manually under another ikey
let otherClient = new appInsights.TelemetryClient("_ikey-B_");
otherClient.trackEvent({name: "my custom event"});
```

## Examples

* Track dependencies

    ```javascript
    let appInsights = require("applicationinsights");
    let client = new appInsights.TelemetryClient();

    var success = false;
    let startTime = Date.now();
    // execute dependency call here....
    let duration = Date.now() - startTime;
    success = true;

    client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:duration, resultCode:0, success: true, dependencyTypeName: "ZSQL"});
    ```

* Assign custom properties to be included with all events

    ```javascript
    appInsights.defaultClient.commonProperties = {
      environment: process.env.SOME_ENV_VARIABLE
    };
    ```

* Manually track all HTTP GET requests

    Note that all requests are tracked by default. To disable automatic
    collection, call `.setAutoCollectRequests(false)` before calling `start()`.

    ```javascript
    appInsights.defaultClient.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true});
    ```
    Alternatively you can track requests using ```trackNodeHttpRequest``` method:

    ```javascript
    var server = http.createServer((req, res) => {
      if ( req.method === "GET" ) {
          appInsights.defaultClient.trackNodeHttpRequest({request:req, response:res});
      }
      // other work here....
      res.end();
    });
    ```

* Track server startup time

    ```javascript
    let start = Date.now();
    server.on("listening", () => {
      let duration = Date.now() - start;
      appInsights.defaultClient.trackMetric({name: "server startup time", value: duration});
    });
    ```

## Advanced configuration options
The Client object contains a `config` property with many optional settings for
advanced scenarios. These can be set as follows:
```
client.config.PROPERTYNAME = VALUE;
```
These properties are client specific, so you can configure `appInsights.defaultClient`
separately from clients created with `new appInsights.TelemetryClient()`.

| Property                        | Description                                                                                                |
| ------------------------------- |------------------------------------------------------------------------------------------------------------|
| instrumentationKey              | An identifier for your Application Insights resource                                                       |
| endpointUrl                     | The ingestion endpoint to send telemetry payloads to                                                       |
| proxyHttpUrl                    | A proxy server for SDK HTTP traffic (Optional, Default pulled from `http_proxy` environment variable)      |
| proxyHttpsUrl                   | A proxy server for SDK HTTPS traffic (Optional, Default pulled from `https_proxy` environment variable)    |
| httpAgent                       | An http.Agent to use for SDK HTTP traffic (Optional, Default undefined)                                    |
| httpsAgent                      | An https.Agent to use for SDK HTTPS traffic (Optional, Default undefined)                                  |
| maxBatchSize                    | The maximum number of telemetry items to include in a payload to the ingestion endpoint (Default `250`)    |
| maxBatchIntervalMs              | The maximum amount of time to wait to for a payload to reach maxBatchSize (Default `15000`)                |
| disableAppInsights              | A flag indicating if telemetry transmission is disabled (Default `false`)                                  |
| samplingPercentage              | The percentage of telemetry items tracked that should be transmitted (Default `100`)                       |
| correlationIdRetryIntervalMs    | The time to wait before retrying to retrieve the id for cross-component correlation (Default `30000`)      |
| correlationHeaderExcludedDomains| A list of domains to exclude from cross-component correlation header injection (Default See [Config.ts][]) |

[Config.ts]: https://github.com/Microsoft/ApplicationInsights-node.js/blob/develop/Library/Config.ts

## Branches

- Ongoing development takes place on the [develop][] branch. **Please submit
  pull requests to this branch.**
- Releases are merged to the [master][] branch and published to [npm][].

[master]: https://github.com/Microsoft/ApplicationInsights-node.js/tree/master
[develop]: https://github.com/Microsoft/ApplicationInsights-node.js/tree/develop
[npm]: https://www.npmjs.com/package/applicationinsights

## Links

* [ApplicationInsights-Home][] is our central repo for libraries and info for
  all languages and platforms.
* Follow the latest Application Insights changes and announcements on the
  [ApplicationInsights-Announcements][] repo.
* [SDK Release Schedule][]

[ApplicationInsights-Announcements]: https://github.com/Microsoft/ApplicationInsights-Announcements
[ApplicationInsights-Home]: https://github.com/Microsoft/ApplicationInsights-Home
[SDK Release Schedule]: https://github.com/Microsoft/ApplicationInsights-Home/wiki/SDK-Release-Schedule

## Contributing

1. Install all dependencies with `npm install`.
2. Set an environment variable to your instrumentation key (optional).
    ```bash
    // windows
    set APPINSIGHTS_INSTRUMENTATIONKEY=<insert_your_instrumentation_key_here>
    // linux/macos
    export APPINSIGHTS_INSTRUMENTATIONKEY=<insert_your_instrumentation_key_here>
    ```
3. Run tests
    ```bash
    npm run test
    npm run backcompattest
    npm run functionaltest
    ```
    _Note: Functional tests require Docker_

---

This project has adopted the [Microsoft Open Source Code of Conduct][]. For more
information see the [Code of Conduct FAQ][] or contact
[opencode@microsoft.com][] with any additional questions or comments.

[Microsoft Open Source Code of Conduct]: https://opensource.microsoft.com/codeofconduct/
[Code of Conduct FAQ]: https://opensource.microsoft.com/codeofconduct/faq/
[opencode@microsoft.com]: mailto:opencode@microsoft.com
