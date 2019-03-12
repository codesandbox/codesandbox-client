"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_chrome_debug_core_1 = require("vscode-chrome-debug-core");
const path = require("path");
const os = require("os");
const nodeDebugAdapter_1 = require("./nodeDebugAdapter");
vscode_chrome_debug_core_1.ChromeDebugSession.run(vscode_chrome_debug_core_1.ChromeDebugSession.getSession({
    logFilePath: path.join(os.tmpdir(), 'vscode-node-debug2.txt'),
    adapter: nodeDebugAdapter_1.NodeDebugAdapter,
    extensionName: 'node-debug2'
}));
/* tslint:disable:no-var-requires */
const debugAdapterVersion = require('../../package.json').version;
vscode_chrome_debug_core_1.logger.log('node-debug2: ' + debugAdapterVersion);
/* __GDPR__FRAGMENT__
   "DebugCommonProperties" : {
      "Versions.DebugAdapter" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
   }
 */
vscode_chrome_debug_core_1.telemetry.telemetry.addCustomGlobalProperty({ 'Versions.DebugAdapter': debugAdapterVersion });

//# sourceMappingURL=nodeDebug.js.map
