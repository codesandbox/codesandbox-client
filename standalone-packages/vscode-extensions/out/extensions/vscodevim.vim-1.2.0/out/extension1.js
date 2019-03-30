"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extension.ts is a lightweight wrapper around ModeHandler. It converts key
 * events to their string names and passes them on to ModeHandler via
 * handleKeyEvent().
 */
require("./src/actions/include-all");
const _ = require("lodash");
const vscode = require("vscode");
const compositionState_1 = require("./src/state/compositionState");
const editorIdentity_1 = require("./src/editorIdentity");
const globals_1 = require("./src/globals");
const jump_1 = require("./src/jumps/jump");
const modeHandlerMap_1 = require("./src/mode/modeHandlerMap");
const mode_1 = require("./src/mode/mode");
const notation_1 = require("./src/configuration/notation");
const logger_1 = require("./src/util/logger");
const position_1 = require("./src/common/motion/position");
const statusBar_1 = require("./src/statusBar");
const vscode_context_1 = require("./src/util/vscode-context");
const commandLine_1 = require("./src/cmd_line/commandLine");
const configuration_1 = require("./src/configuration/configuration");
const globalState_1 = require("./src/state/globalState");
const taskQueue_1 = require("./src/taskQueue");
let extensionContext;
let previousActiveEditorId = null;
let lastClosedModeHandler = null;
function getAndUpdateModeHandler(forceSyncAndUpdate = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const activeEditorId = new editorIdentity_1.EditorIdentity(vscode.window.activeTextEditor);
        let [curHandler, isNew] = yield modeHandlerMap_1.ModeHandlerMap.getOrCreate(activeEditorId.toString());
        if (isNew) {
            extensionContext.subscriptions.push(curHandler);
        }
        curHandler.vimState.editor = vscode.window.activeTextEditor;
        if (forceSyncAndUpdate ||
            !previousActiveEditorId ||
            !previousActiveEditorId.isEqual(activeEditorId)) {
            curHandler.syncCursors();
            yield curHandler.updateView(curHandler.vimState, { drawSelection: false, revealRange: false });
        }
        previousActiveEditorId = activeEditorId;
        if (curHandler.vimState.focusChanged) {
            curHandler.vimState.focusChanged = false;
            if (previousActiveEditorId) {
                const prevHandler = modeHandlerMap_1.ModeHandlerMap.get(previousActiveEditorId.toString());
                prevHandler.vimState.focusChanged = true;
            }
        }
        return curHandler;
    });
}
exports.getAndUpdateModeHandler = getAndUpdateModeHandler;
function loadConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = logger_1.Logger.get('Configuration');
        const validatorResults = yield configuration_1.configuration.load();
        logger.debug(`${validatorResults.numErrors} errors found with vim configuration`);
        if (validatorResults.numErrors > 0) {
            for (let validatorResult of validatorResults.get()) {
                switch (validatorResult.level) {
                    case 'error':
                        logger.error(validatorResult.message);
                        break;
                    case 'warning':
                        logger.warn(validatorResult.message);
                        break;
                }
            }
        }
    });
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // before we do anything else,
        // we need to load the configuration first
        yield loadConfiguration();
        const logger = logger_1.Logger.get('Extension Startup');
        logger.debug('Start');
        extensionContext = context;
        extensionContext.subscriptions.push(statusBar_1.StatusBar);
        // load state
        yield Promise.all([commandLine_1.commandLine.load(), globalState_1.globalState.load()]);
        // workspace events
        registerEventListener(context, vscode.workspace.onDidChangeConfiguration, () => __awaiter(this, void 0, void 0, function* () {
            yield loadConfiguration();
        }), false);
        registerEventListener(context, vscode.workspace.onDidChangeTextDocument, (event) => __awaiter(this, void 0, void 0, function* () {
            const textWasDeleted = changeEvent => changeEvent.contentChanges.length === 1 &&
                changeEvent.contentChanges[0].text === '' &&
                changeEvent.contentChanges[0].range.start.line !==
                    changeEvent.contentChanges[0].range.end.line;
            const textWasAdded = changeEvent => changeEvent.contentChanges.length === 1 &&
                (changeEvent.contentChanges[0].text === '\n' ||
                    changeEvent.contentChanges[0].text === '\r\n') &&
                changeEvent.contentChanges[0].range.start.line ===
                    changeEvent.contentChanges[0].range.end.line;
            if (textWasDeleted(event)) {
                globalState_1.globalState.jumpTracker.handleTextDeleted(event.document, event.contentChanges[0].range);
            }
            else if (textWasAdded(event)) {
                globalState_1.globalState.jumpTracker.handleTextAdded(event.document, event.contentChanges[0].range, event.contentChanges[0].text);
            }
            // Change from vscode editor should set document.isDirty to true but they initially don't!
            // There is a timing issue in vscode codebase between when the isDirty flag is set and
            // when registered callbacks are fired. https://github.com/Microsoft/vscode/issues/11339
            const contentChangeHandler = (modeHandler) => {
                if (modeHandler.vimState.currentMode === mode_1.ModeName.Insert) {
                    if (modeHandler.vimState.historyTracker.currentContentChanges === undefined) {
                        modeHandler.vimState.historyTracker.currentContentChanges = [];
                    }
                    modeHandler.vimState.historyTracker.currentContentChanges = modeHandler.vimState.historyTracker.currentContentChanges.concat(event.contentChanges);
                }
            };
            if (globals_1.Globals.isTesting && globals_1.Globals.mockModeHandler) {
                contentChangeHandler(globals_1.Globals.mockModeHandler);
            }
            else {
                _.filter(modeHandlerMap_1.ModeHandlerMap.getAll(), modeHandler => modeHandler.vimState.identity.fileName === event.document.fileName).forEach(modeHandler => {
                    contentChangeHandler(modeHandler);
                });
            }
            setTimeout(() => {
                if (!event.document.isDirty && !event.document.isUntitled && event.contentChanges.length) {
                    handleContentChangedFromDisk(event.document);
                }
            }, 0);
        }));
        registerEventListener(context, vscode.workspace.onDidCloseTextDocument, () => __awaiter(this, void 0, void 0, function* () {
            const documents = vscode.workspace.textDocuments;
            // Delete modehandler once all tabs of this document have been closed
            for (let editorIdentity of modeHandlerMap_1.ModeHandlerMap.getKeys()) {
                const modeHandler = modeHandlerMap_1.ModeHandlerMap.get(editorIdentity);
                if (modeHandler == null ||
                    modeHandler.vimState.editor === undefined ||
                    documents.indexOf(modeHandler.vimState.editor.document) === -1) {
                    modeHandlerMap_1.ModeHandlerMap.delete(editorIdentity);
                }
            }
        }), false);
        // window events
        registerEventListener(context, vscode.window.onDidChangeActiveTextEditor, () => __awaiter(this, void 0, void 0, function* () {
            const mhPrevious = previousActiveEditorId
                ? modeHandlerMap_1.ModeHandlerMap.get(previousActiveEditorId.toString())
                : null;
            // Track the closed editor so we can use it the next time an open event occurs.
            // When vscode changes away from a temporary file, onDidChangeActiveTextEditor first twice.
            // First it fires when leaving the closed editor. Then onDidCloseTextDocument first, and we delete
            // the old ModeHandler. Then a new editor opens.
            //
            // This also applies to files that are merely closed, which allows you to jump back to that file similarly
            // once a new file is opened.
            lastClosedModeHandler = mhPrevious || lastClosedModeHandler;
            if (vscode.window.activeTextEditor === undefined) {
                return;
            }
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                if (vscode.window.activeTextEditor !== undefined) {
                    const mh = yield getAndUpdateModeHandler(true);
                    yield vscode_context_1.VsCodeContext.Set('vim.mode', mode_1.ModeName[mh.vimState.currentMode]);
                    yield mh.updateView(mh.vimState, { drawSelection: false, revealRange: false });
                    globalState_1.globalState.jumpTracker.handleFileJump(lastClosedModeHandler ? jump_1.Jump.fromStateNow(lastClosedModeHandler.vimState) : null, jump_1.Jump.fromStateNow(mh.vimState));
                }
            }));
        }), true, true);
        registerEventListener(context, vscode.window.onDidChangeTextEditorSelection, (e) => __awaiter(this, void 0, void 0, function* () {
            if (vscode.window.activeTextEditor === undefined ||
                e.textEditor.document !== vscode.window.activeTextEditor.document) {
                // we don't care if there is no active editor
                // or user selection changed in a paneled window (e.g debug console/terminal)
                return;
            }
            const mh = yield getAndUpdateModeHandler();
            if (mh.vimState.focusChanged) {
                mh.vimState.focusChanged = false;
                return;
            }
            if (mh.currentMode.name === mode_1.ModeName.EasyMotionMode) {
                return;
            }
            taskQueue_1.taskQueue.enqueueTask(() => mh.handleSelectionChange(e), undefined, 
            /**
             * We don't want these to become backlogged! If they do, we'll update
             * the selection to an incorrect value and see a jittering cursor.
             */
            true);
        }), true, true);
        const compositionState = new compositionState_1.CompositionState();
        // override vscode commands
        overrideCommand(context, 'type', (args) => __awaiter(this, void 0, void 0, function* () {
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                const mh = yield getAndUpdateModeHandler();
                if (compositionState.isInComposition) {
                    compositionState.composingText += args.text;
                }
                else {
                    yield mh.handleKeyEvent(args.text);
                }
            }));
        }));
        overrideCommand(context, 'replacePreviousChar', (args) => __awaiter(this, void 0, void 0, function* () {
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                const mh = yield getAndUpdateModeHandler();
                if (compositionState.isInComposition) {
                    compositionState.composingText =
                        compositionState.composingText.substr(0, compositionState.composingText.length - args.replaceCharCnt) + args.text;
                }
                else {
                    yield vscode.commands.executeCommand('default:replacePreviousChar', {
                        text: args.text,
                        replaceCharCnt: args.replaceCharCnt,
                    });
                    mh.vimState.cursorStopPosition = position_1.Position.FromVSCodePosition(mh.vimState.editor.selection.start);
                    mh.vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(mh.vimState.editor.selection.start);
                }
            }));
        }));
        overrideCommand(context, 'compositionStart', () => __awaiter(this, void 0, void 0, function* () {
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                const mh = yield getAndUpdateModeHandler();
                if (mh.vimState.currentMode !== mode_1.ModeName.Insert) {
                    compositionState.isInComposition = true;
                }
            }));
        }));
        overrideCommand(context, 'compositionEnd', () => __awaiter(this, void 0, void 0, function* () {
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                const mh = yield getAndUpdateModeHandler();
                if (mh.vimState.currentMode !== mode_1.ModeName.Insert) {
                    let text = compositionState.composingText;
                    compositionState.reset();
                    mh.handleMultipleKeyEvents(text.split(''));
                }
            }));
        }));
        // register extension commands
        registerCommand(context, 'vim.showQuickpickCmdLine', () => __awaiter(this, void 0, void 0, function* () {
            const mh = yield getAndUpdateModeHandler();
            yield commandLine_1.commandLine.PromptAndRun('', mh.vimState);
            mh.updateView(mh.vimState);
        }));
        registerCommand(context, 'vim.remap', (args) => __awaiter(this, void 0, void 0, function* () {
            taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
                const mh = yield getAndUpdateModeHandler();
                if (args.after) {
                    for (const key of args.after) {
                        yield mh.handleKeyEvent(notation_1.Notation.NormalizeKey(key, configuration_1.configuration.leader));
                    }
                    return;
                }
                if (args.commands) {
                    for (const command of args.commands) {
                        // Check if this is a vim command by looking for :
                        if (command.command.slice(0, 1) === ':') {
                            yield commandLine_1.commandLine.Run(command.command.slice(1, command.command.length), mh.vimState);
                            mh.updateView(mh.vimState);
                        }
                        else {
                            vscode.commands.executeCommand(command.command, command.args);
                        }
                    }
                }
            }));
        }));
        registerCommand(context, 'toggleVim', () => __awaiter(this, void 0, void 0, function* () {
            configuration_1.configuration.disableExtension = !configuration_1.configuration.disableExtension;
            toggleExtension(configuration_1.configuration.disableExtension, compositionState);
        }));
        for (const boundKey of configuration_1.configuration.boundKeyCombinations) {
            registerCommand(context, boundKey.command, () => handleKeyEvent(`${boundKey.key}`));
        }
        // Initialize mode handler for current active Text Editor at startup.
        if (vscode.window.activeTextEditor) {
            let mh = yield getAndUpdateModeHandler();
            // This is called last because getAndUpdateModeHandler() will change cursor
            mh.updateView(mh.vimState, { drawSelection: false, revealRange: false });
        }
        // Disable automatic keyboard navigation in lists, so it doesn't interfere
        // with our list navigation keybindings
        yield vscode_context_1.VsCodeContext.Set('listAutomaticKeyboardNavigation', false);
        yield toggleExtension(configuration_1.configuration.disableExtension, compositionState);
        logger.debug('Finish.');
    });
}
exports.activate = activate;
/**
 * Toggles the VSCodeVim extension between Enabled mode and Disabled mode. This
 * function is activated by calling the 'toggleVim' command from the Command Palette.
 *
 * @param isDisabled if true, sets VSCodeVim to Disabled mode; else sets to enabled mode
 */
