/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from '../../../../base/common/event';
import { Registry } from '../../../../platform/registry/common/platform';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey';
/**
 * Mime type used by the output editor.
 */
export var OUTPUT_MIME = 'text/x-code-output';
/**
 * Output resource scheme.
 */
export var OUTPUT_SCHEME = 'output';
/**
 * Id used by the output editor.
 */
export var OUTPUT_MODE_ID = 'Log';
/**
 * Mime type used by the log output editor.
 */
export var LOG_MIME = 'text/x-code-log-output';
/**
 * Log resource scheme.
 */
export var LOG_SCHEME = 'log';
/**
 * Id used by the log output editor.
 */
export var LOG_MODE_ID = 'log';
/**
 * Output panel id
 */
export var OUTPUT_PANEL_ID = 'workbench.panel.output';
export var Extensions = {
    OutputChannels: 'workbench.contributions.outputChannels'
};
export var OUTPUT_SERVICE_ID = 'outputService';
export var MAX_OUTPUT_LENGTH = 10000 /* Max. number of output lines to show in output */ * 100 /* Guestimated chars per line */;
export var CONTEXT_IN_OUTPUT = new RawContextKey('inOutput', false);
export var CONTEXT_ACTIVE_LOG_OUTPUT = new RawContextKey('activeLogOutput', false);
export var IOutputService = createDecorator(OUTPUT_SERVICE_ID);
var OutputChannelRegistry = /** @class */ (function () {
    function OutputChannelRegistry() {
        this.channels = new Map();
        this._onDidRegisterChannel = new Emitter();
        this.onDidRegisterChannel = this._onDidRegisterChannel.event;
        this._onDidRemoveChannel = new Emitter();
        this.onDidRemoveChannel = this._onDidRemoveChannel.event;
    }
    OutputChannelRegistry.prototype.registerChannel = function (descriptor) {
        if (!this.channels.has(descriptor.id)) {
            this.channels.set(descriptor.id, descriptor);
            this._onDidRegisterChannel.fire(descriptor.id);
        }
    };
    OutputChannelRegistry.prototype.getChannels = function () {
        var result = [];
        this.channels.forEach(function (value) { return result.push(value); });
        return result;
    };
    OutputChannelRegistry.prototype.getChannel = function (id) {
        return this.channels.get(id);
    };
    OutputChannelRegistry.prototype.removeChannel = function (id) {
        this.channels.delete(id);
        this._onDidRemoveChannel.fire(id);
    };
    return OutputChannelRegistry;
}());
Registry.add(Extensions.OutputChannels, new OutputChannelRegistry());
