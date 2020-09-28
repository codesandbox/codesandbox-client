(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vscode-languageserver-types", "vscode-languageserver-textdocument", "vscode-languageserver-types"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    var vscode_languageserver_types_1 = require("vscode-languageserver-types");
    var vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
    exports.TextDocument = vscode_languageserver_textdocument_1.TextDocument;
    __export(require("vscode-languageserver-types"));
    var ClientCapabilities;
    (function (ClientCapabilities) {
        ClientCapabilities.LATEST = {
            textDocument: {
                completion: {
                    completionItem: {
                        documentationFormat: [vscode_languageserver_types_1.MarkupKind.Markdown, vscode_languageserver_types_1.MarkupKind.PlainText]
                    }
                },
                hover: {
                    contentFormat: [vscode_languageserver_types_1.MarkupKind.Markdown, vscode_languageserver_types_1.MarkupKind.PlainText]
                }
            }
        };
    })(ClientCapabilities = exports.ClientCapabilities || (exports.ClientCapabilities = {}));
    var FileType;
    (function (FileType) {
        /**
         * The file type is unknown.
         */
        FileType[FileType["Unknown"] = 0] = "Unknown";
        /**
         * A regular file.
         */
        FileType[FileType["File"] = 1] = "File";
        /**
         * A directory.
         */
        FileType[FileType["Directory"] = 2] = "Directory";
        /**
         * A symbolic link to a file.
         */
        FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
    })(FileType = exports.FileType || (exports.FileType = {}));
});
