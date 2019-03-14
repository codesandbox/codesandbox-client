/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var plist = require("./plist");
var debug_1 = require("./debug");
var json_1 = require("./json");
function parseRawGrammar(content, filePath) {
    if (/\.json$/.test(filePath)) {
        return parseJSONGrammar(content, filePath);
    }
    return parsePLISTGrammar(content, filePath);
}
exports.parseRawGrammar = parseRawGrammar;
function parseJSONGrammar(contents, filename) {
    if (debug_1.CAPTURE_METADATA) {
        return json_1.parse(contents, filename, true);
    }
    return JSON.parse(contents);
}
function parsePLISTGrammar(contents, filename) {
    if (debug_1.CAPTURE_METADATA) {
        return plist.parseWithLocation(contents, filename, '$vscodeTextmateLocation');
    }
    return plist.parse(contents);
}
//# sourceMappingURL=grammarReader.js.map