/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as http from '../../../http.js';
import * as https from '../../../https.js';
import * as nodeurl from '../../../url.js';
import { assign } from '../../base/common/objects.js';
import { ProxyAgent } from '../../../vscode-proxy-agent.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { URI } from '../../base/common/uri.js';
export function connectProxyResolver(extHostWorkspace, extHostConfiguration, extensionService, extHostLogService, mainThreadTelemetry) {
    var agent = createProxyAgent(extHostWorkspace, extHostLogService, mainThreadTelemetry);
    var lookup = createPatchedModules(extHostConfiguration, agent);
    return configureModuleLoading(extensionService, lookup);
}
function createProxyAgent(extHostWorkspace, extHostLogService, mainThreadTelemetry) {
    var timeout;
    var count = 0;
    var duration = 0;
    var errorCount = 0;
    function logEvent() {
        timeout = undefined;
        /* __GDPR__
            "resolveProxy" : {
                "count": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                "duration": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                "errorCount": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
            }
        */
        mainThreadTelemetry.$publicLog('resolveProxy', { count: count, duration: duration, errorCount: errorCount });
        count = duration = errorCount = 0;
    }
    function resolveProxy(url, callback) {
        if (!timeout) {
            timeout = setTimeout(logEvent, 10 * 60 * 1000);
        }
        var start = Date.now();
        extHostWorkspace.resolveProxy(url)
            .then(function (proxy) {
            callback(proxy);
        }).then(function () {
            count++;
            duration = Date.now() - start + duration;
        }, function (err) {
            errorCount++;
            extHostLogService.error('resolveProxy', toErrorMessage(err));
            callback();
        });
    }
    return new ProxyAgent({ resolveProxy: resolveProxy });
}
function createPatchedModules(extHostConfiguration, agent) {
    var setting = {
        config: extHostConfiguration.getConfiguration('http')
            .get('systemProxy') || 'off'
    };
    extHostConfiguration.onDidChangeConfiguration(function (e) {
        setting.config = extHostConfiguration.getConfiguration('http')
            .get('systemProxy') || 'off';
    });
    return {
        http: {
            off: assign({}, http, patches(http, agent, { config: 'off' }, true)),
            on: assign({}, http, patches(http, agent, { config: 'on' }, true)),
            force: assign({}, http, patches(http, agent, { config: 'force' }, true)),
            onRequest: assign({}, http, patches(http, agent, setting, true)),
            default: assign(http, patches(http, agent, setting, false)) // run last
        },
        https: {
            off: assign({}, https, patches(https, agent, { config: 'off' }, true)),
            on: assign({}, https, patches(https, agent, { config: 'on' }, true)),
            force: assign({}, https, patches(https, agent, { config: 'force' }, true)),
            onRequest: assign({}, https, patches(https, agent, setting, true)),
            default: assign(https, patches(https, agent, setting, false)) // run last
        }
    };
}
function patches(originals, agent, setting, onRequest) {
    return {
        get: patch(originals.get),
        request: patch(originals.request)
    };
    function patch(original) {
        function patched(url, options, callback) {
            if (typeof url !== 'string' && !(url && url.searchParams)) {
                callback = options;
                options = url;
                url = null;
            }
            if (typeof options === 'function') {
                callback = options;
                options = null;
            }
            options = options || {};
            var config = onRequest && options._vscodeSystemProxy || setting.config;
            if (config === 'off') {
                return original.apply(null, arguments);
            }
            if (!options.socketPath && (config === 'force' || config === 'on' && !options.agent)) {
                if (url) {
                    var parsed = typeof url === 'string' ? nodeurl.parse(url) : url;
                    options = __assign({ protocol: parsed.protocol, hostname: parsed.hostname, port: parsed.port, path: parsed.pathname }, options);
                }
                options.agent = agent;
                return original(options, callback);
            }
            return original.apply(null, arguments);
        }
        return patched;
    }
}
function configureModuleLoading(extensionService, lookup) {
    return extensionService.getExtensionPathIndex()
        .then(function (extensionPaths) {
        var node_module = require.__$__nodeRequire('module');
        var original = node_module._load;
        node_module._load = function load(request, parent, isMain) {
            if (request !== 'http' && request !== 'https') {
                return original.apply(this, arguments);
            }
            var modules = lookup[request];
            var ext = extensionPaths.findSubstr(URI.file(parent.filename).fsPath);
            if (ext && ext.enableProposedApi) {
                return modules[ext.systemProxy] || modules.onRequest;
            }
            return modules.default;
        };
    });
}
