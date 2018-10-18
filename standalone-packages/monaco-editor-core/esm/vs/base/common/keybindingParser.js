/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { SimpleKeybinding, ChordKeybinding, KeyCodeUtils } from './keyCodes';
import { ScanCodeBinding, ScanCodeUtils } from './scanCode';
var KeybindingParser = /** @class */ (function () {
    function KeybindingParser() {
    }
    KeybindingParser._readModifiers = function (input) {
        input = input.toLowerCase().trim();
        var ctrl = false;
        var shift = false;
        var alt = false;
        var meta = false;
        var matchedModifier;
        do {
            matchedModifier = false;
            if (/^ctrl(\+|\-)/.test(input)) {
                ctrl = true;
                input = input.substr('ctrl-'.length);
                matchedModifier = true;
            }
            if (/^shift(\+|\-)/.test(input)) {
                shift = true;
                input = input.substr('shift-'.length);
                matchedModifier = true;
            }
            if (/^alt(\+|\-)/.test(input)) {
                alt = true;
                input = input.substr('alt-'.length);
                matchedModifier = true;
            }
            if (/^meta(\+|\-)/.test(input)) {
                meta = true;
                input = input.substr('meta-'.length);
                matchedModifier = true;
            }
            if (/^win(\+|\-)/.test(input)) {
                meta = true;
                input = input.substr('win-'.length);
                matchedModifier = true;
            }
            if (/^cmd(\+|\-)/.test(input)) {
                meta = true;
                input = input.substr('cmd-'.length);
                matchedModifier = true;
            }
        } while (matchedModifier);
        var key;
        var firstSpaceIdx = input.indexOf(' ');
        if (firstSpaceIdx > 0) {
            key = input.substring(0, firstSpaceIdx);
            input = input.substring(firstSpaceIdx);
        }
        else {
            key = input;
            input = '';
        }
        return {
            remains: input,
            ctrl: ctrl,
            shift: shift,
            alt: alt,
            meta: meta,
            key: key
        };
    };
    KeybindingParser.parseSimpleKeybinding = function (input) {
        var mods = this._readModifiers(input);
        var keyCode = KeyCodeUtils.fromUserSettings(mods.key);
        return [new SimpleKeybinding(mods.ctrl, mods.shift, mods.alt, mods.meta, keyCode), mods.remains];
    };
    KeybindingParser.parseKeybinding = function (input, OS) {
        if (!input) {
            return null;
        }
        var _a = this.parseSimpleKeybinding(input), firstPart = _a[0], remains = _a[1];
        var chordPart = null;
        if (remains.length > 0) {
            chordPart = this.parseSimpleKeybinding(remains)[0];
        }
        if (chordPart) {
            return new ChordKeybinding(firstPart, chordPart);
        }
        return firstPart;
    };
    KeybindingParser.parseSimpleUserBinding = function (input) {
        var mods = this._readModifiers(input);
        var scanCodeMatch = mods.key.match(/^\[([^\]]+)\]$/);
        if (scanCodeMatch) {
            var strScanCode = scanCodeMatch[1];
            var scanCode = ScanCodeUtils.lowerCaseToEnum(strScanCode);
            return [new ScanCodeBinding(mods.ctrl, mods.shift, mods.alt, mods.meta, scanCode), mods.remains];
        }
        var keyCode = KeyCodeUtils.fromUserSettings(mods.key);
        return [new SimpleKeybinding(mods.ctrl, mods.shift, mods.alt, mods.meta, keyCode), mods.remains];
    };
    KeybindingParser.parseUserBinding = function (input) {
        if (!input) {
            return [null, null];
        }
        var _a = this.parseSimpleUserBinding(input), firstPart = _a[0], remains = _a[1];
        var chordPart = null;
        if (remains.length > 0) {
            chordPart = this.parseSimpleUserBinding(remains)[0];
        }
        return [firstPart, chordPart];
    };
    return KeybindingParser;
}());
export { KeybindingParser };
