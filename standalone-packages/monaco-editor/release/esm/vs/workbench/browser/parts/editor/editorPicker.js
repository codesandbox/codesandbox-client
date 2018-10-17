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
import './media/editorpicker.css';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import { QuickOpenModel, QuickOpenEntryGroup, QuickOpenItemAccessor } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { getIconClasses } from '../../labels.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { QuickOpenHandler } from '../../quickopen.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { toResource } from '../../../common/editor.js';
import { compareItemsByScore, scoreItem, prepareQuery } from '../../../../base/parts/quickopen/common/quickOpenScorer.js';
var EditorPickerEntry = /** @class */ (function (_super) {
    __extends(EditorPickerEntry, _super);
    function EditorPickerEntry(editor, _group, modeService, modelService) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this._group = _group;
        _this.modeService = modeService;
        _this.modelService = modelService;
        return _this;
    }
    EditorPickerEntry.prototype.getLabelOptions = function () {
        return {
            extraClasses: getIconClasses(this.modelService, this.modeService, this.getResource()),
            italic: !this._group.isPinned(this.editor)
        };
    };
    EditorPickerEntry.prototype.getLabel = function () {
        return this.editor.getName();
    };
    EditorPickerEntry.prototype.getIcon = function () {
        return this.editor.isDirty() ? 'dirty' : '';
    };
    Object.defineProperty(EditorPickerEntry.prototype, "group", {
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    EditorPickerEntry.prototype.getResource = function () {
        return toResource(this.editor, { supportSideBySide: true });
    };
    EditorPickerEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, editor group picker", this.getLabel());
    };
    EditorPickerEntry.prototype.getDescription = function () {
        return this.editor.getDescription();
    };
    EditorPickerEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            return this.runOpen(context);
        }
        return _super.prototype.run.call(this, mode, context);
    };
    EditorPickerEntry.prototype.runOpen = function (context) {
        this._group.openEditor(this.editor);
        return true;
    };
    EditorPickerEntry = __decorate([
        __param(2, IModeService),
        __param(3, IModelService)
    ], EditorPickerEntry);
    return EditorPickerEntry;
}(QuickOpenEntryGroup));
export { EditorPickerEntry };
var BaseEditorPicker = /** @class */ (function (_super) {
    __extends(BaseEditorPicker, _super);
    function BaseEditorPicker(instantiationService, editorService, editorGroupService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.scorerCache = Object.create(null);
        return _this;
    }
    BaseEditorPicker.prototype.getResults = function (searchValue, token) {
        var _this = this;
        var editorEntries = this.getEditorEntries();
        if (!editorEntries.length) {
            return TPromise.as(null);
        }
        // Prepare search for scoring
        var query = prepareQuery(searchValue);
        var entries = editorEntries.filter(function (e) {
            if (!query.value) {
                return true;
            }
            var itemScore = scoreItem(e, query, true, QuickOpenItemAccessor, _this.scorerCache);
            if (!itemScore.score) {
                return false;
            }
            e.setHighlights(itemScore.labelMatch, itemScore.descriptionMatch);
            return true;
        });
        // Sorting
        if (query.value) {
            var groups_1 = this.editorGroupService.getGroups(2 /* GRID_APPEARANCE */);
            entries.sort(function (e1, e2) {
                if (e1.group !== e2.group) {
                    return groups_1.indexOf(e1.group) - groups_1.indexOf(e2.group); // older groups first
                }
                return compareItemsByScore(e1, e2, query, true, QuickOpenItemAccessor, _this.scorerCache);
            });
        }
        // Grouping (for more than one group)
        if (this.editorGroupService.count > 1) {
            var lastGroup_1;
            entries.forEach(function (e) {
                if (!lastGroup_1 || lastGroup_1 !== e.group) {
                    e.setGroupLabel(e.group.label);
                    e.setShowBorder(!!lastGroup_1);
                    lastGroup_1 = e.group;
                }
            });
        }
        return TPromise.as(new QuickOpenModel(entries));
    };
    BaseEditorPicker.prototype.onClose = function (canceled) {
        this.scorerCache = Object.create(null);
    };
    BaseEditorPicker = __decorate([
        __param(0, IInstantiationService),
        __param(1, IEditorService),
        __param(2, IEditorGroupsService)
    ], BaseEditorPicker);
    return BaseEditorPicker;
}(QuickOpenHandler));
export { BaseEditorPicker };
var ActiveEditorGroupPicker = /** @class */ (function (_super) {
    __extends(ActiveEditorGroupPicker, _super);
    function ActiveEditorGroupPicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActiveEditorGroupPicker.prototype.getEditorEntries = function () {
        var _this = this;
        return this.group.getEditors(0 /* MOST_RECENTLY_ACTIVE */).map(function (editor, index) { return _this.instantiationService.createInstance(EditorPickerEntry, editor, _this.group); });
    };
    Object.defineProperty(ActiveEditorGroupPicker.prototype, "group", {
        get: function () {
            return this.editorGroupService.activeGroup;
        },
        enumerable: true,
        configurable: true
    });
    ActiveEditorGroupPicker.prototype.getEmptyLabel = function (searchString) {
        if (searchString) {
            return nls.localize('noResultsFoundInGroup', "No matching opened editor found in group");
        }
        return nls.localize('noOpenedEditors', "List of opened editors is currently empty in group");
    };
    ActiveEditorGroupPicker.prototype.getAutoFocus = function (searchValue, context) {
        if (searchValue || !context.quickNavigateConfiguration) {
            return {
                autoFocusFirstEntry: true
            };
        }
        var isShiftNavigate = (context.quickNavigateConfiguration && context.quickNavigateConfiguration.keybindings.some(function (k) {
            var _a = k.getParts(), firstPart = _a[0], chordPart = _a[1];
            if (chordPart) {
                return false;
            }
            return firstPart.shiftKey;
        }));
        if (isShiftNavigate) {
            return {
                autoFocusLastEntry: true
            };
        }
        var editors = this.group.count;
        return {
            autoFocusFirstEntry: editors === 1,
            autoFocusSecondEntry: editors > 1
        };
    };
    ActiveEditorGroupPicker.ID = 'workbench.picker.activeEditors';
    return ActiveEditorGroupPicker;
}(BaseEditorPicker));
export { ActiveEditorGroupPicker };
var AllEditorsPicker = /** @class */ (function (_super) {
    __extends(AllEditorsPicker, _super);
    function AllEditorsPicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AllEditorsPicker.prototype.getEditorEntries = function () {
        var _this = this;
        var entries = [];
        this.editorGroupService.getGroups(2 /* GRID_APPEARANCE */).forEach(function (group) {
            group.editors.forEach(function (editor) {
                entries.push(_this.instantiationService.createInstance(EditorPickerEntry, editor, group));
            });
        });
        return entries;
    };
    AllEditorsPicker.prototype.getEmptyLabel = function (searchString) {
        if (searchString) {
            return nls.localize('noResultsFound', "No matching opened editor found");
        }
        return nls.localize('noOpenedEditorsAllGroups', "List of opened editors is currently empty");
    };
    AllEditorsPicker.prototype.getAutoFocus = function (searchValue, context) {
        if (searchValue) {
            return {
                autoFocusFirstEntry: true
            };
        }
        return _super.prototype.getAutoFocus.call(this, searchValue, context);
    };
    AllEditorsPicker.ID = 'workbench.picker.editors';
    return AllEditorsPicker;
}(BaseEditorPicker));
export { AllEditorsPicker };
