/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isObject } from '../../base/common/types.js';
import { LanguageFeatureRegistry } from './modes/languageFeatureRegistry.js';
import { TokenizationRegistryImpl } from './modes/tokenizationRegistry.js';
/**
 * @internal
 */
var LanguageIdentifier = /** @class */ (function () {
    function LanguageIdentifier(language, id) {
        this.language = language;
        this.id = id;
    }
    return LanguageIdentifier;
}());
export { LanguageIdentifier };
/**
 * @internal
 */
var TokenMetadata = /** @class */ (function () {
    function TokenMetadata() {
    }
    TokenMetadata.getLanguageId = function (metadata) {
        return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
    };
    TokenMetadata.getTokenType = function (metadata) {
        return (metadata & 1792 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
    };
    TokenMetadata.getFontStyle = function (metadata) {
        return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
    };
    TokenMetadata.getForeground = function (metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    };
    TokenMetadata.getBackground = function (metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    };
    TokenMetadata.getClassNameFromMetadata = function (metadata) {
        var foreground = this.getForeground(metadata);
        var className = 'mtk' + foreground;
        var fontStyle = this.getFontStyle(metadata);
        if (fontStyle & 1 /* Italic */) {
            className += ' mtki';
        }
        if (fontStyle & 2 /* Bold */) {
            className += ' mtkb';
        }
        if (fontStyle & 4 /* Underline */) {
            className += ' mtku';
        }
        return className;
    };
    TokenMetadata.getInlineStyleFromMetadata = function (metadata, colorMap) {
        var foreground = this.getForeground(metadata);
        var fontStyle = this.getFontStyle(metadata);
        var result = "color: " + colorMap[foreground] + ";";
        if (fontStyle & 1 /* Italic */) {
            result += 'font-style: italic;';
        }
        if (fontStyle & 2 /* Bold */) {
            result += 'font-weight: bold;';
        }
        if (fontStyle & 4 /* Underline */) {
            result += 'text-decoration: underline;';
        }
        return result;
    };
    return TokenMetadata;
}());
export { TokenMetadata };
/**
 * @internal
 */
export var completionKindToCssClass = (function () {
    var data = Object.create(null);
    data[0 /* Method */] = 'method';
    data[1 /* Function */] = 'function';
    data[2 /* Constructor */] = 'constructor';
    data[3 /* Field */] = 'field';
    data[4 /* Variable */] = 'variable';
    data[5 /* Class */] = 'class';
    data[6 /* Struct */] = 'struct';
    data[7 /* Interface */] = 'interface';
    data[8 /* Module */] = 'module';
    data[9 /* Property */] = 'property';
    data[10 /* Event */] = 'event';
    data[11 /* Operator */] = 'operator';
    data[12 /* Unit */] = 'unit';
    data[13 /* Value */] = 'value';
    data[14 /* Constant */] = 'constant';
    data[15 /* Enum */] = 'enum';
    data[16 /* EnumMember */] = 'enum-member';
    data[17 /* Keyword */] = 'keyword';
    data[25 /* Snippet */] = 'snippet';
    data[18 /* Text */] = 'text';
    data[19 /* Color */] = 'color';
    data[20 /* File */] = 'file';
    data[21 /* Reference */] = 'reference';
    data[22 /* Customcolor */] = 'customcolor';
    data[23 /* Folder */] = 'folder';
    data[24 /* TypeParameter */] = 'type-parameter';
    return function (kind) {
        return data[kind] || 'property';
    };
})();
/**
 * @internal
 */
export var completionKindFromLegacyString = (function () {
    var data = Object.create(null);
    data['method'] = 0 /* Method */;
    data['function'] = 1 /* Function */;
    data['constructor'] = 2 /* Constructor */;
    data['field'] = 3 /* Field */;
    data['variable'] = 4 /* Variable */;
    data['class'] = 5 /* Class */;
    data['struct'] = 6 /* Struct */;
    data['interface'] = 7 /* Interface */;
    data['module'] = 8 /* Module */;
    data['property'] = 9 /* Property */;
    data['event'] = 10 /* Event */;
    data['operator'] = 11 /* Operator */;
    data['unit'] = 12 /* Unit */;
    data['value'] = 13 /* Value */;
    data['constant'] = 14 /* Constant */;
    data['enum'] = 15 /* Enum */;
    data['enum-member'] = 16 /* EnumMember */;
    data['keyword'] = 17 /* Keyword */;
    data['snippet'] = 25 /* Snippet */;
    data['text'] = 18 /* Text */;
    data['color'] = 19 /* Color */;
    data['file'] = 20 /* File */;
    data['reference'] = 21 /* Reference */;
    data['customcolor'] = 22 /* Customcolor */;
    data['folder'] = 23 /* Folder */;
    data['type-parameter'] = 24 /* TypeParameter */;
    return function (value) {
        return data[value] || 'property';
    };
})();
export var SignatureHelpTriggerReason;
(function (SignatureHelpTriggerReason) {
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerReason || (SignatureHelpTriggerReason = {}));
/**
 * A document highlight kind.
 */
export var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
/**
 * @internal
 */
export var symbolKindToCssClass = (function () {
    var _fromMapping = Object.create(null);
    _fromMapping[0 /* File */] = 'file';
    _fromMapping[1 /* Module */] = 'module';
    _fromMapping[2 /* Namespace */] = 'namespace';
    _fromMapping[3 /* Package */] = 'package';
    _fromMapping[4 /* Class */] = 'class';
    _fromMapping[5 /* Method */] = 'method';
    _fromMapping[6 /* Property */] = 'property';
    _fromMapping[7 /* Field */] = 'field';
    _fromMapping[8 /* Constructor */] = 'constructor';
    _fromMapping[9 /* Enum */] = 'enum';
    _fromMapping[10 /* Interface */] = 'interface';
    _fromMapping[11 /* Function */] = 'function';
    _fromMapping[12 /* Variable */] = 'variable';
    _fromMapping[13 /* Constant */] = 'constant';
    _fromMapping[14 /* String */] = 'string';
    _fromMapping[15 /* Number */] = 'number';
    _fromMapping[16 /* Boolean */] = 'boolean';
    _fromMapping[17 /* Array */] = 'array';
    _fromMapping[18 /* Object */] = 'object';
    _fromMapping[19 /* Key */] = 'key';
    _fromMapping[20 /* Null */] = 'null';
    _fromMapping[21 /* EnumMember */] = 'enum-member';
    _fromMapping[22 /* Struct */] = 'struct';
    _fromMapping[23 /* Event */] = 'event';
    _fromMapping[24 /* Operator */] = 'operator';
    _fromMapping[25 /* TypeParameter */] = 'type-parameter';
    return function toCssClassName(kind) {
        return "symbol-icon " + (_fromMapping[kind] || 'property');
    };
})();
var FoldingRangeKind = /** @class */ (function () {
    /**
     * Creates a new [FoldingRangeKind](#FoldingRangeKind).
     *
     * @param value of the kind.
     */
    function FoldingRangeKind(value) {
        this.value = value;
    }
    /**
     * Kind for folding range representing a comment. The value of the kind is 'comment'.
     */
    FoldingRangeKind.Comment = new FoldingRangeKind('comment');
    /**
     * Kind for folding range representing a import. The value of the kind is 'imports'.
     */
    FoldingRangeKind.Imports = new FoldingRangeKind('imports');
    /**
     * Kind for folding range representing regions (for example marked by `#region`, `#endregion`).
     * The value of the kind is 'region'.
     */
    FoldingRangeKind.Region = new FoldingRangeKind('region');
    return FoldingRangeKind;
}());
export { FoldingRangeKind };
/**
 * @internal
 */
export function isResourceFileEdit(thing) {
    return isObject(thing) && (Boolean(thing.newUri) || Boolean(thing.oldUri));
}
/**
 * @internal
 */
export function isResourceTextEdit(thing) {
    return isObject(thing) && thing.resource && Array.isArray(thing.edits);
}
/**
 * @internal
 */
export var CommentThreadCollapsibleState;
(function (CommentThreadCollapsibleState) {
    /**
     * Determines an item is collapsed
     */
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Collapsed"] = 0] = "Collapsed";
    /**
     * Determines an item is expanded
     */
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Expanded"] = 1] = "Expanded";
})(CommentThreadCollapsibleState || (CommentThreadCollapsibleState = {}));
// --- feature registries ------
/**
 * @internal
 */
export var ReferenceProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var RenameProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CompletionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var SignatureHelpProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var HoverProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentSymbolProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentHighlightProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DefinitionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DeclarationProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var ImplementationProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var TypeDefinitionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CodeLensProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var CodeActionProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var DocumentRangeFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var OnTypeFormattingEditProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var LinkProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var ColorProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var FoldingRangeProviderRegistry = new LanguageFeatureRegistry();
/**
 * @internal
 */
export var TokenizationRegistry = new TokenizationRegistryImpl();
