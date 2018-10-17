/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Registry } from '../../platform/registry/common/platform.js';
import { Separator } from '../../base/browser/ui/actionbar/actionbar.js';
/**
 * The action bar contributor allows to add actions to an actionbar in a given context.
 */
var ActionBarContributor = /** @class */ (function () {
    function ActionBarContributor() {
    }
    /**
     * Returns true if this contributor has actions for the given context.
     */
    ActionBarContributor.prototype.hasActions = function (context) {
        return false;
    };
    /**
     * Returns an array of primary actions in the given context.
     */
    ActionBarContributor.prototype.getActions = function (context) {
        return [];
    };
    /**
     * Returns true if this contributor has secondary actions for the given context.
     */
    ActionBarContributor.prototype.hasSecondaryActions = function (context) {
        return false;
    };
    /**
     * Returns an array of secondary actions in the given context.
     */
    ActionBarContributor.prototype.getSecondaryActions = function (context) {
        return [];
    };
    /**
     * Can return a specific IActionItem to render the given action.
     */
    ActionBarContributor.prototype.getActionItem = function (context, action) {
        return null;
    };
    return ActionBarContributor;
}());
export { ActionBarContributor };
/**
 * Some predefined scopes to contribute actions to
 */
export var Scope = {
    /**
     * Actions inside tree widgets.
     */
    VIEWER: 'viewer'
};
/**
 * The ContributableActionProvider leverages the actionbar contribution model to find actions.
 */
