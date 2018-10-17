/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { ProblemSeverity, ErrorCode } from '../parser/jsonParser.js';
import { DiagnosticSeverity } from '../../vscode-languageserver-types/main.js';
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
            this.commentSeverity = raw.allowComments ? ProblemSeverity.Ignore : ProblemSeverity.Error;
        }
    };
    JSONValidation.prototype.doValidation = function (textDocument, jsonDocument, documentSettings) {
        var _this = this;
        if (!this.validationEnabled) {
            return this.promise.resolve([]);
        }
        var diagnostics = [];
        var added = {};
        var addProblem = function (problem) {
            if (problem.severity === ProblemSeverity.Ignore) {
                return;
            }
            // remove duplicated messages
            var signature = problem.location.offset + ' ' + problem.location.length + ' ' + problem.message;
            if (!added[signature]) {
                added[signature] = true;
                var range = {
                    start: textDocument.positionAt(problem.location.offset),
                    end: textDocument.positionAt(problem.location.offset + problem.location.length)
                };
                var severity = problem.severity === ProblemSeverity.Error ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning;
                diagnostics.push({ severity: severity, range: range, message: problem.message });
            }
        };
        return this.jsonSchemaService.getSchemaForResource(textDocument.uri, jsonDocument).then(function (schema) {
            var trailingCommaSeverity = documentSettings ? documentSettings.trailingCommas : ProblemSeverity.Error;
            var commentSeverity = documentSettings ? documentSettings.comments : _this.commentSeverity;
            if (schema) {
                if (schema.errors.length && jsonDocument.root) {
                    var astRoot = jsonDocument.root;
                    var property = astRoot.type === 'object' ? astRoot.properties[0] : null;
                    if (property && property.keyNode.value === '$schema') {
                        var node = property.valueNode || property;
                        addProblem({ location: { offset: node.offset, length: node.length }, message: schema.errors[0], severity: ProblemSeverity.Warning });
                    }
                    else {
                        addProblem({ location: { offset: astRoot.offset, length: 1 }, message: schema.errors[0], severity: ProblemSeverity.Warning });
                    }
                }
                else {
                    var semanticErrors = jsonDocument.validate(schema.schema);
                    if (semanticErrors) {
                        semanticErrors.forEach(addProblem);
                    }
                }
                if (schemaAllowsComments(schema.schema)) {
                    trailingCommaSeverity = commentSeverity = ProblemSeverity.Ignore;
                }
            }
            jsonDocument.syntaxErrors.forEach(function (p) {
                if (p.code === ErrorCode.TrailingComma) {
                    p.severity = trailingCommaSeverity;
                }
                addProblem(p);
            });
            diagnostics.push.apply(diagnostics, jsonDocument.externalDiagnostic);
            if (commentSeverity !== ProblemSeverity.Ignore) {
                var message_1 = localize('InvalidCommentToken', 'Comments are not permitted in JSON.');
                jsonDocument.comments.forEach(function (c) {
                    addProblem({ location: c, severity: commentSeverity, message: message_1 });
                });
            }
            return diagnostics;
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
//# sourceMappingURL=jsonValidation.js.map