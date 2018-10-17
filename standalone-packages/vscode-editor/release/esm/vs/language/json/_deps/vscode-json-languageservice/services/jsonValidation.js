/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Diagnostic, DiagnosticSeverity, Range } from '../../vscode-languageserver-types/main.js';
import { ErrorCode } from '../jsonLanguageTypes.js';
import * as nls from '../../../fillers/vscode-nls.js';
var localize = nls.loadMessageBundle();
var JSONValidation = /** @class */ (function () {
    function JSONValidation(jsonSchemaService, promiseConstructor) {
        this.jsonSchemaService = jsonSchemaService;
        this.promise = promiseConstructor;
        this.validationEnabled = true;
    }
    JSONValidation.prototype.configure = function (raw) {
        if (raw) {
            this.validationEnabled = raw.validate;
            this.commentSeverity = raw.allowComments ? void 0 : DiagnosticSeverity.Error;
        }
    };
    JSONValidation.prototype.doValidation = function (textDocument, jsonDocument, documentSettings, schema) {
        var _this = this;
        if (!this.validationEnabled) {
            return this.promise.resolve([]);
        }
        var diagnostics = [];
        var added = {};
        var addProblem = function (problem) {
            // remove duplicated messages
            var signature = problem.range.start.line + ' ' + problem.range.start.character + ' ' + problem.message;
            if (!added[signature]) {
                added[signature] = true;
                diagnostics.push(problem);
            }
        };
        var getDiagnostics = function (schema) {
            var trailingCommaSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.trailingCommas) : DiagnosticSeverity.Error;
            var commentSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.comments) : _this.commentSeverity;
            if (schema) {
                if (schema.errors.length && jsonDocument.root) {
                    var astRoot = jsonDocument.root;
                    var property = astRoot.type === 'object' ? astRoot.properties[0] : null;
                    if (property && property.keyNode.value === '$schema') {
                        var node = property.valueNode || property;
                        var range = Range.create(textDocument.positionAt(node.offset), textDocument.positionAt(node.offset + node.length));
                        addProblem(Diagnostic.create(range, schema.errors[0], DiagnosticSeverity.Warning, ErrorCode.SchemaResolveError));
                    }
                    else {
                        var range = Range.create(textDocument.positionAt(astRoot.offset), textDocument.positionAt(astRoot.offset + 1));
                        addProblem(Diagnostic.create(range, schema.errors[0], DiagnosticSeverity.Warning, ErrorCode.SchemaResolveError));
                    }
                }
                else {
                    var semanticErrors = jsonDocument.validate(textDocument, schema.schema);
                    if (semanticErrors) {
                        semanticErrors.forEach(addProblem);
                    }
                }
                if (schemaAllowsComments(schema.schema)) {
                    trailingCommaSeverity = commentSeverity = void 0;
                }
            }
            jsonDocument.syntaxErrors.forEach(function (p) {
                if (p.code === ErrorCode.TrailingComma) {
                    if (typeof commentSeverity !== 'number') {
                        return;
                    }
                    p.severity = trailingCommaSeverity;
                }
                addProblem(p);
            });
            if (typeof commentSeverity === 'number') {
                var message_1 = localize('InvalidCommentToken', 'Comments are not permitted in JSON.');
                jsonDocument.comments.forEach(function (c) {
                    addProblem(Diagnostic.create(c, message_1, commentSeverity, ErrorCode.CommentNotPermitted));
                });
            }
            return diagnostics;
        };
        if (schema) {
            return this.promise.resolve(getDiagnostics(schema));
        }
        return this.jsonSchemaService.getSchemaForResource(textDocument.uri, jsonDocument).then(function (schema) {
            return getDiagnostics(schema);
        });
    };
    return JSONValidation;
}());
export { JSONValidation };
function schemaAllowsComments(schemaRef) {
    if (schemaRef && typeof schemaRef === 'object') {
        if (schemaRef.allowComments) {
            return true;
        }
        if (schemaRef.allOf) {
            return schemaRef.allOf.some(schemaAllowsComments);
        }
    }
    return false;
}
function toDiagnosticSeverity(severityLevel) {
    switch (severityLevel) {
        case 'error': return DiagnosticSeverity.Error;
        case 'warning': return DiagnosticSeverity.Warning;
        case 'ignore': return void 0;
    }
    return void 0;
}
//# sourceMappingURL=jsonValidation.js.map