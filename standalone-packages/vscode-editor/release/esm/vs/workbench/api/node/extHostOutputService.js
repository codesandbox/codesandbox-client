/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { MainContext } from './extHost.protocol.js';
import { URI } from '../../../base/common/uri.js';
import { posix } from '../../../../path.js';
import { OutputAppender } from '../../../platform/output/node/outputAppender.js';
import { toLocalISOString } from '../../../base/common/date.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, dispose } from '../../../base/common/lifecycle.js';
var AbstractExtHostOutputChannel = /** @class */ (function (_super) {
    __extends(AbstractExtHostOutputChannel, _super);
    function AbstractExtHostOutputChannel(name, log, file, proxy) {
        var _this = _super.call(this) || this;
        _this._onDidAppend = _this._register(new Emitter());
        _this.onDidAppend = _this._onDidAppend.event;
        _this._name = name;
        _this._proxy = proxy;
        _this._id = proxy.$register(_this.name, log, file);
        _this._offset = 0;
        return _this;
    }
    Object.defineProperty(AbstractExtHostOutputChannel.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    AbstractExtHostOutputChannel.prototype.append = function (value) {
        this.validate();
        this._offset += value ? Buffer.from(value).byteLength : 0;
    };
    AbstractExtHostOutputChannel.prototype.update = function () {
        var _this = this;
        this._id.then(function (id) { return _this._proxy.$update(id); });
    };
    AbstractExtHostOutputChannel.prototype.appendLine = function (value) {
        this.validate();
        this.append(value + '\n');
    };
    AbstractExtHostOutputChannel.prototype.clear = function () {
        var _this = this;
        this.validate();
        var till = this._offset;
        this._id.then(function (id) { return _this._proxy.$clear(id, till); });
    };
    AbstractExtHostOutputChannel.prototype.show = function (columnOrPreserveFocus, preserveFocus) {
        var _this = this;
        this.validate();
        this._id.then(function (id) { return _this._proxy.$reveal(id, typeof columnOrPreserveFocus === 'boolean' ? columnOrPreserveFocus : preserveFocus); });
    };
    AbstractExtHostOutputChannel.prototype.hide = function () {
        var _this = this;
        this.validate();
        this._id.then(function (id) { return _this._proxy.$close(id); });
    };
    AbstractExtHostOutputChannel.prototype.validate = function () {
        if (this._disposed) {
            throw new Error('Channel has been closed');
        }
    };
    AbstractExtHostOutputChannel.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        if (!this._disposed) {
            this._id
                .then(function (id) { return _this._proxy.$dispose(id); })
                .then(function () { return _this._disposed = true; });
        }
    };
    return AbstractExtHostOutputChannel;
}(Disposable));
export { AbstractExtHostOutputChannel };
var ExtHostPushOutputChannel = /** @class */ (function (_super) {
    __extends(ExtHostPushOutputChannel, _super);
    function ExtHostPushOutputChannel(name, proxy) {
        return _super.call(this, name, false, null, proxy) || this;
    }
    ExtHostPushOutputChannel.prototype.append = function (value) {
        var _this = this;
        _super.prototype.append.call(this, value);
        this._id.then(function (id) { return _this._proxy.$append(id, value); });
        this._onDidAppend.fire();
    };
    return ExtHostPushOutputChannel;
}(AbstractExtHostOutputChannel));
export { ExtHostPushOutputChannel };
var ExtHostOutputChannelBackedByFile = /** @class */ (function (_super) {
    __extends(ExtHostOutputChannelBackedByFile, _super);
    function ExtHostOutputChannelBackedByFile(name, outputDir, proxy) {
        var _this = this;
        var fileName = ExtHostOutputChannelBackedByFile._namePool++ + "-" + name;
        var file = URI.file(posix.join(outputDir, fileName + ".log"));
        _this = _super.call(this, name, false, file, proxy) || this;
        _this._appender = new OutputAppender(fileName, file.fsPath);
        return _this;
    }
    ExtHostOutputChannelBackedByFile.prototype.append = function (value) {
        _super.prototype.append.call(this, value);
        this._appender.append(value);
        this._onDidAppend.fire();
    };
    ExtHostOutputChannelBackedByFile.prototype.update = function () {
        this._appender.flush();
        _super.prototype.update.call(this);
    };
    ExtHostOutputChannelBackedByFile.prototype.show = function (columnOrPreserveFocus, preserveFocus) {
        this._appender.flush();
        _super.prototype.show.call(this, columnOrPreserveFocus, preserveFocus);
    };
    ExtHostOutputChannelBackedByFile.prototype.clear = function () {
        this._appender.flush();
        _super.prototype.clear.call(this);
    };
    ExtHostOutputChannelBackedByFile._namePool = 1;
    return ExtHostOutputChannelBackedByFile;
}(AbstractExtHostOutputChannel));
export { ExtHostOutputChannelBackedByFile };
var ExtHostLogFileOutputChannel = /** @class */ (function (_super) {
    __extends(ExtHostLogFileOutputChannel, _super);
    function ExtHostLogFileOutputChannel(name, file, proxy) {
        return _super.call(this, name, true, file, proxy) || this;
    }
    ExtHostLogFileOutputChannel.prototype.append = function (value) {
        throw new Error('Not supported');
    };
    return ExtHostLogFileOutputChannel;
}(AbstractExtHostOutputChannel));
export { ExtHostLogFileOutputChannel };
var ExtHostOutputService = /** @class */ (function () {
    function ExtHostOutputService(logsLocation, mainContext) {
        this._channels = new Map();
        this._outputDir = posix.join(logsLocation.fsPath, "output_logging_" + toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, ''));
        this._proxy = mainContext.getProxy(MainContext.MainThreadOutputService);
    }
    ExtHostOutputService.prototype.$setVisibleChannel = function (channelId) {
        if (this._visibleChannelDisposable) {
            this._visibleChannelDisposable = dispose(this._visibleChannelDisposable);
        }
        if (channelId) {
            var channel_1 = this._channels.get(channelId);
            if (channel_1) {
                this._visibleChannelDisposable = channel_1.onDidAppend(function () { return channel_1.update(); });
            }
        }
    };
    ExtHostOutputService.prototype.createOutputChannel = function (name) {
        var _this = this;
        var channel = this._createOutputChannel(name);
        channel._id.then(function (id) { return _this._channels.set(id, channel); });
        return channel;
    };
    ExtHostOutputService.prototype._createOutputChannel = function (name) {
        name = name.trim();
        if (!name) {
            throw new Error('illegal argument `name`. must not be falsy');
        }
        else {
            // Do not crash if logger cannot be created
            try {
                return new ExtHostOutputChannelBackedByFile(name, this._outputDir, this._proxy);
            }
            catch (error) {
                console.log(error);
                return new ExtHostPushOutputChannel(name, this._proxy);
            }
        }
    };
    ExtHostOutputService.prototype.createOutputChannelFromLogFile = function (name, file) {
        name = name.trim();
        if (!name) {
            throw new Error('illegal argument `name`. must not be falsy');
        }
        if (!file) {
            throw new Error('illegal argument `file`. must not be falsy');
        }
        return new ExtHostLogFileOutputChannel(name, file, this._proxy);
    };
    return ExtHostOutputService;
}());
export { ExtHostOutputService };
