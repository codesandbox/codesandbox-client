/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import LanguageFeatureRegistry from './modes/languageFeatureRegistry';
import { TokenizationRegistryImpl } from './modes/tokenizationRegistry';
import { isObject } from '../../base/common/types';
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
 * How a suggest provider was triggered.
 */
export var SuggestTriggerKind;
(function (SuggestTriggerKind) {
    SuggestTriggerKind[SuggestTriggerKind["Invoke"] = 0] = "Invoke";
    SuggestTriggerKind[SuggestTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    SuggestTriggerKind[SuggestTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(SuggestTriggerKind || (SuggestTriggerKind = {}));
/**
 * @internal
 */
export var CodeActionTrigger;
(function (CodeActionTrigger) {
    CodeActionTrigger[CodeActionTrigger["Automatic"] = 1] = "Automatic";
    CodeActionTrigger[CodeActionTrigger["Manual"] = 2] = "Manual";
})(CodeActionTrigger || (CodeActionTrigger = {}));
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
 * A symbol kind.
 */
export var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 0] = "File";
    SymbolKind[SymbolKind["Module"] = 1] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 3] = "Package";
    SymbolKind[SymbolKind["Class"] = 4] = "Class";
    SymbolKind[SymbolKind["Method"] = 5] = "Method";
    SymbolKind[SymbolKind["Property"] = 6] = "Property";
    SymbolKind[SymbolKind["Field"] = 7] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
    SymbolKind[SymbolKind["Function"] = 11] = "Function";
    SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
    SymbolKind[SymbolKind["String"] = 14] = "String";
    SymbolKind[SymbolKind["Number"] = 15] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 17] = "Array";
    SymbolKind[SymbolKind["Object"] = 18] = "Object";
    SymbolKind[SymbolKind["Key"] = 19] = "Key";
    SymbolKind[SymbolKind["Null"] = 20] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
    SymbolKind[SymbolKind["Event"] = 23] = "Event";
    SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
/**
 * @internal
 */
export var symbolKindToCssClass = (function () {
    var _fromMapping = Object.create(null);
    _fromMapping[SymbolKind.File] = 'file';
    _fromMapping[SymbolKind.Module] = 'module';
    _fromMapping[SymbolKind.Namespace] = 'namespace';
    _fromMapping[SymbolKind.Package] = 'package';
    _fromMapping[SymbolKind.Class] = 'class';
    _fromMapping[SymbolKind.Method] = 'method';
    _fromMapping[SymbolKind.Property] = 'property';
    _fromMapping[SymbolKind.Field] = 'field';
    _fromMapping[SymbolKind.Constructor] = 'constructor';
    _fromMapping[SymbolKind.Enum] = 'enum';
    _fromMapping[SymbolKind.Interface] = 'interface';
    _fromMapping[SymbolKind.Function] = 'function';
    _fromMapping[SymbolKind.Variable] = 'variable';
    _fromMapping[SymbolKind.Constant] = 'constant';
    _fromMapping[SymbolKind.String] = 'string';
    _fromMapping[SymbolKind.Number] = 'number';
    _fromMapping[SymbolKind.Boolean] = 'boolean';
    _fromMapping[SymbolKind.Array] = 'array';
    _fromMapping[SymbolKind.Object] = 'object';
    _fromMapping[SymbolKind.Key] = 'key';
    _fromMapping[SymbolKind.Null] = 'null';
    _fromMapping[SymbolKind.EnumMember] = 'enum-member';
    _fromMapping[SymbolKind.Struct] = 'struct';
    _fromMapping[SymbolKind.Event] = 'event';
    _fromMapping[SymbolKind.Operator] = 'operator';
    _fromMapping[SymbolKind.TypeParameter] = 'type-parameter';
    return function toCssClassName(kind) {
        return _fromMapping[kind] || 'property';
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
export var SuggestRegistry = new LanguageFeatureRegistry();
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
