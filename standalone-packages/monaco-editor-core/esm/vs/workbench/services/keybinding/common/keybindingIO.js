/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { KeybindingParser } from '../../../../base/common/keybindingParser';
var KeybindingIO = /** @class */ (function () {
    function KeybindingIO() {
    }
    KeybindingIO.writeKeybindingItem = function (out, item, OS) {
        var quotedSerializedKeybinding = JSON.stringify(item.resolvedKeybinding.getUserSettingsLabel());
        out.write("{ \"key\": " + rightPaddedString(quotedSerializedKeybinding + ',', 25) + " \"command\": ");
        var quotedSerializedWhen = item.when ? JSON.stringify(item.when.serialize()) : '';
        var quotedSerializeCommand = JSON.stringify(item.command);
        if (quotedSerializedWhen.length > 0) {
            out.write(quotedSerializeCommand + ",");
            out.writeLine();
            out.write("                                     \"when\": " + quotedSerializedWhen + " ");
        }
        else {
            out.write(quotedSerializeCommand + " ");
        }
        // out.write(String(item.weight1 + '-' + item.weight2));
        out.write('}');
    };
    KeybindingIO.readUserKeybindingItem = function (input, OS) {
        var _a = (typeof input.key === 'string' ? KeybindingParser.parseUserBinding(input.key) : [null, null]), firstPart = _a[0], chordPart = _a[1];
        var when = (typeof input.when === 'string' ? ContextKeyExpr.deserialize(input.when) : null);
        var command = (typeof input.command === 'string' ? input.command : null);
        var commandArgs = (typeof input.args !== 'undefined' ? input.args : undefined);
        return {
            firstPart: firstPart,
            chordPart: chordPart,
            command: command,
            commandArgs: commandArgs,
            when: when
        };
    };
    return KeybindingIO;
}());
export { KeybindingIO };
function rightPaddedString(str, minChars) {
    if (str.length < minChars) {
        return str + (new Array(minChars - str.length).join(' '));
    }
    return str;
}
var OutputBuilder = /** @class */ (function () {
    function OutputBuilder() {
        this._lines = [];
        this._currentLine = '';
    }
    OutputBuilder.prototype.write = function (str) {
        this._currentLine += str;
    };
    OutputBuilder.prototype.writeLine = function (str) {
        if (str === void 0) { str = ''; }
        this._lines.push(this._currentLine + str);
        this._currentLine = '';
    };
    OutputBuilder.prototype.toString = function () {
        this.writeLine();
        return this._lines.join('\n');
    };
    return OutputBuilder;
}());
export { OutputBuilder };
