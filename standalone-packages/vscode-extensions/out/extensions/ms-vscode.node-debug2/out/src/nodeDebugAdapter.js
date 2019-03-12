"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_chrome_debug_core_1 = require("vscode-chrome-debug-core");
const telemetry = vscode_chrome_debug_core_1.telemetry.telemetry;
const vscode_debugadapter_1 = require("vscode-debugadapter");
const errors_1 = require("vscode-chrome-debug-core/out/src/errors");
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const pathUtils = require("./pathUtils");
const utils = require("./utils");
const errors = require("./errors");
const wsl = require("./wslSupport");
const nls = require("vscode-nls");
let localize = nls.loadMessageBundle(__filename);
const DefaultSourceMapPathOverrides = {
    'webpack:///./~/*': '${cwd}/node_modules/*',
    'webpack:///./*': '${cwd}/*',
    'webpack:///*': '*',
    'meteor://💻app/*': '${cwd}/*',
};
class NodeDebugAdapter extends vscode_chrome_debug_core_1.ChromeDebugAdapter {
    constructor() {
        super(...arguments);
        // Flags relevant during init
        this._continueAfterConfigDone = true;
        this._waitingForEntryPauseEvent = true;
        this._finishedConfig = false;
        this._handlingEarlyNodeMsgs = true;
        this._captureFromStd = false;
    }
    /**
     * Returns whether this is a non-EH attach scenario
     */
    get normalAttachMode() {
        return this._attachMode && !this.isExtensionHost();
    }
    get supportsTerminateRequest() {
        return process.platform !== 'win32' && !this.isExtensionHost();
    }
    initialize(args) {
        this._adapterID = args.adapterID;
        this._promiseRejectExceptionFilterEnabled = this.isExtensionHost();
        this._supportsRunInTerminalRequest = args.supportsRunInTerminalRequest;
        if (args.locale) {
            localize = nls.config({ locale: args.locale })(__filename);
        }
        const capabilities = super.initialize(args);
        capabilities.supportsLogPoints = true;
        capabilities.supportsTerminateRequest = this.supportsTerminateRequest;
        return capabilities;
    }
    launch(args) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof args.enableSourceMapCaching !== 'boolean') {
                args.enableSourceMapCaching = this.isExtensionHost();
            }
            if (args.console && args.console !== 'internalConsole' && typeof args._suppressConsoleOutput === 'undefined') {
                args._suppressConsoleOutput = true;
            }
            yield _super("launch").call(this, args);
            if (args.__restart && typeof args.__restart.port === 'number') {
                return this.doAttach(args.__restart.port, undefined, args.address, args.timeout);
            }
            const port = args.port || utils.random(3000, 50000);
            if (args.useWSL && !wsl.subsystemForLinuxPresent()) {
                return Promise.reject(new errors_1.ErrorWithMessage({
                    id: 2007,
                    format: localize(0, null)
                }));
            }
            this._continueAfterConfigDone = !args.stopOnEntry;
            if (this.isExtensionHost()) {
                return this.extensionHostLaunch(args, port);
            }
            let runtimeExecutable = args.runtimeExecutable;
            if (args.useWSL) {
                runtimeExecutable = runtimeExecutable || NodeDebugAdapter.NODE;
            }
            else if (runtimeExecutable) {
                if (path.isAbsolute(runtimeExecutable)) {
                    const re = pathUtils.findExecutable(runtimeExecutable, args.env);
                    if (!re) {
                        return this.getNotExistErrorResponse('runtimeExecutable', runtimeExecutable);
                    }
                    runtimeExecutable = re;
                }
                else {
                    const re = pathUtils.findOnPath(runtimeExecutable, args.env);
                    if (!re) {
                        return this.getRuntimeNotOnPathErrorResponse(runtimeExecutable);
                    }
                    runtimeExecutable = re;
                }
            }
            else {
                const re = pathUtils.findOnPath(NodeDebugAdapter.NODE, args.env);
                if (!re) {
                    return Promise.reject(errors.runtimeNotFound(NodeDebugAdapter.NODE));
                }
                // use node from PATH
                runtimeExecutable = re;
            }
            let programPath = args.program;
            if (programPath) {
                if (!path.isAbsolute(programPath)) {
                    return this.getRelativePathErrorResponse('program', programPath);
                }
                if (!fs.existsSync(programPath)) {
                    if (fs.existsSync(programPath + '.js')) {
                        programPath += '.js';
                    }
                    else {
                        return this.getNotExistErrorResponse('program', programPath);
                    }
                }
                programPath = path.normalize(programPath);
                if (pathUtils.normalizeDriveLetter(programPath) !== pathUtils.realCasePath(programPath)) {
                    vscode_chrome_debug_core_1.logger.warn(localize(1, null));
                }
            }
            this._captureFromStd = args.outputCapture === 'std';
            const resolvedProgramPath = yield this.resolveProgramPath(programPath, args.sourceMaps);
            let program;
            let cwd = args.cwd;
            if (cwd) {
                if (!path.isAbsolute(cwd)) {
                    return this.getRelativePathErrorResponse('cwd', cwd);
                }
                if (!fs.existsSync(cwd)) {
                    return this.getNotExistErrorResponse('cwd', cwd);
                }
                // if working dir is given and if the executable is within that folder, we make the executable path relative to the working dir
                if (resolvedProgramPath) {
                    program = (yield pathUtils.isSymlinkedPath(cwd)) ?
                        resolvedProgramPath :
                        path.relative(cwd, resolvedProgramPath);
                }
            }
            else if (resolvedProgramPath) {
                // if no working dir given, we use the direct folder of the executable
                cwd = path.dirname(resolvedProgramPath);
                program = (yield pathUtils.isSymlinkedPath(cwd)) ?
                    resolvedProgramPath :
                    path.basename(resolvedProgramPath);
            }
            const runtimeArgs = args.runtimeArgs || [];
            const programArgs = args.args || [];
            const debugArgs = detectSupportedDebugArgsForLaunch(args, runtimeExecutable, args.env);
            let launchArgs = [];
            if (!args.noDebug && !args.port) {
                // Always stop on entry to set breakpoints
                if (debugArgs === DebugArgs.Inspect_DebugBrk) {
                    launchArgs.push(`--inspect=${port}`);
                    launchArgs.push('--debug-brk');
                }
                else {
                    launchArgs.push(`--inspect-brk=${port}`);
                }
            }
            launchArgs = runtimeArgs.concat(launchArgs, program ? [program] : [], programArgs);
            const wslLaunchArgs = wsl.createLaunchArg(args.useWSL, args.console === 'externalTerminal', cwd, runtimeExecutable, launchArgs, program);
            // if using subsystem for linux, we will trick the debugger to map source files
            if (args.useWSL && !args.localRoot && !args.remoteRoot) {
                this._pathTransformer.attach({
                    remoteRoot: wslLaunchArgs.remoteRoot,
                    localRoot: wslLaunchArgs.localRoot
                });
            }
            const envArgs = this.collectEnvFileArgs(args) || args.env;
            if ((args.console === 'integratedTerminal' || args.console === 'externalTerminal') && this._supportsRunInTerminalRequest) {
                const termArgs = {
                    kind: args.console === 'integratedTerminal' ? 'integrated' : 'external',
                    title: localize(2, null),
                    cwd,
                    args: wslLaunchArgs.combined,
                    env: envArgs
                };
                yield this.launchInTerminal(termArgs);
                if (args.noDebug) {
                    this.terminateSession('cannot track process');
                }
            }
            else if (!args.console || args.console === 'internalConsole') {
                yield this.launchInInternalConsole(wslLaunchArgs.executable, wslLaunchArgs.args, envArgs, cwd);
            }
            else {
                throw errors.unknownConsoleType(args.console);
            }
            if (!args.noDebug) {
                yield this.doAttach(port, undefined, args.address, args.timeout, undefined, args.extraCRDPChannelPort);
            }
        });
    }
    extensionHostLaunch(launchArgs, debugPort) {
        // Separate all "paths" from an arguments into separate attributes.
        const args = launchArgs.args.map(arg => {
            if (arg.startsWith('-')) {
                // arg is an option
                const pair = arg.split('=', 2);
                if (pair.length === 2 && fs.existsSync(pair[1])) {
                    return { prefix: pair[0] + '=', path: pair[1] };
                }
                return { prefix: arg };
            }
            else {
                // arg is a path
                try {
                    const stat = fs.lstatSync(arg);
                    if (stat.isDirectory()) {
                        return { prefix: '--folder-uri=', path: arg };
                    }
                    else if (stat.isFile()) {
                        return { prefix: '--file-uri=', path: arg };
                    }
                }
                catch (err) {
                    // file not found
                }
                return { path: arg }; // just return the path blindly and hope for the best...
            }
        });
        if (!launchArgs.noDebug) {
            args.unshift({ prefix: `--inspect-brk-extensions=${debugPort}` });
        }
        args.unshift({ prefix: `--debugId=${launchArgs.__sessionId}` }); // pass the debug session ID so that broadcast events know where they come from
        const launchVSCodeArgs = {
            args: args,
            env: this.collectEnvFileArgs(launchArgs) || launchArgs.env
        };
        return new Promise((resolve, reject) => {
            this._session.sendRequest('launchVSCode', launchVSCodeArgs, NodeDebugAdapter.RUNINTERMINAL_TIMEOUT, response => {
                if (response.success) {
                    if (response.body && typeof response.body.processId === 'number') {
                        this._nodeProcessId = response.body.processId;
                    }
                    resolve();
                }
                else {
                    reject(errors.cannotDebugExtension(response.message));
                    this.terminateSession('launchVSCode error: ' + response.message);
                }
            });
        });
    }
    attach(args) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof args.enableSourceMapCaching !== 'boolean') {
                    args.enableSourceMapCaching = true;
                }
                return _super("attach").call(this, args);
            }
            catch (err) {
                if (err.format && err.format.indexOf('Cannot connect to runtime process') >= 0) {
                    // hack -core error msg
                    err.format = 'Ensure Node was launched with --inspect. ' + err.format;
                }
                throw err;
            }
        });
    }
    commonArgs(args) {
        args.sourceMapPathOverrides = getSourceMapPathOverrides(args.cwd, args.sourceMapPathOverrides);
        fixNodeInternalsSkipFiles(args);
        args.smartStep = typeof args.smartStep === 'undefined' ? !this._isVSClient : args.smartStep;
        this._restartMode = args.restart;
        super.commonArgs(args);
    }
    hookConnectionEvents() {
        super.hookConnectionEvents();
        this.chrome.Runtime.on('executionContextDestroyed', params => {
            if (params.executionContextId === 1) {
                this.terminateSession('Program ended');
            }
        });
    }
    doAttach(port, targetUrl, address, timeout, websocketUrl, extraCRDPChannelPort) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("doAttach").call(this, port, targetUrl, address, timeout, websocketUrl, extraCRDPChannelPort);
            this.beginWaitingForDebuggerPaused();
            this.getNodeProcessDetailsIfNeeded();
            this._session.sendEvent(new vscode_debugadapter_1.CapabilitiesEvent({ supportsStepBack: this.supportsStepBack() }));
        });
    }
    supportsStepBack() {
        return this._domains.has('TimeTravel');
    }
    launchInTerminal(termArgs) {
        return new Promise((resolve, reject) => {
            this._session.sendRequest('runInTerminal', termArgs, NodeDebugAdapter.RUNINTERMINAL_TIMEOUT, response => {
                if (response.success) {
                    // since node starts in a terminal, we cannot track it with an 'exit' handler
                    // plan for polling after we have gotten the process pid.
                    this._pollForNodeProcess = true;
                    resolve();
                }
                else {
                    reject(errors.cannotLaunchInTerminal(response.message));
                    this.terminateSession('terminal error: ' + response.message);
                }
            });
        });
    }
    launchInInternalConsole(runtimeExecutable, launchArgs, envArgs, cwd) {
        // merge environment variables into a copy of the process.env
        const env = Object.assign({}, process.env, envArgs);
        Object.keys(env).filter(k => env[k] === null).forEach(key => delete env[key]);
        const spawnOpts = { cwd, env };
        // Workaround for bug Microsoft/vscode#45832
        if (process.platform === 'win32' && runtimeExecutable.indexOf(' ') > 0) {
            let foundArgWithSpace = false;
            // check whether there is one arg with a space
            const args = [];
            for (const a of launchArgs) {
                if (a.indexOf(' ') > 0) {
                    args.push(`"${a}"`);
                    foundArgWithSpace = true;
                }
                else {
                    args.push(a);
                }
            }
            if (foundArgWithSpace) {
                launchArgs = args;
                runtimeExecutable = `"${runtimeExecutable}"`;
                spawnOpts.shell = true;
            }
        }
        this.logLaunchCommand(runtimeExecutable, launchArgs);
        spawnOpts.detached = this.supportsTerminateRequest; // https://github.com/Microsoft/vscode/issues/57018
        const nodeProcess = cp.spawn(runtimeExecutable, launchArgs, spawnOpts);
        return new Promise((resolve, reject) => {
            this._nodeProcessId = nodeProcess.pid;
            nodeProcess.on('error', (error) => {
                reject(errors.cannotLaunchDebugTarget(errors.toString()));
                const msg = `Node process error: ${error}`;
                vscode_chrome_debug_core_1.logger.error(msg);
                this.terminateSession(msg);
            });
            nodeProcess.on('exit', () => {
                const msg = 'Target exited';
                vscode_chrome_debug_core_1.logger.log(msg);
                if (!this.isExtensionHost()) {
                    this.terminateSession(msg);
                }
            });
            nodeProcess.on('close', (code) => {
                const msg = 'Target closed';
                vscode_chrome_debug_core_1.logger.log(msg);
                if (!this.isExtensionHost()) {
                    this.terminateSession(msg);
                }
            });
            const noDebugMode = this._launchAttachArgs.noDebug;
            this.captureStderr(nodeProcess, noDebugMode);
            // Must attach a listener to stdout or process will hang on Windows
            nodeProcess.stdout.on('data', (data) => {
                if ((noDebugMode || this._captureFromStd) && !this._launchAttachArgs._suppressConsoleOutput) {
                    let msg = data.toString();
                    this._session.sendEvent(new vscode_debugadapter_1.OutputEvent(msg, 'stdout'));
                }
            });
            resolve();
        });
    }
    captureStderr(nodeProcess, noDebugMode) {
        nodeProcess.stderr.on('data', (data) => {
            let msg = data.toString();
            let isLastEarlyNodeMsg = false;
            // We want to send initial stderr output back to the console because they can contain useful errors.
            // But there are some messages printed to stderr at the start of debugging that can be misleading.
            // Node is "handlingEarlyNodeMsgs" from launch to when one of these messages is printed:
            //   "To start debugging, open the following URL in Chrome: ..." - Node <8
            //   --debug-brk deprecation message - Node 8+
            // In this mode, we strip those messages from stderr output. After one of them is printed, we don't
            // watch stderr anymore and pass it along (unless in noDebugMode).
            if (this._handlingEarlyNodeMsgs && !noDebugMode) {
                const chromeMsgIndex = msg.indexOf('To start debugging, open the following URL in Chrome:');
                if (chromeMsgIndex >= 0) {
                    msg = msg.substr(0, chromeMsgIndex);
                    isLastEarlyNodeMsg = true;
                }
                const msgMatch = msg.match(NodeDebugAdapter.DEBUG_BRK_DEP_MSG);
                if (msgMatch) {
                    isLastEarlyNodeMsg = true;
                    msg = msg.replace(NodeDebugAdapter.DEBUG_BRK_DEP_MSG, '');
                }
                const helpMsg = /For help see https:\/\/nodejs.org\/en\/docs\/inspector\s*/;
                msg = msg.replace(helpMsg, '');
            }
            if ((this._handlingEarlyNodeMsgs || noDebugMode || this._captureFromStd) && !this._launchAttachArgs._suppressConsoleOutput) {
                this._session.sendEvent(new vscode_debugadapter_1.OutputEvent(msg, 'stderr'));
            }
            if (isLastEarlyNodeMsg) {
                this._handlingEarlyNodeMsgs = false;
            }
        });
    }
    onConsoleAPICalled(params) {
        // Once any console API message is received, we are done listening to initial stderr output
        this._handlingEarlyNodeMsgs = false;
        if (this._captureFromStd) {
            return;
        }
        // Strip the --debug-brk deprecation message which is printed at startup
        if (!params.args || params.args.length !== 1 || typeof params.args[0].value !== 'string' || !params.args[0].value.match(NodeDebugAdapter.DEBUG_BRK_DEP_MSG)) {
            super.onConsoleAPICalled(params);
        }
    }
    collectEnvFileArgs(args) {
        // read env from disk and merge into envVars
        if (args.envFile) {
            try {
                const env = {};
                const buffer = utils.stripBOM(fs.readFileSync(args.envFile, 'utf8'));
                buffer.split('\n').forEach(line => {
                    const r = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
                    if (r !== null) {
                        const key = r[1];
                        if (!process.env[key]) { // .env variables never overwrite existing variables (see #21169)
                            let value = r[2] || '';
                            if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                                value = value.replace(/\\n/gm, '\n');
                            }
                            env[key] = value.replace(/(^['"]|['"]$)/g, '');
                        }
                    }
                });
                return utils.extendObject(env, args.env); // launch config env vars overwrite .env vars
            }
            catch (e) {
                throw errors.cannotLoadEnvVarsFromFile(e.message);
            }
        }
    }
    /**
     * Override so that -core's call on attach will be ignored, and we can wait until the first break when ready to set BPs.
     */
    sendInitializedEvent() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._waitingForEntryPauseEvent) {
                return _super("sendInitializedEvent").call(this);
            }
        });
    }
    configurationDone() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.chrome) {
                // It's possible to get this request after we've detached, see #21973
                return _super("configurationDone").call(this);
            }
            // This message means that all breakpoints have been set by the client. We should be paused at this point.
            // So tell the target to continue, or tell the client that we paused, as needed
            this._finishedConfig = true;
            if (this._continueAfterConfigDone) {
                this._expectingStopReason = undefined;
                yield this.continue(/*internal=*/ true);
            }
            else if (this._entryPauseEvent) {
                yield this.onPaused(this._entryPauseEvent);
            }
            this.events.emit(vscode_chrome_debug_core_1.ChromeDebugSession.FinishedStartingUpEventName, { requestedContentWasDetected: true });
            yield _super("configurationDone").call(this);
        });
    }
    killNodeProcess() {
        if (this._nodeProcessId && !this.normalAttachMode) {
            if (this._nodeProcessId === 1) {
                vscode_chrome_debug_core_1.logger.log('Not killing launched process. It has PID=1');
            }
            else {
                vscode_chrome_debug_core_1.logger.log('Killing process with id: ' + this._nodeProcessId);
                utils.killTree(this._nodeProcessId);
            }
            this._nodeProcessId = 0;
        }
    }
    terminate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this._clientRequestedSessionEnd = true;
            if (!this._attachMode && !this._launchAttachArgs.useWSL && this._nodeProcessId > 0) {
                // -pid to kill the process group
                // https://github.com/Microsoft/vscode/issues/57018
                const groupPID = -this._nodeProcessId;
                try {
                    vscode_chrome_debug_core_1.logger.log(`Sending SIGINT to ${groupPID}`);
                    process.kill(groupPID, 'SIGINT');
                }
                catch (e) {
                    if (e.message === 'kill ESRCH') {
                        vscode_chrome_debug_core_1.logger.log(`Got 'kill ESRCH'. Sending SIGINT to ${this._nodeProcessId}`);
                        process.kill(this._nodeProcessId, 'SIGINT');
                    }
                }
            }
        });
    }
    terminateSession(reason, args) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isExtensionHost() && args && typeof args.restart === 'boolean' && args.restart) {
                this._nodeProcessId = 0;
            }
            else if (this._restartMode && !args) {
                // If restart: true, only kill the process when the client has disconnected. 'args' present implies that a Disconnect request was received
                this._nodeProcessId = 0;
            }
            this.killNodeProcess();
            const restartArgs = this._restartMode && !this._clientRequestedSessionEnd ? { port: this._port } : undefined;
            return _super("terminateSession").call(this, reason, undefined, restartArgs);
        });
    }
    onPaused(notification, expectingStopReason = this._expectingStopReason) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            // If we don't have the entry location, this must be the entry pause
            if (this._waitingForEntryPauseEvent) {
                vscode_chrome_debug_core_1.logger.log(Date.now() / 1000 + ': Paused on entry');
                this._expectingStopReason = 'entry';
                this._entryPauseEvent = notification;
                this._waitingForEntryPauseEvent = false;
                if ((this.normalAttachMode && this._launchAttachArgs.stopOnEntry !== false) ||
                    (this.isExtensionHost() && this._launchAttachArgs.stopOnEntry)) {
                    // In attach mode, and we did pause right away, so assume --debug-brk was set and we should show paused.
                    // In normal attach mode, assume stopOnEntry unless explicitly disabled.
                    // In extensionhost mode, only when stopOnEntry is explicitly enabled
                    this._continueAfterConfigDone = false;
                }
                yield this.getNodeProcessDetailsIfNeeded();
                yield this.sendInitializedEvent();
                return { didPause: true };
            }
            else {
                return _super("onPaused").call(this, notification, expectingStopReason);
            }
        });
    }
    resolveProgramPath(programPath, sourceMaps) {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_chrome_debug_core_1.logger.verbose(`Launch: Resolving programPath: ${programPath}`);
            if (!programPath) {
                return programPath;
            }
            if (utils.isJavaScript(programPath)) {
                if (!sourceMaps) {
                    return programPath;
                }
                // if programPath is a JavaScript file and sourceMaps are enabled, we don't know whether
                // programPath is the generated file or whether it is the source (and we need source mapping).
                // Typically this happens if a tool like 'babel' or 'uglify' is used (because they both transpile js to js).
                // We use the source maps to find a 'source' file for the given js file.
                const generatedPath = yield this._sourceMapTransformer.getGeneratedPathFromAuthoredPath(programPath);
                if (generatedPath && generatedPath !== programPath) {
                    // programPath must be source because there seems to be a generated file for it
                    vscode_chrome_debug_core_1.logger.log(`Launch: program '${programPath}' seems to be the source; launch the generated file '${generatedPath}' instead`);
                    programPath = generatedPath;
                }
                else {
                    vscode_chrome_debug_core_1.logger.log(`Launch: program '${programPath}' seems to be the generated file`);
                }
                return programPath;
            }
            else {
                // node cannot execute the program directly
                if (!sourceMaps) {
                    return Promise.reject(errors.cannotLaunchBecauseSourceMaps(programPath));
                }
                const generatedPath = yield this._sourceMapTransformer.getGeneratedPathFromAuthoredPath(programPath);
                if (!generatedPath) { // cannot find generated file
                    if (this._launchAttachArgs.outFiles || this._launchAttachArgs.outDir) {
                        return Promise.reject(errors.cannotLaunchBecauseJsNotFound(programPath));
                    }
                    else {
                        return Promise.reject(errors.cannotLaunchBecauseOutFiles(programPath));
                    }
                }
                vscode_chrome_debug_core_1.logger.log(`Launch: program '${programPath}' seems to be the source; launch the generated file '${generatedPath}' instead`);
                return generatedPath;
            }
        });
    }
    /**
     * Wait 500-5000ms for the entry pause event, and if it doesn't come, move on with life.
     * During attach, we don't know whether it's paused when attaching.
     */
    beginWaitingForDebuggerPaused() {
        const checkPausedInterval = 50;
        const timeout = this._launchAttachArgs.timeout;
        // Wait longer in launch mode - it definitely should be paused.
        let count = this.normalAttachMode ? 10 :
            (typeof timeout === 'number' ?
                Math.floor(timeout / checkPausedInterval) :
                100);
        vscode_chrome_debug_core_1.logger.log(Date.now() / 1000 + ': Waiting for initial debugger pause');
        const id = setInterval(() => {
            if (this._entryPauseEvent || this._isTerminated) {
                // Got the entry pause, stop waiting
                clearInterval(id);
            }
            else if (--count <= 0) {
                // No entry event, so fake it and continue
                vscode_chrome_debug_core_1.logger.log(Date.now() / 1000 + ': Did not get a pause event after starting, so continuing');
                clearInterval(id);
                this._continueAfterConfigDone = false;
                this._waitingForEntryPauseEvent = false;
                this.getNodeProcessDetailsIfNeeded()
                    .then(() => this.sendInitializedEvent());
            }
        }, checkPausedInterval);
    }
    threadName() {
        return `Node (${this._nodeProcessId})`;
    }
    /**
     * Override addBreakpoints, which is called by setBreakpoints to make the actual call to Chrome.
     */
    addBreakpoints(url, breakpoints) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield _super("addBreakpoints").call(this, url, breakpoints);
            if (this._entryPauseEvent && !this._finishedConfig) {
                const entryLocation = this._entryPauseEvent.callFrames[0].location;
                const bpAtEntryLocationIdx = responses.findIndex(response => {
                    // Don't compare column location, because you can have a bp at col 0, then break at some other column
                    return response && response.actualLocation && response.actualLocation.lineNumber === entryLocation.lineNumber &&
                        response.actualLocation.scriptId === entryLocation.scriptId;
                });
                const bpAtEntryLocation = bpAtEntryLocationIdx >= 0 && breakpoints[bpAtEntryLocationIdx];
                if (bpAtEntryLocation) {
                    let conditionPassed = true;
                    if (bpAtEntryLocation.condition) {
                        const evalConditionResponse = yield this.evaluateOnCallFrame(bpAtEntryLocation.condition, this._entryPauseEvent.callFrames[0]);
                        conditionPassed = !evalConditionResponse.exceptionDetails && (!!evalConditionResponse.result.objectId || !!evalConditionResponse.result.value);
                    }
                    if (conditionPassed) {
                        // There is some initial breakpoint being set to the location where we stopped on entry, so need to pause even if
                        // the stopOnEntry flag is not set
                        vscode_chrome_debug_core_1.logger.log('Got a breakpoint set in the entry location, so will stop even though stopOnEntry is not set');
                        this._continueAfterConfigDone = false;
                        this._expectingStopReason = 'breakpoint';
                    }
                    else {
                        vscode_chrome_debug_core_1.logger.log('Breakpoint condition at entry location did not evaluate to truthy value');
                    }
                }
            }
            return responses;
        });
    }
    validateBreakpointsPath(args) {
        return super.validateBreakpointsPath(args).catch(e => {
            if (!this._launchAttachArgs.disableOptimisticBPs && args.source.path && utils.isJavaScript(args.source.path)) {
                return undefined;
            }
            else {
                return Promise.reject(e);
            }
        });
    }
    getNodeProcessDetailsIfNeeded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loggedTargetVersion || !this.chrome) {
                return Promise.resolve();
            }
            const response = yield this.chrome.Runtime.evaluate({ expression: '[process.pid, process.version, process.arch]', returnByValue: true, contextId: 1 })
                .catch(error => vscode_chrome_debug_core_1.logger.error('Error evaluating `process.pid`: ' + error.message));
            if (!response) {
                return;
            }
            if (this._loggedTargetVersion) {
                // Possible to get two of these requests going simultaneously
                return;
            }
            if (response.exceptionDetails) {
                const description = vscode_chrome_debug_core_1.chromeUtils.errorMessageFromExceptionDetails(response.exceptionDetails);
                if (description.startsWith('ReferenceError: process is not defined')) {
                    vscode_chrome_debug_core_1.logger.verbose('Got expected exception: `process is not defined`. Will try again later.');
                }
                else {
                    vscode_chrome_debug_core_1.logger.log('Exception evaluating `process.pid`: ' + description + '. Will try again later.');
                }
            }
            else {
                const [pid, version, arch] = response.result.value;
                if (!this._nodeProcessId) {
                    this._nodeProcessId = pid;
                }
                if (this._pollForNodeProcess) {
                    this.startPollingForNodeTermination();
                }
                this._loggedTargetVersion = true;
                vscode_chrome_debug_core_1.logger.log(`Target node version: ${version} ${arch}`);
                /* __GDPR__
                    "nodeVersion" : {
                        "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "${include}": [ "${DebugCommonProperties}" ]
                    }
                 */
                telemetry.reportEvent('nodeVersion', { version });
                /* __GDPR__FRAGMENT__
                    "DebugCommonProperties" : {
                        "Versions.Target.Version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                telemetry.addCustomGlobalProperty({ 'Versions.Target.Version': version });
            }
        });
    }
    startPollingForNodeTermination() {
        const intervalId = setInterval(() => {
            try {
                if (this._nodeProcessId) {
                    // kill with signal=0 just test for whether the proc is alive. It throws if not.
                    process.kill(this._nodeProcessId, 0);
                }
                else {
                    clearInterval(intervalId);
                }
            }
            catch (e) {
                clearInterval(intervalId);
                vscode_chrome_debug_core_1.logger.log('Target process died');
                this.terminateSession('Target process died');
            }
        }, NodeDebugAdapter.NODE_TERMINATION_POLL_INTERVAL);
    }
    logLaunchCommand(executable, args) {
        // print the command to launch the target to the debug console
        let cli = executable + ' ';
        for (let a of args) {
            if (a.indexOf(' ') >= 0) {
                cli += '\'' + a + '\'';
            }
            else {
                cli += a;
            }
            cli += ' ';
        }
        vscode_chrome_debug_core_1.logger.warn(cli);
    }
    globalEvaluate(args) {
        // contextId: 1 - see https://github.com/nodejs/node/issues/8426
        if (!args.contextId)
            args.contextId = 1;
        return super.globalEvaluate(args);
    }
    /**
     * 'Path does not exist' error
     */
    getNotExistErrorResponse(attribute, path) {
        return Promise.reject(new errors_1.ErrorWithMessage({
            id: 2007,
            format: localize(3, null, attribute, '{path}'),
            variables: { path }
        }));
    }
    /**
     * 'Path not absolute' error with 'More Information' link.
     */
    getRelativePathErrorResponse(attribute, path) {
        const format = localize(4, null, attribute, '{path}', '${workspaceFolder}/');
        return this.getErrorResponseWithInfoLink(2008, format, { path }, 20003);
    }
    getRuntimeNotOnPathErrorResponse(runtime) {
        return Promise.reject(new errors_1.ErrorWithMessage({
            id: 2001,
            format: localize(5, null, '{_runtime}'),
            variables: { _runtime: runtime }
        }));
    }
    /**
     * Send error response with 'More Information' link.
     */
    getErrorResponseWithInfoLink(code, format, variables, infoId) {
        return Promise.reject(new errors_1.ErrorWithMessage({
            id: code,
            format,
            variables,
            showUser: true,
            url: 'http://go.microsoft.com/fwlink/?linkID=534832#_' + infoId.toString(),
            urlLabel: localize(6, null)
        }));
    }
    getReadonlyOrigin(aPath) {
        return path.isAbsolute(aPath) || aPath.startsWith(vscode_chrome_debug_core_1.ChromeDebugAdapter.EVAL_NAME_PREFIX) ?
            localize(7, null) :
            localize(8, null);
    }
    /**
     * If realPath is an absolute path or a URL, return realPath. Otherwise, prepend the node_internals marker
     */
    realPathToDisplayPath(realPath) {
        if (!realPath.match(/VM\d+/) && !path.isAbsolute(realPath)) {
            return `${NodeDebugAdapter.NODE_INTERNALS}/${realPath}`;
        }
        return super.realPathToDisplayPath(realPath);
    }
    /**
     * If displayPath starts with the NODE_INTERNALS indicator, strip it.
     */
    displayPathToRealPath(displayPath) {
        const match = displayPath.match(new RegExp(`^${NodeDebugAdapter.NODE_INTERNALS}[\\\\/](.*)`));
        return match ? match[1] : super.displayPathToRealPath(displayPath);
    }
    isExtensionHost() {
        return this._adapterID === 'extensionHost2' || this._adapterID === 'extensionHost';
    }
}
NodeDebugAdapter.NODE = 'node';
NodeDebugAdapter.RUNINTERMINAL_TIMEOUT = 5000;
NodeDebugAdapter.NODE_TERMINATION_POLL_INTERVAL = 3000;
NodeDebugAdapter.DEBUG_BRK_DEP_MSG = /\(node:\d+\) \[DEP0062\] DeprecationWarning: `node --inspect --debug-brk` is deprecated\. Please use `node --inspect-brk` instead\.\s*/;
NodeDebugAdapter.NODE_INTERNALS = '<node_internals>';
exports.NodeDebugAdapter = NodeDebugAdapter;
function getSourceMapPathOverrides(cwd, sourceMapPathOverrides) {
    return sourceMapPathOverrides ? resolveCwdPattern(cwd, sourceMapPathOverrides, /*warnOnMissing=*/ true) :
        resolveCwdPattern(cwd, DefaultSourceMapPathOverrides, /*warnOnMissing=*/ false);
}
function fixNodeInternalsSkipFiles(args) {
    if (args.skipFiles) {
        args.skipFileRegExps = args.skipFileRegExps || [];
        args.skipFiles = args.skipFiles.filter(pattern => {
            const fixed = fixNodeInternalsSkipFilePattern(pattern);
            if (fixed) {
                args.skipFileRegExps.push(fixed);
                return false;
            }
            else {
                return true;
            }
        });
    }
}
const internalsRegex = new RegExp(`^${NodeDebugAdapter.NODE_INTERNALS}/(.*)`);
function fixNodeInternalsSkipFilePattern(pattern) {
    const internalsMatch = pattern.match(internalsRegex);
    if (internalsMatch) {
        return `^(?!\/)(?![a-zA-Z]:)(?!file:///)${vscode_chrome_debug_core_1.utils.pathGlobToBlackboxedRegex(internalsMatch[1])}`;
    }
    else {
        return null;
    }
}
/**
 * Returns a copy of sourceMapPathOverrides with the ${cwd} pattern resolved in all entries.
 */
