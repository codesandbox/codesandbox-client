/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import './media/part.css';
import { Component } from '../common/component';
import { Dimension, size } from '../../base/browser/dom';
/**
 * Parts are layed out in the workbench and have their own layout that arranges an optional title
 * and mandatory content area to show content.
 */
var Part = /** @class */ (function (_super) {
    __extends(Part, _super);
    function Part(id, options, themeService) {
        var _this = _super.call(this, id, themeService) || this;
        _this.options = options;
        return _this;
    }
    Part.prototype.onThemeChange = function (theme) {
        // only call if our create() method has been called
        if (this.parent) {
            _super.prototype.onThemeChange.call(this, theme);
        }
    };
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to create title and content area of the part.
     */
    Part.prototype.create = function (parent) {
        this.parent = parent;
        this.titleArea = this.createTitleArea(parent);
        this.contentArea = this.createContentArea(parent);
        this.partLayout = new PartLayout(this.parent, this.options, this.titleArea, this.contentArea);
        this.updateStyles();
    };
    /**
     * Returns the overall part container.
     */
    Part.prototype.getContainer = function () {
        return this.parent;
    };
    /**
     * Subclasses override to provide a title area implementation.
     */
    Part.prototype.createTitleArea = function (parent) {
        return null;
    };
    /**
     * Returns the title area container.
     */
    Part.prototype.getTitleArea = function () {
        return this.titleArea;
    };
    /**
     * Subclasses override to provide a content area implementation.
     */
    Part.prototype.createContentArea = function (parent) {
        return null;
    };
    /**
     * Returns the content area container.
     */
    Part.prototype.getContentArea = function () {
        return this.contentArea;
    };
    /**
     * Layout title and content area in the given dimension.
     */
    Part.prototype.layout = function (dimension) {
        return this.partLayout.layout(dimension);
    };
    return Part;
}(Component));
export { Part };
var TITLE_HEIGHT = 35;
var PartLayout = /** @class */ (function () {
    function PartLayout(container, options, titleArea, contentArea) {
        this.options = options;
        this.contentArea = contentArea;
    }
    PartLayout.prototype.layout = function (dimension) {
        var width = dimension.width, height = dimension.height;
        // Return the applied sizes to title and content
        var sizes = [];
        // Title Size: Width (Fill), Height (Variable)
        var titleSize;
        if (this.options && this.options.hasTitle) {
            titleSize = new Dimension(width, Math.min(height, TITLE_HEIGHT));
        }
        else {
            titleSize = new Dimension(0, 0);
        }
        // Content Size: Width (Fill), Height (Variable)
        var contentSize = new Dimension(width, height - titleSize.height);
        if (this.options && typeof this.options.borderWidth === 'function') {
            contentSize.width -= this.options.borderWidth(); // adjust for border size
        }
        sizes.push(titleSize);
        sizes.push(contentSize);
        // Content
        if (this.contentArea) {
            size(this.contentArea, contentSize.width, contentSize.height);
        }
        return sizes;
    };
    return PartLayout;
}());
export { PartLayout };
