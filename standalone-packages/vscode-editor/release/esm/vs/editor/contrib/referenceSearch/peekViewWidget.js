/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as dom from '../../../base/browser/dom.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../base/common/actions.js';
import { Color } from '../../../base/common/color.js';
import { Emitter } from '../../../base/common/event.js';
import * as objects from '../../../base/common/objects.js';
import * as strings from '../../../base/common/strings.js';
import './media/peekViewWidget.css';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../browser/widget/embeddedCodeEditorWidget.js';
import { ZoneWidget } from '../zoneWidget/zoneWidget.js';
import * as nls from '../../../nls.js';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
export var PeekContext;
(function (PeekContext) {
    PeekContext.inPeekEditor = new RawContextKey('inReferenceSearchEditor', true);
    PeekContext.notInPeekEditor = PeekContext.inPeekEditor.toNegated();
})(PeekContext || (PeekContext = {}));
export function getOuterEditor(accessor) {
    var editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
    if (editor instanceof EmbeddedCodeEditorWidget) {
        return editor.getParentEditor();
    }
    return editor;
}
var defaultOptions = {
    headerBackgroundColor: Color.white,
    primaryHeadingColor: Color.fromHex('#333333'),
    secondaryHeadingColor: Color.fromHex('#6c6c6cb3')
};
var PeekViewWidget = /** @class */ (function (_super) {
    __extends(PeekViewWidget, _super);
    function PeekViewWidget(editor, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, editor, options) || this;
        _this._onDidClose = new Emitter();
        objects.mixin(_this.options, defaultOptions, false);
        return _this;
    }
    PeekViewWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._onDidClose.fire(this);
    };
    Object.defineProperty(PeekViewWidget.prototype, "onDidClose", {
        get: function () {
            return this._onDidClose.event;
        },
        enumerable: true,
        configurable: true
    });
    PeekViewWidget.prototype.style = function (styles) {
        var options = this.options;
        if (styles.headerBackgroundColor) {
            options.headerBackgroundColor = styles.headerBackgroundColor;
        }
        if (styles.primaryHeadingColor) {
            options.primaryHeadingColor = styles.primaryHeadingColor;
        }
        if (styles.secondaryHeadingColor) {
            options.secondaryHeadingColor = styles.secondaryHeadingColor;
        }
        _super.prototype.style.call(this, styles);
    };
    PeekViewWidget.prototype._applyStyles = function () {
        _super.prototype._applyStyles.call(this);
        var options = this.options;
        if (this._headElement) {
            this._headElement.style.backgroundColor = options.headerBackgroundColor.toString();
        }
        if (this._primaryHeading) {
            this._primaryHeading.style.color = options.primaryHeadingColor.toString();
        }
        if (this._secondaryHeading) {
            this._secondaryHeading.style.color = options.secondaryHeadingColor.toString();
        }
        if (this._bodyElement) {
            this._bodyElement.style.borderColor = options.frameColor.toString();
        }
    };
    PeekViewWidget.prototype._fillContainer = function (container) {
        this.setCssClass('peekview-widget');
        this._headElement = dom.$('.head');
        this._bodyElement = dom.$('.body');
        this._fillHead(this._headElement);
        this._fillBody(this._bodyElement);
        container.appendChild(this._headElement);
        container.appendChild(this._bodyElement);
    };
    PeekViewWidget.prototype._fillHead = function (container) {
        var _this = this;
        var titleElement = dom.$('.peekview-title');
        dom.append(this._headElement, titleElement);
        dom.addStandardDisposableListener(titleElement, 'click', function (event) { return _this._onTitleClick(event); });
        this._primaryHeading = dom.$('span.filename');
        this._secondaryHeading = dom.$('span.dirname');
        this._metaHeading = dom.$('span.meta');
        dom.append(titleElement, this._primaryHeading, this._secondaryHeading, this._metaHeading);
        var actionsContainer = dom.$('.peekview-actions');
        dom.append(this._headElement, actionsContainer);
        var actionBarOptions = this._getActionBarOptions();
        this._actionbarWidget = new ActionBar(actionsContainer, actionBarOptions);
        this._disposables.push(this._actionbarWidget);
        this._actionbarWidget.push(new Action('peekview.close', nls.localize('label.close', "Close"), 'close-peekview-action', true, function () {
            _this.dispose();
            return null;
        }), { label: false, icon: true });
    };
    PeekViewWidget.prototype._getActionBarOptions = function () {
        return {};
    };
    PeekViewWidget.prototype._onTitleClick = function (event) {
        // implement me
    };
    PeekViewWidget.prototype.setTitle = function (primaryHeading, secondaryHeading) {
        this._primaryHeading.innerHTML = strings.escape(primaryHeading);
        this._primaryHeading.setAttribute('aria-label', primaryHeading);
        if (secondaryHeading) {
            this._secondaryHeading.innerHTML = strings.escape(secondaryHeading);
        }
        else {
            dom.clearNode(this._secondaryHeading);
        }
    };
    PeekViewWidget.prototype.setMetaTitle = function (value) {
        if (value) {
            this._metaHeading.innerHTML = strings.escape(value);
        }
        else {
            dom.clearNode(this._metaHeading);
        }
    };
    PeekViewWidget.prototype._doLayout = function (heightInPixel, widthInPixel) {
        if (!this._isShowing && heightInPixel < 0) {
            // Looks like the view zone got folded away!
            this.dispose();
            return;
        }
        var headHeight = Math.ceil(this.editor.getConfiguration().lineHeight * 1.2);
        var bodyHeight = heightInPixel - (headHeight + 2 /* the border-top/bottom width*/);
        this._doLayoutHead(headHeight, widthInPixel);
        this._doLayoutBody(bodyHeight, widthInPixel);
    };
    PeekViewWidget.prototype._doLayoutHead = function (heightInPixel, widthInPixel) {
        this._headElement.style.height = strings.format('{0}px', heightInPixel);
        this._headElement.style.lineHeight = this._headElement.style.height;
    };
    PeekViewWidget.prototype._doLayoutBody = function (heightInPixel, widthInPixel) {
        this._bodyElement.style.height = strings.format('{0}px', heightInPixel);
    };
    return PeekViewWidget;
}(ZoneWidget));
export { PeekViewWidget };