function resolveCwdPattern(cwd, sourceMapPathOverrides, warnOnMissing) {
    const resolvedOverrides = {};
    for (let pattern in sourceMapPathOverrides) {
        const replacePattern = sourceMapPathOverrides[pattern];
        resolvedOverrides[pattern] = replacePattern;
        const cwdIndex = replacePattern.indexOf('${cwd}');
        if (cwdIndex === 0) {
            if (cwd) {
                resolvedOverrides[pattern] = replacePattern.replace('${cwd}', cwd);
            }
            else if (warnOnMissing) {
                vscode_chrome_debug_core_1.logger.log('Warning: sourceMapPathOverrides entry contains ${cwd}, but cwd is not set');
            }
        }
        else if (cwdIndex > 0) {
            vscode_chrome_debug_core_1.logger.log('Warning: in a sourceMapPathOverrides entry, ${cwd} is only valid at the beginning of the path');
        }
    }
    return resolvedOverrides;
}
var DebugArgs;
(function (DebugArgs) {
    DebugArgs[DebugArgs["InspectBrk"] = 0] = "InspectBrk";
    DebugArgs[DebugArgs["Inspect_DebugBrk"] = 1] = "Inspect_DebugBrk";
})(DebugArgs = exports.DebugArgs || (exports.DebugArgs = {}));
const defaultDebugArgs = DebugArgs.InspectBrk;
function detectSupportedDebugArgsForLaunch(config, runtimeExecutable, env) {
    if (config.__nodeVersion || (config.runtimeVersion && config.runtimeVersion !== 'default')) {
        return getSupportedDebugArgsForVersion(config.__nodeVersion || config.runtimeVersion);
    }
    else if (config.runtimeExecutable) {
        vscode_chrome_debug_core_1.logger.log('Using --inspect-brk because a runtimeExecutable is set');
        return defaultDebugArgs;
    }
    else {
        // only determine version if no runtimeExecutable is set (and 'node' on PATH is used)
        vscode_chrome_debug_core_1.logger.log('Spawning `node --version` to determine supported debug args');
        let result;
        try {
            result = cp.spawnSync(runtimeExecutable, ['--version']);
        }
        catch (e) {
            vscode_chrome_debug_core_1.logger.error('Node version detection failed: ' + (e && e.message));
        }
        const semVerString = result.stdout ? result.stdout.toString().trim() : undefined;
        if (semVerString) {
            return getSupportedDebugArgsForVersion(semVerString);
        }
        else {
            vscode_chrome_debug_core_1.logger.log('Using --inspect-brk because we couldn\'t get a version from node');
            return defaultDebugArgs;
        }
    }
}
function getSupportedDebugArgsForVersion(semVerString) {
    if (utils.compareSemver(semVerString, 'v7.6.0') >= 0) {
        vscode_chrome_debug_core_1.logger.log(`Using --inspect-brk, Node version ${semVerString} detected`);
        return DebugArgs.InspectBrk;
    }
    else {
        vscode_chrome_debug_core_1.logger.log(`Using --inspect --debug-brk, Node version ${semVerString} detected`);
        return DebugArgs.Inspect_DebugBrk;
    }
}

//# sourceMappingURL=nodeDebugAdapter.js.map