var ContributableActionProvider = /** @class */ (function () {
    function ContributableActionProvider() {
        this.registry = Registry.as(Extensions.Actionbar);
    }
    ContributableActionProvider.prototype.toContext = function (tree, element) {
        return {
            viewer: tree,
            element: element
        };
    };
    ContributableActionProvider.prototype.hasActions = function (tree, element) {
        var context = this.toContext(tree, element);
        var contributors = this.registry.getActionBarContributors(Scope.VIEWER);
        for (var i = 0; i < contributors.length; i++) {
            var contributor = contributors[i];
            if (contributor.hasActions(context)) {
                return true;
            }
        }
        return false;
    };
    ContributableActionProvider.prototype.getActions = function (tree, element) {
        var actions = [];
        var context = this.toContext(tree, element);
        // Collect Actions
        var contributors = this.registry.getActionBarContributors(Scope.VIEWER);
        for (var i = 0; i < contributors.length; i++) {
            var contributor = contributors[i];
            if (contributor.hasActions(context)) {
                actions.push.apply(actions, contributor.getActions(context));
            }
        }
        return Promise.resolve(prepareActions(actions));
    };
    ContributableActionProvider.prototype.hasSecondaryActions = function (tree, element) {
        var context = this.toContext(tree, element);
        var contributors = this.registry.getActionBarContributors(Scope.VIEWER);
        for (var i = 0; i < contributors.length; i++) {
            var contributor = contributors[i];
            if (contributor.hasSecondaryActions(context)) {
                return true;
            }
        }
        return false;
    };
    ContributableActionProvider.prototype.getSecondaryActions = function (tree, element) {
        var actions = [];
        var context = this.toContext(tree, element);
        // Collect Actions
        var contributors = this.registry.getActionBarContributors(Scope.VIEWER);
        for (var i = 0; i < contributors.length; i++) {
            var contributor = contributors[i];
            if (contributor.hasSecondaryActions(context)) {
                actions.push.apply(actions, contributor.getSecondaryActions(context));
            }
        }
        return Promise.resolve(prepareActions(actions));
    };
    ContributableActionProvider.prototype.getActionItem = function (tree, element, action) {
        var contributors = this.registry.getActionBarContributors(Scope.VIEWER);
        var context = this.toContext(tree, element);
        for (var i = contributors.length - 1; i >= 0; i--) {
            var contributor = contributors[i];
            var itemProvider = contributor.getActionItem(context, action);
            if (itemProvider) {
                return itemProvider;
            }
        }
        return null;
    };
    return ContributableActionProvider;
}());
export { ContributableActionProvider };
// Helper function used in parts to massage actions before showing in action areas
export function prepareActions(actions) {
    if (!actions.length) {
        return actions;
    }
    // Clean up leading separators
    var firstIndexOfAction = -1;
    for (var i = 0; i < actions.length; i++) {
        if (actions[i].id === Separator.ID) {
            continue;
        }
        firstIndexOfAction = i;
        break;
    }
    if (firstIndexOfAction === -1) {
        return [];
    }
    actions = actions.slice(firstIndexOfAction);
    // Clean up trailing separators
    for (var h = actions.length - 1; h >= 0; h--) {
        var isSeparator = actions[h].id === Separator.ID;
        if (isSeparator) {
            actions.splice(h, 1);
        }
        else {
            break;
        }
    }
    // Clean up separator duplicates
    var foundAction = false;
    for (var k = actions.length - 1; k >= 0; k--) {
        var isSeparator = actions[k].id === Separator.ID;
        if (isSeparator && !foundAction) {
            actions.splice(k, 1);
        }
        else if (!isSeparator) {
            foundAction = true;
        }
        else if (isSeparator) {
            foundAction = false;
        }
    }
    return actions;
}
export var Extensions = {
    Actionbar: 'workbench.contributions.actionbar'
};
var ActionBarRegistry = /** @class */ (function () {
    function ActionBarRegistry() {
        this.actionBarContributorConstructors = [];
        this.actionBarContributorInstances = Object.create(null);
    }
    ActionBarRegistry.prototype.setInstantiationService = function (service) {
        this.instantiationService = service;
        while (this.actionBarContributorConstructors.length > 0) {
            var entry = this.actionBarContributorConstructors.shift();
            this.createActionBarContributor(entry.scope, entry.ctor);
        }
    };
    ActionBarRegistry.prototype.createActionBarContributor = function (scope, ctor) {
        var instance = this.instantiationService.createInstance(ctor);
        var target = this.actionBarContributorInstances[scope];
        if (!target) {
            target = this.actionBarContributorInstances[scope] = [];
        }
        target.push(instance);
    };
    ActionBarRegistry.prototype.getContributors = function (scope) {
        return this.actionBarContributorInstances[scope] || [];
    };
    ActionBarRegistry.prototype.getActionBarActionsForContext = function (scope, context) {
        var actions = [];
        // Go through contributors for scope
        this.getContributors(scope).forEach(function (contributor) {
            // Primary Actions
            if (contributor.hasActions(context)) {
                actions.push.apply(actions, contributor.getActions(context));
            }
        });
        return actions;
    };
    ActionBarRegistry.prototype.getSecondaryActionBarActionsForContext = function (scope, context) {
        var actions = [];
        // Go through contributors
        this.getContributors(scope).forEach(function (contributor) {
            // Secondary Actions
            if (contributor.hasSecondaryActions(context)) {
                actions.push.apply(actions, contributor.getSecondaryActions(context));
            }
        });
        return actions;
    };
    ActionBarRegistry.prototype.getActionItemForContext = function (scope, context, action) {
        var contributors = this.getContributors(scope);
        for (var i = 0; i < contributors.length; i++) {
            var contributor = contributors[i];
            var item = contributor.getActionItem(context, action);
            if (item) {
                return item;
            }
        }
        return null;
    };
    ActionBarRegistry.prototype.registerActionBarContributor = function (scope, ctor) {
        if (!this.instantiationService) {
            this.actionBarContributorConstructors.push({
                scope: scope,
                ctor: ctor
            });
        }
        else {
            this.createActionBarContributor(scope, ctor);
        }
    };
    ActionBarRegistry.prototype.getActionBarContributors = function (scope) {
        return this.getContributors(scope).slice(0);
    };
    return ActionBarRegistry;
}());
Registry.add(Extensions.Actionbar, new ActionBarRegistry());
