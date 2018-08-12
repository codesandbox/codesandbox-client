/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TPromise } from '../../../common/winjs.base.js';
import { isFunction } from '../../../common/types.js';
var DataSource = /** @class */ (function () {
    function DataSource(arg) {
        this.modelProvider = isFunction(arg.getModel) ? arg : { getModel: function () { return arg; } };
    }
    DataSource.prototype.getId = function (tree, element) {
        if (!element) {
            return null;
        }
        var model = this.modelProvider.getModel();
        return model === element ? '__root__' : model.dataSource.getId(element);
    };
    DataSource.prototype.hasChildren = function (tree, element) {
        var model = this.modelProvider.getModel();
        return model && model === element && model.entries.length > 0;
    };
    DataSource.prototype.getChildren = function (tree, element) {
        var model = this.modelProvider.getModel();
        return TPromise.as(model === element ? model.entries : []);
    };
    DataSource.prototype.getParent = function (tree, element) {
        return TPromise.as(null);
    };
    return DataSource;
}());
export { DataSource };
var AccessibilityProvider = /** @class */ (function () {
    function AccessibilityProvider(modelProvider) {
        this.modelProvider = modelProvider;
    }
    AccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
        var model = this.modelProvider.getModel();
        return model.accessibilityProvider && model.accessibilityProvider.getAriaLabel(element);
    };
    AccessibilityProvider.prototype.getPosInSet = function (tree, element) {
        var model = this.modelProvider.getModel();
        return String(model.entries.indexOf(element) + 1);
    };
    AccessibilityProvider.prototype.getSetSize = function () {
        var model = this.modelProvider.getModel();
        return String(model.entries.length);
    };
    return AccessibilityProvider;
}());
export { AccessibilityProvider };
var Filter = /** @class */ (function () {
    function Filter(modelProvider) {
        this.modelProvider = modelProvider;
    }
    Filter.prototype.isVisible = function (tree, element) {
        var model = this.modelProvider.getModel();
        if (!model.filter) {
            return true;
        }
        return model.filter.isVisible(element);
    };
    return Filter;
}());
export { Filter };
var Renderer = /** @class */ (function () {
    function Renderer(modelProvider, styles) {
        this.modelProvider = modelProvider;
        this.styles = styles;
    }
    Renderer.prototype.updateStyles = function (styles) {
        this.styles = styles;
    };
    Renderer.prototype.getHeight = function (tree, element) {
        var model = this.modelProvider.getModel();
        return model.renderer.getHeight(element);
    };
    Renderer.prototype.getTemplateId = function (tree, element) {
        var model = this.modelProvider.getModel();
        return model.renderer.getTemplateId(element);
    };
    Renderer.prototype.renderTemplate = function (tree, templateId, container) {
        var model = this.modelProvider.getModel();
        return model.renderer.renderTemplate(templateId, container, this.styles);
    };
    Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
        var model = this.modelProvider.getModel();
        model.renderer.renderElement(element, templateId, templateData, this.styles);
    };
    Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        var model = this.modelProvider.getModel();
        model.renderer.disposeTemplate(templateId, templateData);
    };
    return Renderer;
}());
export { Renderer };
