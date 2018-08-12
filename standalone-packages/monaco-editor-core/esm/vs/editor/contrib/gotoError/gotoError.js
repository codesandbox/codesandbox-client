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
import * as nls from '../../../nls';
import { Emitter } from '../../../base/common/event';
import { dispose } from '../../../base/common/lifecycle';
import { RawContextKey, IContextKeyService } from '../../../platform/contextkey/common/contextkey';
import { IMarkerService, MarkerSeverity } from '../../../platform/markers/common/markers';
import { Range } from '../../common/core/range';
import { registerEditorAction, registerEditorContribution, EditorAction, EditorCommand, registerEditorCommand } from '../../browser/editorExtensions';
import { IThemeService } from '../../../platform/theme/common/themeService';
import { EditorContextKeys } from '../../common/editorContextKeys';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry';
import { MarkerNavigationWidget } from './gotoErrorWidget';
import { compare } from '../../../base/common/strings';
import { binarySearch } from '../../../base/common/arrays';
import { ICodeEditorService } from '../../browser/services/codeEditorService';
import { onUnexpectedError } from '../../../base/common/errors';
var MarkerModel = /** @class */ (function () {
    function MarkerModel(editor, markers) {
        var _this = this;
        this._editor = editor;
        this._markers = null;
        this._nextIdx = -1;
        this._toUnbind = [];
        this._ignoreSelectionChange = false;
        this._onCurrentMarkerChanged = new Emitter();
        this._onMarkerSetChanged = new Emitter();
        this.setMarkers(markers);
        // listen on editor
        this._toUnbind.push(this._editor.onDidDispose(function () { return _this.dispose(); }));
        this._toUnbind.push(this._editor.onDidChangeCursorPosition(function () {
            if (_this._ignoreSelectionChange) {
                return;
            }
            if (_this.currentMarker && Range.containsPosition(_this.currentMarker, _this._editor.getPosition())) {
                return;
            }
            _this._nextIdx = -1;
        }));
    }
    Object.defineProperty(MarkerModel.prototype, "onCurrentMarkerChanged", {
        get: function () {
            return this._onCurrentMarkerChanged.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerModel.prototype, "onMarkerSetChanged", {
        get: function () {
            return this._onMarkerSetChanged.event;
        },
        enumerable: true,
        configurable: true
    });
    MarkerModel.prototype.setMarkers = function (markers) {
        var oldMarker = this._nextIdx >= 0 ? this._markers[this._nextIdx] : undefined;
        this._markers = markers || [];
        this._markers.sort(MarkerNavigationAction.compareMarker);
        if (!oldMarker) {
            this._nextIdx = -1;
        }
        else {
            this._nextIdx = Math.max(-1, binarySearch(this._markers, oldMarker, MarkerNavigationAction.compareMarker));
        }
        this._onMarkerSetChanged.fire(this);
    };
    MarkerModel.prototype.withoutWatchingEditorPosition = function (callback) {
        this._ignoreSelectionChange = true;
        try {
            callback();
        }
        finally {
            this._ignoreSelectionChange = false;
        }
    };
    MarkerModel.prototype._initIdx = function (fwd) {
        var found = false;
        var position = this._editor.getPosition();
        for (var i = 0; i < this._markers.length; i++) {
            var range = Range.lift(this._markers[i]);
            if (range.isEmpty()) {
                var word = this._editor.getModel().getWordAtPosition(range.getStartPosition());
                if (word) {
                    range = new Range(range.startLineNumber, word.startColumn, range.startLineNumber, word.endColumn);
                }
            }
            if (range.containsPosition(position) || position.isBeforeOrEqual(range.getStartPosition())) {
                this._nextIdx = i;
                found = true;
                break;
            }
        }
        if (!found) {
            // after the last change
            this._nextIdx = fwd ? 0 : this._markers.length - 1;
        }
        if (this._nextIdx < 0) {
            this._nextIdx = this._markers.length - 1;
        }
    };
    Object.defineProperty(MarkerModel.prototype, "currentMarker", {
        get: function () {
            return this.canNavigate() ? this._markers[this._nextIdx] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    MarkerModel.prototype.move = function (fwd, inCircles) {
        if (!this.canNavigate()) {
            this._onCurrentMarkerChanged.fire(undefined);
            return !inCircles;
        }
        var oldIdx = this._nextIdx;
        var atEdge = false;
        if (this._nextIdx === -1) {
            this._initIdx(fwd);
        }
        else if (fwd) {
            if (inCircles || this._nextIdx + 1 < this._markers.length) {
                this._nextIdx = (this._nextIdx + 1) % this._markers.length;
            }
            else {
                atEdge = true;
            }
        }
        else if (!fwd) {
            if (inCircles || this._nextIdx > 0) {
                this._nextIdx = (this._nextIdx - 1 + this._markers.length) % this._markers.length;
            }
            else {
                atEdge = true;
            }
        }
        if (oldIdx !== this._nextIdx) {
            var marker = this._markers[this._nextIdx];
            this._onCurrentMarkerChanged.fire(marker);
        }
        return atEdge;
    };
    MarkerModel.prototype.canNavigate = function () {
        return this._markers.length > 0;
    };
    MarkerModel.prototype.findMarkerAtPosition = function (pos) {
        for (var _i = 0, _a = this._markers; _i < _a.length; _i++) {
            var marker = _a[_i];
            if (Range.containsPosition(marker, pos)) {
                return marker;
            }
        }
        return undefined;
    };
    Object.defineProperty(MarkerModel.prototype, "total", {
        get: function () {
            return this._markers.length;
        },
        enumerable: true,
        configurable: true
    });
    MarkerModel.prototype.indexOf = function (marker) {
        return 1 + this._markers.indexOf(marker);
    };
    MarkerModel.prototype.dispose = function () {
        this._toUnbind = dispose(this._toUnbind);
    };
    return MarkerModel;
}());
var MarkerController = /** @class */ (function () {
    function MarkerController(editor, _markerService, _contextKeyService, _themeService, _editorService) {
        this._markerService = _markerService;
        this._contextKeyService = _contextKeyService;
        this._themeService = _themeService;
        this._editorService = _editorService;
        this._disposeOnClose = [];
        this._editor = editor;
        this._widgetVisible = CONTEXT_MARKERS_NAVIGATION_VISIBLE.bindTo(this._contextKeyService);
    }
    MarkerController.get = function (editor) {
        return editor.getContribution(MarkerController.ID);
    };
    MarkerController.prototype.getId = function () {
        return MarkerController.ID;
    };
    MarkerController.prototype.dispose = function () {
        this._cleanUp();
    };
    MarkerController.prototype._cleanUp = function () {
        this._widgetVisible.reset();
        this._disposeOnClose = dispose(this._disposeOnClose);
        this._widget = null;
        this._model = null;
    };
    MarkerController.prototype.getOrCreateModel = function () {
        var _this = this;
        if (this._model) {
            return this._model;
        }
        var markers = this._getMarkers();
        this._model = new MarkerModel(this._editor, markers);
        this._markerService.onMarkerChanged(this._onMarkerChanged, this, this._disposeOnClose);
        this._widget = new MarkerNavigationWidget(this._editor, this._themeService);
        this._widgetVisible.set(true);
        this._disposeOnClose.push(this._model);
        this._disposeOnClose.push(this._widget);
        this._disposeOnClose.push(this._widget.onDidSelectRelatedInformation(function (related) {
            _this._editorService.openCodeEditor({
                resource: related.resource,
                options: { pinned: true, revealIfOpened: true, selection: Range.lift(related).collapseToStart() }
            }, _this._editor).then(undefined, onUnexpectedError);
            _this.closeMarkersNavigation(false);
        }));
        this._disposeOnClose.push(this._editor.onDidChangeModel(function () { return _this._cleanUp(); }));
        this._disposeOnClose.push(this._model.onCurrentMarkerChanged(function (marker) {
            if (!marker) {
                _this._cleanUp();
            }
            else {
                _this._model.withoutWatchingEditorPosition(function () {
                    _this._widget.showAtMarker(marker, _this._model.indexOf(marker), _this._model.total);
                });
            }
        }));
        this._disposeOnClose.push(this._model.onMarkerSetChanged(function () {
            var marker = _this._model.findMarkerAtPosition(_this._widget.position);
            if (marker) {
                _this._widget.updateMarker(marker);
            }
            else {
                _this._widget.showStale();
            }
        }));
        return this._model;
    };
    MarkerController.prototype.closeMarkersNavigation = function (focusEditor) {
        if (focusEditor === void 0) { focusEditor = true; }
        this._cleanUp();
        if (focusEditor) {
            this._editor.focus();
        }
    };
    MarkerController.prototype._onMarkerChanged = function (changedResources) {
        var _this = this;
        if (!changedResources.some(function (r) { return _this._editor.getModel().uri.toString() === r.toString(); })) {
            return;
        }
        this._model.setMarkers(this._getMarkers());
    };
    MarkerController.prototype._getMarkers = function () {
        return this._markerService.read({
            resource: this._editor.getModel().uri,
            severities: MarkerSeverity.Error | MarkerSeverity.Warning | MarkerSeverity.Info
        });
    };
    MarkerController.ID = 'editor.contrib.markerController';
    MarkerController = __decorate([
        __param(1, IMarkerService),
        __param(2, IContextKeyService),
        __param(3, IThemeService),
        __param(4, ICodeEditorService)
    ], MarkerController);
    return MarkerController;
}());
var MarkerNavigationAction = /** @class */ (function (_super) {
    __extends(MarkerNavigationAction, _super);
    function MarkerNavigationAction(next, multiFile, opts) {
        var _this = _super.call(this, opts) || this;
        _this._isNext = next;
        _this._multiFile = multiFile;
        return _this;
    }
    MarkerNavigationAction.prototype.run = function (accessor, editor) {
        var _this = this;
        var markerService = accessor.get(IMarkerService);
        var editorService = accessor.get(ICodeEditorService);
        var controller = MarkerController.get(editor);
        if (!controller) {
            return undefined;
        }
        var model = controller.getOrCreateModel();
        var atEdge = model.move(this._isNext, !this._multiFile);
        if (!atEdge || !this._multiFile) {
            return undefined;
        }
        // try with the next/prev file
        var markers = markerService.read({ severities: MarkerSeverity.Error | MarkerSeverity.Warning | MarkerSeverity.Info }).sort(MarkerNavigationAction.compareMarker);
        if (markers.length === 0) {
            return undefined;
        }
        var oldMarker = model.currentMarker || { resource: editor.getModel().uri, severity: MarkerSeverity.Error, startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 };
        var idx = binarySearch(markers, oldMarker, MarkerNavigationAction.compareMarker);
        if (idx < 0) {
            // find best match...
            idx = ~idx;
            idx %= markers.length;
        }
        else if (this._isNext) {
            idx = (idx + 1) % markers.length;
        }
        else {
            idx = (idx + markers.length - 1) % markers.length;
        }
        var newMarker = markers[idx];
        if (newMarker.resource.toString() === editor.getModel().uri.toString()) {
            // the next `resource` is this resource which
            // means we cycle within this file
            model.move(this._isNext, true);
            return undefined;
        }
        // close the widget for this editor-instance, open the resource
        // for the next marker and re-start marker navigation in there
        controller.closeMarkersNavigation();
        return editorService.openCodeEditor({
            resource: newMarker.resource,
            options: { pinned: false, revealIfOpened: true, revealInCenterIfOutsideViewport: true, selection: newMarker }
        }, editor).then(function (editor) {
            if (!editor) {
                return undefined;
            }
            return editor.getAction(_this.id).run();
        });
    };
    MarkerNavigationAction.compareMarker = function (a, b) {
        var res = compare(a.resource.toString(), b.resource.toString());
        if (res === 0) {
            res = MarkerSeverity.compare(a.severity, b.severity);
        }
        if (res === 0) {
            res = Range.compareRangesUsingStarts(a, b);
        }
        return res;
    };
    return MarkerNavigationAction;
}(EditorAction));
var NextMarkerAction = /** @class */ (function (_super) {
    __extends(NextMarkerAction, _super);
    function NextMarkerAction() {
        return _super.call(this, true, false, {
            id: 'editor.action.marker.next',
            label: nls.localize('markerAction.next.label', "Go to Next Problem (Error, Warning, Info)"),
            alias: 'Go to Next Error or Warning',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return NextMarkerAction;
}(MarkerNavigationAction));
var PrevMarkerAction = /** @class */ (function (_super) {
    __extends(PrevMarkerAction, _super);
    function PrevMarkerAction() {
        return _super.call(this, false, false, {
            id: 'editor.action.marker.prev',
            label: nls.localize('markerAction.previous.label', "Go to Previous Problem (Error, Warning, Info)"),
            alias: 'Go to Previous Error or Warning',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    return PrevMarkerAction;
}(MarkerNavigationAction));
var NextMarkerInFilesAction = /** @class */ (function (_super) {
    __extends(NextMarkerInFilesAction, _super);
    function NextMarkerInFilesAction() {
        return _super.call(this, true, true, {
            id: 'editor.action.marker.nextInFiles',
            label: nls.localize('markerAction.nextInFiles.label', "Go to Next Problem in Files (Error, Warning, Info)"),
            alias: 'Go to Next Error or Warning in Files',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 66 /* F8 */
            }
        }) || this;
    }
    return NextMarkerInFilesAction;
}(MarkerNavigationAction));
var PrevMarkerInFilesAction = /** @class */ (function (_super) {
    __extends(PrevMarkerInFilesAction, _super);
    function PrevMarkerInFilesAction() {
        return _super.call(this, false, true, {
            id: 'editor.action.marker.prevInFiles',
            label: nls.localize('markerAction.previousInFiles.label', "Go to Previous Problem in Files (Error, Warning, Info)"),
            alias: 'Go to Previous Error or Warning in Files',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 1024 /* Shift */ | 66 /* F8 */
            }
        }) || this;
    }
    return PrevMarkerInFilesAction;
}(MarkerNavigationAction));
registerEditorContribution(MarkerController);
registerEditorAction(NextMarkerAction);
registerEditorAction(PrevMarkerAction);
registerEditorAction(NextMarkerInFilesAction);
registerEditorAction(PrevMarkerInFilesAction);
var CONTEXT_MARKERS_NAVIGATION_VISIBLE = new RawContextKey('markersNavigationVisible', false);
var MarkerCommand = EditorCommand.bindToContribution(MarkerController.get);
registerEditorCommand(new MarkerCommand({
    id: 'closeMarkersNavigation',
    precondition: CONTEXT_MARKERS_NAVIGATION_VISIBLE,
    handler: function (x) { return x.closeMarkersNavigation(); },
    kbOpts: {
        weight: KeybindingsRegistry.WEIGHT.editorContrib(50),
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
