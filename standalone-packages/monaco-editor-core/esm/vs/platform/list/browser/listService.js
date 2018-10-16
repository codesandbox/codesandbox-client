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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { addClass, addStandardDisposableListener, createStyleSheet, getTotalHeight, removeClass } from '../../../base/browser/dom';
import { InputBox } from '../../../base/browser/ui/inputbox/inputBox';
import { PagedList } from '../../../base/browser/ui/list/listPaging';
import { DefaultStyleController, isSelectionRangeChangeEvent, isSelectionSingleChangeEvent, List } from '../../../base/browser/ui/list/listWidget';
import { canceled, onUnexpectedError } from '../../../base/common/errors';
import { Emitter } from '../../../base/common/event';
import { combinedDisposable, Disposable, dispose, toDisposable } from '../../../base/common/lifecycle';
import { ScrollbarVisibility } from '../../../base/common/scrollable';
import { isUndefinedOrNull } from '../../../base/common/types';
import { DefaultController, DefaultTreestyler } from '../../../base/parts/tree/browser/treeDefaults';
import { Tree } from '../../../base/parts/tree/browser/treeImpl';
import { localize } from '../../../nls';
import { IConfigurationService } from '../../configuration/common/configuration';
import { Extensions as ConfigurationExtensions } from '../../configuration/common/configurationRegistry';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey';
import { IContextViewService } from '../../contextview/browser/contextView';
import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation';
import { IKeybindingService } from '../../keybinding/common/keybinding';
import { Registry } from '../../registry/common/platform';
import { attachInputBoxStyler, attachListStyler, computeStyles, defaultListStyles } from '../../theme/common/styler';
import { IThemeService } from '../../theme/common/themeService';
import { InputFocusedContextKey } from '../../workbench/common/contextkeys';
export var IListService = createDecorator('listService');
var ListService = /** @class */ (function () {
    function ListService(contextKeyService) {
        this.lists = [];
        this._lastFocusedWidget = undefined;
    }
    Object.defineProperty(ListService.prototype, "lastFocusedList", {
        get: function () {
            return this._lastFocusedWidget;
        },
        enumerable: true,
        configurable: true
    });
    ListService.prototype.register = function (widget, extraContextKeys) {
        var _this = this;
        if (this.lists.some(function (l) { return l.widget === widget; })) {
            throw new Error('Cannot register the same widget multiple times');
        }
        // Keep in our lists list
        var registeredList = { widget: widget, extraContextKeys: extraContextKeys };
        this.lists.push(registeredList);
        // Check for currently being focused
        if (widget.isDOMFocused()) {
            this._lastFocusedWidget = widget;
        }
        var result = combinedDisposable([
            widget.onDidFocus(function () { return _this._lastFocusedWidget = widget; }),
            toDisposable(function () { return _this.lists.splice(_this.lists.indexOf(registeredList), 1); }),
            widget.onDidDispose(function () {
                _this.lists = _this.lists.filter(function (l) { return l !== registeredList; });
                if (_this._lastFocusedWidget === widget) {
                    _this._lastFocusedWidget = undefined;
                }
            })
        ]);
        return result;
    };
    ListService = __decorate([
        __param(0, IContextKeyService)
    ], ListService);
    return ListService;
}());
export { ListService };
var RawWorkbenchListFocusContextKey = new RawContextKey('listFocus', true);
export var WorkbenchListSupportsMultiSelectContextKey = new RawContextKey('listSupportsMultiselect', true);
export var WorkbenchListFocusContextKey = ContextKeyExpr.and(RawWorkbenchListFocusContextKey, ContextKeyExpr.not(InputFocusedContextKey));
export var WorkbenchListHasSelectionOrFocus = new RawContextKey('listHasSelectionOrFocus', false);
export var WorkbenchListDoubleSelection = new RawContextKey('listDoubleSelection', false);
export var WorkbenchListMultiSelection = new RawContextKey('listMultiSelection', false);
function createScopedContextKeyService(contextKeyService, widget) {
    var result = contextKeyService.createScoped(widget.getHTMLElement());
    RawWorkbenchListFocusContextKey.bindTo(result);
    return result;
}
export var multiSelectModifierSettingKey = 'workbench.list.multiSelectModifier';
export var openModeSettingKey = 'workbench.list.openMode';
export var horizontalScrollingKey = 'workbench.tree.horizontalScrolling';
function useAltAsMultipleSelectionModifier(configurationService) {
    return configurationService.getValue(multiSelectModifierSettingKey) === 'alt';
}
function useSingleClickToOpen(configurationService) {
    return configurationService.getValue(openModeSettingKey) !== 'doubleClick';
}
var MultipleSelectionController = /** @class */ (function () {
    function MultipleSelectionController(configurationService) {
        this.configurationService = configurationService;
    }
    MultipleSelectionController.prototype.isSelectionSingleChangeEvent = function (event) {
        if (useAltAsMultipleSelectionModifier(this.configurationService)) {
            return event.browserEvent.altKey;
        }
        return isSelectionSingleChangeEvent(event);
    };
    MultipleSelectionController.prototype.isSelectionRangeChangeEvent = function (event) {
        return isSelectionRangeChangeEvent(event);
    };
    return MultipleSelectionController;
}());
var WorkbenchOpenController = /** @class */ (function () {
    function WorkbenchOpenController(configurationService, existingOpenController) {
        this.configurationService = configurationService;
        this.existingOpenController = existingOpenController;
    }
    WorkbenchOpenController.prototype.shouldOpen = function (event) {
        if (event instanceof MouseEvent) {
            var isDoubleClick = event.detail === 2;
            if (!useSingleClickToOpen(this.configurationService) && !isDoubleClick) {
                return false;
            }
            if (event.button === 0 /* left mouse button */ || event.button === 1 /* middle mouse button */) {
                return this.existingOpenController ? this.existingOpenController.shouldOpen(event) : true;
            }
            return false;
        }
        return this.existingOpenController ? this.existingOpenController.shouldOpen(event) : true;
    };
    return WorkbenchOpenController;
}());
function handleListControllers(options, configurationService) {
    if (options.multipleSelectionSupport !== false && !options.multipleSelectionController) {
        options.multipleSelectionController = new MultipleSelectionController(configurationService);
    }
    options.openController = new WorkbenchOpenController(configurationService, options.openController);
    return options;
}
var sharedListStyleSheet;
function getSharedListStyleSheet() {
    if (!sharedListStyleSheet) {
        sharedListStyleSheet = createStyleSheet();
    }
    return sharedListStyleSheet;
}
var sharedTreeStyleSheet;
function getSharedTreeStyleSheet() {
    if (!sharedTreeStyleSheet) {
        sharedTreeStyleSheet = createStyleSheet();
    }
    return sharedTreeStyleSheet;
}
function handleTreeController(configuration, instantiationService) {
    if (!configuration.controller) {
        configuration.controller = instantiationService.createInstance(WorkbenchTreeController, {});
    }
    if (!configuration.styler) {
        configuration.styler = new DefaultTreestyler(getSharedTreeStyleSheet());
    }
    return configuration;
}
var WorkbenchList = /** @class */ (function (_super) {
    __extends(WorkbenchList, _super);
    function WorkbenchList(container, delegate, renderers, options, contextKeyService, listService, themeService, configurationService) {
        var _this = _super.call(this, container, delegate, renderers, __assign({ keyboardSupport: false, selectOnMouseDown: true, styleController: new DefaultStyleController(getSharedListStyleSheet()) }, computeStyles(themeService.getTheme(), defaultListStyles), handleListControllers(options, configurationService))) || this;
        _this.configurationService = configurationService;
        _this.contextKeyService = createScopedContextKeyService(contextKeyService, _this);
        var listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(_this.contextKeyService);
        listSupportsMultiSelect.set(!(options.multipleSelectionSupport === false));
        _this.listHasSelectionOrFocus = WorkbenchListHasSelectionOrFocus.bindTo(_this.contextKeyService);
        _this.listDoubleSelection = WorkbenchListDoubleSelection.bindTo(_this.contextKeyService);
        _this.listMultiSelection = WorkbenchListMultiSelection.bindTo(_this.contextKeyService);
        _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
        _this.disposables.push(combinedDisposable([
            _this.contextKeyService,
            listService.register(_this),
            attachListStyler(_this, themeService),
            _this.onSelectionChange(function () {
                var selection = _this.getSelection();
                var focus = _this.getFocus();
                _this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
                _this.listMultiSelection.set(selection.length > 1);
                _this.listDoubleSelection.set(selection.length === 2);
            }),
            _this.onFocusChange(function () {
                var selection = _this.getSelection();
                var focus = _this.getFocus();
                _this.listHasSelectionOrFocus.set(selection.length > 0 || focus.length > 0);
            })
        ]));
        _this.registerListeners();
        return _this;
    }
    WorkbenchList.prototype.registerListeners = function () {
        var _this = this;
        this.disposables.push(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
                _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(_this.configurationService);
            }
        }));
    };
    Object.defineProperty(WorkbenchList.prototype, "useAltAsMultipleSelectionModifier", {
        get: function () {
            return this._useAltAsMultipleSelectionModifier;
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchList = __decorate([
        __param(4, IContextKeyService),
        __param(5, IListService),
        __param(6, IThemeService),
        __param(7, IConfigurationService)
    ], WorkbenchList);
    return WorkbenchList;
}(List));
export { WorkbenchList };
var WorkbenchPagedList = /** @class */ (function (_super) {
    __extends(WorkbenchPagedList, _super);
    function WorkbenchPagedList(container, delegate, renderers, options, contextKeyService, listService, themeService, configurationService) {
        var _this = _super.call(this, container, delegate, renderers, __assign({ keyboardSupport: false, selectOnMouseDown: true, styleController: new DefaultStyleController(getSharedListStyleSheet()) }, computeStyles(themeService.getTheme(), defaultListStyles), handleListControllers(options, configurationService))) || this;
        _this.configurationService = configurationService;
        _this.disposables = [];
        _this.contextKeyService = createScopedContextKeyService(contextKeyService, _this);
        var listSupportsMultiSelect = WorkbenchListSupportsMultiSelectContextKey.bindTo(_this.contextKeyService);
        listSupportsMultiSelect.set(!(options.multipleSelectionSupport === false));
        _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
        _this.disposables.push(combinedDisposable([
            _this.contextKeyService,
            listService.register(_this),
            attachListStyler(_this, themeService)
        ]));
        _this.registerListeners();
        return _this;
    }
    WorkbenchPagedList.prototype.registerListeners = function () {
        var _this = this;
        this.disposables.push(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
                _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(_this.configurationService);
            }
        }));
    };
    Object.defineProperty(WorkbenchPagedList.prototype, "useAltAsMultipleSelectionModifier", {
        get: function () {
            return this._useAltAsMultipleSelectionModifier;
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchPagedList.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.disposables = dispose(this.disposables);
    };
    WorkbenchPagedList = __decorate([
        __param(4, IContextKeyService),
        __param(5, IListService),
        __param(6, IThemeService),
        __param(7, IConfigurationService)
    ], WorkbenchPagedList);
    return WorkbenchPagedList;
}(PagedList));
export { WorkbenchPagedList };
var WorkbenchTree = /** @class */ (function (_super) {
    __extends(WorkbenchTree, _super);
    function WorkbenchTree(container, configuration, options, contextKeyService, listService, themeService, instantiationService, configurationService) {
        var _this = this;
        var config = handleTreeController(configuration, instantiationService);
        var horizontalScrollMode = configurationService.getValue(horizontalScrollingKey) ? ScrollbarVisibility.Auto : ScrollbarVisibility.Hidden;
        var opts = __assign({ horizontalScrollMode: horizontalScrollMode, keyboardSupport: false }, computeStyles(themeService.getTheme(), defaultListStyles), options);
        _this = _super.call(this, container, config, opts) || this;
        _this.disposables = [];
        _this.contextKeyService = createScopedContextKeyService(contextKeyService, _this);
        WorkbenchListSupportsMultiSelectContextKey.bindTo(_this.contextKeyService);
        _this.listHasSelectionOrFocus = WorkbenchListHasSelectionOrFocus.bindTo(_this.contextKeyService);
        _this.listDoubleSelection = WorkbenchListDoubleSelection.bindTo(_this.contextKeyService);
        _this.listMultiSelection = WorkbenchListMultiSelection.bindTo(_this.contextKeyService);
        _this._openOnSingleClick = useSingleClickToOpen(configurationService);
        _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
        _this.disposables.push(_this.contextKeyService, listService.register(_this), attachListStyler(_this, themeService));
        _this.disposables.push(_this.onDidChangeSelection(function () {
            var selection = _this.getSelection();
            var focus = _this.getFocus();
            _this.listHasSelectionOrFocus.set((selection && selection.length > 0) || !!focus);
            _this.listDoubleSelection.set(selection && selection.length === 2);
            _this.listMultiSelection.set(selection && selection.length > 1);
        }));
        _this.disposables.push(_this.onDidChangeFocus(function () {
            var selection = _this.getSelection();
            var focus = _this.getFocus();
            _this.listHasSelectionOrFocus.set((selection && selection.length > 0) || !!focus);
        }));
        _this.disposables.push(configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(openModeSettingKey)) {
                _this._openOnSingleClick = useSingleClickToOpen(configurationService);
            }
            if (e.affectsConfiguration(multiSelectModifierSettingKey)) {
                _this._useAltAsMultipleSelectionModifier = useAltAsMultipleSelectionModifier(configurationService);
            }
        }));
        return _this;
    }
    Object.defineProperty(WorkbenchTree.prototype, "openOnSingleClick", {
        get: function () {
            return this._openOnSingleClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchTree.prototype, "useAltAsMultipleSelectionModifier", {
        get: function () {
            return this._useAltAsMultipleSelectionModifier;
        },
        enumerable: true,
        configurable: true
    });
    WorkbenchTree.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.disposables = dispose(this.disposables);
    };
    WorkbenchTree = __decorate([
        __param(3, IContextKeyService),
        __param(4, IListService),
        __param(5, IThemeService),
        __param(6, IInstantiationService),
        __param(7, IConfigurationService)
    ], WorkbenchTree);
    return WorkbenchTree;
}(Tree));
export { WorkbenchTree };
function massageControllerOptions(options) {
    if (typeof options.keyboardSupport !== 'boolean') {
        options.keyboardSupport = false;
    }
    if (typeof options.clickBehavior !== 'number') {
        options.clickBehavior = 0 /* ON_MOUSE_DOWN */;
    }
    return options;
}
var WorkbenchTreeController = /** @class */ (function (_super) {
    __extends(WorkbenchTreeController, _super);
    function WorkbenchTreeController(options, configurationService) {
        var _this = _super.call(this, massageControllerOptions(options)) || this;
        _this.configurationService = configurationService;
        _this.disposables = [];
        // if the open mode is not set, we configure it based on settings
        if (isUndefinedOrNull(options.openMode)) {
            _this.setOpenMode(_this.getOpenModeSetting());
            _this.registerListeners();
        }
        return _this;
    }
    WorkbenchTreeController.prototype.registerListeners = function () {
        var _this = this;
        this.disposables.push(this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(openModeSettingKey)) {
                _this.setOpenMode(_this.getOpenModeSetting());
            }
        }));
    };
    WorkbenchTreeController.prototype.getOpenModeSetting = function () {
        return useSingleClickToOpen(this.configurationService) ? 0 /* SINGLE_CLICK */ : 1 /* DOUBLE_CLICK */;
    };
    WorkbenchTreeController.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    WorkbenchTreeController = __decorate([
        __param(1, IConfigurationService)
    ], WorkbenchTreeController);
    return WorkbenchTreeController;
}(DefaultController));
export { WorkbenchTreeController };
var TreeResourceNavigator = /** @class */ (function (_super) {
    __extends(TreeResourceNavigator, _super);
    function TreeResourceNavigator(tree, options) {
        var _this = _super.call(this) || this;
        _this.tree = tree;
        _this.options = options;
        _this._openResource = new Emitter();
        _this.openResource = _this._openResource.event;
        _this.registerListeners();
        return _this;
    }
    TreeResourceNavigator.prototype.registerListeners = function () {
        var _this = this;
        if (this.options && this.options.openOnFocus) {
            this._register(this.tree.onDidChangeFocus(function (e) { return _this.onFocus(e); }));
        }
        this._register(this.tree.onDidChangeSelection(function (e) { return _this.onSelection(e); }));
    };
    TreeResourceNavigator.prototype.onFocus = function (_a) {
        var payload = _a.payload;
        var element = this.tree.getFocus();
        this.tree.setSelection([element], { fromFocus: true });
        var originalEvent = payload && payload.originalEvent;
        var isMouseEvent = payload && payload.origin === 'mouse';
        var isDoubleClick = isMouseEvent && originalEvent && originalEvent.detail === 2;
        var preventOpen = payload && payload.preventOpenOnFocus;
        if (!preventOpen && (!isMouseEvent || this.tree.openOnSingleClick || isDoubleClick)) {
            this._openResource.fire({
                editorOptions: {
                    preserveFocus: true,
                    pinned: false,
                    revealIfVisible: true
                },
                sideBySide: false,
                element: element,
                payload: payload
            });
        }
    };
    TreeResourceNavigator.prototype.onSelection = function (_a) {
        var payload = _a.payload;
        if (payload && payload.fromFocus) {
            return;
        }
        var originalEvent = payload && payload.originalEvent;
        var isMouseEvent = payload && payload.origin === 'mouse';
        var isDoubleClick = isMouseEvent && originalEvent && originalEvent.detail === 2;
        if (!isMouseEvent || this.tree.openOnSingleClick || isDoubleClick) {
            if (isDoubleClick && originalEvent) {
                originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
            }
            var isFromKeyboard = payload && payload.origin === 'keyboard';
            var sideBySide = (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey || originalEvent.altKey));
            var preserveFocus = !((isFromKeyboard && (!payload || !payload.preserveFocus)) || isDoubleClick || (payload && payload.focusEditor));
            this._openResource.fire({
                editorOptions: {
                    preserveFocus: preserveFocus,
                    pinned: isDoubleClick,
                    revealIfVisible: true
                },
                sideBySide: sideBySide,
                element: this.tree.getSelection()[0],
                payload: payload
            });
        }
    };
    return TreeResourceNavigator;
}(Disposable));
export { TreeResourceNavigator };
var HighlightingTreeController = /** @class */ (function (_super) {
    __extends(HighlightingTreeController, _super);
    function HighlightingTreeController(options, onType, configurationService, _keybindingService) {
        var _this = _super.call(this, options, configurationService) || this;
        _this.onType = onType;
        _this._keybindingService = _keybindingService;
        return _this;
    }
    HighlightingTreeController.prototype.onKeyDown = function (tree, event) {
        var handled = _super.prototype.onKeyDown.call(this, tree, event);
        if (handled) {
            return true;
        }
        if (this.upKeyBindingDispatcher.has(event.keyCode)) {
            return false;
        }
        if (this._keybindingService.mightProducePrintableCharacter(event)) {
            this.onType();
            return true;
        }
        return false;
    };
    HighlightingTreeController = __decorate([
        __param(2, IConfigurationService),
        __param(3, IKeybindingService)
    ], HighlightingTreeController);
    return HighlightingTreeController;
}(WorkbenchTreeController));
export { HighlightingTreeController };
var HightlightsFilter = /** @class */ (function () {
    function HightlightsFilter() {
        this.enabled = true;
    }
    HightlightsFilter.add = function (config, options) {
        var myFilter = new HightlightsFilter();
        myFilter.enabled = options.filterOnType;
        if (!config.filter) {
            config.filter = myFilter;
        }
        else {
            var otherFilter_1 = config.filter;
            config.filter = {
                isVisible: function (tree, element) {
                    return myFilter.isVisible(tree, element) && otherFilter_1.isVisible(tree, element);
                }
            };
        }
        return config;
    };
    HightlightsFilter.prototype.isVisible = function (tree, element) {
        if (!this.enabled) {
            return true;
        }
        var tree2 = tree;
        if (!tree2.isHighlighterScoring()) {
            return true;
        }
        if (tree2.getHighlighterScore(element)) {
            return true;
        }
        return false;
    };
    return HightlightsFilter;
}());
var HighlightingWorkbenchTree = /** @class */ (function (_super) {
    __extends(HighlightingWorkbenchTree, _super);
    function HighlightingWorkbenchTree(parent, treeConfiguration, treeOptions, listOptions, contextKeyService, contextViewService, listService, themeService, instantiationService, configurationService) {
        var _this = this;
        // build html skeleton
        var container = document.createElement('div');
        container.className = 'highlighting-tree';
        var inputContainer = document.createElement('div');
        inputContainer.className = 'input';
        var treeContainer = document.createElement('div');
        treeContainer.className = 'tree';
        container.appendChild(inputContainer);
        container.appendChild(treeContainer);
        parent.appendChild(container);
        // create tree
        treeConfiguration.controller = treeConfiguration.controller || instantiationService.createInstance(HighlightingTreeController, {}, function () { return _this.onTypeInTree(); });
        _this = _super.call(this, treeContainer, HightlightsFilter.add(treeConfiguration, treeOptions), treeOptions, contextKeyService, listService, themeService, instantiationService, configurationService) || this;
        _this.highlighter = treeConfiguration.highlighter;
        _this.highlights = new Map();
        _this.domNode = container;
        addClass(_this.domNode, 'inactive');
        // create input
        _this.inputContainer = inputContainer;
        _this.input = new InputBox(inputContainer, contextViewService, listOptions);
        _this.input.setEnabled(false);
        _this.input.onDidChange(_this.updateHighlights, _this, _this.disposables);
        _this.disposables.push(attachInputBoxStyler(_this.input, themeService));
        _this.disposables.push(_this.input);
        _this.disposables.push(addStandardDisposableListener(_this.input.inputElement, 'keydown', function (event) {
            //todo@joh make this command/context-key based
            switch (event.keyCode) {
                case 16 /* UpArrow */:
                case 18 /* DownArrow */:
                case 2 /* Tab */:
                    _this.domFocus();
                    event.preventDefault();
                    break;
                case 3 /* Enter */:
                    _this.setSelection(_this.getSelection());
                    event.preventDefault();
                    break;
                case 9 /* Escape */:
                    _this.input.value = '';
                    _this.domFocus();
                    event.preventDefault();
                    break;
            }
        }));
        _this._onDidStartFilter = new Emitter();
        _this.onDidStartFiltering = _this._onDidStartFilter.event;
        _this.disposables.push(_this._onDidStartFilter);
        return _this;
    }
    HighlightingWorkbenchTree.prototype.setInput = function (element) {
        var _this = this;
        this.input.setEnabled(false);
        return _super.prototype.setInput.call(this, element).then(function (value) {
            if (!_this.input.inputElement) {
                // has been disposed in the meantime -> cancel
                return Promise.reject(canceled());
            }
            _this.input.setEnabled(true);
            return value;
        });
    };
    HighlightingWorkbenchTree.prototype.layout = function (height, width) {
        this.input.layout();
        _super.prototype.layout.call(this, isNaN(height) ? height : height - getTotalHeight(this.inputContainer), width);
    };
    HighlightingWorkbenchTree.prototype.onTypeInTree = function () {
        removeClass(this.domNode, 'inactive');
        this.input.focus();
        this.layout();
        this._onDidStartFilter.fire(this);
    };
    HighlightingWorkbenchTree.prototype.updateHighlights = function (pattern) {
        var _this = this;
        // remember old selection
        var defaultSelection = [];
        if (!this.lastSelection && pattern) {
            this.lastSelection = this.getSelection();
        }
        else if (this.lastSelection && !pattern) {
            defaultSelection = this.lastSelection;
            this.lastSelection = [];
        }
        var topElement;
        if (pattern) {
            var nav = this.getNavigator(undefined, false);
            var topScore = void 0;
            while (nav.next()) {
                var element = nav.current();
                var score = this.highlighter.getHighlights(this, element, pattern);
                this.highlights.set(this._getHighlightsStorageKey(element), score);
                element.foo = 1;
                if (!topScore || score && topScore[0] < score[0]) {
                    topScore = score;
                    topElement = element;
                }
            }
        }
        else {
            // no pattern, clear highlights
            this.highlights.clear();
        }
        this.refresh().then(function () {
            if (topElement) {
                _this.reveal(topElement, .5).then(function (_) {
                    _this.setSelection([topElement], _this);
                    _this.setFocus(topElement, _this);
                });
            }
            else {
                _this.setSelection(defaultSelection, _this);
            }
        }, onUnexpectedError);
    };
    HighlightingWorkbenchTree.prototype.isHighlighterScoring = function () {
        return this.highlights.size > 0;
    };
    HighlightingWorkbenchTree.prototype.getHighlighterScore = function (element) {
        return this.highlights.get(this._getHighlightsStorageKey(element));
    };
    HighlightingWorkbenchTree.prototype._getHighlightsStorageKey = function (element) {
        return typeof this.highlighter.getHighlightsStorageKey === 'function'
            ? this.highlighter.getHighlightsStorageKey(element)
            : element;
    };
    HighlightingWorkbenchTree = __decorate([
        __param(4, IContextKeyService),
        __param(5, IContextViewService),
        __param(6, IListService),
        __param(7, IThemeService),
        __param(8, IInstantiationService),
        __param(9, IConfigurationService)
    ], HighlightingWorkbenchTree);
    return HighlightingWorkbenchTree;
}(WorkbenchTree));
export { HighlightingWorkbenchTree };
var configurationRegistry = Registry.as(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
    'id': 'workbench',
    'order': 7,
    'title': localize('workbenchConfigurationTitle', "Workbench"),
    'type': 'object',
    'properties': (_a = {},
        _a[multiSelectModifierSettingKey] = {
            'type': 'string',
            'enum': ['ctrlCmd', 'alt'],
            'enumDescriptions': [
                localize('multiSelectModifier.ctrlCmd', "Maps to `Control` on Windows and Linux and to `Command` on macOS."),
                localize('multiSelectModifier.alt', "Maps to `Alt` on Windows and Linux and to `Option` on macOS.")
            ],
            'default': 'ctrlCmd',
            'description': localize({
                key: 'multiSelectModifier',
                comment: [
                    '- `ctrlCmd` refers to a value the setting can take and should not be localized.',
                    '- `Control` and `Command` refer to the modifier keys Ctrl or Cmd on the keyboard and can be localized.'
                ]
            }, "The modifier to be used to add an item in trees and lists to a multi-selection with the mouse (for example in the explorer, open editors and scm view). The 'Open to Side' mouse gestures - if supported - will adapt such that they do not conflict with the multiselect modifier.")
        },
        _a[openModeSettingKey] = {
            'type': 'string',
            'enum': ['singleClick', 'doubleClick'],
            'default': 'singleClick',
            'description': localize({
                key: 'openModeModifier',
                comment: ['`singleClick` and `doubleClick` refers to a value the setting can take and should not be localized.']
            }, "Controls how to open items in trees and lists using the mouse (if supported). For parents with children in trees, this setting will control if a single click expands the parent or a double click. Note that some trees and lists might choose to ignore this setting if it is not applicable. ")
        },
        _a[horizontalScrollingKey] = {
            'type': 'boolean',
            'default': false,
            'description': localize('horizontalScrolling setting', "Controls whether trees support horizontal scrolling in the workbench.")
        },
        _a)
});
