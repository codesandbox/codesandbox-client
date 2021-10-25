"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptGoToProjectConfigCommand = exports.TypeScriptGoToProjectConfigCommand = void 0;
const tsconfig_1 = require("../utils/tsconfig");
class TypeScriptGoToProjectConfigCommand {
    constructor(activeJsTsEditorTracker, lazyClientHost) {
        this.activeJsTsEditorTracker = activeJsTsEditorTracker;
        this.lazyClientHost = lazyClientHost;
        this.id = 'typescript.goToProjectConfig';
    }
    execute() {
        const editor = this.activeJsTsEditorTracker.activeJsTsEditor;
        if (editor) {
            (0, tsconfig_1.openProjectConfigForFile)(0 /* TypeScript */, this.lazyClientHost.value.serviceClient, editor.document.uri);
        }
    }
}
exports.TypeScriptGoToProjectConfigCommand = TypeScriptGoToProjectConfigCommand;
class JavaScriptGoToProjectConfigCommand {
    constructor(activeJsTsEditorTracker, lazyClientHost) {
        this.activeJsTsEditorTracker = activeJsTsEditorTracker;
        this.lazyClientHost = lazyClientHost;
        this.id = 'javascript.goToProjectConfig';
    }
    execute() {
        const editor = this.activeJsTsEditorTracker.activeJsTsEditor;
        if (editor) {
            (0, tsconfig_1.openProjectConfigForFile)(1 /* JavaScript */, this.lazyClientHost.value.serviceClient, editor.document.uri);
        }
    }
}
exports.JavaScriptGoToProjectConfigCommand = JavaScriptGoToProjectConfigCommand;
//# sourceMappingURL=goToProjectConfiguration.js.map