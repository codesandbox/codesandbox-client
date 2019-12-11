# vscode-extension-telemetry
This module provides a consistent way for first-party extensions to report telemetry
over Application Insights. The module respects the user's decision about whether or
not to send telemetry data.

Follow [guide to set up Application Insights](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-nodejs-quick-start) in Azure and get your key.

# install 
`npm install vscode-extension-telemetry`

# usage
 ```javascript
 const vscode = require('vscode');
 const TelemetryReporter = require('vscode-extension-telemetry');
 
 // all events will be prefixed with this event name
 const extensionId = '<your extension unique name>';
 
 // extension version will be reported as a property with each event 
 const extensionVersion = '<your extension version>'; 
 
 // the application insights key (also known as instrumentation key)
 const key = '<your key>'; 

// telemetry reporter 
 let reporter;
 
 function activate(context: vscode.ExtensionContext) {
    ...
    // create telemetry reporter on extension activation
    reporter = new TelemetryReporter(extensionId, extensionVersion, key);
    // ensure it gets property disposed
    context.subscriptions.push(reporter);
    ...
 }

 function deactivate() {
   // This will ensure all pending events get flushed
    reporter.dispose();
 }

 ...
 // send event any time after activation
 reporter.sendTelemetryEvent('sampleEvent', { 'stringProp': 'some string' }, { 'numericMeasure': 123});
 
  ```

# common properties
- `common.extname`
- `common.extversion`
- `common.vscodemachineid` 
- `common.vscodesessionid`
- `common.vscodeversion` 
- `common.os`
- `common.platformversion`

# License
[MIT](LICENSE)
