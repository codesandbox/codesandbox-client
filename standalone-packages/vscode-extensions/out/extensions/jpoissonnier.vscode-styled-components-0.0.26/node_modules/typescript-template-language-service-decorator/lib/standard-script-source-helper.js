"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("./nodes");
class StandardScriptSourceHelper {
    constructor(typescript, project) {
        this.typescript = typescript;
        this.project = project;
    }
    getNode(fileName, position) {
        const sourceFile = this.getSourceFile(fileName);
        return sourceFile && nodes_1.findNode(this.typescript, sourceFile, position);
    }
    getAllNodes(fileName, cond) {
        const sourceFile = this.getSourceFile(fileName);
        return sourceFile ? nodes_1.findAllNodes(this.typescript, sourceFile, cond) : [];
    }
    getLineAndChar(fileName, position) {
        const scriptInto = this.project.getScriptInfo(fileName);
        if (!scriptInto) {
            return { line: 0, character: 0 };
        }
        const location = scriptInto.positionToLineOffset(position);
        return { line: location.line - 1, character: location.offset - 1 };
    }
    getOffset(fileName, line, character) {
        const scriptInto = this.project.getScriptInfo(fileName);
        if (!scriptInto) {
            return 0;
        }
        return scriptInto.lineOffsetToPosition(line + 1, character + 1);
    }
    getProgram() {
        return this.project.getLanguageService().getProgram();
    }
    getSourceFile(fileName) {
        const program = this.getProgram();
        return program ? program.getSourceFile(fileName) : undefined;
    }
}
exports.default = StandardScriptSourceHelper;
