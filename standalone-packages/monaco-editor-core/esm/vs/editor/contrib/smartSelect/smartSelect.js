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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls';
import * as arrays from '../../../base/common/arrays';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation';
import { Range } from '../../common/core/range';
import { EditorContextKeys } from '../../common/editorContextKeys';
import { registerEditorAction, EditorAction, registerEditorContribution } from '../../browser/editorExtensions';
import { TokenSelectionSupport } from './tokenSelectionSupport';
import { MenuId } from '../../../platform/actions/common/actions';
// --- selection state machine
var State = /** @class */ (function () {
    function State(editor) {
        this.editor = editor;
        this.next = null;
        this.previous = null;
        this.selection = editor.getSelection();
    }
    return State;
}());
// -- action implementation
var SmartSelectController = /** @class */ (function () {
    function SmartSelectController(editor, instantiationService) {
        this.editor = editor;
        this._tokenSelectionSupport = instantiationService.createInstance(TokenSelectionSupport);
        this._state = null;
        this._ignoreSelection = false;
    }
    SmartSelectController.get = function (editor) {
        return editor.getContribution(SmartSelectController.ID);
    };
    SmartSelectController.prototype.dispose = function () {
    };
    SmartSelectController.prototype.getId = function () {
        return SmartSelectController.ID;
    };
    SmartSelectController.prototype.run = function (forward) {
        var _this = this;
        var selection = this.editor.getSelection();
        var model = this.editor.getModel();
        // forget about current state
        if (this._state) {
            if (this._state.editor !== this.editor) {
                this._state = null;
            }
        }
        var promise = Promise.resolve(null);
        if (!this._state) {
            promise = Promise.resolve(this._tokenSelectionSupport.getRangesToPositionSync(model.uri, selection.getStartPosition())).then(function (elements) {
                if (arrays.isFalsyOrEmpty(elements)) {
                    return;
                }
                var lastState;
                elements.filter(function (element) {
                    // filter ranges inside the selection
                    var selection = _this.editor.getSelection();
                    var range = new Range(element.range.startLineNumber, element.range.startColumn, element.range.endLineNumber, element.range.endColumn);
                    return range.containsPosition(selection.getStartPosition()) && range.containsPosition(selection.getEndPosition());
                }).forEach(function (element) {
                    // create ranges
                    var range = element.range;
                    var state = new State(_this.editor);
                    state.selection = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
                    if (lastState) {
                        state.next = lastState;
                        lastState.previous = state;
                    }
                    lastState = state;
                });
                // insert current selection
                var editorState = new State(_this.editor);
                editorState.next = lastState;
                if (lastState) {
                    lastState.previous = editorState;
                }
                _this._state = editorState;
                // listen to caret move and forget about state
                var unhook = _this.editor.onDidChangeCursorPosition(function (e) {
                    if (_this._ignoreSelection) {
                        return;
                    }
                    _this._state = null;
                    unhook.dispose();
                });
            });
        }
        return promise.then(function () {
            if (!_this._state) {
                return;
            }
            _this._state = forward ? _this._state.next : _this._state.previous;
            if (!_this._state) {
                return;
            }
            _this._ignoreSelection = true;
            try {
                _this.editor.setSelection(_this._state.selection);
            }
            finally {
                _this._ignoreSelection = false;
            }
            return;
        });
    };
    SmartSelectController.ID = 'editor.contrib.smartSelectController';
    SmartSelectController = __decorate([
        __param(1, IInstantiationService)
    ], SmartSelectController);
    return SmartSelectController;
}());
var AbstractSmartSelect = /** @class */ (function (_super) {
    __extends(AbstractSmartSelect, _super);
    function AbstractSmartSelect(forward, opts) {
        var _this = _super.call(this, opts) || this;
        _this._forward = forward;
        return _this;
    }
    AbstractSmartSelect.prototype.run = function (accessor, editor) {
        var controller = SmartSelectController.get(editor);
        if (controller) {
            return controller.run(this._forward);
        }
        return undefined;
    };
    return AbstractSmartSelect;
}(EditorAction));
var GrowSelectionAction = /** @class */ (function (_super) {
    __extends(GrowSelectionAction, _super);
    function GrowSelectionAction() {
        return _super.call(this, true, {
            id: 'editor.action.smartSelect.grow',
            label: nls.localize('smartSelect.grow', "Expand Select"),
            alias: 'Expand Select',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 17 /* RightArrow */,
                mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 1024 /* Shift */ | 17 /* RightArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '1_basic',
                title: nls.localize({ key: 'miSmartSelectGrow', comment: ['&& denotes a mnemonic'] }, "&&Expand Selection"),
                order: 2
            }
        }) || this;
    }
    return GrowSelectionAction;
}(AbstractSmartSelect));
var ShrinkSelectionAction = /** @class */ (function (_super) {
    __extends(ShrinkSelectionAction, _super);
    function ShrinkSelectionAction() {
        return _super.call(this, false, {
            id: 'editor.action.smartSelect.shrink',
            label: nls.localize('smartSelect.shrink', "Shrink Select"),
            alias: 'Shrink Select',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 15 /* LeftArrow */,
                mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 1024 /* Shift */ | 15 /* LeftArrow */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '1_basic',
                title: nls.localize({ key: 'miSmartSelectShrink', comment: ['&& denotes a mnemonic'] }, "&&Shrink Selection"),
                order: 3
            }
        }) || this;
    }
    return ShrinkSelectionAction;
}(AbstractSmartSelect));
registerEditorContribution(SmartSelectController);
registerEditorAction(GrowSelectionAction);
registerEditorAction(ShrinkSelectionAction);