function toggleExtension(isDisabled, compositionState) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_context_1.VsCodeContext.Set('vim.active', !isDisabled);
        if (!vscode.window.activeTextEditor) {
            // This was happening in unit tests.
            // If activate was called and no editor window is open, we can't properly initialize.
            return;
        }
        let mh = yield getAndUpdateModeHandler();
        if (isDisabled) {
            yield mh.handleKeyEvent('<ExtensionDisable>');
            compositionState.reset();
            modeHandlerMap_1.ModeHandlerMap.clear();
        }
        else {
            yield mh.handleKeyEvent('<ExtensionEnable>');
        }
    });
}
function overrideCommand(context, command, callback) {
    const disposable = vscode.commands.registerCommand(command, (args) => __awaiter(this, void 0, void 0, function* () {
        if (configuration_1.configuration.disableExtension) {
            return vscode.commands.executeCommand('default:' + command, args);
        }
        if (!vscode.window.activeTextEditor) {
            return;
        }
        if (vscode.window.activeTextEditor.document &&
            vscode.window.activeTextEditor.document.uri.toString() === 'debug:input') {
            return vscode.commands.executeCommand('default:' + command, args);
        }
        return callback(args);
    }));
    context.subscriptions.push(disposable);
}
function registerCommand(context, command, callback) {
    const disposable = vscode.commands.registerCommand(command, (args) => __awaiter(this, void 0, void 0, function* () {
        if (!vscode.window.activeTextEditor) {
            return;
        }
        callback(args);
    }));
    context.subscriptions.push(disposable);
}
function registerEventListener(context, event, listener, exitOnExtensionDisable = true, exitOnTests = false) {
    const disposable = event((e) => __awaiter(this, void 0, void 0, function* () {
        if (exitOnExtensionDisable && configuration_1.configuration.disableExtension) {
            return;
        }
        if (exitOnTests && globals_1.Globals.isTesting) {
            return;
        }
        listener(e);
    }));
    context.subscriptions.push(disposable);
}
function handleKeyEvent(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const mh = yield getAndUpdateModeHandler();
        taskQueue_1.taskQueue.enqueueTask(() => __awaiter(this, void 0, void 0, function* () {
            yield mh.handleKeyEvent(key);
        }));
    });
}
function handleContentChangedFromDisk(document) {
    _.filter(modeHandlerMap_1.ModeHandlerMap.getAll(), modeHandler => modeHandler.vimState.identity.fileName === document.fileName).forEach(modeHandler => {
        modeHandler.vimState.historyTracker.clear();
    });
}

//# sourceMappingURL=extension.js.map
