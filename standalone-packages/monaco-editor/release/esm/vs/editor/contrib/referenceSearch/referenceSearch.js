/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import * as nls from '../../../nls.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { IContextKeyService, ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { Position } from '../../common/core/position.js';
import { registerEditorAction, EditorAction, registerEditorContribution, registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { ReferenceProviderRegistry } from '../../common/modes.js';
import { Range } from '../../common/core/range.js';
import { PeekContext, getOuterEditor } from './peekViewWidget.js';
import { ReferencesController, ctxReferenceSearchVisible } from './referencesController.js';
import { ReferencesModel, OneReference } from './referencesModel.js';
import { asWinJsPromise, createCancelablePromise } from '../../../base/common/async.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { EmbeddedCodeEditorWidget } from '../../browser/widget/embeddedCodeEditorWidget.js';
import { isCodeEditor } from '../../browser/editorBrowser.js';
import { IListService } from '../../../platform/list/browser/listService.js';
import { ctxReferenceWidgetSearchTreeFocused } from './referencesWidget.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import URI from '../../../base/common/uri.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
export var defaultReferenceSearchOptions = {
    getMetaTitle: function (model) {
        return model.references.length > 1 && nls.localize('meta.titleReference', " – {0} references", model.references.length);
    }
};
var ReferenceController = /** @class */ (function () {
    function ReferenceController(editor, contextKeyService) {
        if (editor instanceof EmbeddedCodeEditorWidget) {
            PeekContext.inPeekEditor.bindTo(contextKeyService);
        }
    }
    ReferenceController.prototype.dispose = function () {
    };
    ReferenceController.prototype.getId = function () {
        return ReferenceController.ID;
    };
    ReferenceController.ID = 'editor.contrib.referenceController';
    ReferenceController = __decorate([
        __param(1, IContextKeyService)
    ], ReferenceController);
    return ReferenceController;
}());
export { ReferenceController };
var ReferenceAction = /** @class */ (function (_super) {
    __extends(ReferenceAction, _super);
    function ReferenceAction() {
        return _super.call(this, {
            id: 'editor.action.referenceSearch.trigger',
            label: nls.localize('references.action.label', "Find All References"),
            alias: 'Find All References',
            precondition: ContextKeyExpr.and(EditorContextKeys.hasReferenceProvider, PeekContext.notInPeekEditor, EditorContextKeys.isInEmbeddedEditor.toNegated()),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 70 /* F12 */
            },
            menuOpts: {
                group: 'navigation',
                order: 1.5
            }
        }) || this;
    }
    ReferenceAction.prototype.run = function (accessor, editor) {
        var controller = ReferencesController.get(editor);
        if (!controller) {
            return;
        }
        var range = editor.getSelection();
        var model = editor.getModel();
        var references = createCancelablePromise(function (token) { return provideReferences(model, range.getStartPosition(), token).then(function (references) { return new ReferencesModel(references); }); });
        controller.toggleWidget(range, references, defaultReferenceSearchOptions);
    };
    return ReferenceAction;
}(EditorAction));
export { ReferenceAction };
registerEditorContribution(ReferenceController);
registerEditorAction(ReferenceAction);
var findReferencesCommand = function (accessor, resource, position) {
    if (!(resource instanceof URI)) {
        throw new Error('illegal argument, uri');
    }
    if (!position) {
        throw new Error('illegal argument, position');
    }
    var codeEditorService = accessor.get(ICodeEditorService);
    return codeEditorService.openCodeEditor({ resource: resource }, codeEditorService.getFocusedCodeEditor()).then(function (control) {
        if (!isCodeEditor(control)) {
            return undefined;
        }
        var controller = ReferencesController.get(control);
        if (!controller) {
            return undefined;
        }
        var references = createCancelablePromise(function (token) { return provideReferences(control.getModel(), Position.lift(position), token).then(function (references) { return new ReferencesModel(references); }); });
        var range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
        return TPromise.as(controller.toggleWidget(range, references, defaultReferenceSearchOptions));
    });
};
var showReferencesCommand = function (accessor, resource, position, references) {
    if (!(resource instanceof URI)) {
        throw new Error('illegal argument, uri expected');
    }
    var codeEditorService = accessor.get(ICodeEditorService);
    return codeEditorService.openCodeEditor({ resource: resource }, codeEditorService.getFocusedCodeEditor()).then(function (control) {
        if (!isCodeEditor(control)) {
            return undefined;
        }
        var controller = ReferencesController.get(control);
        if (!controller) {
            return undefined;
        }
        return TPromise.as(controller.toggleWidget(new Range(position.lineNumber, position.column, position.lineNumber, position.column), createCancelablePromise(function (_) { return Promise.reject(new ReferencesModel(references)); }), defaultReferenceSearchOptions)).then(function () { return true; });
    });
};
// register commands
CommandsRegistry.registerCommand({
    id: 'editor.action.findReferences',
    handler: findReferencesCommand
});
CommandsRegistry.registerCommand({
    id: 'editor.action.showReferences',
    handler: showReferencesCommand,
    description: {
        description: 'Show references at a position in a file',
        args: [
            { name: 'uri', description: 'The text document in which to show references', constraint: URI },
            { name: 'position', description: 'The position at which to show', constraint: Position.isIPosition },
            { name: 'locations', description: 'An array of locations.', constraint: Array },
        ]
    }
});
function closeActiveReferenceSearch(accessor, args) {
    withController(accessor, function (controller) { return controller.closeWidget(); });
}
function openReferenceToSide(accessor, args) {
    var listService = accessor.get(IListService);
    var focus = listService.lastFocusedList && listService.lastFocusedList.getFocus();
    if (focus instanceof OneReference) {
        withController(accessor, function (controller) { return controller.openReference(focus, true); });
    }
}
function withController(accessor, fn) {
    var outerEditor = getOuterEditor(accessor);
    if (!outerEditor) {
        return;
    }
    var controller = ReferencesController.get(outerEditor);
    if (!controller) {
        return;
    }
    fn(controller);
}
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToNextReference',
    weight: KeybindingsRegistry.WEIGHT.workbenchContrib(50),
    primary: 62 /* F4 */,
    when: ctxReferenceSearchVisible,
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(true);
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToNextReferenceFromEmbeddedEditor',
    weight: KeybindingsRegistry.WEIGHT.editorContrib(50),
    primary: 62 /* F4 */,
    when: PeekContext.inPeekEditor,
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(true);
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToPreviousReference',
    weight: KeybindingsRegistry.WEIGHT.workbenchContrib(50),
    primary: 1024 /* Shift */ | 62 /* F4 */,
    when: ctxReferenceSearchVisible,
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(false);
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'goToPreviousReferenceFromEmbeddedEditor',
    weight: KeybindingsRegistry.WEIGHT.editorContrib(50),
    primary: 1024 /* Shift */ | 62 /* F4 */,
    when: PeekContext.inPeekEditor,
    handler: function (accessor) {
        withController(accessor, function (controller) {
            controller.goToNextOrPreviousReference(false);
        });
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'closeReferenceSearch',
    weight: KeybindingsRegistry.WEIGHT.workbenchContrib(50),
    primary: 9 /* Escape */,
    secondary: [1024 /* Shift */ | 9 /* Escape */],
    when: ContextKeyExpr.and(ctxReferenceSearchVisible, ContextKeyExpr.not('config.editor.stablePeek')),
    handler: closeActiveReferenceSearch
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'closeReferenceSearchEditor',
    weight: KeybindingsRegistry.WEIGHT.editorContrib(-101),
    primary: 9 /* Escape */,
    secondary: [1024 /* Shift */ | 9 /* Escape */],
    when: ContextKeyExpr.and(PeekContext.inPeekEditor, ContextKeyExpr.not('config.editor.stablePeek')),
    handler: closeActiveReferenceSearch
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'openReferenceToSide',
    weight: KeybindingsRegistry.WEIGHT.editorContrib(),
    primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
    mac: {
        primary: 256 /* WinCtrl */ | 3 /* Enter */
    },
    when: ContextKeyExpr.and(ctxReferenceSearchVisible, ctxReferenceWidgetSearchTreeFocused),
    handler: openReferenceToSide
});
export function provideReferences(model, position, token) {
    // collect references from all providers
    var promises = ReferenceProviderRegistry.ordered(model).map(function (provider) {
        return asWinJsPromise(function (token) {
            return provider.provideReferences(model, position, { includeDeclaration: true }, token);
        }).then(function (result) {
            if (Array.isArray(result)) {
                return result;
            }
            return undefined;
        }, function (err) {
            onUnexpectedExternalError(err);
        });
    });
    return Promise.all(promises).then(function (references) {
        var result = [];
        for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
            var ref = references_1[_i];
            if (ref) {
                result.push.apply(result, ref);
            }
        }
        return result;
    });
}
registerDefaultLanguageCommand('_executeReferenceProvider', provideReferences);
