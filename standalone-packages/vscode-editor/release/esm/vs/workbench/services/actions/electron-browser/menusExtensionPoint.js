/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { localize } from '../../../../nls.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import * as resources from '../../../../base/common/resources.js';
import { forEach } from '../../../../base/common/collections.js';
import { ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { MenuRegistry } from '../../../../platform/actions/common/actions.js';
var schema;
(function (schema) {
    // --- menus contribution point
    function parseMenuId(value) {
        switch (value) {
            case 'commandPalette': return 0 /* CommandPalette */;
            case 'touchBar': return 34 /* TouchBarContext */;
            case 'editor/title': return 7 /* EditorTitle */;
            case 'editor/context': return 6 /* EditorContext */;
            case 'explorer/context': return 10 /* ExplorerContext */;
            case 'editor/title/context': return 8 /* EditorTitleContext */;
            case 'debug/callstack/context': return 2 /* DebugCallStackContext */;
            case 'scm/title': return 32 /* SCMTitle */;
            case 'scm/sourceControl': return 31 /* SCMSourceControl */;
            case 'scm/resourceGroup/context': return 30 /* SCMResourceGroupContext */;
            case 'scm/resourceState/context': return 29 /* SCMResourceContext */;
            case 'scm/change/title': return 28 /* SCMChangeContext */;
            case 'view/title': return 36 /* ViewTitle */;
            case 'view/item/context': return 35 /* ViewItemContext */;
        }
        return void 0;
    }
    schema.parseMenuId = parseMenuId;
    function isValidMenuItems(menu, collector) {
        if (!Array.isArray(menu)) {
            collector.error(localize('requirearray', "menu items must be an array"));
            return false;
        }
        for (var _i = 0, menu_1 = menu; _i < menu_1.length; _i++) {
            var item = menu_1[_i];
            if (typeof item.command !== 'string') {
                collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
                return false;
            }
            if (item.alt && typeof item.alt !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'alt'));
                return false;
            }
            if (item.when && typeof item.when !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
                return false;
            }
            if (item.group && typeof item.group !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'group'));
                return false;
            }
        }
        return true;
    }
    schema.isValidMenuItems = isValidMenuItems;
    var menuItem = {
        type: 'object',
        properties: {
            command: {
                description: localize('vscode.extension.contributes.menuItem.command', 'Identifier of the command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            alt: {
                description: localize('vscode.extension.contributes.menuItem.alt', 'Identifier of an alternative command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            when: {
                description: localize('vscode.extension.contributes.menuItem.when', 'Condition which must be true to show this item'),
                type: 'string'
            },
            group: {
                description: localize('vscode.extension.contributes.menuItem.group', 'Group into which this command belongs'),
                type: 'string'
            }
        }
    };
    schema.menusContribtion = {
        description: localize('vscode.extension.contributes.menus', "Contributes menu items to the editor"),
        type: 'object',
        properties: {
            'commandPalette': {
                description: localize('menus.commandPalette', "The Command Palette"),
                type: 'array',
                items: menuItem
            },
            'touchBar': {
                description: localize('menus.touchBar', "The touch bar (macOS only)"),
                type: 'array',
                items: menuItem
            },
            'editor/title': {
                description: localize('menus.editorTitle', "The editor title menu"),
                type: 'array',
                items: menuItem
            },
            'editor/context': {
                description: localize('menus.editorContext', "The editor context menu"),
                type: 'array',
                items: menuItem
            },
            'explorer/context': {
                description: localize('menus.explorerContext', "The file explorer context menu"),
                type: 'array',
                items: menuItem
            },
            'editor/title/context': {
                description: localize('menus.editorTabContext', "The editor tabs context menu"),
                type: 'array',
                items: menuItem
            },
            'debug/callstack/context': {
                description: localize('menus.debugCallstackContext', "The debug callstack context menu"),
                type: 'array',
                items: menuItem
            },
            'scm/title': {
                description: localize('menus.scmTitle', "The Source Control title menu"),
                type: 'array',
                items: menuItem
            },
            'scm/sourceControl': {
                description: localize('menus.scmSourceControl', "The Source Control menu"),
                type: 'array',
                items: menuItem
            },
            'scm/resourceGroup/context': {
                description: localize('menus.resourceGroupContext', "The Source Control resource group context menu"),
                type: 'array',
                items: menuItem
            },
            'scm/resourceState/context': {
                description: localize('menus.resourceStateContext', "The Source Control resource state context menu"),
                type: 'array',
                items: menuItem
            },
            'view/title': {
                description: localize('view.viewTitle', "The contributed view title menu"),
                type: 'array',
                items: menuItem
            },
            'view/item/context': {
                description: localize('view.itemContext', "The contributed view item context menu"),
                type: 'array',
                items: menuItem
            }
        }
    };
    function isValidCommand(command, collector) {
        if (!command) {
            collector.error(localize('nonempty', "expected non-empty value."));
            return false;
        }
        if (isFalsyOrWhitespace(command.command)) {
            collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
            return false;
        }
        if (!isValidLocalizedString(command.title, collector, 'title')) {
            return false;
        }
        if (command.category && !isValidLocalizedString(command.category, collector, 'category')) {
            return false;
        }
        if (!isValidIcon(command.icon, collector)) {
            return false;
        }
        return true;
    }
    schema.isValidCommand = isValidCommand;
    function isValidIcon(icon, collector) {
        if (typeof icon === 'undefined') {
            return true;
        }
        if (typeof icon === 'string') {
            return true;
        }
        else if (typeof icon.dark === 'string' && typeof icon.light === 'string') {
            return true;
        }
        collector.error(localize('opticon', "property `icon` can be omitted or must be either a string or a literal like `{dark, light}`"));
        return false;
    }
    function isValidLocalizedString(localized, collector, propertyName) {
        if (typeof localized === 'undefined') {
            collector.error(localize('requireStringOrObject', "property `{0}` is mandatory and must be of type `string` or `object`", propertyName));
            return false;
        }
        else if (typeof localized === 'string' && isFalsyOrWhitespace(localized)) {
            collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", propertyName));
            return false;
        }
        else if (typeof localized !== 'string' && (isFalsyOrWhitespace(localized.original) || isFalsyOrWhitespace(localized.value))) {
            collector.error(localize('requirestrings', "properties `{0}` and `{1}` are mandatory and must be of type `string`", propertyName + ".value", propertyName + ".original"));
            return false;
        }
        return true;
    }
    var commandType = {
        type: 'object',
        properties: {
            command: {
                description: localize('vscode.extension.contributes.commandType.command', 'Identifier of the command to execute'),
                type: 'string'
            },
            title: {
                description: localize('vscode.extension.contributes.commandType.title', 'Title by which the command is represented in the UI'),
                type: 'string'
            },
            category: {
                description: localize('vscode.extension.contributes.commandType.category', '(Optional) Category string by the command is grouped in the UI'),
                type: 'string'
            },
            icon: {
                description: localize('vscode.extension.contributes.commandType.icon', '(Optional) Icon which is used to represent the command in the UI. Either a file path or a themable configuration'),
                anyOf: [{
                        type: 'string'
                    },
                    {
                        type: 'object',
                        properties: {
                            light: {
                                description: localize('vscode.extension.contributes.commandType.icon.light', 'Icon path when a light theme is used'),
                                type: 'string'
                            },
                            dark: {
                                description: localize('vscode.extension.contributes.commandType.icon.dark', 'Icon path when a dark theme is used'),
                                type: 'string'
                            }
                        }
                    }]
            }
        }
    };
    schema.commandsContribution = {
        description: localize('vscode.extension.contributes.commands', "Contributes commands to the command palette."),
        oneOf: [
            commandType,
            {
                type: 'array',
                items: commandType
            }
        ]
    };
})(schema || (schema = {}));
ExtensionsRegistry.registerExtensionPoint('commands', [], schema.commandsContribution).setHandler(function (extensions) {
    function handleCommand(userFriendlyCommand, extension) {
        if (!schema.isValidCommand(userFriendlyCommand, extension.collector)) {
            return;
        }
        var icon = userFriendlyCommand.icon, category = userFriendlyCommand.category, title = userFriendlyCommand.title, command = userFriendlyCommand.command;
        var absoluteIcon;
        if (icon) {
            if (typeof icon === 'string') {
                absoluteIcon = { dark: resources.joinPath(extension.description.extensionLocation, icon) };
            }
            else {
                absoluteIcon = {
                    dark: resources.joinPath(extension.description.extensionLocation, icon.dark),
                    light: resources.joinPath(extension.description.extensionLocation, icon.light)
                };
            }
        }
        if (MenuRegistry.addCommand({ id: command, title: title, category: category, iconLocation: absoluteIcon })) {
            extension.collector.info(localize('dup', "Command `{0}` appears multiple times in the `commands` section.", userFriendlyCommand.command));
        }
    }
    for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
        var extension = extensions_1[_i];
        var value = extension.value;
        if (Array.isArray(value)) {
            for (var _a = 0, value_1 = value; _a < value_1.length; _a++) {
                var command = value_1[_a];
                handleCommand(command, extension);
            }
        }
        else {
            handleCommand(value, extension);
        }
    }
});
ExtensionsRegistry.registerExtensionPoint('menus', [], schema.menusContribtion).setHandler(function (extensions) {
    var _loop_1 = function (extension) {
        var value = extension.value, collector = extension.collector;
        forEach(value, function (entry) {
            if (!schema.isValidMenuItems(entry.value, collector)) {
                return;
            }
            var menu = schema.parseMenuId(entry.key);
            if (typeof menu !== 'number') {
                collector.warn(localize('menuId.invalid', "`{0}` is not a valid menu identifier", entry.key));
                return;
            }
            for (var _i = 0, _a = entry.value; _i < _a.length; _i++) {
                var item = _a[_i];
                var command = MenuRegistry.getCommand(item.command);
                var alt = item.alt && MenuRegistry.getCommand(item.alt);
                if (!command) {
                    collector.error(localize('missing.command', "Menu item references a command `{0}` which is not defined in the 'commands' section.", item.command));
                    continue;
                }
                if (item.alt && !alt) {
                    collector.warn(localize('missing.altCommand', "Menu item references an alt-command `{0}` which is not defined in the 'commands' section.", item.alt));
                }
                if (item.command === item.alt) {
                    collector.info(localize('dupe.command', "Menu item references the same command as default and alt-command"));
                }
                var group = void 0;
                var order = void 0;
                if (item.group) {
                    var idx = item.group.lastIndexOf('@');
                    if (idx > 0) {
                        group = item.group.substr(0, idx);
                        order = Number(item.group.substr(idx + 1)) || undefined;
                    }
                    else {
                        group = item.group;
                    }
                }
                MenuRegistry.appendMenuItem(menu, {
                    command: command,
                    alt: alt,
                    group: group,
                    order: order,
                    when: ContextKeyExpr.deserialize(item.when)
                });
            }
        });
    };
    for (var _i = 0, extensions_2 = extensions; _i < extensions_2.length; _i++) {
        var extension = extensions_2[_i];
        _loop_1(extension);
    }
});
