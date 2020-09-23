(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../parser/cssNodes", "../languageFacts/facts", "./selectorPrinting", "../utils/strings", "../cssLanguageTypes", "../utils/objects"], factory);
    }
})(function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var nodes = require("../parser/cssNodes");
    var languageFacts = require("../languageFacts/facts");
    var selectorPrinting_1 = require("./selectorPrinting");
    var strings_1 = require("../utils/strings");
    var cssLanguageTypes_1 = require("../cssLanguageTypes");
    var objects_1 = require("../utils/objects");
    var CSSHover = /** @class */ (function () {
        function CSSHover(clientCapabilities, cssDataManager) {
            this.clientCapabilities = clientCapabilities;
            this.cssDataManager = cssDataManager;
            this.selectorPrinting = new selectorPrinting_1.SelectorPrinting(cssDataManager);
        }
        CSSHover.prototype.doHover = function (document, position, stylesheet) {
            function getRange(node) {
                return cssLanguageTypes_1.Range.create(document.positionAt(node.offset), document.positionAt(node.end));
            }
            var offset = document.offsetAt(position);
            var nodepath = nodes.getNodePath(stylesheet, offset);
            /**
             * nodepath is top-down
             * Build up the hover by appending inner node's information
             */
            var hover = null;
            for (var i = 0; i < nodepath.length; i++) {
                var node = nodepath[i];
                if (node instanceof nodes.Selector) {
                    hover = {
                        contents: this.selectorPrinting.selectorToMarkedString(node),
                        range: getRange(node)
                    };
                    break;
                }
                if (node instanceof nodes.SimpleSelector) {
                    /**
                     * Some sass specific at rules such as `@at-root` are parsed as `SimpleSelector`
                     */
                    if (!strings_1.startsWith(node.getText(), '@')) {
                        hover = {
                            contents: this.selectorPrinting.simpleSelectorToMarkedString(node),
                            range: getRange(node)
                        };
                    }
                    break;
                }
                if (node instanceof nodes.Declaration) {
                    var propertyName = node.getFullPropertyName();
                    var entry = this.cssDataManager.getProperty(propertyName);
                    if (entry) {
                        var contents = languageFacts.getEntryDescription(entry, this.doesSupportMarkdown());
                        if (contents) {
                            hover = {
                                contents: contents,
                                range: getRange(node)
                            };
                        }
                        else {
                            hover = null;
                        }
                    }
                    continue;
                }
                if (node instanceof nodes.UnknownAtRule) {
                    var atRuleName = node.getText();
                    var entry = this.cssDataManager.getAtDirective(atRuleName);
                    if (entry) {
                        var contents = languageFacts.getEntryDescription(entry, this.doesSupportMarkdown());
                        if (contents) {
                            hover = {
                                contents: contents,
                                range: getRange(node)
                            };
                        }
                        else {
                            hover = null;
                        }
                    }
                    continue;
                }
                if (node instanceof nodes.Node && node.type === nodes.NodeType.PseudoSelector) {
                    var selectorName = node.getText();
                    var entry = selectorName.slice(0, 2) === '::'
                        ? this.cssDataManager.getPseudoElement(selectorName)
                        : this.cssDataManager.getPseudoClass(selectorName);
                    if (entry) {
                        var contents = languageFacts.getEntryDescription(entry, this.doesSupportMarkdown());
                        if (contents) {
                            hover = {
                                contents: contents,
                                range: getRange(node)
                            };
                        }
                        else {
                            hover = null;
                        }
                    }
                    continue;
                }
            }
            if (hover) {
                hover.contents = this.convertContents(hover.contents);
            }
            return hover;
        };
        CSSHover.prototype.convertContents = function (contents) {
            if (!this.doesSupportMarkdown()) {
                if (typeof contents === 'string') {
                    return contents;
                }
                // MarkupContent
                else if ('kind' in contents) {
                    return {
                        kind: 'plaintext',
                        value: contents.value
                    };
                }
                // MarkedString[]
                else if (Array.isArray(contents)) {
                    return contents.map(function (c) {
                        return typeof c === 'string' ? c : c.value;
                    });
                }
                // MarkedString
                else {
                    return contents.value;
                }
            }
            return contents;
        };
        CSSHover.prototype.doesSupportMarkdown = function () {
            if (!objects_1.isDefined(this.supportsMarkdown)) {
                if (!objects_1.isDefined(this.clientCapabilities)) {
                    this.supportsMarkdown = true;
                    return this.supportsMarkdown;
                }
                var hover = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.hover;
                this.supportsMarkdown = hover && hover.contentFormat && Array.isArray(hover.contentFormat) && hover.contentFormat.indexOf(cssLanguageTypes_1.MarkupKind.Markdown) !== -1;
            }
            return this.supportsMarkdown;
        };
        return CSSHover;
    }());
    exports.CSSHover = CSSHover;
});
