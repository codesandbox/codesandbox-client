/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './keybindingLabel.css';
import { equals } from '../../../common/objects.js';
import { UILabelProvider } from '../../../common/keybindingLabels.js';
import * as dom from '../../dom.js';
var $ = dom.$;
var KeybindingLabel = /** @class */ (function () {
    function KeybindingLabel(container, os) {
        this.os = os;
        this.domNode = dom.append(container, $('.monaco-keybinding'));
        this.didEverRender = false;
        container.appendChild(this.domNode);
    }
    Object.defineProperty(KeybindingLabel.prototype, "element", {
        get: function () {
            return this.domNode;
        },
        enumerable: true,
        configurable: true
    });
    KeybindingLabel.prototype.set = function (keybinding, matches) {
        if (this.didEverRender && this.keybinding === keybinding && KeybindingLabel.areSame(this.matches, matches)) {
            return;
        }
        this.keybinding = keybinding;
        this.matches = matches;
        this.render();
    };
    KeybindingLabel.prototype.render = function () {
        dom.clearNode(this.domNode);
        if (this.keybinding) {
            var _a = this.keybinding.getParts(), firstPart = _a[0], chordPart = _a[1];
            if (firstPart) {
                this.renderPart(this.domNode, firstPart, this.matches ? this.matches.firstPart : null);
            }
            if (chordPart) {
                dom.append(this.domNode, $('span.monaco-keybinding-key-chord-separator', null, ' '));
                this.renderPart(this.domNode, chordPart, this.matches ? this.matches.chordPart : null);
            }
            this.domNode.title = this.keybinding.getAriaLabel();
        }
        this.didEverRender = true;
    };
    KeybindingLabel.prototype.renderPart = function (parent, part, match) {
        var modifierLabels = UILabelProvider.modifierLabels[this.os];
        if (part.ctrlKey) {
            this.renderKey(parent, modifierLabels.ctrlKey, match && match.ctrlKey, modifierLabels.separator);
        }
        if (part.shiftKey) {
            this.renderKey(parent, modifierLabels.shiftKey, match && match.shiftKey, modifierLabels.separator);
        }
        if (part.altKey) {
            this.renderKey(parent, modifierLabels.altKey, match && match.altKey, modifierLabels.separator);
        }
        if (part.metaKey) {
            this.renderKey(parent, modifierLabels.metaKey, match && match.metaKey, modifierLabels.separator);
        }
        var keyLabel = part.keyLabel;
        if (keyLabel) {
            this.renderKey(parent, keyLabel, match && match.keyCode, '');
        }
    };
    KeybindingLabel.prototype.renderKey = function (parent, label, highlight, separator) {
        dom.append(parent, $('span.monaco-keybinding-key' + (highlight ? '.highlight' : ''), null, label));
        if (separator) {
            dom.append(parent, $('span.monaco-keybinding-key-separator', null, separator));
        }
    };
    KeybindingLabel.prototype.dispose = function () {
        this.keybinding = null;
    };
    KeybindingLabel.areSame = function (a, b) {
        if (a === b || (!a && !b)) {
            return true;
        }
        return !!a && !!b && equals(a.firstPart, b.firstPart) && equals(a.chordPart, b.chordPart);
    };
    return KeybindingLabel;
}());
export { KeybindingLabel };
