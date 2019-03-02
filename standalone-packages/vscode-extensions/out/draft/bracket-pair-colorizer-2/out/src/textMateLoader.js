"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const bracketUtil_1 = require("./bracketUtil");
const JSON5 = require("json5");
const languageConfig_1 = require("./languageConfig");
class TextMateLoader {
    constructor() {
        this.scopeNameToLanguage = new Map();
        this.scopeNameToPath = new Map();
        this.languageToScopeName = new Map();
        this.languageToConfigPath = new Map();
        this.languageId = 1;
        this.languageConfigs = new Map();
        this.initializeGrammars();
        this.vsctm = this.loadTextMate();
    }
    tryGetLanguageConfig(languageID) {
        const existingTokenizer = this.languageConfigs.get(languageID);
        if (existingTokenizer) {
            return existingTokenizer;
        }
        const scopeName = this.languageToScopeName.get(languageID);
        if (!scopeName) {
            return;
        }
        const configPath = this.languageToConfigPath.get(languageID);
        if (!configPath) {
            return;
        }
        return new Promise((resolve, reject) => {
            fs.readFile(configPath, (error, content) => {
                if (error) {
                    reject(error);
                }
                else {
                    const config = JSON5.parse(content.toString());
                    const brackets = config.brackets;
                    resolve(brackets);
                }
            });
        }).then((brackets) => {
            if (!brackets) {
                return null;
            }
            const registry = new this.vsctm.Registry({
                // tslint:disable-next-line:object-literal-shorthand
                loadGrammar: (scopeName) => {
                    const path = this.scopeNameToPath.get(scopeName);
                    if (!path) {
                        return null;
                    }
                    return new Promise((resolve, reject) => {
                        fs.readFile(path, (error, content) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                const text = content.toString();
                                const rawGrammar = this.vsctm.parseRawGrammar(text, path);
                                resolve(rawGrammar);
                            }
                        });
                    });
                },
            });
            // Load the JavaScript grammar and any other grammars included by it async.
            return registry.loadGrammarWithConfiguration(scopeName, this.languageId++, {}).then((grammar) => {
                if (grammar) {
                    if (!this.languageConfigs.has(languageID)) {
                        const mappedBrackets = brackets.map((b) => ({ open: b[0], close: b[1] }))
                            .filter(e => e.open !== "<" && e.close !== ">");
                        const bracketToId = new Map();
                        for (let i = 0; i < brackets.length; i++) {
                            const bracket = brackets[i];
                            bracketToId.set(bracket[0], { open: true, key: i });
                            bracketToId.set(bracket[1], { open: false, key: i });
                        }
                        let maxBracketLength = 0;
                        for (const bracket of mappedBrackets) {
                            maxBracketLength = Math.max(maxBracketLength, bracket.open.length);
                            maxBracketLength = Math.max(maxBracketLength, bracket.close.length);
                        }
                        const regex = bracketUtil_1.getRegexForBrackets(mappedBrackets);
                        this.languageConfigs.set(languageID, new languageConfig_1.default(grammar, regex, bracketToId));
                    }
                }
                return grammar;
            });
        });
    }
    getNodeModule(moduleName) {
        return require(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
    }
    loadTextMate() {
        return this.getNodeModule("vscode-textmate");
    }
    initializeGrammars() {
        for (const extension of vscode.extensions.all) {
            const packageJSON = extension.packageJSON;
            if (packageJSON.contributes) {
                if (packageJSON.contributes.grammars && packageJSON.contributes.languages) {
                    for (const grammar of packageJSON.contributes.grammars) {
                        if (grammar.language && grammar.scopeName && grammar.path) {
                            const fullPath = path.join(extension.extensionPath, grammar.path);
                            this.languageToScopeName.set(grammar.language, grammar.scopeName);
                            this.scopeNameToPath.set(grammar.scopeName, fullPath);
                            this.scopeNameToLanguage.set(grammar.scopeName, grammar.language);
                        }
                    }
                    for (const language of packageJSON.contributes.languages) {
                        if (language.configuration) {
                            const configPath = path.join(extension.extensionPath, language.configuration);
                            this.languageToConfigPath.set(language.id, configPath);
                        }
                    }
                }
            }
        }
    }
}
exports.TextMateLoader = TextMateLoader;
exports.default = TextMateLoader;
//# sourceMappingURL=textMateLoader.js.map