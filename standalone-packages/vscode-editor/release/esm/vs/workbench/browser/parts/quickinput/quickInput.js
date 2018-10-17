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
import './quickInput.css';
import { Component } from '../../../common/component.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IPartService } from '../../../services/part/common/partService.js';
import * as dom from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { contrastBorder, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { SIDE_BAR_BACKGROUND, SIDE_BAR_FOREGROUND } from '../../../common/theme.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { QuickInputList } from './quickInputList.js';
import { QuickInputBox } from './quickInputBox.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { CLOSE_ON_FOCUS_LOST_CONFIG } from '../../quickopen.js';
import { CountBadge } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { attachBadgeStyler, attachProgressBarStyler, attachButtonStyler } from '../../../../platform/theme/common/styler.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { debounceEvent, Emitter } from '../../../../base/common/event.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { inQuickOpenContext } from '../quickopen/quickopen.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../base/common/actions.js';
import { URI } from '../../../../base/common/uri.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { equals } from '../../../../base/common/arrays.js';
import { TimeoutTimer } from '../../../../base/common/async.js';
import { getIconClass } from './quickInputUtils.js';
import * as browser from '../../../../base/browser/browser.js';
var $ = dom.$;
var backButton = {
    iconPath: {
        dark: URI.parse(require.toUrl('vs/workbench/browser/parts/quickinput/media/dark/arrow-left.svg')),
        light: URI.parse(require.toUrl('vs/workbench/browser/parts/quickinput/media/light/arrow-left.svg'))
    },
    tooltip: localize('quickInput.back', "Back"),
    handle: -1 // TODO
};
var QuickInput = /** @class */ (function () {
    function QuickInput(ui) {
        this.ui = ui;
        this.visible = false;
        this._enabled = true;
        this._busy = false;
        this._ignoreFocusOut = false;
        this._buttons = [];
        this.buttonsUpdated = false;
        this.onDidTriggerButtonEmitter = new Emitter();
        this.onDidHideEmitter = new Emitter();
        this.visibleDisposables = [];
        this.disposables = [
            this.onDidTriggerButtonEmitter,
            this.onDidHideEmitter,
        ];
        this.onDidTriggerButton = this.onDidTriggerButtonEmitter.event;
        this.onDidHide = this.onDidHideEmitter.event;
    }
    Object.defineProperty(QuickInput.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            this._title = title;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "step", {
        get: function () {
            return this._steps;
        },
        set: function (step) {
            this._steps = step;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "totalSteps", {
        get: function () {
            return this._totalSteps;
        },
        set: function (totalSteps) {
            this._totalSteps = totalSteps;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            this._enabled = enabled;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "contextKey", {
        get: function () {
            return this._contextKey;
        },
        set: function (contextKey) {
            this._contextKey = contextKey;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "busy", {
        get: function () {
            return this._busy;
        },
        set: function (busy) {
            this._busy = busy;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "ignoreFocusOut", {
        get: function () {
            return this._ignoreFocusOut;
        },
        set: function (ignoreFocusOut) {
            this._ignoreFocusOut = ignoreFocusOut;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInput.prototype, "buttons", {
        get: function () {
            return this._buttons;
        },
        set: function (buttons) {
            this._buttons = buttons;
            this.buttonsUpdated = true;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    QuickInput.prototype.show = function () {
        var _this = this;
        if (this.visible) {
            return;
        }
        this.visibleDisposables.push(this.ui.onDidTriggerButton(function (button) {
            if (_this.buttons.indexOf(button) !== -1) {
                _this.onDidTriggerButtonEmitter.fire(button);
            }
        }));
        this.ui.show(this);
        this.visible = true;
        this.update();
    };
    QuickInput.prototype.hide = function () {
        if (!this.visible) {
            return;
        }
        this.ui.hide();
    };
    QuickInput.prototype.didHide = function () {
        this.visible = false;
        this.visibleDisposables = dispose(this.visibleDisposables);
        this.onDidHideEmitter.fire();
    };
    QuickInput.prototype.update = function () {
        var _this = this;
        if (!this.visible) {
            return;
        }
        var title = this.getTitle();
        if (this.ui.title.textContent !== title) {
            this.ui.title.textContent = title;
        }
        if (this.busy && !this.busyDelay) {
            this.busyDelay = new TimeoutTimer();
            this.busyDelay.setIfNotSet(function () {
                if (_this.visible) {
                    _this.ui.progressBar.infinite();
                }
            }, 800);
        }
        if (!this.busy && this.busyDelay) {
            this.ui.progressBar.stop();
            this.busyDelay.cancel();
            this.busyDelay = null;
        }
        if (this.buttonsUpdated) {
            this.buttonsUpdated = false;
            this.ui.leftActionBar.clear();
            var leftButtons = this.buttons.filter(function (button) { return button === backButton; });
            this.ui.leftActionBar.push(leftButtons.map(function (button, index) {
                var action = new Action("id-" + index, '', button.iconClass || getIconClass(button.iconPath), true, function () { return _this.onDidTriggerButtonEmitter.fire(button); });
                action.tooltip = button.tooltip;
                return action;
            }), { icon: true, label: false });
            this.ui.rightActionBar.clear();
            var rightButtons = this.buttons.filter(function (button) { return button !== backButton; });
            this.ui.rightActionBar.push(rightButtons.map(function (button, index) {
                var action = new Action("id-" + index, '', button.iconClass || getIconClass(button.iconPath), true, function () { return _this.onDidTriggerButtonEmitter.fire(button); });
                action.tooltip = button.tooltip;
                return action;
            }), { icon: true, label: false });
        }
        this.ui.ignoreFocusOut = this.ignoreFocusOut;
        this.ui.setEnabled(this.enabled);
        this.ui.setContextKey(this.contextKey);
    };
    QuickInput.prototype.getTitle = function () {
        if (this.title && this.step) {
            return this.title + " (" + this.getSteps() + ")";
        }
        if (this.title) {
            return this.title;
        }
        if (this.step) {
            return this.getSteps();
        }
        return '';
    };
    QuickInput.prototype.getSteps = function () {
        if (this.step && this.totalSteps) {
            return localize('quickInput.steps', "{0}/{1}", this.step, this.totalSteps);
        }
        if (this.step) {
            return String(this.step);
        }
        return '';
    };
    QuickInput.prototype.dispose = function () {
        this.hide();
        this.disposables = dispose(this.disposables);
    };
    return QuickInput;
}());
var QuickPick = /** @class */ (function (_super) {
    __extends(QuickPick, _super);
    function QuickPick(ui) {
        var _this = _super.call(this, ui) || this;
        _this._value = '';
        _this.onDidChangeValueEmitter = new Emitter();
        _this.onDidAcceptEmitter = new Emitter();
        _this._items = [];
        _this.itemsUpdated = false;
        _this._canSelectMany = false;
        _this._matchOnDescription = false;
        _this._matchOnDetail = false;
        _this._activeItems = [];
        _this.activeItemsUpdated = false;
        _this.activeItemsToConfirm = [];
        _this.onDidChangeActiveEmitter = new Emitter();
        _this._selectedItems = [];
        _this.selectedItemsUpdated = false;
        _this.selectedItemsToConfirm = [];
        _this.onDidChangeSelectionEmitter = new Emitter();
        _this.onDidTriggerItemButtonEmitter = new Emitter();
        _this.onDidChangeValue = _this.onDidChangeValueEmitter.event;
        _this.onDidAccept = _this.onDidAcceptEmitter.event;
        _this.onDidChangeActive = _this.onDidChangeActiveEmitter.event;
        _this.onDidChangeSelection = _this.onDidChangeSelectionEmitter.event;
        _this.onDidTriggerItemButton = _this.onDidTriggerItemButtonEmitter.event;
        _this.disposables.push(_this.onDidChangeValueEmitter, _this.onDidAcceptEmitter, _this.onDidChangeActiveEmitter, _this.onDidChangeSelectionEmitter, _this.onDidTriggerItemButtonEmitter);
        return _this;
    }
    Object.defineProperty(QuickPick.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value || '';
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (placeholder) {
            this._placeholder = placeholder;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            this._items = items;
            this.itemsUpdated = true;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "canSelectMany", {
        get: function () {
            return this._canSelectMany;
        },
        set: function (canSelectMany) {
            this._canSelectMany = canSelectMany;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "matchOnDescription", {
        get: function () {
            return this._matchOnDescription;
        },
        set: function (matchOnDescription) {
            this._matchOnDescription = matchOnDescription;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "matchOnDetail", {
        get: function () {
            return this._matchOnDetail;
        },
        set: function (matchOnDetail) {
            this._matchOnDetail = matchOnDetail;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "activeItems", {
        get: function () {
            return this._activeItems;
        },
        set: function (activeItems) {
            this._activeItems = activeItems;
            this.activeItemsUpdated = true;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        set: function (selectedItems) {
            this._selectedItems = selectedItems;
            this.selectedItemsUpdated = true;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickPick.prototype, "keyMods", {
        get: function () {
            return this.ui.keyMods;
        },
        enumerable: true,
        configurable: true
    });
    QuickPick.prototype.show = function () {
        var _this = this;
        if (!this.visible) {
            this.visibleDisposables.push(this.ui.inputBox.onDidChange(function (value) {
                if (value === _this.value) {
                    return;
                }
                _this._value = value;
                _this.ui.list.filter(_this.ui.inputBox.value);
                if (!_this.ui.isScreenReaderOptimized() && !_this.canSelectMany) {
                    _this.ui.list.focus('First');
                }
                _this.onDidChangeValueEmitter.fire(value);
            }), this.ui.inputBox.onKeyDown(function (event) {
                switch (event.keyCode) {
                    case 18 /* DownArrow */:
                        _this.ui.list.focus('Next');
                        if (_this.canSelectMany) {
                            _this.ui.list.domFocus();
                        }
                        break;
                    case 16 /* UpArrow */:
                        if (_this.ui.list.getFocusedElements().length) {
                            _this.ui.list.focus('Previous');
                        }
                        else {
                            _this.ui.list.focus('Last');
                        }
                        if (_this.canSelectMany) {
                            _this.ui.list.domFocus();
                        }
                        break;
                    case 12 /* PageDown */:
                        if (_this.ui.list.getFocusedElements().length) {
                            _this.ui.list.focus('NextPage');
                        }
                        else {
                            _this.ui.list.focus('First');
                        }
                        if (_this.canSelectMany) {
                            _this.ui.list.domFocus();
                        }
                        break;
                    case 11 /* PageUp */:
                        if (_this.ui.list.getFocusedElements().length) {
                            _this.ui.list.focus('PreviousPage');
                        }
                        else {
                            _this.ui.list.focus('Last');
                        }
                        if (_this.canSelectMany) {
                            _this.ui.list.domFocus();
                        }
                        break;
                }
            }), this.ui.onDidAccept(function () {
                if (!_this.canSelectMany && _this.activeItems[0]) {
                    _this._selectedItems = [_this.activeItems[0]];
                    _this.onDidChangeSelectionEmitter.fire(_this.selectedItems);
                }
                _this.onDidAcceptEmitter.fire();
            }), this.ui.list.onDidChangeFocus(function (focusedItems) {
                if (_this.activeItemsUpdated) {
                    return; // Expect another event.
                }
                if (_this.activeItemsToConfirm !== _this._activeItems && equals(focusedItems, _this._activeItems, function (a, b) { return a === b; })) {
                    return;
                }
                _this._activeItems = focusedItems;
                _this.onDidChangeActiveEmitter.fire(focusedItems);
            }), this.ui.list.onDidChangeSelection(function (selectedItems) {
                if (_this.canSelectMany) {
                    return;
                }
                if (_this.selectedItemsToConfirm !== _this._selectedItems && equals(selectedItems, _this._selectedItems, function (a, b) { return a === b; })) {
                    return;
                }
                _this._selectedItems = selectedItems;
                _this.onDidChangeSelectionEmitter.fire(selectedItems);
                _this.onDidAcceptEmitter.fire();
            }), this.ui.list.onChangedCheckedElements(function (checkedItems) {
                if (!_this.canSelectMany) {
                    return;
                }
                if (_this.selectedItemsToConfirm !== _this._selectedItems && equals(checkedItems, _this._selectedItems, function (a, b) { return a === b; })) {
                    return;
                }
                _this._selectedItems = checkedItems;
                _this.onDidChangeSelectionEmitter.fire(checkedItems);
            }), this.ui.list.onButtonTriggered(function (event) { return _this.onDidTriggerItemButtonEmitter.fire(event); }), this.registerQuickNavigation());
        }
        _super.prototype.show.call(this); // TODO: Why have show() bubble up while update() trickles down? (Could move setComboboxAccessibility() here.)
    };
    QuickPick.prototype.registerQuickNavigation = function () {
        var _this = this;
        return dom.addDisposableListener(this.ui.container, dom.EventType.KEY_UP, function (e) {
            if (_this.canSelectMany || !_this.quickNavigate) {
                return;
            }
            var keyboardEvent = new StandardKeyboardEvent(e);
            var keyCode = keyboardEvent.keyCode;
            // Select element when keys are pressed that signal it
            var quickNavKeys = _this.quickNavigate.keybindings;
            var wasTriggerKeyPressed = keyCode === 3 /* Enter */ || quickNavKeys.some(function (k) {
                var _a = k.getParts(), firstPart = _a[0], chordPart = _a[1];
                if (chordPart) {
                    return false;
                }
                if (firstPart.shiftKey && keyCode === 4 /* Shift */) {
                    if (keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.metaKey) {
                        return false; // this is an optimistic check for the shift key being used to navigate back in quick open
                    }
                    return true;
                }
                if (firstPart.altKey && keyCode === 6 /* Alt */) {
                    return true;
                }
                if (firstPart.ctrlKey && keyCode === 5 /* Ctrl */) {
                    return true;
                }
                if (firstPart.metaKey && keyCode === 57 /* Meta */) {
                    return true;
                }
                return false;
            });
            if (wasTriggerKeyPressed && _this.activeItems[0]) {
                _this._selectedItems = [_this.activeItems[0]];
                _this.onDidChangeSelectionEmitter.fire(_this.selectedItems);
                _this.onDidAcceptEmitter.fire();
            }
        });
    };
    QuickPick.prototype.update = function () {
        _super.prototype.update.call(this);
        if (!this.visible) {
            return;
        }
        if (this.ui.inputBox.value !== this.value) {
            this.ui.inputBox.value = this.value;
        }
        if (this.ui.inputBox.placeholder !== (this.placeholder || '')) {
            this.ui.inputBox.placeholder = (this.placeholder || '');
        }
        if (this.itemsUpdated) {
            this.itemsUpdated = false;
            this.ui.list.setElements(this.items);
            this.ui.list.filter(this.ui.inputBox.value);
            this.ui.checkAll.checked = this.ui.list.getAllVisibleChecked();
            this.ui.visibleCount.setCount(this.ui.list.getVisibleCount());
            this.ui.count.setCount(this.ui.list.getCheckedCount());
            if (!this.ui.isScreenReaderOptimized() && !this.canSelectMany) {
                this.ui.list.focus('First');
            }
        }
        if (this.ui.container.classList.contains('show-checkboxes') !== !!this.canSelectMany) {
            if (this.canSelectMany) {
                this.ui.list.clearFocus();
            }
            else if (!this.ui.isScreenReaderOptimized()) {
                this.ui.list.focus('First');
            }
        }
        if (this.activeItemsUpdated) {
            this.activeItemsUpdated = false;
            this.activeItemsToConfirm = this._activeItems;
            this.ui.list.setFocusedElements(this.activeItems);
            if (this.activeItemsToConfirm === this._activeItems) {
                this.activeItemsToConfirm = null;
            }
        }
        if (this.selectedItemsUpdated) {
            this.selectedItemsUpdated = false;
            this.selectedItemsToConfirm = this._selectedItems;
            if (this.canSelectMany) {
                this.ui.list.setCheckedElements(this.selectedItems);
            }
            else {
                this.ui.list.setSelectedElements(this.selectedItems);
            }
            if (this.selectedItemsToConfirm === this._selectedItems) {
                this.selectedItemsToConfirm = null;
            }
        }
        this.ui.list.matchOnDescription = this.matchOnDescription;
        this.ui.list.matchOnDetail = this.matchOnDetail;
        this.ui.setComboboxAccessibility(true);
        this.ui.inputBox.setAttribute('aria-label', QuickPick.INPUT_BOX_ARIA_LABEL);
        this.ui.setVisibilities(this.canSelectMany ? { title: !!this.title || !!this.step, checkAll: true, inputBox: true, visibleCount: true, count: true, ok: true, list: true } : { title: !!this.title || !!this.step, inputBox: true, visibleCount: true, list: true });
    };
    QuickPick.INPUT_BOX_ARIA_LABEL = localize('quickInputBox.ariaLabel', "Type to narrow down results.");
    return QuickPick;
}(QuickInput));
var InputBox = /** @class */ (function (_super) {
    __extends(InputBox, _super);
    function InputBox(ui) {
        var _this = _super.call(this, ui) || this;
        _this._value = '';
        _this.valueSelectionUpdated = true;
        _this._password = false;
        _this.noValidationMessage = InputBox.noPromptMessage;
        _this.onDidValueChangeEmitter = new Emitter();
        _this.onDidAcceptEmitter = new Emitter();
        _this.onDidChangeValue = _this.onDidValueChangeEmitter.event;
        _this.onDidAccept = _this.onDidAcceptEmitter.event;
        _this.disposables.push(_this.onDidValueChangeEmitter, _this.onDidAcceptEmitter);
        return _this;
    }
    Object.defineProperty(InputBox.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value || '';
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "valueSelection", {
        set: function (valueSelection) {
            this._valueSelection = valueSelection;
            this.valueSelectionUpdated = true;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (placeholder) {
            this._placeholder = placeholder;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (password) {
            this._password = password;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "prompt", {
        get: function () {
            return this._prompt;
        },
        set: function (prompt) {
            this._prompt = prompt;
            this.noValidationMessage = prompt
                ? localize('inputModeEntryDescription', "{0} (Press 'Enter' to confirm or 'Escape' to cancel)", prompt)
                : InputBox.noPromptMessage;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "validationMessage", {
        get: function () {
            return this._validationMessage;
        },
        set: function (validationMessage) {
            this._validationMessage = validationMessage;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    InputBox.prototype.show = function () {
        var _this = this;
        if (!this.visible) {
            this.visibleDisposables.push(this.ui.inputBox.onDidChange(function (value) {
                if (value === _this.value) {
                    return;
                }
                _this._value = value;
                _this.onDidValueChangeEmitter.fire(value);
            }), this.ui.onDidAccept(function () { return _this.onDidAcceptEmitter.fire(); }));
            this.valueSelectionUpdated = true;
        }
        _super.prototype.show.call(this);
    };
    InputBox.prototype.update = function () {
        _super.prototype.update.call(this);
        if (!this.visible) {
            return;
        }
        if (this.ui.inputBox.value !== this.value) {
            this.ui.inputBox.value = this.value;
        }
        if (this.valueSelectionUpdated) {
            this.valueSelectionUpdated = false;
            this.ui.inputBox.select(this._valueSelection && { start: this._valueSelection[0], end: this._valueSelection[1] });
        }
        if (this.ui.inputBox.placeholder !== (this.placeholder || '')) {
            this.ui.inputBox.placeholder = (this.placeholder || '');
        }
        if (this.ui.inputBox.password !== this.password) {
            this.ui.inputBox.password = this.password;
        }
        if (!this.validationMessage && this.ui.message.textContent !== this.noValidationMessage) {
            this.ui.message.textContent = this.noValidationMessage;
            this.ui.inputBox.showDecoration(Severity.Ignore);
        }
        if (this.validationMessage && this.ui.message.textContent !== this.validationMessage) {
            this.ui.message.textContent = this.validationMessage;
            this.ui.inputBox.showDecoration(Severity.Error);
        }
        this.ui.setVisibilities({ title: !!this.title || !!this.step, inputBox: true, message: true });
    };
    InputBox.noPromptMessage = localize('inputModeEntry', "Press 'Enter' to confirm your input or 'Escape' to cancel");
    return InputBox;
}(QuickInput));
var QuickInputService = /** @class */ (function (_super) {
    __extends(QuickInputService, _super);
    function QuickInputService(environmentService, configurationService, instantiationService, partService, quickOpenService, editorGroupService, keybindingService, contextKeyService, themeService) {
        var _this = _super.call(this, QuickInputService.ID, themeService) || this;
        _this.environmentService = environmentService;
        _this.configurationService = configurationService;
        _this.instantiationService = instantiationService;
        _this.partService = partService;
        _this.quickOpenService = quickOpenService;
        _this.editorGroupService = editorGroupService;
        _this.keybindingService = keybindingService;
        _this.contextKeyService = contextKeyService;
        _this.idPrefix = 'quickInput_'; // Constant since there is still only one.
        _this.comboboxAccessibility = false;
        _this.enabled = true;
        _this.inQuickOpenWidgets = {};
        _this.contexts = Object.create(null);
        _this.onDidAcceptEmitter = _this._register(new Emitter());
        _this.onDidTriggerButtonEmitter = _this._register(new Emitter());
        _this.keyMods = { ctrlCmd: false, alt: false };
        _this.backButton = backButton;
        _this.inQuickOpenContext = new RawContextKey('inQuickOpen', false).bindTo(contextKeyService);
        _this._register(_this.quickOpenService.onShow(function () { return _this.inQuickOpen('quickOpen', true); }));
        _this._register(_this.quickOpenService.onHide(function () { return _this.inQuickOpen('quickOpen', false); }));
        _this.registerKeyModsListeners();
        return _this;
    }
    QuickInputService.prototype.inQuickOpen = function (widget, open) {
        if (open) {
            this.inQuickOpenWidgets[widget] = true;
        }
        else {
            delete this.inQuickOpenWidgets[widget];
        }
        if (Object.keys(this.inQuickOpenWidgets).length) {
            if (!this.inQuickOpenContext.get()) {
                this.inQuickOpenContext.set(true);
            }
        }
        else {
            if (this.inQuickOpenContext.get()) {
                this.inQuickOpenContext.reset();
            }
        }
    };
    QuickInputService.prototype.setContextKey = function (id) {
        var key;
        if (id) {
            key = this.contexts[id];
            if (!key) {
                key = new RawContextKey(id, false)
                    .bindTo(this.contextKeyService);
                this.contexts[id] = key;
            }
        }
        if (key && key.get()) {
            return; // already active context
        }
        this.resetContextKeys();
        if (key) {
            key.set(true);
        }
    };
    QuickInputService.prototype.resetContextKeys = function () {
        for (var key in this.contexts) {
            if (this.contexts[key].get()) {
                this.contexts[key].reset();
            }
        }
    };
    QuickInputService.prototype.registerKeyModsListeners = function () {
        var _this = this;
        var workbench = this.partService.getWorkbenchElement();
        this._register(dom.addDisposableListener(workbench, dom.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            switch (event.keyCode) {
                case 5 /* Ctrl */:
                case 57 /* Meta */:
                    _this.keyMods.ctrlCmd = true;
                    break;
                case 6 /* Alt */:
                    _this.keyMods.alt = true;
                    break;
            }
        }));
        this._register(dom.addDisposableListener(workbench, dom.EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            switch (event.keyCode) {
                case 5 /* Ctrl */:
                case 57 /* Meta */:
                    _this.keyMods.ctrlCmd = false;
                    break;
                case 6 /* Alt */:
                    _this.keyMods.alt = false;
                    break;
            }
        }));
    };
    QuickInputService.prototype.create = function () {
        var _this = this;
        if (this.ui) {
            return;
        }
        var workbench = this.partService.getWorkbenchElement();
        var container = dom.append(workbench, $('.quick-input-widget.show-file-icons'));
        container.tabIndex = -1;
        container.style.display = 'none';
        this.titleBar = dom.append(container, $('.quick-input-titlebar'));
        var leftActionBar = this._register(new ActionBar(this.titleBar));
        leftActionBar.domNode.classList.add('quick-input-left-action-bar');
        var title = dom.append(this.titleBar, $('.quick-input-title'));
        var rightActionBar = this._register(new ActionBar(this.titleBar));
        rightActionBar.domNode.classList.add('quick-input-right-action-bar');
        var headerContainer = dom.append(container, $('.quick-input-header'));
        var checkAll = dom.append(headerContainer, $('input.quick-input-check-all'));
        checkAll.type = 'checkbox';
        this._register(dom.addStandardDisposableListener(checkAll, dom.EventType.CHANGE, function (e) {
            var checked = checkAll.checked;
            list.setAllVisibleChecked(checked);
        }));
        this._register(dom.addDisposableListener(checkAll, dom.EventType.CLICK, function (e) {
            if (e.x || e.y) { // Avoid 'click' triggered by 'space'...
                inputBox.setFocus();
            }
        }));
        this.filterContainer = dom.append(headerContainer, $('.quick-input-filter'));
        var inputBox = this._register(new QuickInputBox(this.filterContainer));
        inputBox.setAttribute('aria-describedby', this.idPrefix + "message");
        this.visibleCountContainer = dom.append(this.filterContainer, $('.quick-input-visible-count'));
        this.visibleCountContainer.setAttribute('aria-live', 'polite');
        this.visibleCountContainer.setAttribute('aria-atomic', 'true');
        var visibleCount = new CountBadge(this.visibleCountContainer, { countFormat: localize({ key: 'quickInput.visibleCount', comment: ['This tells the user how many items are shown in a list of items to select from. The items can be anything. Currently not visible, but read by screen readers.'] }, "{0} Results") });
        this.countContainer = dom.append(this.filterContainer, $('.quick-input-count'));
        this.countContainer.setAttribute('aria-live', 'polite');
        var count = new CountBadge(this.countContainer, { countFormat: localize({ key: 'quickInput.countSelected', comment: ['This tells the user how many items are selected in a list of items to select from. The items can be anything.'] }, "{0} Selected") });
        this._register(attachBadgeStyler(count, this.themeService));
        this.okContainer = dom.append(headerContainer, $('.quick-input-action'));
        this.ok = new Button(this.okContainer);
        attachButtonStyler(this.ok, this.themeService);
        this.ok.label = localize('ok', "OK");
        this._register(this.ok.onDidClick(function (e) {
            _this.onDidAcceptEmitter.fire();
        }));
        var message = dom.append(container, $("#" + this.idPrefix + "message.quick-input-message"));
        var progressBar = new ProgressBar(container);
        dom.addClass(progressBar.getContainer(), 'quick-input-progress');
        this._register(attachProgressBarStyler(progressBar, this.themeService));
        var list = this._register(this.instantiationService.createInstance(QuickInputList, container, this.idPrefix + 'list'));
        this._register(list.onChangedAllVisibleChecked(function (checked) {
            checkAll.checked = checked;
        }));
        this._register(list.onChangedVisibleCount(function (c) {
            visibleCount.setCount(c);
        }));
        this._register(list.onChangedCheckedCount(function (c) {
            count.setCount(c);
        }));
        this._register(list.onLeave(function () {
            // Defer to avoid the input field reacting to the triggering key.
            setTimeout(function () {
                inputBox.setFocus();
                if (_this.controller instanceof QuickPick && _this.controller.canSelectMany) {
                    list.clearFocus();
                }
            }, 0);
        }));
        this._register(list.onDidChangeFocus(function () {
            if (_this.comboboxAccessibility) {
                _this.ui.inputBox.setAttribute('aria-activedescendant', _this.ui.list.getActiveDescendant());
            }
        }));
        var focusTracker = dom.trackFocus(container);
        this._register(focusTracker);
        this._register(focusTracker.onDidBlur(function () {
            if (!_this.ui.ignoreFocusOut && !_this.environmentService.args['sticky-quickopen'] && _this.configurationService.getValue(CLOSE_ON_FOCUS_LOST_CONFIG)) {
                _this.hide(true);
            }
        }));
        this._register(dom.addDisposableListener(container, dom.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            switch (event.keyCode) {
                case 3 /* Enter */:
                    dom.EventHelper.stop(e, true);
                    _this.onDidAcceptEmitter.fire();
                    break;
                case 9 /* Escape */:
                    dom.EventHelper.stop(e, true);
                    _this.hide();
                    break;
                case 2 /* Tab */:
                    if (!event.altKey && !event.ctrlKey && !event.metaKey) {
                        var selectors = ['.action-label.icon'];
                        if (container.classList.contains('show-checkboxes')) {
                            selectors.push('input');
                        }
                        else {
                            selectors.push('input[type=text]');
                        }
                        if (_this.ui.list.isDisplayed()) {
                            selectors.push('.monaco-list');
                        }
                        var stops = container.querySelectorAll(selectors.join(', '));
                        if (event.shiftKey && event.target === stops[0]) {
                            dom.EventHelper.stop(e, true);
                            stops[stops.length - 1].focus();
                        }
                        else if (!event.shiftKey && event.target === stops[stops.length - 1]) {
                            dom.EventHelper.stop(e, true);
                            stops[0].focus();
                        }
                    }
                    break;
            }
        }));
        this._register(this.quickOpenService.onShow(function () { return _this.hide(true); }));
        this.ui = {
            container: container,
            leftActionBar: leftActionBar,
            title: title,
            rightActionBar: rightActionBar,
            checkAll: checkAll,
            inputBox: inputBox,
            visibleCount: visibleCount,
            count: count,
            message: message,
            progressBar: progressBar,
            list: list,
            onDidAccept: this.onDidAcceptEmitter.event,
            onDidTriggerButton: this.onDidTriggerButtonEmitter.event,
            ignoreFocusOut: false,
            keyMods: this.keyMods,
            isScreenReaderOptimized: function () { return _this.isScreenReaderOptimized(); },
            show: function (controller) { return _this.show(controller); },
            hide: function () { return _this.hide(); },
            setVisibilities: function (visibilities) { return _this.setVisibilities(visibilities); },
            setComboboxAccessibility: function (enabled) { return _this.setComboboxAccessibility(enabled); },
            setEnabled: function (enabled) { return _this.setEnabled(enabled); },
            setContextKey: function (contextKey) { return _this.setContextKey(contextKey); },
        };
        this.updateStyles();
    };
    QuickInputService.prototype.pick = function (picks, options, token) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (token === void 0) { token = CancellationToken.None; }
        return new TPromise(function (doResolve, reject) {
            var resolve = function (result) {
                resolve = doResolve;
                if (options.onKeyMods) {
                    options.onKeyMods(input.keyMods);
                }
                doResolve(result);
            };
            if (token.isCancellationRequested) {
                resolve(undefined);
                return;
            }
            var input = _this.createQuickPick();
            var activeItem;
            var disposables = [
                input,
                input.onDidAccept(function () {
                    if (input.canSelectMany) {
                        resolve(input.selectedItems.slice());
                        input.hide();
                    }
                    else {
                        var result = input.activeItems[0];
                        if (result) {
                            resolve(result);
                            input.hide();
                        }
                    }
                }),
                input.onDidChangeActive(function (items) {
                    var focused = items[0];
                    if (focused && options.onDidFocus) {
                        options.onDidFocus(focused);
                    }
                }),
                input.onDidChangeSelection(function (items) {
                    if (!input.canSelectMany) {
                        var result = items[0];
                        if (result) {
                            resolve(result);
                            input.hide();
                        }
                    }
                }),
                input.onDidTriggerItemButton(function (event) { return options.onDidTriggerItemButton && options.onDidTriggerItemButton(__assign({}, event, { removeItem: function () {
                        var index = input.items.indexOf(event.item);
                        if (index !== -1) {
                            var items = input.items.slice();
                            items.splice(index, 1);
                            input.items = items;
                        }
                    } })); }),
                input.onDidChangeValue(function (value) {
                    if (activeItem && !value && (input.activeItems.length !== 1 || input.activeItems[0] !== activeItem)) {
                        input.activeItems = [activeItem];
                    }
                }),
                token.onCancellationRequested(function () {
                    input.hide();
                }),
                input.onDidHide(function () {
                    dispose(disposables);
                    resolve(undefined);
                }),
            ];
            input.canSelectMany = options.canPickMany;
            input.placeholder = options.placeHolder;
            input.ignoreFocusOut = options.ignoreFocusLost;
            input.matchOnDescription = options.matchOnDescription;
            input.matchOnDetail = options.matchOnDetail;
            input.quickNavigate = options.quickNavigate;
            input.contextKey = options.contextKey;
            input.busy = true;
            TPromise.join([picks, options.activeItem])
                .then(function (_a) {
                var items = _a[0], _activeItem = _a[1];
                activeItem = _activeItem;
                input.busy = false;
                input.items = items;
                if (input.canSelectMany) {
                    input.selectedItems = items.filter(function (item) { return item.type !== 'separator' && item.picked; });
                }
                if (activeItem) {
                    input.activeItems = [activeItem];
                }
            });
            input.show();
            TPromise.wrap(picks).then(null, function (err) {
                reject(err);
                input.hide();
            });
        });
    };
    QuickInputService.prototype.input = function (options, token) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (token === void 0) { token = CancellationToken.None; }
        return new TPromise(function (resolve, reject) {
            if (token.isCancellationRequested) {
                resolve(undefined);
                return;
            }
            var input = _this.createInputBox();
            var validateInput = options.validateInput || (function () { return TPromise.as(undefined); });
            var onDidValueChange = debounceEvent(input.onDidChangeValue, function (last, cur) { return cur; }, 100);
            var validationValue = options.value || '';
            var validation = TPromise.wrap(validateInput(validationValue));
            var disposables = [
                input,
                onDidValueChange(function (value) {
                    if (value !== validationValue) {
                        validation = TPromise.wrap(validateInput(value));
                        validationValue = value;
                    }
                    validation.then(function (result) {
                        if (value === validationValue) {
                            input.validationMessage = result;
                        }
                    });
                }),
                input.onDidAccept(function () {
                    var value = input.value;
                    if (value !== validationValue) {
                        validation = TPromise.wrap(validateInput(value));
                        validationValue = value;
                    }
                    validation.then(function (result) {
                        if (!result) {
                            resolve(value);
                            input.hide();
                        }
                        else if (value === validationValue) {
                            input.validationMessage = result;
                        }
                    });
                }),
                token.onCancellationRequested(function () {
                    input.hide();
                }),
                input.onDidHide(function () {
                    dispose(disposables);
                    resolve(undefined);
                }),
            ];
            input.value = options.value;
            input.valueSelection = options.valueSelection;
            input.prompt = options.prompt;
            input.placeholder = options.placeHolder;
            input.password = options.password;
            input.ignoreFocusOut = options.ignoreFocusLost;
            input.show();
        });
    };
    QuickInputService.prototype.createQuickPick = function () {
        this.create();
        return new QuickPick(this.ui);
    };
    QuickInputService.prototype.createInputBox = function () {
        this.create();
        return new InputBox(this.ui);
    };
    QuickInputService.prototype.show = function (controller) {
        this.create();
        this.quickOpenService.close();
        var oldController = this.controller;
        this.controller = controller;
        if (oldController) {
            oldController.didHide();
        }
        this.setEnabled(true);
        this.ui.leftActionBar.clear();
        this.ui.title.textContent = '';
        this.ui.rightActionBar.clear();
        this.ui.checkAll.checked = false;
        // this.ui.inputBox.value = ''; Avoid triggering an event.
        this.ui.inputBox.placeholder = '';
        this.ui.inputBox.password = false;
        this.ui.inputBox.showDecoration(Severity.Ignore);
        this.ui.visibleCount.setCount(0);
        this.ui.count.setCount(0);
        this.ui.message.textContent = '';
        this.ui.progressBar.stop();
        this.ui.list.setElements([]);
        this.ui.list.matchOnDescription = false;
        this.ui.list.matchOnDetail = false;
        this.ui.ignoreFocusOut = false;
        this.setComboboxAccessibility(false);
        this.ui.inputBox.removeAttribute('aria-label');
        var keybinding = this.keybindingService.lookupKeybinding(BackAction.ID);
        backButton.tooltip = keybinding ? localize('quickInput.backWithKeybinding', "Back ({0})", keybinding.getLabel()) : localize('quickInput.back', "Back");
        this.inQuickOpen('quickInput', true);
        this.resetContextKeys();
        this.ui.container.style.display = '';
        this.updateLayout();
        this.ui.inputBox.setFocus();
    };
    QuickInputService.prototype.setVisibilities = function (visibilities) {
        this.ui.title.style.display = visibilities.title ? '' : 'none';
        this.ui.checkAll.style.display = visibilities.checkAll ? '' : 'none';
        this.filterContainer.style.display = visibilities.inputBox ? '' : 'none';
        this.visibleCountContainer.style.display = visibilities.visibleCount ? '' : 'none';
        this.countContainer.style.display = visibilities.count ? '' : 'none';
        this.okContainer.style.display = visibilities.ok ? '' : 'none';
        this.ui.message.style.display = visibilities.message ? '' : 'none';
        this.ui.list.display(visibilities.list);
        this.ui.container.classList[visibilities.checkAll ? 'add' : 'remove']('show-checkboxes');
        this.updateLayout(); // TODO
    };
    QuickInputService.prototype.setComboboxAccessibility = function (enabled) {
        if (enabled !== this.comboboxAccessibility) {
            this.comboboxAccessibility = enabled;
            if (this.comboboxAccessibility) {
                this.ui.inputBox.setAttribute('role', 'combobox');
                this.ui.inputBox.setAttribute('aria-haspopup', 'true');
                this.ui.inputBox.setAttribute('aria-autocomplete', 'list');
                this.ui.inputBox.setAttribute('aria-activedescendant', this.ui.list.getActiveDescendant());
            }
            else {
                this.ui.inputBox.removeAttribute('role');
                this.ui.inputBox.removeAttribute('aria-haspopup');
                this.ui.inputBox.removeAttribute('aria-autocomplete');
                this.ui.inputBox.removeAttribute('aria-activedescendant');
            }
        }
    };
    QuickInputService.prototype.isScreenReaderOptimized = function () {
        var detected = browser.getAccessibilitySupport() === 2 /* Enabled */;
        var config = this.configurationService.getValue('editor').accessibilitySupport;
        return config === 'on' || (config === 'auto' && detected);
    };
    QuickInputService.prototype.setEnabled = function (enabled) {
        if (enabled !== this.enabled) {
            this.enabled = enabled;
            for (var _i = 0, _a = this.ui.leftActionBar.items; _i < _a.length; _i++) {
                var item = _a[_i];
                item.getAction().enabled = enabled;
            }
            for (var _b = 0, _c = this.ui.rightActionBar.items; _b < _c.length; _b++) {
                var item = _c[_b];
                item.getAction().enabled = enabled;
            }
            this.ui.checkAll.disabled = !enabled;
            // this.ui.inputBox.enabled = enabled; Avoid loosing focus.
            this.ok.enabled = enabled;
            this.ui.list.enabled = enabled;
        }
    };
    QuickInputService.prototype.hide = function (focusLost) {
        var controller = this.controller;
        if (controller) {
            this.controller = null;
            this.inQuickOpen('quickInput', false);
            this.resetContextKeys();
            this.ui.container.style.display = 'none';
            if (!focusLost) {
                this.editorGroupService.activeGroup.focus();
            }
            controller.didHide();
        }
    };
    QuickInputService.prototype.focus = function () {
        if (this.isDisplayed()) {
            this.ui.inputBox.setFocus();
        }
    };
    QuickInputService.prototype.toggle = function () {
        if (this.isDisplayed() && this.controller instanceof QuickPick && this.controller.canSelectMany) {
            this.ui.list.toggleCheckbox();
        }
    };
    QuickInputService.prototype.navigate = function (next, quickNavigate) {
        if (this.isDisplayed() && this.ui.list.isDisplayed()) {
            this.ui.list.focus(next ? 'Next' : 'Previous');
            if (quickNavigate && this.controller instanceof QuickPick) {
                this.controller.quickNavigate = quickNavigate;
            }
        }
    };
    QuickInputService.prototype.accept = function () {
        this.onDidAcceptEmitter.fire();
        return TPromise.as(undefined);
    };
    QuickInputService.prototype.back = function () {
        this.onDidTriggerButtonEmitter.fire(this.backButton);
        return TPromise.as(undefined);
    };
    QuickInputService.prototype.cancel = function () {
        this.hide();
        return TPromise.as(undefined);
    };
    QuickInputService.prototype.layout = function (dimension) {
        this.layoutDimensions = dimension;
        this.updateLayout();
    };
    QuickInputService.prototype.updateLayout = function () {
        if (this.layoutDimensions && this.ui) {
            var titlebarOffset = this.partService.getTitleBarOffset();
            this.ui.container.style.top = titlebarOffset + "px";
            var style = this.ui.container.style;
            var width = Math.min(this.layoutDimensions.width * 0.62 /* golden cut */, QuickInputService.MAX_WIDTH);
            style.width = width + 'px';
            style.marginLeft = '-' + (width / 2) + 'px';
            this.ui.inputBox.layout();
            this.ui.list.layout();
        }
    };
    QuickInputService.prototype.updateStyles = function () {
        var theme = this.themeService.getTheme();
        if (this.ui) {
            // TODO
            var titleColor = { dark: 'rgba(255, 255, 255, 0.105)', light: 'rgba(0,0,0,.06)', hc: 'black' }[theme.type];
            this.titleBar.style.backgroundColor = titleColor ? titleColor.toString() : null;
            this.ui.inputBox.style(theme);
            var sideBarBackground = theme.getColor(SIDE_BAR_BACKGROUND);
            this.ui.container.style.backgroundColor = sideBarBackground ? sideBarBackground.toString() : null;
            var sideBarForeground = theme.getColor(SIDE_BAR_FOREGROUND);
            this.ui.container.style.color = sideBarForeground ? sideBarForeground.toString() : null;
            var contrastBorderColor = theme.getColor(contrastBorder);
            this.ui.container.style.border = contrastBorderColor ? "1px solid " + contrastBorderColor : null;
            var widgetShadowColor = theme.getColor(widgetShadow);
            this.ui.container.style.boxShadow = widgetShadowColor ? "0 5px 8px " + widgetShadowColor : null;
        }
    };
    QuickInputService.prototype.isDisplayed = function () {
        return this.ui && this.ui.container.style.display !== 'none';
    };
    QuickInputService.ID = 'workbench.component.quickinput';
    QuickInputService.MAX_WIDTH = 600; // Max total width of quick open widget
    QuickInputService = __decorate([
        __param(0, IEnvironmentService),
        __param(1, IConfigurationService),
        __param(2, IInstantiationService),
        __param(3, IPartService),
        __param(4, IQuickOpenService),
        __param(5, IEditorGroupsService),
        __param(6, IKeybindingService),
        __param(7, IContextKeyService),
        __param(8, IThemeService)
    ], QuickInputService);
    return QuickInputService;
}(Component));
export { QuickInputService };
export var QuickPickManyToggle = {
    id: 'workbench.action.quickPickManyToggle',
    weight: 200 /* WorkbenchContrib */,
    when: inQuickOpenContext,
    primary: undefined,
    handler: function (accessor) {
        var quickInputService = accessor.get(IQuickInputService);
        quickInputService.toggle();
    }
};
var BackAction = /** @class */ (function (_super) {
    __extends(BackAction, _super);
    function BackAction(id, label, quickInputService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickInputService = quickInputService;
        return _this;
    }
    BackAction.prototype.run = function () {
        this.quickInputService.back();
        return TPromise.as(null);
    };
    BackAction.ID = 'workbench.action.quickInputBack';
    BackAction.LABEL = localize('back', "Back");
    BackAction = __decorate([
        __param(2, IQuickInputService)
    ], BackAction);
    return BackAction;
}(Action));
export { BackAction };
