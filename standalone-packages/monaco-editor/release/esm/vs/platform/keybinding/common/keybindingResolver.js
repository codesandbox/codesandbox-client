/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { ContextKeyAndExpr } from '../../contextkey/common/contextkey.js';
import { CommandsRegistry } from '../../commands/common/commands.js';
var KeybindingResolver = /** @class */ (function () {
    function KeybindingResolver(defaultKeybindings, overrides) {
        this._defaultKeybindings = defaultKeybindings;
        this._defaultBoundCommands = new Map();
        for (var i = 0, len = defaultKeybindings.length; i < len; i++) {
            var command = defaultKeybindings[i].command;
            this._defaultBoundCommands.set(command, true);
        }
        this._map = new Map();
        this._lookupMap = new Map();
        this._keybindings = KeybindingResolver.combine(defaultKeybindings, overrides);
        for (var i = 0, len = this._keybindings.length; i < len; i++) {
            var k = this._keybindings[i];
            if (k.keypressFirstPart === null) {
                // unbound
                continue;
            }
            this._addKeyPress(k.keypressFirstPart, k);
        }
    }
    KeybindingResolver._isTargetedForRemoval = function (defaultKb, keypressFirstPart, keypressChordPart, command, when) {
        if (defaultKb.command !== command) {
            return false;
        }
        if (keypressFirstPart && defaultKb.keypressFirstPart !== keypressFirstPart) {
            return false;
        }
        if (keypressChordPart && defaultKb.keypressChordPart !== keypressChordPart) {
            return false;
        }
        if (when) {
            if (!defaultKb.when) {
                return false;
            }
            if (!when.equals(defaultKb.when)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Looks for rules containing -command in `overrides` and removes them directly from `defaults`.
     */
    KeybindingResolver.combine = function (defaults, rawOverrides) {
        defaults = defaults.slice(0);
        var overrides = [];
        for (var i = 0, len = rawOverrides.length; i < len; i++) {
            var override = rawOverrides[i];
            if (!override.command || override.command.length === 0 || override.command.charAt(0) !== '-') {
                overrides.push(override);
                continue;
            }
            var command = override.command.substr(1);
            var keypressFirstPart = override.keypressFirstPart;
            var keypressChordPart = override.keypressChordPart;
            var when = override.when;
            for (var j = defaults.length - 1; j >= 0; j--) {
                if (this._isTargetedForRemoval(defaults[j], keypressFirstPart, keypressChordPart, command, when)) {
                    defaults.splice(j, 1);
                }
            }
        }
        return defaults.concat(overrides);
    };
    KeybindingResolver.prototype._addKeyPress = function (keypress, item) {
        var conflicts = this._map.get(keypress);
        if (typeof conflicts === 'undefined') {
            // There is no conflict so far
            this._map.set(keypress, [item]);
            this._addToLookupMap(item);
            return;
        }
        for (var i = conflicts.length - 1; i >= 0; i--) {
            var conflict = conflicts[i];
            if (conflict.command === item.command) {
                continue;
            }
            var conflictIsChord = (conflict.keypressChordPart !== null);
            var itemIsChord = (item.keypressChordPart !== null);
            if (conflictIsChord && itemIsChord && conflict.keypressChordPart !== item.keypressChordPart) {
                // The conflict only shares the chord start with this command
                continue;
            }
            if (KeybindingResolver.whenIsEntirelyIncluded(conflict.when, item.when)) {
                // `item` completely overwrites `conflict`
                // Remove conflict from the lookupMap
                this._removeFromLookupMap(conflict);
            }
        }
        conflicts.push(item);
        this._addToLookupMap(item);
    };
    KeybindingResolver.prototype._addToLookupMap = function (item) {
        if (!item.command) {
            return;
        }
        var arr = this._lookupMap.get(item.command);
        if (typeof arr === 'undefined') {
            arr = [item];
            this._lookupMap.set(item.command, arr);
        }
        else {
            arr.push(item);
        }
    };
    KeybindingResolver.prototype._removeFromLookupMap = function (item) {
        var arr = this._lookupMap.get(item.command);
        if (typeof arr === 'undefined') {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Returns true if it is provable `a` implies `b`.
     * **Precondition**: Assumes `a` and `b` are normalized!
     */
    KeybindingResolver.whenIsEntirelyIncluded = function (a, b) {
        if (!b) {
            return true;
        }
        if (!a) {
            return false;
        }
        var aExpressions = ((a instanceof ContextKeyAndExpr) ? a.expr : [a]);
        var bExpressions = ((b instanceof ContextKeyAndExpr) ? b.expr : [b]);
        var aIndex = 0;
        for (var bIndex = 0; bIndex < bExpressions.length; bIndex++) {
            var bExpr = bExpressions[bIndex];
            var bExprMatched = false;
            while (!bExprMatched && aIndex < aExpressions.length) {
                var aExpr = aExpressions[aIndex];
                if (aExpr.equals(bExpr)) {
                    bExprMatched = true;
                }
                aIndex++;
            }
            if (!bExprMatched) {
                return false;
            }
        }
        return true;
    };
    KeybindingResolver.prototype.getDefaultBoundCommands = function () {
        return this._defaultBoundCommands;
    };
    KeybindingResolver.prototype.getDefaultKeybindings = function () {
        return this._defaultKeybindings;
    };
    KeybindingResolver.prototype.getKeybindings = function () {
        return this._keybindings;
    };
    KeybindingResolver.prototype.lookupKeybindings = function (commandId) {
        var items = this._lookupMap.get(commandId);
        if (typeof items === 'undefined' || items.length === 0) {
            return [];
        }
        // Reverse to get the most specific item first
        var result = [], resultLen = 0;
        for (var i = items.length - 1; i >= 0; i--) {
            result[resultLen++] = items[i];
        }
        return result;
    };
    KeybindingResolver.prototype.lookupPrimaryKeybinding = function (commandId) {
        var items = this._lookupMap.get(commandId);
        if (typeof items === 'undefined' || items.length === 0) {
            return null;
        }
        return items[items.length - 1];
    };
    KeybindingResolver.prototype.resolve = function (context, currentChord, keypress) {
        var lookupMap = null;
        if (currentChord !== null) {
            // Fetch all chord bindings for `currentChord`
            var candidates = this._map.get(currentChord);
            if (typeof candidates === 'undefined') {
                // No chords starting with `currentChord`
                return null;
            }
            lookupMap = [];
            for (var i = 0, len = candidates.length; i < len; i++) {
                var candidate = candidates[i];
                if (candidate.keypressChordPart === keypress) {
                    lookupMap.push(candidate);
                }
            }
        }
        else {
            var candidates = this._map.get(keypress);
            if (typeof candidates === 'undefined') {
                // No bindings with `keypress`
                return null;
            }
            lookupMap = candidates;
        }
        var result = this._findCommand(context, lookupMap);
        if (!result) {
            return null;
        }
        if (currentChord === null && result.keypressChordPart !== null) {
            return {
                enterChord: true,
                commandId: null,
                commandArgs: null,
                bubble: false
            };
        }
        return {
            enterChord: false,
            commandId: result.command,
            commandArgs: result.commandArgs,
            bubble: result.bubble
        };
    };
    KeybindingResolver.prototype._findCommand = function (context, matches) {
        for (var i = matches.length - 1; i >= 0; i--) {
            var k = matches[i];
            if (!KeybindingResolver.contextMatchesRules(context, k.when)) {
                continue;
            }
            return k;
        }
        return null;
    };
    KeybindingResolver.contextMatchesRules = function (context, rules) {
        if (!rules) {
            return true;
        }
        return rules.evaluate(context);
    };
    KeybindingResolver.getAllUnboundCommands = function (boundCommands) {
        var commands = CommandsRegistry.getCommands();
        var unboundCommands = [];
        for (var id in commands) {
            if (id[0] === '_' || id.indexOf('vscode.') === 0) { // private command
                continue;
            }
            if (typeof commands[id].description === 'object'
                && !isFalsyOrEmpty(commands[id].description.args)) { // command with args
                continue;
            }
            if (boundCommands.get(id) === true) {
                continue;
            }
            unboundCommands.push(id);
        }
        return unboundCommands;
    };
    return KeybindingResolver;
}());
export { KeybindingResolver };
