/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import * as platform from '../../registry/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
export var IThemeService = createDecorator('themeService');
export function themeColorFromId(id) {
    return { id: id };
}
export var FileThemeIcon = { id: 'file' };
export var FolderThemeIcon = { id: 'folder' };
// base themes
export var DARK = 'dark';
export var LIGHT = 'light';
export var HIGH_CONTRAST = 'hc';
export function getThemeTypeSelector(type) {
    switch (type) {
        case DARK: return 'vs-dark';
        case HIGH_CONTRAST: return 'hc-black';
        default: return 'vs';
    }
}
// static theming participant
export var Extensions = {
    ThemingContribution: 'base.contributions.theming'
};
var ThemingRegistry = /** @class */ (function () {
    function ThemingRegistry() {
        this.themingParticipants = [];
        this.themingParticipants = [];
        this.onThemingParticipantAddedEmitter = new Emitter();
    }
    ThemingRegistry.prototype.onThemeChange = function (participant) {
        var _this = this;
        this.themingParticipants.push(participant);
        this.onThemingParticipantAddedEmitter.fire(participant);
        return {
            dispose: function () {
                var idx = _this.themingParticipants.indexOf(participant);
                _this.themingParticipants.splice(idx, 1);
            }
        };
    };
    Object.defineProperty(ThemingRegistry.prototype, "onThemingParticipantAdded", {
        get: function () {
            return this.onThemingParticipantAddedEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    ThemingRegistry.prototype.getThemingParticipants = function () {
        return this.themingParticipants;
    };
    return ThemingRegistry;
}());
var themingRegistry = new ThemingRegistry();
platform.Registry.add(Extensions.ThemingContribution, themingRegistry);
export function registerThemingParticipant(participant) {
    return themingRegistry.onThemeChange(participant);
}
