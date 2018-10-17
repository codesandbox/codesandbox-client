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
import * as nls from '../../../../nls.js';
import { registerEditorAction, EditorAction, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { EDITOR_DEFAULTS } from '../../../../editor/common/config/editorOptions.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
var transientWordWrapState = 'transientWordWrapState';
var isWordWrapMinifiedKey = 'isWordWrapMinified';
var isDominatedByLongLinesKey = 'isDominatedByLongLines';
var inDiffEditorKey = 'inDiffEditor';
/**
 * Store (in memory) the word wrap state for a particular model.
 */
function writeTransientState(model, state, codeEditorService) {
    codeEditorService.setTransientModelProperty(model, transientWordWrapState, state);
}
/**
 * Read (in memory) the word wrap state for a particular model.
 */
function readTransientState(model, codeEditorService) {
    return codeEditorService.getTransientModelProperty(model, transientWordWrapState);
}
function readWordWrapState(model, configurationService, codeEditorService) {
    var editorConfig = configurationService.getValue(model.uri, 'editor');
    var _configuredWordWrap = editorConfig && (typeof editorConfig.wordWrap === 'string' || typeof editorConfig.wordWrap === 'boolean') ? editorConfig.wordWrap : void 0;
    // Compatibility with old true or false values
    if (_configuredWordWrap === true) {
        _configuredWordWrap = 'on';
    }
    else if (_configuredWordWrap === false) {
        _configuredWordWrap = 'off';
    }
    var _configuredWordWrapMinified = editorConfig && typeof editorConfig.wordWrapMinified === 'boolean' ? editorConfig.wordWrapMinified : void 0;
    var _transientState = readTransientState(model, codeEditorService);
    return {
        configuredWordWrap: _configuredWordWrap,
        configuredWordWrapMinified: (typeof _configuredWordWrapMinified === 'boolean' ? _configuredWordWrapMinified : EDITOR_DEFAULTS.wordWrapMinified),
        transientState: _transientState
    };
}
function toggleWordWrap(editor, state) {
    if (state.transientState) {
        // toggle off => go to null
        return {
            configuredWordWrap: state.configuredWordWrap,
            configuredWordWrapMinified: state.configuredWordWrapMinified,
            transientState: null
        };
    }
    var config = editor.getConfiguration();
    var transientState;
    var actualWrappingInfo = config.wrappingInfo;
    if (actualWrappingInfo.isWordWrapMinified) {
        // => wrapping due to minified file
        transientState = {
            forceWordWrap: 'off',
            forceWordWrapMinified: false
        };
    }
    else if (state.configuredWordWrap !== 'off') {
        // => wrapping is configured to be on (or some variant)
        transientState = {
            forceWordWrap: 'off',
            forceWordWrapMinified: false
        };
    }
    else {
        // => wrapping is configured to be off
        transientState = {
            forceWordWrap: 'on',
            forceWordWrapMinified: state.configuredWordWrapMinified
        };
    }
    return {
        configuredWordWrap: state.configuredWordWrap,
        configuredWordWrapMinified: state.configuredWordWrapMinified,
        transientState: transientState
    };
}
var TOGGLE_WORD_WRAP_ID = 'editor.action.toggleWordWrap';
var ToggleWordWrapAction = /** @class */ (function (_super) {
    __extends(ToggleWordWrapAction, _super);
    function ToggleWordWrapAction() {
        return _super.call(this, {
            id: TOGGLE_WORD_WRAP_ID,
            label: nls.localize('toggle.wordwrap', "View: Toggle Word Wrap"),
            alias: 'View: Toggle Word Wrap',
            precondition: null,
            kbOpts: {
                kbExpr: null,
                primary: 512 /* Alt */ | 56 /* KEY_Z */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    ToggleWordWrapAction.prototype.run = function (accessor, editor) {
        var editorConfiguration = editor.getConfiguration();
        if (editorConfiguration.wrappingInfo.inDiffEditor) {
            // Cannot change wrapping settings inside the diff editor
            var notificationService = accessor.get(INotificationService);
            notificationService.info(nls.localize('wordWrap.notInDiffEditor', "Cannot toggle word wrap in a diff editor."));
            return;
        }
        var textResourceConfigurationService = accessor.get(ITextResourceConfigurationService);
        var codeEditorService = accessor.get(ICodeEditorService);
        var model = editor.getModel();
        if (!canToggleWordWrap(model.uri)) {
            return;
        }
        // Read the current state
        var currentState = readWordWrapState(model, textResourceConfigurationService, codeEditorService);
        // Compute the new state
        var newState = toggleWordWrap(editor, currentState);
        // Write the new state
        // (this will cause an event and the controller will apply the state)
        writeTransientState(model, newState.transientState, codeEditorService);
    };
    return ToggleWordWrapAction;
}(EditorAction));
var ToggleWordWrapController = /** @class */ (function (_super) {
    __extends(ToggleWordWrapController, _super);
    function ToggleWordWrapController(editor, contextKeyService, configurationService, codeEditorService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this.contextKeyService = contextKeyService;
        _this.configurationService = configurationService;
        _this.codeEditorService = codeEditorService;
        var configuration = _this.editor.getConfiguration();
        var isWordWrapMinified = _this.contextKeyService.createKey(isWordWrapMinifiedKey, _this._isWordWrapMinified(configuration));
        var isDominatedByLongLines = _this.contextKeyService.createKey(isDominatedByLongLinesKey, _this._isDominatedByLongLines(configuration));
        var inDiffEditor = _this.contextKeyService.createKey(inDiffEditorKey, _this._inDiffEditor(configuration));
        var currentlyApplyingEditorConfig = false;
        _this._register(editor.onDidChangeConfiguration(function (e) {
            if (!e.wrappingInfo) {
                return;
            }
            var configuration = _this.editor.getConfiguration();
            isWordWrapMinified.set(_this._isWordWrapMinified(configuration));
            isDominatedByLongLines.set(_this._isDominatedByLongLines(configuration));
            inDiffEditor.set(_this._inDiffEditor(configuration));
            if (!currentlyApplyingEditorConfig) {
                // I am not the cause of the word wrap getting changed
                ensureWordWrapSettings();
            }
        }));
        _this._register(editor.onDidChangeModel(function (e) {
            ensureWordWrapSettings();
        }));
        _this._register(codeEditorService.onDidChangeTransientModelProperty(function () {
            ensureWordWrapSettings();
        }));
        var ensureWordWrapSettings = function () {
            // Ensure correct word wrap settings
            var newModel = _this.editor.getModel();
            if (!newModel) {
                return;
            }
            var configuration = _this.editor.getConfiguration();
            if (_this._inDiffEditor(configuration)) {
                return;
            }
            if (!canToggleWordWrap(newModel.uri)) {
                return;
            }
            // Read current configured values and toggle state
            var desiredState = readWordWrapState(newModel, _this.configurationService, _this.codeEditorService);
            // Apply the state
            try {
                currentlyApplyingEditorConfig = true;
                _this._applyWordWrapState(desiredState);
            }
            finally {
                currentlyApplyingEditorConfig = false;
            }
        };
        return _this;
    }
    ToggleWordWrapController.prototype._applyWordWrapState = function (state) {
        if (state.transientState) {
            // toggle is on
            this.editor.updateOptions({
                wordWrap: state.transientState.forceWordWrap,
                wordWrapMinified: state.transientState.forceWordWrapMinified
            });
            return;
        }
        // toggle is off
        this.editor.updateOptions({
            wordWrap: state.configuredWordWrap,
            wordWrapMinified: state.configuredWordWrapMinified
        });
    };
    ToggleWordWrapController.prototype._isWordWrapMinified = function (config) {
        return config.wrappingInfo.isWordWrapMinified;
    };
    ToggleWordWrapController.prototype._isDominatedByLongLines = function (config) {
        return config.wrappingInfo.isDominatedByLongLines;
    };
    ToggleWordWrapController.prototype._inDiffEditor = function (config) {
        return config.wrappingInfo.inDiffEditor;
    };
    ToggleWordWrapController.prototype.getId = function () {
        return ToggleWordWrapController._ID;
    };
    ToggleWordWrapController._ID = 'editor.contrib.toggleWordWrapController';
    ToggleWordWrapController = __decorate([
        __param(1, IContextKeyService),
        __param(2, ITextResourceConfigurationService),
        __param(3, ICodeEditorService)
    ], ToggleWordWrapController);
    return ToggleWordWrapController;
}(Disposable));
function canToggleWordWrap(uri) {
    if (!uri) {
        return false;
    }
    return (uri.scheme !== 'output' && uri.scheme !== 'vscode');
}
registerEditorContribution(ToggleWordWrapController);
registerEditorAction(ToggleWordWrapAction);
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: TOGGLE_WORD_WRAP_ID,
        title: nls.localize('unwrapMinified', "Disable wrapping for this file"),
        iconLocation: { dark: URI.parse(require.toUrl('vs/workbench/parts/codeEditor/electron-browser/media/WordWrap_16x.svg')) }
    },
    group: 'navigation',
    order: 1,
    when: ContextKeyExpr.and(ContextKeyExpr.not(inDiffEditorKey), ContextKeyExpr.has(isDominatedByLongLinesKey), ContextKeyExpr.has(isWordWrapMinifiedKey))
});
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
    command: {
        id: TOGGLE_WORD_WRAP_ID,
        title: nls.localize('wrapMinified', "Enable wrapping for this file"),
        iconLocation: { dark: URI.parse(require.toUrl('vs/workbench/parts/codeEditor/electron-browser/media/WordWrap_16x.svg')) }
    },
    group: 'navigation',
    order: 1,
    when: ContextKeyExpr.and(ContextKeyExpr.not(inDiffEditorKey), ContextKeyExpr.has(isDominatedByLongLinesKey), ContextKeyExpr.not(isWordWrapMinifiedKey))
});
// View menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '5_editor',
    command: {
        id: TOGGLE_WORD_WRAP_ID,
        title: nls.localize({ key: 'miToggleWordWrap', comment: ['&& denotes a mnemonic'] }, "Toggle &&Word Wrap")
    },
    order: 1
});
