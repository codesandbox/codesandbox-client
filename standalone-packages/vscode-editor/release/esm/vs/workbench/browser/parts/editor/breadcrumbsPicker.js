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
import { onDidChangeZoomLevel } from '../../../../base/browser/browser.js';
import * as dom from '../../../../base/browser/dom.js';
import { compareFileNames } from '../../../../base/common/comparers.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { createMatches, fuzzyScore } from '../../../../base/common/filters.js';
import * as glob from '../../../../base/common/glob.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { join } from '../../../../base/common/paths.js';
import { basename, dirname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import './media/breadcrumbscontrol.css';
import { OutlineElement, OutlineModel } from '../../../../editor/contrib/documentSymbols/outlineModel.js';
import { OutlineDataSource, OutlineItemComparator, OutlineRenderer } from '../../../../editor/contrib/documentSymbols/outlineTree.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { HighlightingWorkbenchTree } from '../../../../platform/list/browser/listService.js';
import { breadcrumbsPickerBackground, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { FileLabel } from '../../labels.js';
import { BreadcrumbsConfig } from './breadcrumbs.js';
import { FileElement } from './breadcrumbsModel.js';
import { IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';
export function createBreadcrumbsPicker(instantiationService, parent, element) {
    var ctor = element instanceof FileElement ? BreadcrumbsFilePicker : BreadcrumbsOutlinePicker;
    return instantiationService.createInstance(ctor, parent);
}
var BreadcrumbsPicker = /** @class */ (function () {
    function BreadcrumbsPicker(parent, _instantiationService, _themeService, _configurationService) {
        var _this = this;
        this._instantiationService = _instantiationService;
        this._themeService = _themeService;
        this._configurationService = _configurationService;
        this._disposables = new Array();
        this._onDidPickElement = new Emitter();
        this.onDidPickElement = this._onDidPickElement.event;
        this._onDidFocusElement = new Emitter();
        this.onDidFocusElement = this._onDidFocusElement.event;
        this._domNode = document.createElement('div');
        this._domNode.className = 'monaco-breadcrumbs-picker show-file-icons';
        parent.appendChild(this._domNode);
        this._focus = dom.trackFocus(this._domNode);
        this._focus.onDidBlur(function (_) { return _this._onDidPickElement.fire({ target: undefined, payload: undefined }); }, undefined, this._disposables);
        this._disposables.push(onDidChangeZoomLevel(function (_) { return _this._onDidPickElement.fire({ target: undefined, payload: undefined }); }));
        var theme = this._themeService.getTheme();
        var color = theme.getColor(breadcrumbsPickerBackground);
        this._arrow = document.createElement('div');
        this._arrow.className = 'arrow';
        this._arrow.style.borderColor = "transparent transparent " + color.toString();
        this._domNode.appendChild(this._arrow);
        this._treeContainer = document.createElement('div');
        this._treeContainer.style.background = color.toString();
        this._treeContainer.style.paddingTop = '2px';
        this._treeContainer.style.boxShadow = "0px 5px 8px " + this._themeService.getTheme().getColor(widgetShadow);
        this._domNode.appendChild(this._treeContainer);
        var filterConfig = BreadcrumbsConfig.FilterOnType.bindTo(this._configurationService);
        this._disposables.push(filterConfig);
        var treeConifg = this._completeTreeConfiguration({ dataSource: undefined, renderer: undefined, highlighter: undefined });
        this._tree = this._instantiationService.createInstance(HighlightingWorkbenchTree, this._treeContainer, treeConifg, { useShadows: false, filterOnType: filterConfig.getValue(), showTwistie: false, twistiePixels: 12 }, { placeholder: localize('placeholder', "Find") });
        this._disposables.push(this._tree.onDidChangeSelection(function (e) {
            if (e.payload !== _this._tree) {
                var target_1 = _this._getTargetFromEvent(e.selection[0], e.payload);
                if (target_1) {
                    setTimeout(function (_) {
                        _this._onDidPickElement.fire({ target: target_1, payload: e.payload });
                    }, 0);
                }
            }
        }));
        this._disposables.push(this._tree.onDidChangeFocus(function (e) {
            var target = _this._getTargetFromEvent(e.focus, e.payload);
            if (target) {
                _this._onDidFocusElement.fire({ target: target, payload: e.payload });
            }
        }));
        this._disposables.push(this._tree.onDidStartFiltering(function () {
            _this._layoutInfo.inputHeight = 36;
            _this._layout();
        }));
        this._disposables.push(this._tree.onDidExpandItem(function () {
            _this._layout();
        }));
        this._disposables.push(this._tree.onDidCollapseItem(function () {
            _this._layout();
        }));
        // tree icon theme specials
        dom.addClass(this._treeContainer, 'file-icon-themable-tree');
        dom.addClass(this._treeContainer, 'show-file-icons');
        var onFileIconThemeChange = function (fileIconTheme) {
            dom.toggleClass(_this._treeContainer, 'align-icons-and-twisties', fileIconTheme.hasFileIcons && !fileIconTheme.hasFolderIcons);
            dom.toggleClass(_this._treeContainer, 'hide-arrows', fileIconTheme.hidesExplorerArrows === true);
        };
        this._disposables.push(_themeService.onDidFileIconThemeChange(onFileIconThemeChange));
        onFileIconThemeChange(_themeService.getFileIconTheme());
        this._domNode.focus();
    }
    BreadcrumbsPicker.prototype.dispose = function () {
        dispose(this._disposables);
        this._onDidPickElement.dispose();
        this._tree.dispose();
        this._focus.dispose();
    };
    BreadcrumbsPicker.prototype.setInput = function (input, maxHeight, width, arrowSize, arrowOffset) {
        var _this = this;
        var actualInput = this._getInput(input);
        this._tree.setInput(actualInput).then(function () {
            _this._layoutInfo = { maxHeight: maxHeight, width: width, arrowSize: arrowSize, arrowOffset: arrowOffset, inputHeight: 0 };
            _this._layout();
            // use proper selection, reveal
            var selection = _this._getInitialSelection(_this._tree, input);
            if (selection) {
                return _this._tree.reveal(selection, .5).then(function () {
                    _this._tree.setSelection([selection], _this._tree);
                    _this._tree.setFocus(selection);
                    _this._tree.domFocus();
                });
            }
            else {
                _this._tree.focusFirst();
                _this._tree.setSelection([_this._tree.getFocus()], _this._tree);
                _this._tree.domFocus();
                return Promise.resolve(null);
            }
        }, onUnexpectedError);
    };
    BreadcrumbsPicker.prototype._layout = function (info) {
        if (info === void 0) { info = this._layoutInfo; }
        var count = 0;
        var nav = this._tree.getNavigator(undefined, false);
        while (nav.next() && count < 13) {
            count += 1;
        }
        var headerHeight = 2 * info.arrowSize;
        var treeHeight = Math.min(info.maxHeight - headerHeight, count * 22);
        var totalHeight = treeHeight + headerHeight;
        this._domNode.style.height = totalHeight + "px";
        this._domNode.style.width = info.width + "px";
        this._arrow.style.top = "-" + 2 * info.arrowSize + "px";
        this._arrow.style.borderWidth = info.arrowSize + "px";
        this._arrow.style.marginLeft = info.arrowOffset + "px";
        this._treeContainer.style.height = treeHeight + "px";
        this._treeContainer.style.width = info.width + "px";
        this._tree.layout();
        this._layoutInfo = info;
    };
    BreadcrumbsPicker = __decorate([
        __param(1, IInstantiationService),
        __param(2, IWorkbenchThemeService),
        __param(3, IConfigurationService)
    ], BreadcrumbsPicker);
    return BreadcrumbsPicker;
}());
export { BreadcrumbsPicker };
//#region - Files
var FileDataSource = /** @class */ (function () {
    function FileDataSource(_fileService) {
        this._fileService = _fileService;
        this._parents = new WeakMap();
    }
    FileDataSource.prototype.getId = function (tree, element) {
        if (URI.isUri(element)) {
            return element.toString();
        }
        else if (IWorkspace.isIWorkspace(element)) {
            return element.id;
        }
        else if (IWorkspaceFolder.isIWorkspaceFolder(element)) {
            return element.uri.toString();
        }
        else {
            return element.resource.toString();
        }
    };
    FileDataSource.prototype.hasChildren = function (tree, element) {
        return URI.isUri(element) || IWorkspace.isIWorkspace(element) || IWorkspaceFolder.isIWorkspaceFolder(element) || element.isDirectory;
    };
    FileDataSource.prototype.getChildren = function (tree, element) {
        var _this = this;
        if (IWorkspace.isIWorkspace(element)) {
            return Promise.resolve(element.folders).then(function (folders) {
                for (var _i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
                    var child = folders_1[_i];
                    _this._parents.set(element, child);
                }
                return folders;
            });
        }
        var uri;
        if (IWorkspaceFolder.isIWorkspaceFolder(element)) {
            uri = element.uri;
        }
        else if (URI.isUri(element)) {
            uri = element;
        }
        else {
            uri = element.resource;
        }
        return this._fileService.resolveFile(uri).then(function (stat) {
            for (var _i = 0, _a = stat.children; _i < _a.length; _i++) {
                var child = _a[_i];
                _this._parents.set(stat, child);
            }
            return stat.children;
        });
    };
    FileDataSource.prototype.getParent = function (tree, element) {
        return Promise.resolve(this._parents.get(element));
    };
    FileDataSource = __decorate([
        __param(0, IFileService)
    ], FileDataSource);
    return FileDataSource;
}());
export { FileDataSource };
var FileFilter = /** @class */ (function () {
    function FileFilter(_workspaceService, configService) {
        var _this = this;
        this._workspaceService = _workspaceService;
        this._cachedExpressions = new Map();
        this._disposables = [];
        var config = BreadcrumbsConfig.FileExcludes.bindTo(configService);
        var update = function () {
            _workspaceService.getWorkspace().folders.forEach(function (folder) {
                var excludesConfig = config.getValue({ resource: folder.uri });
                if (!excludesConfig) {
                    return;
                }
                // adjust patterns to be absolute in case they aren't
                // free floating (**/)
                var adjustedConfig = {};
                for (var pattern in excludesConfig) {
                    if (typeof excludesConfig[pattern] !== 'boolean') {
                        continue;
                    }
                    var patternAbs = pattern.indexOf('**/') !== 0
                        ? join(folder.uri.path, pattern)
                        : pattern;
                    adjustedConfig[patternAbs] = excludesConfig[pattern];
                }
                _this._cachedExpressions.set(folder.uri.toString(), glob.parse(adjustedConfig));
            });
        };
        update();
        this._disposables.push(config, config.onDidChange(update), _workspaceService.onDidChangeWorkspaceFolders(update));
    }
    FileFilter.prototype.dispose = function () {
        dispose(this._disposables);
    };
    FileFilter.prototype.isVisible = function (tree, element) {
        if (IWorkspaceFolder.isIWorkspaceFolder(element)) {
            // not a file
            return true;
        }
        var folder = this._workspaceService.getWorkspaceFolder(element.resource);
        if (!folder || !this._cachedExpressions.has(folder.uri.toString())) {
            // no folder or no filer
            return true;
        }
        var expression = this._cachedExpressions.get(folder.uri.toString());
        return !expression(element.resource.path, basename(element.resource));
    };
    FileFilter = __decorate([
        __param(0, IWorkspaceContextService),
        __param(1, IConfigurationService)
    ], FileFilter);
    return FileFilter;
}());
export { FileFilter };
var FileHighlighter = /** @class */ (function () {
    function FileHighlighter() {
    }
    FileHighlighter.prototype.getHighlightsStorageKey = function (element) {
        return IWorkspaceFolder.isIWorkspaceFolder(element) ? element.uri.toString() : element.resource.toString();
    };
    FileHighlighter.prototype.getHighlights = function (tree, element, pattern) {
        return fuzzyScore(pattern, element.name, undefined, true);
    };
    return FileHighlighter;
}());
export { FileHighlighter };
var FileRenderer = /** @class */ (function () {
    function FileRenderer(_instantiationService, _configService) {
        this._instantiationService = _instantiationService;
        this._configService = _configService;
    }
    FileRenderer.prototype.getHeight = function (tree, element) {
        return 22;
    };
    FileRenderer.prototype.getTemplateId = function (tree, element) {
        return 'FileStat';
    };
    FileRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        return this._instantiationService.createInstance(FileLabel, container, { supportHighlights: true });
    };
    FileRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
        var fileDecorations = this._configService.getValue('explorer.decorations');
        var resource;
        var fileKind;
        if (IWorkspaceFolder.isIWorkspaceFolder(element)) {
            resource = element.uri;
            fileKind = FileKind.ROOT_FOLDER;
        }
        else {
            resource = element.resource;
            fileKind = element.isDirectory ? FileKind.FOLDER : FileKind.FILE;
        }
        templateData.setFile(resource, {
            fileKind: fileKind,
            hidePath: true,
            fileDecorations: fileDecorations,
            matches: createMatches(tree.getHighlighterScore(element)),
            extraClasses: ['picker-item']
        });
    };
    FileRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        templateData.dispose();
    };
    FileRenderer = __decorate([
        __param(0, IInstantiationService),
        __param(1, IConfigurationService)
    ], FileRenderer);
    return FileRenderer;
}());
export { FileRenderer };
var FileSorter = /** @class */ (function () {
    function FileSorter() {
    }
    FileSorter.prototype.compare = function (tree, a, b) {
        if (IWorkspaceFolder.isIWorkspaceFolder(a) && IWorkspaceFolder.isIWorkspaceFolder(b)) {
            return a.index - b.index;
        }
        else {
            if (a.isDirectory === b.isDirectory) {
                // same type -> compare on names
                return compareFileNames(a.name, b.name);
            }
            else if (a.isDirectory) {
                return -1;
            }
            else {
                return 1;
            }
        }
    };
    return FileSorter;
}());
export { FileSorter };
var BreadcrumbsFilePicker = /** @class */ (function (_super) {
    __extends(BreadcrumbsFilePicker, _super);
    function BreadcrumbsFilePicker(parent, instantiationService, themeService, configService, _workspaceService) {
        var _this = _super.call(this, parent, instantiationService, themeService, configService) || this;
        _this._workspaceService = _workspaceService;
        return _this;
    }
    BreadcrumbsFilePicker.prototype._getInput = function (input) {
        var _a = input, uri = _a.uri, kind = _a.kind;
        if (kind === FileKind.ROOT_FOLDER) {
            return this._workspaceService.getWorkspace();
        }
        else {
            return dirname(uri);
        }
    };
    BreadcrumbsFilePicker.prototype._getInitialSelection = function (tree, input) {
        var uri = input.uri;
        var nav = tree.getNavigator();
        while (nav.next()) {
            var cur = nav.current();
            var candidate = IWorkspaceFolder.isIWorkspaceFolder(cur) ? cur.uri : cur.resource;
            if (isEqual(uri, candidate)) {
                return cur;
            }
        }
        return undefined;
    };
    BreadcrumbsFilePicker.prototype._completeTreeConfiguration = function (config) {
        // todo@joh reuse explorer implementations?
        var filter = this._instantiationService.createInstance(FileFilter);
        this._disposables.push(filter);
        config.dataSource = this._instantiationService.createInstance(FileDataSource);
        config.renderer = this._instantiationService.createInstance(FileRenderer);
        config.sorter = new FileSorter();
        config.highlighter = new FileHighlighter();
        config.filter = filter;
        return config;
    };
    BreadcrumbsFilePicker.prototype._getTargetFromEvent = function (element, _payload) {
        if (element && !IWorkspaceFolder.isIWorkspaceFolder(element) && !element.isDirectory) {
            return new FileElement(element.resource, FileKind.FILE);
        }
    };
    BreadcrumbsFilePicker = __decorate([
        __param(1, IInstantiationService),
        __param(2, IWorkbenchThemeService),
        __param(3, IConfigurationService),
        __param(4, IWorkspaceContextService)
    ], BreadcrumbsFilePicker);
    return BreadcrumbsFilePicker;
}(BreadcrumbsPicker));
export { BreadcrumbsFilePicker };
//#endregion
//#region - Symbols
var OutlineHighlighter = /** @class */ (function () {
    function OutlineHighlighter() {
    }
    OutlineHighlighter.prototype.getHighlights = function (tree, element, pattern) {
        OutlineModel.get(element).updateMatches(pattern);
        return element.score;
    };
    return OutlineHighlighter;
}());
var BreadcrumbsOutlinePicker = /** @class */ (function (_super) {
    __extends(BreadcrumbsOutlinePicker, _super);
    function BreadcrumbsOutlinePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbsOutlinePicker.prototype._getInput = function (input) {
        var element = input;
        var model = OutlineModel.get(element);
        model.updateMatches('');
        return model;
    };
    BreadcrumbsOutlinePicker.prototype._getInitialSelection = function (_tree, input) {
        return input instanceof OutlineModel ? undefined : input;
    };
    BreadcrumbsOutlinePicker.prototype._completeTreeConfiguration = function (config) {
        config.dataSource = this._instantiationService.createInstance(OutlineDataSource);
        config.renderer = this._instantiationService.createInstance(OutlineRenderer);
        config.sorter = new OutlineItemComparator();
        config.highlighter = new OutlineHighlighter();
        return config;
    };
    BreadcrumbsOutlinePicker.prototype._getTargetFromEvent = function (element, payload) {
        if (payload && payload.didClickOnTwistie) {
            return;
        }
        if (element instanceof OutlineElement) {
            return element;
        }
    };
    return BreadcrumbsOutlinePicker;
}(BreadcrumbsPicker));
export { BreadcrumbsOutlinePicker };
