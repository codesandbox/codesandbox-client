/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Dimension } from '../../../../base/browser/dom.js';
import { QuickOpenWidget } from '../../../../base/parts/quickopen/browser/quickOpenWidget.js';
import { foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { attachQuickOpenStyler } from '../../../../platform/theme/common/styler.js';
var QuickOpenEditorWidget = /** @class */ (function () {
    function QuickOpenEditorWidget(codeEditor, onOk, onCancel, onType, configuration, themeService) {
        this.codeEditor = codeEditor;
        this.themeService = themeService;
        this.create(onOk, onCancel, onType, configuration);
    }
    QuickOpenEditorWidget.prototype.create = function (onOk, onCancel, onType, configuration) {
        this.domNode = document.createElement('div');
        this.quickOpenWidget = new QuickOpenWidget(this.domNode, {
            onOk: onOk,
            onCancel: onCancel,
            onType: onType
        }, {
            inputPlaceHolder: null,
            inputAriaLabel: configuration.inputAriaLabel,
            keyboardSupport: true
        });
        this.styler = attachQuickOpenStyler(this.quickOpenWidget, this.themeService, {
            pickerGroupForeground: foreground
        });
        this.quickOpenWidget.create();
        this.codeEditor.addOverlayWidget(this);
    };
    QuickOpenEditorWidget.prototype.setInput = function (model, focus) {
        this.quickOpenWidget.setInput(model, focus);
    };
    QuickOpenEditorWidget.prototype.getId = function () {
        return QuickOpenEditorWidget.ID;
    };
    QuickOpenEditorWidget.prototype.getDomNode = function () {
        return this.domNode;
    };
    QuickOpenEditorWidget.prototype.destroy = function () {
        this.codeEditor.removeOverlayWidget(this);
        this.quickOpenWidget.dispose();
        this.styler.dispose();
    };
    QuickOpenEditorWidget.prototype.show = function (value) {
        this.visible = true;
        var editorLayout = this.codeEditor.getLayoutInfo();
        if (editorLayout) {
            this.quickOpenWidget.layout(new Dimension(editorLayout.width, editorLayout.height));
        }
        this.quickOpenWidget.show(value);
        this.codeEditor.layoutOverlayWidget(this);
    };
    QuickOpenEditorWidget.prototype.getPosition = function () {
        if (this.visible) {
            return {
                preference: 2 /* TOP_CENTER */
            };
        }
        return null;
    };
    QuickOpenEditorWidget.ID = 'editor.contrib.quickOpenEditorWidget';
    return QuickOpenEditorWidget;
}());
export { QuickOpenEditorWidget };
