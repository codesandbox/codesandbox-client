/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../base/common/winjs.base';
import { Registry } from '../../platform/registry/common/platform';
import { KeybindingsRegistry } from '../../platform/keybinding/common/keybindingsRegistry';
import { CommandsRegistry } from '../../platform/commands/common/commands';
import { MenuRegistry, MenuId } from '../../platform/actions/common/actions';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation';
import { combinedDisposable } from '../../base/common/lifecycle';
import { ILifecycleService } from '../../platform/lifecycle/common/lifecycle';
import { INotificationService } from '../../platform/notification/common/notification';
export var Extensions = {
    WorkbenchActions: 'workbench.contributions.actions'
};
Registry.add(Extensions.WorkbenchActions, new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.registerWorkbenchAction = function (descriptor, alias, category, when) {
        return this._registerWorkbenchCommandFromAction(descriptor, alias, category, when);
    };
    class_1.prototype._registerWorkbenchCommandFromAction = function (descriptor, alias, category, when) {
        var registrations = [];
        // command
        registrations.push(CommandsRegistry.registerCommand(descriptor.id, this._createCommandHandler(descriptor)));
        // keybinding
        var weight = (typeof descriptor.keybindingWeight === 'undefined' ? 200 /* WorkbenchContrib */ : descriptor.keybindingWeight);
        var keybindings = descriptor.keybindings;
        KeybindingsRegistry.registerKeybindingRule({
            id: descriptor.id,
            weight: weight,
            when: descriptor.keybindingContext,
            primary: keybindings && keybindings.primary,
            secondary: keybindings && keybindings.secondary,
            win: keybindings && keybindings.win,
            mac: keybindings && keybindings.mac,
            linux: keybindings && keybindings.linux
        });
        // menu item
        // TODO@Rob slightly weird if-check required because of
        // https://github.com/Microsoft/vscode/blob/master/src/vs/workbench/parts/search/electron-browser/search.contribution.ts#L266
        if (descriptor.label) {
            var idx = alias.indexOf(': ');
            var categoryOriginal = void 0;
            if (idx > 0) {
                categoryOriginal = alias.substr(0, idx);
                alias = alias.substr(idx + 2);
            }
            var command = {
                id: descriptor.id,
                title: { value: descriptor.label, original: alias },
                category: category && { value: category, original: categoryOriginal }
            };
            MenuRegistry.addCommand(command);
            registrations.push(MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: command, when: when }));
        }
        // TODO@alex,joh
        // support removal of keybinding rule
        // support removal of command-ui
        return combinedDisposable(registrations);
    };
    class_1.prototype._createCommandHandler = function (descriptor) {
        var _this = this;
        return function (accessor, args) {
            var notificationService = accessor.get(INotificationService);
            var instantiationService = accessor.get(IInstantiationService);
            var lifecycleService = accessor.get(ILifecycleService);
            TPromise.as(_this._triggerAndDisposeAction(instantiationService, lifecycleService, descriptor, args)).then(null, function (err) {
                notificationService.error(err);
            });
        };
    };
    class_1.prototype._triggerAndDisposeAction = function (instantiationService, lifecycleService, descriptor, args) {
        // run action when workbench is created
        return lifecycleService.when(3 /* Running */).then(function () {
            var actionInstance = instantiationService.createInstance(descriptor.syncDescriptor);
            try {
                actionInstance.label = descriptor.label || actionInstance.label;
                // don't run the action when not enabled
                if (!actionInstance.enabled) {
                    actionInstance.dispose();
                    return void 0;
                }
                var from = args && args.from || 'keybinding';
                return TPromise.as(actionInstance.run(undefined, { from: from })).then(function () {
                    actionInstance.dispose();
                }, function (err) {
                    actionInstance.dispose();
                    return TPromise.wrapError(err);
                });
            }
            catch (err) {
                actionInstance.dispose();
                return TPromise.wrapError(err);
            }
        });
    };
    return class_1;
}()));
