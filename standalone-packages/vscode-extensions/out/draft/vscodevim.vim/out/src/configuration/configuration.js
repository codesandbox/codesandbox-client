"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const globals_1 = require("../globals");
const taskQueue_1 = require("../taskQueue");
const notation_1 = require("./notation");
const packagejson = require('../../../package.json');
/**
 * Every Vim option we support should
 * 1. Be added to contribution section of `package.json`.
 * 2. Named as `vim.{optionName}`, `optionName` is the name we use in Vim.
 * 3. Define a public property in `Configuration` with the same name and a default value.
 *    Or define a private property and define customized Getter/Setter accessors for it.
 *    Always remember to decorate Getter accessor as @enumerable()
 * 4. If user doesn't set the option explicitly
 *    a. we don't have a similar setting in Code, initialize the option as default value.
 *    b. we have a similar setting in Code, use Code's setting.
 *
 * Vim option override sequence.
 * 1. `:set {option}` on the fly
 * 2. TODO .vimrc.
 * 3. `vim.{option}`
 * 4. VS Code configuration
 * 5. VSCodeVim flavored Vim option default values
 *
 */
class Configuration {
    constructor() {
        this.leaderDefault = '\\';
        this.cursorTypeMap = {
            line: vscode.TextEditorCursorStyle.Line,
            block: vscode.TextEditorCursorStyle.Block,
            underline: vscode.TextEditorCursorStyle.Underline,
            'line-thin': vscode.TextEditorCursorStyle.LineThin,
            'block-outline': vscode.TextEditorCursorStyle.BlockOutline,
            'underline-thin': vscode.TextEditorCursorStyle.UnderlineThin,
        };
        this.handleKeys = [];
        this.useSystemClipboard = false;
        this.useCtrlKeys = false;
        this.overrideCopy = true;
        this.textwidth = 80;
        this.hlsearch = false;
        this.ignorecase = true;
        this.smartcase = true;
        this.autoindent = true;
        this.sneak = false;
        this.sneakUseIgnorecaseAndSmartcase = false;
        this.surround = true;
        this.easymotion = false;
        this.easymotionMarkerBackgroundColor = '';
        this.easymotionMarkerForegroundColorOneChar = '#ff0000';
        this.easymotionMarkerForegroundColorTwoChar = '#ffa500';
        this.easymotionMarkerWidthPerChar = 8;
        this.easymotionMarkerHeight = 14;
        this.easymotionMarkerFontFamily = 'Consolas';
        this.easymotionMarkerFontSize = '14';
        this.easymotionMarkerFontWeight = 'normal';
        this.easymotionMarkerYOffset = 0;
        this.easymotionKeys = 'hklyuiopnm,qwertzxcvbasdgjf;';
        this.easymotionJumpToAnywhereRegex = '\\b[A-Za-z0-9]|[A-Za-z0-9]\\b|_.|#.|[a-z][A-Z]';
        this.autoSwitchInputMethod = {
            enable: false,
            defaultIM: '',
            obtainIMCmd: '',
            switchIMCmd: '',
        };
        this.timeout = 1000;
        this.showcmd = true;
        this.showmodename = true;
        this.leader = this.leaderDefault;
        this.history = 50;
        this.incsearch = true;
        this.startInInsertMode = false;
        this.statusBarColorControl = false;
        this.statusBarColors = {
            normal: '#005f5f',
            insert: '#5f0000',
            visual: '#5f00af',
            visualline: '#005f87',
            visualblock: '#86592d',
            replace: '#000000',
        };
        this.debug = {
            loggingLevel: 'error',
        };
        this.searchHighlightColor = 'rgba(150, 150, 255, 0.3)';
        this.iskeyword = '/\\()"\':,.;<>~!@#$%^&*|+=[]{}`?-';
        this.boundKeyCombinations = [];
        this.visualstar = false;
        this.mouseSelectionGoesIntoVisualMode = true;
        this.changeWordIncludesWhitespace = false;
        this.foldfix = false;
        this.disableExtension = false;
        this.enableNeovim = false;
        this.neovimPath = 'nvim';
        this.substituteGlobalFlag = false;
        this.whichwrap = '';
        this.wrapKeys = {};
        this.cursorStylePerMode = {
            normal: undefined,
            insert: undefined,
            visual: undefined,
            visualline: undefined,
            visualblock: undefined,
            replace: undefined,
        };
        // remappings
        this.insertModeKeyBindings = [];
        this.insertModeKeyBindingsNonRecursive = [];
        this.normalModeKeyBindings = [];
        this.normalModeKeyBindingsNonRecursive = [];
        this.visualModeKeyBindings = [];
        this.visualModeKeyBindingsNonRecursive = [];
        this.reload();
    }
    reload() {
        let vimConfigs = globals_1.Globals.isTesting
            ? globals_1.Globals.mockConfiguration
            : this.getConfiguration('vim');
        /* tslint:disable:forin */
        // Disable forin rule here as we make accessors enumerable.`
        for (const option in this) {
            let val = vimConfigs[option];
            if (val !== null && val !== undefined) {
                if (val.constructor.name === Object.name) {
                    val = this.unproxify(val);
                }
                this[option] = val;
            }
        }
        this.leader = notation_1.Notation.NormalizeKey(this.leader, this.leaderDefault);
        // normalize remapped keys
        const keybindingList = [
            this.insertModeKeyBindings,
            this.insertModeKeyBindingsNonRecursive,
            this.normalModeKeyBindings,
            this.normalModeKeyBindingsNonRecursive,
            this.visualModeKeyBindings,
            this.visualModeKeyBindingsNonRecursive,
        ];
        for (const keybindings of keybindingList) {
            for (let remapping of keybindings) {
                if (remapping.before) {
                    remapping.before.forEach((key, idx) => (remapping.before[idx] = notation_1.Notation.NormalizeKey(key, this.leader)));
                }
                if (remapping.after) {
                    remapping.after.forEach((key, idx) => (remapping.after[idx] = notation_1.Notation.NormalizeKey(key, this.leader)));
                }
            }
        }
        this.wrapKeys = {};
        for (const wrapKey of this.whichwrap.split(',')) {
            this.wrapKeys[wrapKey] = true;
        }
        // read package.json for bound keys
        this.boundKeyCombinations = [];
        for (let keybinding of packagejson.contributes.keybindings) {
            if (keybinding.when.indexOf('listFocus') !== -1) {
                continue;
            }
            let key = keybinding.key;
            if (process.platform === 'darwin') {
                key = keybinding.mac || key;
            }
            else if (process.platform === 'linux') {
                key = keybinding.linux || key;
            }
            this.boundKeyCombinations.push({
                key: notation_1.Notation.NormalizeKey(key, this.leader),
                command: keybinding.command,
            });
        }
        // enable/disable certain key combinations
        for (const boundKey of this.boundKeyCombinations) {
            // By default, all key combinations are used
            let useKey = true;
            let handleKey = this.handleKeys[boundKey.key];
            if (handleKey !== undefined) {
                // enabled/disabled through `vim.handleKeys`
                useKey = handleKey;
            }
            else if (!this.useCtrlKeys && boundKey.key.slice(1, 3) === 'C-') {
                // user has disabled CtrlKeys and the current key is a CtrlKey
                // <C-c>, still needs to be captured to overrideCopy
                if (boundKey.key === '<C-c>' && this.overrideCopy) {
                    useKey = true;
                }
                else {
                    useKey = false;
                }
            }
            vscode.commands.executeCommand('setContext', `vim.use${boundKey.key}`, useKey);
        }
        vscode.commands.executeCommand('setContext', 'vim.overrideCopy', this.overrideCopy);
        vscode.commands.executeCommand('setContext', 'vim.overrideCtrlC', this.overrideCopy || this.useCtrlKeys);
    }
    unproxify(obj) {
        let result = {};
        for (const key in obj) {
            let val = obj[key];
            if (val !== null && val !== undefined) {
                result[key] = val;
            }
        }
        return result;
    }
    getConfiguration(section = '') {
        let resource = undefined;
        let activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor) {
            resource = activeTextEditor.document.uri;
        }
        return vscode.workspace.getConfiguration(section, resource);
    }
    cursorStyleFromString(cursorStyle) {
        return this.cursorTypeMap[cursorStyle];
    }
    get editorCursorStyle() {
        return this.cursorStyleFromString(this.editorCursorStyleRaw);
    }
    set editorCursorStyle(val) {
        // nop
    }
    get disableExt() {
        return this.disableExtension;
    }
    set disableExt(isDisabled) {
        this.disableExtension = isDisabled;
        this.getConfiguration('vim').update('disableExtension', isDisabled, vscode.ConfigurationTarget.Global);
    }
    getCursorStyleForMode(modeName) {
        let cursorStyle = this.cursorStylePerMode[modeName.toLowerCase()];
        if (cursorStyle) {
            return this.cursorStyleFromString(cursorStyle);
        }
        return;
    }
}
__decorate([
    overlapSetting({ settingName: 'tabSize', defaultValue: 8 })
], Configuration.prototype, "tabstop", void 0);
__decorate([
    overlapSetting({ settingName: 'cursorStyle', defaultValue: 'line' })
], Configuration.prototype, "editorCursorStyleRaw", void 0);
__decorate([
    overlapSetting({ settingName: 'insertSpaces', defaultValue: false })
], Configuration.prototype, "expandtab", void 0);
__decorate([
    overlapSetting({
        settingName: 'lineNumbers',
        defaultValue: true,
        map: new Map([['on', true], ['off', false], ['relative', false], ['interval', false]]),
    })
], Configuration.prototype, "number", void 0);
__decorate([
    overlapSetting({
        settingName: 'lineNumbers',
        defaultValue: false,
        map: new Map([['on', false], ['off', false], ['relative', true], ['interval', false]]),
    })
], Configuration.prototype, "relativenumber", void 0);
// handle mapped settings between vscode to vim
function overlapSetting(args) {
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                if (this['_' + propertyKey] !== undefined) {
                    return this['_' + propertyKey];
                }
                let val = this.getConfiguration('editor').get(args.settingName, args.defaultValue);
                if (args.map && val !== undefined) {
                    val = args.map.get(val);
                }
                return val;
            },
            set: function (value) {
                this['_' + propertyKey] = value;
                if (value === undefined || globals_1.Globals.isTesting) {
                    return;
                }
                taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                    if (args.map) {
                        for (let [vscodeSetting, vimSetting] of args.map.entries()) {
                            if (value === vimSetting) {
                                value = vscodeSetting;
                                break;
                            }
                        }
                    }
                    yield this.getConfiguration('editor').update(args.settingName, value, vscode.ConfigurationTarget.Global);
                }), 'config');
            },
            enumerable: true,
            configurable: true,
        });
    };
}
exports.configuration = new Configuration();

//# sourceMappingURL=configuration.js.map
