/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../../nls.js';
import { parse } from '../../../../../base/common/json.js';
import * as types from '../../../../../base/common/types.js';
import { LanguageConfigurationRegistry } from '../../../../../editor/common/modes/languageConfigurationRegistry.js';
import { IModeService } from '../../../../../editor/common/services/modeService.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { Extensions } from '../../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { ITextMateService } from '../../../../services/textMate/electron-browser/textMateService.js';
function isStringArr(something) {
    if (!Array.isArray(something)) {
        return false;
    }
    for (var i = 0, len = something.length; i < len; i++) {
        if (typeof something[i] !== 'string') {
            return false;
        }
    }
    return true;
}
function isCharacterPair(something) {
    return (isStringArr(something)
        && something.length === 2);
}
var LanguageConfigurationFileHandler = /** @class */ (function () {
    function LanguageConfigurationFileHandler(textMateService, _modeService, _fileService, _extensionService) {
        var _this = this;
        this._modeService = _modeService;
        this._fileService = _fileService;
        this._extensionService = _extensionService;
        this._done = [];
        // Listen for hints that a language configuration is needed/usefull and then load it once
        this._modeService.onDidCreateMode(function (mode) {
            var languageIdentifier = mode.getLanguageIdentifier();
            // Modes can be instantiated before the extension points have finished registering
            _this._extensionService.whenInstalledExtensionsRegistered().then(function () {
                _this._loadConfigurationsForMode(languageIdentifier);
            });
        });
        textMateService.onDidEncounterLanguage(function (languageId) {
            _this._loadConfigurationsForMode(_this._modeService.getLanguageIdentifier(languageId));
        });
    }
    LanguageConfigurationFileHandler.prototype._loadConfigurationsForMode = function (languageIdentifier) {
        var _this = this;
        if (this._done[languageIdentifier.id]) {
            return;
        }
        this._done[languageIdentifier.id] = true;
        var configurationFiles = this._modeService.getConfigurationFiles(languageIdentifier.language);
        configurationFiles.forEach(function (configFileLocation) { return _this._handleConfigFile(languageIdentifier, configFileLocation); });
    };
    LanguageConfigurationFileHandler.prototype._handleConfigFile = function (languageIdentifier, configFileLocation) {
        var _this = this;
        this._fileService.resolveContent(configFileLocation, { encoding: 'utf8' }).then(function (contents) {
            var errors = [];
            var configuration = parse(contents.value.toString(), errors);
            if (errors.length) {
                console.error(nls.localize('parseErrors', "Errors parsing {0}: {1}", configFileLocation.toString(), errors.join('\n')));
            }
            _this._handleConfig(languageIdentifier, configuration);
        }, function (err) {
            console.error(err);
        });
    };
    LanguageConfigurationFileHandler.prototype._extractValidCommentRule = function (languageIdentifier, configuration) {
        var source = configuration.comments;
        if (typeof source === 'undefined') {
            return null;
        }
        if (!types.isObject(source)) {
            console.warn("[" + languageIdentifier.language + "]: language configuration: expected `comments` to be an object.");
            return null;
        }
        var result = null;
        if (typeof source.lineComment !== 'undefined') {
            if (typeof source.lineComment !== 'string') {
                console.warn("[" + languageIdentifier.language + "]: language configuration: expected `comments.lineComment` to be a string.");
            }
            else {
                result = result || {};
                result.lineComment = source.lineComment;
            }
        }
        if (typeof source.blockComment !== 'undefined') {
            if (!isCharacterPair(source.blockComment)) {
                console.warn("[" + languageIdentifier.language + "]: language configuration: expected `comments.blockComment` to be an array of two strings.");
            }
            else {
                result = result || {};
                result.blockComment = source.blockComment;
            }
        }
        return result;
    };
    LanguageConfigurationFileHandler.prototype._extractValidBrackets = function (languageIdentifier, configuration) {
        var source = configuration.brackets;
        if (typeof source === 'undefined') {
            return null;
        }
        if (!Array.isArray(source)) {
            console.warn("[" + languageIdentifier.language + "]: language configuration: expected `brackets` to be an array.");
            return null;
        }
        var result = null;
        for (var i = 0, len = source.length; i < len; i++) {
            var pair = source[i];
            if (!isCharacterPair(pair)) {
                console.warn("[" + languageIdentifier.language + "]: language configuration: expected `brackets[" + i + "]` to be an array of two strings.");
                continue;
            }
            result = result || [];
            result.push(pair);
        }
        return result;
    };
    LanguageConfigurationFileHandler.prototype._extractValidAutoClosingPairs = function (languageIdentifier, configuration) {
        var source = configuration.autoClosingPairs;
        if (typeof source === 'undefined') {
            return null;
        }
        if (!Array.isArray(source)) {
            console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs` to be an array.");
            return null;
        }
        var result = null;
        for (var i = 0, len = source.length; i < len; i++) {
            var pair = source[i];
            if (Array.isArray(pair)) {
                if (!isCharacterPair(pair)) {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs[" + i + "]` to be an array of two strings or an object.");
                    continue;
                }
                result = result || [];
                result.push({ open: pair[0], close: pair[1] });
            }
            else {
                if (!types.isObject(pair)) {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs[" + i + "]` to be an array of two strings or an object.");
                    continue;
                }
                if (typeof pair.open !== 'string') {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs[" + i + "].open` to be a string.");
                    continue;
                }
                if (typeof pair.close !== 'string') {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs[" + i + "].close` to be a string.");
                    continue;
                }
                if (typeof pair.notIn !== 'undefined') {
                    if (!isStringArr(pair.notIn)) {
                        console.warn("[" + languageIdentifier.language + "]: language configuration: expected `autoClosingPairs[" + i + "].notIn` to be a string array.");
                        continue;
                    }
                }
                result = result || [];
                result.push({ open: pair.open, close: pair.close, notIn: pair.notIn });
            }
        }
        return result;
    };
    LanguageConfigurationFileHandler.prototype._extractValidSurroundingPairs = function (languageIdentifier, configuration) {
        var source = configuration.surroundingPairs;
        if (typeof source === 'undefined') {
            return null;
        }
        if (!Array.isArray(source)) {
            console.warn("[" + languageIdentifier.language + "]: language configuration: expected `surroundingPairs` to be an array.");
            return null;
        }
        var result = null;
        for (var i = 0, len = source.length; i < len; i++) {
            var pair = source[i];
            if (Array.isArray(pair)) {
                if (!isCharacterPair(pair)) {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `surroundingPairs[" + i + "]` to be an array of two strings or an object.");
                    continue;
                }
                result = result || [];
                result.push({ open: pair[0], close: pair[1] });
            }
            else {
                if (!types.isObject(pair)) {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `surroundingPairs[" + i + "]` to be an array of two strings or an object.");
                    continue;
                }
                if (typeof pair.open !== 'string') {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `surroundingPairs[" + i + "].open` to be a string.");
                    continue;
                }
                if (typeof pair.close !== 'string') {
                    console.warn("[" + languageIdentifier.language + "]: language configuration: expected `surroundingPairs[" + i + "].close` to be a string.");
                    continue;
                }
                result = result || [];
                result.push({ open: pair.open, close: pair.close });
            }
        }
        return result;
    };
    // private _mapCharacterPairs(pairs: (CharacterPair | IAutoClosingPairConditional)[]): IAutoClosingPairConditional[] {
    // 	return pairs.map(pair => {
    // 		if (Array.isArray(pair)) {
    // 			return { open: pair[0], close: pair[1] };
    // 		}
    // 		return <IAutoClosingPairConditional>pair;
    // 	});
    // }
    LanguageConfigurationFileHandler.prototype._handleConfig = function (languageIdentifier, configuration) {
        var richEditConfig = {};
        var comments = this._extractValidCommentRule(languageIdentifier, configuration);
        if (comments) {
            richEditConfig.comments = comments;
        }
        var brackets = this._extractValidBrackets(languageIdentifier, configuration);
        if (brackets) {
            richEditConfig.brackets = brackets;
        }
        var autoClosingPairs = this._extractValidAutoClosingPairs(languageIdentifier, configuration);
        if (autoClosingPairs) {
            richEditConfig.autoClosingPairs = autoClosingPairs;
        }
        var surroundingPairs = this._extractValidSurroundingPairs(languageIdentifier, configuration);
        if (surroundingPairs) {
            richEditConfig.surroundingPairs = surroundingPairs;
        }
        var autoCloseBefore = configuration.autoCloseBefore;
        if (typeof autoCloseBefore === 'string') {
            richEditConfig.autoCloseBefore = autoCloseBefore;
        }
        if (configuration.wordPattern) {
            try {
                var wordPattern = this._parseRegex(configuration.wordPattern);
                if (wordPattern) {
                    richEditConfig.wordPattern = wordPattern;
                }
            }
            catch (error) {
                // Malformed regexes are ignored
            }
        }
        if (configuration.indentationRules) {
            var indentationRules = this._mapIndentationRules(configuration.indentationRules);
            if (indentationRules) {
                richEditConfig.indentationRules = indentationRules;
            }
        }
        if (configuration.folding) {
            var markers = configuration.folding.markers;
            richEditConfig.folding = {
                offSide: configuration.folding.offSide,
                markers: markers ? { start: new RegExp(markers.start), end: new RegExp(markers.end) } : void 0
            };
        }
        LanguageConfigurationRegistry.register(languageIdentifier, richEditConfig);
    };
    LanguageConfigurationFileHandler.prototype._parseRegex = function (value) {
        if (typeof value === 'string') {
            return new RegExp(value, '');
        }
        else if (typeof value === 'object') {
            return new RegExp(value.pattern, value.flags);
        }
        return null;
    };
    LanguageConfigurationFileHandler.prototype._mapIndentationRules = function (indentationRules) {
        try {
            var increaseIndentPattern = this._parseRegex(indentationRules.increaseIndentPattern);
            var decreaseIndentPattern = this._parseRegex(indentationRules.decreaseIndentPattern);
            if (increaseIndentPattern && decreaseIndentPattern) {
                var result = {
                    increaseIndentPattern: increaseIndentPattern,
                    decreaseIndentPattern: decreaseIndentPattern
                };
                if (indentationRules.indentNextLinePattern) {
                    result.indentNextLinePattern = this._parseRegex(indentationRules.indentNextLinePattern);
                }
                if (indentationRules.unIndentedLinePattern) {
                    result.unIndentedLinePattern = this._parseRegex(indentationRules.unIndentedLinePattern);
                }
                return result;
            }
        }
        catch (error) {
            // Malformed regexes are ignored
        }
        return null;
    };
    LanguageConfigurationFileHandler = __decorate([
        __param(0, ITextMateService),
        __param(1, IModeService),
        __param(2, IFileService),
        __param(3, IExtensionService)
    ], LanguageConfigurationFileHandler);
    return LanguageConfigurationFileHandler;
}());
export { LanguageConfigurationFileHandler };
var schemaId = 'vscode://schemas/language-configuration';
var schema = {
    allowComments: true,
    default: {
        comments: {
            blockComment: ['/*', '*/'],
            lineComment: '//'
        },
        brackets: [['(', ')'], ['[', ']'], ['{', '}']],
        autoClosingPairs: [['(', ')'], ['[', ']'], ['{', '}']],
        surroundingPairs: [['(', ')'], ['[', ']'], ['{', '}']]
    },
    definitions: {
        openBracket: {
            type: 'string',
            description: nls.localize('schema.openBracket', 'The opening bracket character or string sequence.')
        },
        closeBracket: {
            type: 'string',
            description: nls.localize('schema.closeBracket', 'The closing bracket character or string sequence.')
        },
        bracketPair: {
            type: 'array',
            items: [{
                    $ref: '#definitions/openBracket'
                }, {
                    $ref: '#definitions/closeBracket'
                }]
        }
    },
    properties: {
        comments: {
            default: {
                blockComment: ['/*', '*/'],
                lineComment: '//'
            },
            description: nls.localize('schema.comments', 'Defines the comment symbols'),
            type: 'object',
            properties: {
                blockComment: {
                    type: 'array',
                    description: nls.localize('schema.blockComments', 'Defines how block comments are marked.'),
                    items: [{
                            type: 'string',
                            description: nls.localize('schema.blockComment.begin', 'The character sequence that starts a block comment.')
                        }, {
                            type: 'string',
                            description: nls.localize('schema.blockComment.end', 'The character sequence that ends a block comment.')
                        }]
                },
                lineComment: {
                    type: 'string',
                    description: nls.localize('schema.lineComment', 'The character sequence that starts a line comment.')
                }
            }
        },
        brackets: {
            default: [['(', ')'], ['[', ']'], ['{', '}']],
            description: nls.localize('schema.brackets', 'Defines the bracket symbols that increase or decrease the indentation.'),
            type: 'array',
            items: {
                $ref: '#definitions/bracketPair'
            }
        },
        autoClosingPairs: {
            default: [['(', ')'], ['[', ']'], ['{', '}']],
            description: nls.localize('schema.autoClosingPairs', 'Defines the bracket pairs. When a opening bracket is entered, the closing bracket is inserted automatically.'),
            type: 'array',
            items: {
                oneOf: [{
                        $ref: '#definitions/bracketPair'
                    }, {
                        type: 'object',
                        properties: {
                            open: {
                                $ref: '#definitions/openBracket'
                            },
                            close: {
                                $ref: '#definitions/closeBracket'
                            },
                            notIn: {
                                type: 'array',
                                description: nls.localize('schema.autoClosingPairs.notIn', 'Defines a list of scopes where the auto pairs are disabled.'),
                                items: {
                                    enum: ['string', 'comment']
                                }
                            }
                        }
                    }]
            }
        },
        autoCloseBefore: {
            default: ';:.,=}])> \n\t',
            description: nls.localize('schema.autoCloseBefore', 'Defines what characters must be after the cursor in order for bracket or quote autoclosing to occur when using the \'languageDefined\' autoclosing setting. This is typically the set of characters which can not start an expression.'),
            type: 'string',
        },
        surroundingPairs: {
            default: [['(', ')'], ['[', ']'], ['{', '}']],
            description: nls.localize('schema.surroundingPairs', 'Defines the bracket pairs that can be used to surround a selected string.'),
            type: 'array',
            items: {
                oneOf: [{
                        $ref: '#definitions/bracketPair'
                    }, {
                        type: 'object',
                        properties: {
                            open: {
                                $ref: '#definitions/openBracket'
                            },
                            close: {
                                $ref: '#definitions/closeBracket'
                            }
                        }
                    }]
            }
        },
        wordPattern: {
            default: '',
            description: nls.localize('schema.wordPattern', 'The word definition for the language.'),
            type: ['string', 'object'],
            properties: {
                pattern: {
                    type: 'string',
                    description: nls.localize('schema.wordPattern.pattern', 'The RegExp pattern used to match words.'),
                    default: '',
                },
                flags: {
                    type: 'string',
                    description: nls.localize('schema.wordPattern.flags', 'The RegExp flags used to match words.'),
                    default: 'g',
                    pattern: '^([gimuy]+)$',
                    patternErrorMessage: nls.localize('schema.wordPattern.flags.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                }
            }
        },
        indentationRules: {
            default: {
                increaseIndentPattern: '',
                decreaseIndentPattern: ''
            },
            description: nls.localize('schema.indentationRules', 'The language\'s indentation settings.'),
            type: 'object',
            properties: {
                increaseIndentPattern: {
                    type: ['string', 'object'],
                    description: nls.localize('schema.indentationRules.increaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).'),
                    properties: {
                        pattern: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.increaseIndentPattern.pattern', 'The RegExp pattern for increaseIndentPattern.'),
                            default: '',
                        },
                        flags: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.increaseIndentPattern.flags', 'The RegExp flags for increaseIndentPattern.'),
                            default: '',
                            pattern: '^([gimuy]+)$',
                            patternErrorMessage: nls.localize('schema.indentationRules.increaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                        }
                    }
                },
                decreaseIndentPattern: {
                    type: ['string', 'object'],
                    description: nls.localize('schema.indentationRules.decreaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be unindented once (until another rule matches).'),
                    properties: {
                        pattern: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.decreaseIndentPattern.pattern', 'The RegExp pattern for decreaseIndentPattern.'),
                            default: '',
                        },
                        flags: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.decreaseIndentPattern.flags', 'The RegExp flags for decreaseIndentPattern.'),
                            default: '',
                            pattern: '^([gimuy]+)$',
                            patternErrorMessage: nls.localize('schema.indentationRules.decreaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                        }
                    }
                },
                indentNextLinePattern: {
                    type: ['string', 'object'],
                    description: nls.localize('schema.indentationRules.indentNextLinePattern', 'If a line matches this pattern, then **only the next line** after it should be indented once.'),
                    properties: {
                        pattern: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.indentNextLinePattern.pattern', 'The RegExp pattern for indentNextLinePattern.'),
                            default: '',
                        },
                        flags: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.indentNextLinePattern.flags', 'The RegExp flags for indentNextLinePattern.'),
                            default: '',
                            pattern: '^([gimuy]+)$',
                            patternErrorMessage: nls.localize('schema.indentationRules.indentNextLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                        }
                    }
                },
                unIndentedLinePattern: {
                    type: ['string', 'object'],
                    description: nls.localize('schema.indentationRules.unIndentedLinePattern', 'If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.'),
                    properties: {
                        pattern: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.unIndentedLinePattern.pattern', 'The RegExp pattern for unIndentedLinePattern.'),
                            default: '',
                        },
                        flags: {
                            type: 'string',
                            description: nls.localize('schema.indentationRules.unIndentedLinePattern.flags', 'The RegExp flags for unIndentedLinePattern.'),
                            default: '',
                            pattern: '^([gimuy]+)$',
                            patternErrorMessage: nls.localize('schema.indentationRules.unIndentedLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                        }
                    }
                }
            }
        },
        folding: {
            type: 'object',
            description: nls.localize('schema.folding', 'The language\'s folding settings.'),
            properties: {
                offSide: {
                    type: 'boolean',
                    description: nls.localize('schema.folding.offSide', 'A language adheres to the off-side rule if blocks in that language are expressed by their indentation. If set, empty lines belong to the subsequent block.'),
                },
                markers: {
                    type: 'object',
                    description: nls.localize('schema.folding.markers', 'Language specific folding markers such as \'#region\' and \'#endregion\'. The start and end regexes will be tested against the contents of all lines and must be designed efficiently'),
                    properties: {
                        start: {
                            type: 'string',
                            description: nls.localize('schema.folding.markers.start', 'The RegExp pattern for the start marker. The regexp must start with \'^\'.')
                        },
                        end: {
                            type: 'string',
                            description: nls.localize('schema.folding.markers.end', 'The RegExp pattern for the end marker. The regexp must start with \'^\'.')
                        },
                    }
                }
            }
        }
    }
};
var schemaRegistry = Registry.as(Extensions.JSONContribution);
schemaRegistry.registerSchema(schemaId, schema);
