/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { parse as jsonParse } from '../../../../base/common/json.js';
import { forEach } from '../../../../base/common/collections.js';
import { localize } from '../../../../nls.js';
import { basename, extname } from '../../../../../path.js';
import { SnippetParser, Variable, Placeholder, Text } from '../../../../editor/contrib/snippet/snippetParser.js';
import { KnownSnippetVariableNames } from '../../../../editor/contrib/snippet/snippetVariables.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
var Snippet = /** @class */ (function () {
    function Snippet(scopes, name, prefix, description, body, source, snippetSource) {
        this.scopes = scopes;
        this.name = name;
        this.prefix = prefix;
        this.description = description;
        this.body = body;
        this.source = source;
        this.snippetSource = snippetSource;
        //
        this.prefixLow = prefix ? prefix.toLowerCase() : prefix;
    }
    Object.defineProperty(Snippet.prototype, "codeSnippet", {
        get: function () {
            this._ensureCodeSnippet();
            return this._codeSnippet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snippet.prototype, "isBogous", {
        get: function () {
            this._ensureCodeSnippet();
            return this._isBogous;
        },
        enumerable: true,
        configurable: true
    });
    Snippet.prototype._ensureCodeSnippet = function () {
        if (!this._codeSnippet) {
            var rewrite = Snippet._rewriteBogousVariables(this.body);
            if (typeof rewrite === 'string') {
                this._codeSnippet = rewrite;
                this._isBogous = true;
            }
            else {
                this._codeSnippet = this.body;
                this._isBogous = false;
            }
        }
    };
    Snippet.compare = function (a, b) {
        if (a.snippetSource < b.snippetSource) {
            return -1;
        }
        else if (a.snippetSource > b.snippetSource) {
            return 1;
        }
        else if (a.name > b.name) {
            return 1;
        }
        else if (a.name < b.name) {
            return -1;
        }
        else {
            return 0;
        }
    };
    Snippet._rewriteBogousVariables = function (template) {
        var textmateSnippet = new SnippetParser().parse(template, false);
        var placeholders = new Map();
        var placeholderMax = 0;
        for (var _i = 0, _a = textmateSnippet.placeholders; _i < _a.length; _i++) {
            var placeholder = _a[_i];
            placeholderMax = Math.max(placeholderMax, placeholder.index);
        }
        var didChange = false;
        var stack = textmateSnippet.children.slice();
        while (stack.length > 0) {
            var marker = stack.shift();
            if (marker instanceof Variable
                && marker.children.length === 0
                && !KnownSnippetVariableNames[marker.name]) {
                // a 'variable' without a default value and not being one of our supported
                // variables is automatically turned into a placeholder. This is to restore
                // a bug we had before. So `${foo}` becomes `${N:foo}`
                var index = placeholders.has(marker.name) ? placeholders.get(marker.name) : ++placeholderMax;
                placeholders.set(marker.name, index);
                var synthetic = new Placeholder(index).appendChild(new Text(marker.name));
                textmateSnippet.replace(marker, [synthetic]);
                didChange = true;
            }
            else {
                // recurse
                stack.push.apply(stack, marker.children);
            }
        }
        if (!didChange) {
            return false;
        }
        else {
            return textmateSnippet.toTextmateString();
        }
    };
    return Snippet;
}());
export { Snippet };
function isJsonSerializedSnippet(thing) {
    return Boolean(thing.body) && Boolean(thing.prefix);
}
var SnippetFile = /** @class */ (function () {
    function SnippetFile(source, location, defaultScopes, _extension, _fileService) {
        this.source = source;
        this.location = location;
        this.defaultScopes = defaultScopes;
        this._extension = _extension;
        this._fileService = _fileService;
        this.data = [];
        this.isGlobalSnippets = extname(location.path) === '.code-snippets';
        this.isUserSnippets = !this._extension;
    }
    SnippetFile.prototype.select = function (selector, bucket) {
        if (this.isGlobalSnippets || !this.isUserSnippets) {
            this._scopeSelect(selector, bucket);
        }
        else {
            this._filepathSelect(selector, bucket);
        }
    };
    SnippetFile.prototype._filepathSelect = function (selector, bucket) {
        // for `fooLang.json` files all snippets are accepted
        if (selector === basename(this.location.path, '.json')) {
            bucket.push.apply(bucket, this.data);
        }
    };
    SnippetFile.prototype._scopeSelect = function (selector, bucket) {
        // for `my.code-snippets` files we need to look at each snippet
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var snippet = _a[_i];
            var len = snippet.scopes.length;
            if (len === 0) {
                // always accept
                bucket.push(snippet);
            }
            else {
                for (var i = 0; i < len; i++) {
                    // match
                    if (snippet.scopes[i] === selector) {
                        bucket.push(snippet);
                        break; // match only once!
                    }
                }
            }
        }
        var idx = selector.lastIndexOf('.');
        if (idx >= 0) {
            this._scopeSelect(selector.substring(0, idx), bucket);
        }
    };
    SnippetFile.prototype.load = function () {
        var _this = this;
        if (!this._loadPromise) {
            this._loadPromise = Promise.resolve(this._fileService.resolveContent(this.location, { encoding: 'utf8' })).then(function (content) {
                var data = jsonParse(content.value.toString());
                if (typeof data === 'object') {
                    forEach(data, function (entry) {
                        var name = entry.key, scopeOrTemplate = entry.value;
                        if (isJsonSerializedSnippet(scopeOrTemplate)) {
                            _this._parseSnippet(name, scopeOrTemplate, _this.data);
                        }
                        else {
                            forEach(scopeOrTemplate, function (entry) {
                                var name = entry.key, template = entry.value;
                                _this._parseSnippet(name, template, _this.data);
                            });
                        }
                    });
                }
                return _this;
            });
        }
        return this._loadPromise;
    };
    SnippetFile.prototype.reset = function () {
        this._loadPromise = undefined;
        this.data.length = 0;
    };
    SnippetFile.prototype._parseSnippet = function (name, snippet, bucket) {
        var _this = this;
        var prefix = snippet.prefix, body = snippet.body, description = snippet.description;
        if (Array.isArray(body)) {
            body = body.join('\n');
        }
        if ((typeof prefix !== 'string' && !Array.isArray(prefix)) || typeof body !== 'string') {
            return;
        }
        var scopes;
        if (this.defaultScopes) {
            scopes = this.defaultScopes;
        }
        else if (typeof snippet.scope === 'string') {
            scopes = snippet.scope.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return !isFalsyOrWhitespace(s); });
        }
        else {
            scopes = [];
        }
        var source;
        if (this._extension) {
            // extension snippet -> show the name of the extension
            source = this._extension.displayName || this._extension.name;
        }
        else if (this.source === 2 /* Workspace */) {
            // workspace -> only *.code-snippets files
            source = localize('source.workspaceSnippetGlobal', "Workspace Snippet");
        }
        else {
            // user -> global (*.code-snippets) and language snippets
            if (this.isGlobalSnippets) {
                source = localize('source.userSnippetGlobal', "Global User Snippet");
            }
            else {
                source = localize('source.userSnippet', "User Snippet");
            }
        }
        var prefixes = Array.isArray(prefix) ? prefix : [prefix];
        prefixes.forEach(function (p) {
            bucket.push(new Snippet(scopes, name, p, description, body, source, _this.source));
        });
    };
    return SnippetFile;
}());
export { SnippetFile };
