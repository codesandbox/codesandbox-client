/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from '../../../../base/common/event';
import { localize } from '../../../../nls';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
import { Registry } from '../../../../platform/registry/common/platform';
export var IBreadcrumbsService = createDecorator('IEditorBreadcrumbsService');
var BreadcrumbsService = /** @class */ (function () {
    function BreadcrumbsService() {
        this._map = new Map();
    }
    BreadcrumbsService.prototype.register = function (group, widget) {
        var _this = this;
        if (this._map.has(group)) {
            throw new Error("group (" + group + ") has already a widget");
        }
        this._map.set(group, widget);
        return {
            dispose: function () { return _this._map.delete(group); }
        };
    };
    BreadcrumbsService.prototype.getWidget = function (group) {
        return this._map.get(group);
    };
    return BreadcrumbsService;
}());
export { BreadcrumbsService };
registerSingleton(IBreadcrumbsService, BreadcrumbsService);
//#region config
var BreadcrumbsConfig = /** @class */ (function () {
    function BreadcrumbsConfig() {
        // internal
    }
    BreadcrumbsConfig._stub = function (name) {
        return {
            bindTo: function (service) {
                var onDidChange = new Emitter();
                var listener = service.onDidChangeConfiguration(function (e) {
                    if (e.affectsConfiguration(name)) {
                        onDidChange.fire(undefined);
                    }
                });
                return new /** @class */ (function () {
                    function class_1() {
                        this.name = name;
                        this.onDidChange = onDidChange.event;
                    }
                    class_1.prototype.getValue = function (overrides) {
                        return service.getValue(name, overrides);
                    };
                    class_1.prototype.updateValue = function (newValue, overrides) {
                        return service.updateValue(name, newValue, overrides);
                    };
                    class_1.prototype.dispose = function () {
                        listener.dispose();
                        onDidChange.dispose();
                    };
                    return class_1;
                }());
            }
        };
    };
    BreadcrumbsConfig.IsEnabled = BreadcrumbsConfig._stub('breadcrumbs.enabled');
    BreadcrumbsConfig.UseQuickPick = BreadcrumbsConfig._stub('breadcrumbs.useQuickPick');
    BreadcrumbsConfig.FilePath = BreadcrumbsConfig._stub('breadcrumbs.filePath');
    BreadcrumbsConfig.SymbolPath = BreadcrumbsConfig._stub('breadcrumbs.symbolPath');
    BreadcrumbsConfig.FilterOnType = BreadcrumbsConfig._stub('breadcrumbs.filterOnType');
    BreadcrumbsConfig.FileExcludes = BreadcrumbsConfig._stub('files.exclude');
    return BreadcrumbsConfig;
}());
export { BreadcrumbsConfig };
Registry.as(Extensions.Configuration).registerConfiguration({
    id: 'breadcrumbs',
    title: localize('title', "Breadcrumb Navigation"),
    order: 101,
    type: 'object',
    properties: {
        'breadcrumbs.enabled': {
            description: localize('enabled', "Enable/disable navigation breadcrumbs"),
            type: 'boolean',
            default: false
        },
        // 'breadcrumbs.useQuickPick': {
        // 	description: localize('useQuickPick', "Use quick pick instead of breadcrumb-pickers."),
        // 	type: 'boolean',
        // 	default: false
        // },
        'breadcrumbs.filePath': {
            description: localize('filepath', "Controls whether and how file paths are shown in the breadcrumbs view."),
            type: 'string',
            default: 'on',
            enum: ['on', 'off', 'last'],
            enumDescriptions: [
                localize('filepath.on', "Show the file path in the breadcrumbs view."),
                localize('filepath.off', "Do not show the file path in the breadcrumbs view."),
                localize('filepath.last', "Only show the last element of the file path in the breadcrumbs view."),
            ]
        },
        'breadcrumbs.symbolPath': {
            description: localize('symbolpath', "Controls whether and how symbols are shown in the breadcrumbs view."),
            type: 'string',
            default: 'on',
            enum: ['on', 'off', 'last'],
            enumDescriptions: [
                localize('symbolpath.on', "Show all symbols in the breadcrumbs view."),
                localize('symbolpath.off', "Do not show symbols in the breadcrumbs view."),
                localize('symbolpath.last', "Only show the current symbol in the breadcrumbs view."),
            ]
        },
    }
});
