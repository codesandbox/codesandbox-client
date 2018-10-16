/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createKeybinding } from '../../../base/common/keyCodes';
import { OS } from '../../../base/common/platform';
import { CommandsRegistry } from '../../commands/common/commands';
import { Registry } from '../../registry/common/platform';
var KeybindingsRegistryImpl = /** @class */ (function () {
    function KeybindingsRegistryImpl() {
        this._keybindings = [];
        this._keybindingsSorted = true;
    }
    /**
     * Take current platform into account and reduce to primary & secondary.
     */
    KeybindingsRegistryImpl.bindToCurrentPlatform = function (kb) {
        if (OS === 1 /* Windows */) {
            if (kb && kb.win) {
                return kb.win;
            }
        }
        else if (OS === 2 /* Macintosh */) {
            if (kb && kb.mac) {
                return kb.mac;
            }
        }
        else {
            if (kb && kb.linux) {
                return kb.linux;
            }
        }
        return kb;
    };
    /**
     * Take current platform into account and reduce to primary & secondary.
     */
    KeybindingsRegistryImpl.bindToCurrentPlatform2 = function (kb) {
        if (OS === 1 /* Windows */) {
            if (kb && kb.win) {
                return kb.win;
            }
        }
        else if (OS === 2 /* Macintosh */) {
            if (kb && kb.mac) {
                return kb.mac;
            }
        }
        else {
            if (kb && kb.linux) {
                return kb.linux;
            }
        }
        return kb;
    };
    KeybindingsRegistryImpl.prototype.registerKeybindingRule = function (rule, source) {
        if (source === void 0) { source = 0 /* Core */; }
        var actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform(rule);
        if (actualKb && actualKb.primary) {
            this._registerDefaultKeybinding(createKeybinding(actualKb.primary, OS), rule.id, rule.weight, 0, rule.when, source);
        }
        if (actualKb && Array.isArray(actualKb.secondary)) {
            for (var i = 0, len = actualKb.secondary.length; i < len; i++) {
                var k = actualKb.secondary[i];
                this._registerDefaultKeybinding(createKeybinding(k, OS), rule.id, rule.weight, -i - 1, rule.when, source);
            }
        }
    };
    KeybindingsRegistryImpl.prototype.registerKeybindingRule2 = function (rule, source) {
        if (source === void 0) { source = 0 /* Core */; }
        var actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform2(rule);
        if (actualKb && actualKb.primary) {
            this._registerDefaultKeybinding(actualKb.primary, rule.id, rule.weight, 0, rule.when, source);
        }
    };
    KeybindingsRegistryImpl.prototype.registerCommandAndKeybindingRule = function (desc, source) {
        if (source === void 0) { source = 0 /* Core */; }
        this.registerKeybindingRule(desc, source);
        CommandsRegistry.registerCommand(desc);
    };
    KeybindingsRegistryImpl._mightProduceChar = function (keyCode) {
        if (keyCode >= 21 /* KEY_0 */ && keyCode <= 30 /* KEY_9 */) {
            return true;
        }
        if (keyCode >= 31 /* KEY_A */ && keyCode <= 56 /* KEY_Z */) {
            return true;
        }
        return (keyCode === 80 /* US_SEMICOLON */
            || keyCode === 81 /* US_EQUAL */
            || keyCode === 82 /* US_COMMA */
            || keyCode === 83 /* US_MINUS */
            || keyCode === 84 /* US_DOT */
            || keyCode === 85 /* US_SLASH */
            || keyCode === 86 /* US_BACKTICK */
            || keyCode === 110 /* ABNT_C1 */
            || keyCode === 111 /* ABNT_C2 */
            || keyCode === 87 /* US_OPEN_SQUARE_BRACKET */
            || keyCode === 88 /* US_BACKSLASH */
            || keyCode === 89 /* US_CLOSE_SQUARE_BRACKET */
            || keyCode === 90 /* US_QUOTE */
            || keyCode === 91 /* OEM_8 */
            || keyCode === 92 /* OEM_102 */);
    };
    KeybindingsRegistryImpl.prototype._assertNoCtrlAlt = function (keybinding, commandId) {
        if (keybinding.ctrlKey && keybinding.altKey && !keybinding.metaKey) {
            if (KeybindingsRegistryImpl._mightProduceChar(keybinding.keyCode)) {
                console.warn('Ctrl+Alt+ keybindings should not be used by default under Windows. Offender: ', keybinding, ' for ', commandId);
            }
        }
    };
    KeybindingsRegistryImpl.prototype._registerDefaultKeybinding = function (keybinding, commandId, weight1, weight2, when, source) {
        if (source === 0 /* Core */ && OS === 1 /* Windows */) {
            if (keybinding.type === 2 /* Chord */) {
                this._assertNoCtrlAlt(keybinding.firstPart, commandId);
            }
            else {
                this._assertNoCtrlAlt(keybinding, commandId);
            }
        }
        this._keybindings.push({
            keybinding: keybinding,
            command: commandId,
            commandArgs: undefined,
            when: when,
            weight1: weight1,
            weight2: weight2
        });
        this._keybindingsSorted = false;
    };
    KeybindingsRegistryImpl.prototype.getDefaultKeybindings = function () {
        if (!this._keybindingsSorted) {
            this._keybindings.sort(sorter);
            this._keybindingsSorted = true;
        }
        return this._keybindings.slice(0);
    };
    return KeybindingsRegistryImpl;
}());
export var KeybindingsRegistry = new KeybindingsRegistryImpl();
// Define extension point ids
export var Extensions = {
    EditorModes: 'platform.keybindingsRegistry'
};
Registry.add(Extensions.EditorModes, KeybindingsRegistry);
function sorter(a, b) {
    if (a.weight1 !== b.weight1) {
        return a.weight1 - b.weight1;
    }
    if (a.command < b.command) {
        return -1;
    }
    if (a.command > b.command) {
        return 1;
    }
    return a.weight2 - b.weight2;
}
