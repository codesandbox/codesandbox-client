/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TextDocument, Position, CompletionItem, CompletionList, Range, SymbolInformation, Diagnostic, TextEdit, FormattingOptions, MarkedString } from '../vscode-languageserver-types/main.js';
import { JSONCompletion } from './services/jsonCompletion.js';
import { JSONHover } from './services/jsonHover.js';
import { JSONValidation } from './services/jsonValidation.js';
import { JSONDocumentSymbols } from './services/jsonDocumentSymbols.js';
import { parse as parseJSON, newJSONDocument } from './parser/jsonParser.js';
import { schemaContributions } from './services/configuration.js';
import { JSONSchemaService } from './services/jsonSchemaService.js';
import { format as formatJSON } from '../jsonc-parser/main.js';
export { TextDocument, Position, CompletionItem, CompletionList, Range, SymbolInformation, Diagnostic, TextEdit, FormattingOptions, MarkedString };
export function getLanguageService(params) {
    var promise = params.promiseConstructor || Promise;
    var jsonSchemaService = new JSONSchemaService(params.schemaRequestService, params.workspaceContext, promise);
    jsonSchemaService.setSchemaContributions(schemaContributions);
    var jsonCompletion = new JSONCompletion(jsonSchemaService, params.contributions, promise);
    var jsonHover = new JSONHover(jsonSchemaService, params.contributions, promise);
    var jsonDocumentSymbols = new JSONDocumentSymbols(jsonSchemaService);
    var jsonValidation = new JSONValidation(jsonSchemaService, promise);
    return {
        configure: function (settings) {
            jsonSchemaService.clearExternalSchemas();
            if (settings.schemas) {
                settings.schemas.forEach(function (settings) {
                    jsonSchemaService.registerExternalSchema(settings.uri, settings.fileMatch, settings.schema);
                });
            }
            jsonValidation.configure(settings);
        },
        resetSchema: function (uri) { return jsonSchemaService.onResourceChange(uri); },
        doValidation: jsonValidation.doValidation.bind(jsonValidation),
        parseJSONDocument: function (document) { return parseJSON(document, { collectComments: true }); },
        newJSONDocument: function (root, diagnostics) { return newJSONDocument(root, diagnostics); },
        doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
        doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
        findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
        findColorSymbols: function (d, s) { return jsonDocumentSymbols.findDocumentColors(d, s).then(function (s) { return s.map(function (s) { return s.range; }); }); },
        findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
        getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
        doHover: jsonHover.doHover.bind(jsonHover),
        format: function (d, r, o) {
            var range = void 0;
            if (r) {
                var offset = d.offsetAt(r.start);
                var length = d.offsetAt(r.end) - offset;
                range = { offset: offset, length: length };
            }
            var options = { tabSize: o ? o.tabSize : 4, insertSpaces: o ? o.insertSpaces : true, eol: '\n' };
            return formatJSON(d.getText(), range, options).map(function (e) {
                return TextEdit.replace(Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
            });
        }
    };
}
//# sourceMappingURL=jsonLanguageService.js.map