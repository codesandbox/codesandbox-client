"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitionAfterInheritance_1 = require("./definitionAfterInheritance");
const scopeSingle_1 = require("./scopeSingle");
class RuleBuilder {
    constructor(languageDefinitions) {
        this.start = new Map();
        this.intermediate = new Map();
        this.final = new Map();
        for (const userLanguage of languageDefinitions) {
            this.start.set(userLanguage.language, userLanguage);
        }
    }
    override(languageDefinitions) {
        for (const userLanguage of languageDefinitions) {
            this.start.set(userLanguage.language, userLanguage);
        }
    }
    get(languageId) {
        const stackResult = this.final.get(languageId);
        if (stackResult) {
            return stackResult;
        }
        const baseLanguage = this.start.get(languageId);
        if (!baseLanguage) {
            return;
        }
        const history = new Set();
        const scopesThisToBase = this.getAllScopes(baseLanguage, [], history);
        const scopeMap = new Map();
        // Set base map first then let extended languages overwrite
        for (let i = scopesThisToBase.length; i-- > 0;) {
            for (const scope of scopesThisToBase[i]) {
                if (!scope.open) {
                    console.error("Missing 'open' property");
                    console.error(scope);
                    continue;
                }
                scopeMap.set(scope.open, scope);
            }
        }
        const extendedLanguage = new definitionAfterInheritance_1.default(baseLanguage.language, scopeMap);
        this.intermediate.set(extendedLanguage.language, extendedLanguage);
        const tokens = new Map();
        for (const scope of scopeMap.values()) {
            if (!scope.open) {
                console.error("Missing 'open' property");
                console.error(scope);
                continue;
            }
            if (scope.open && scope.close) {
                if (scope.close === scope.open) {
                    throw new Error("Open and close scopes are the same: " + scope.open);
                }
                const open = new scopeSingle_1.default(scope.open, scopeSingle_1.ScopeType.Open, scope.open);
                tokens.set(open.tokenName, open);
                if (Array.isArray(scope.close)) {
                    for (const closeType of scope.close) {
                        const close = new scopeSingle_1.default(closeType, scopeSingle_1.ScopeType.Close, scope.open);
                        tokens.set(close.tokenName, close);
                    }
                }
                else {
                    const close = new scopeSingle_1.default(scope.close, scopeSingle_1.ScopeType.Close, scope.open);
                    tokens.set(close.tokenName, close);
                }
            }
            else {
                const ambiguous = new scopeSingle_1.default(scope.open, scopeSingle_1.ScopeType.Ambiguous, scope.open);
                tokens.set(ambiguous.tokenName, ambiguous);
            }
        }
        this.final.set(languageId, tokens);
        return tokens;
    }
    getAllScopes(userLanguageDefinition, allScopeDefinitions, history) {
        if (history.has(userLanguageDefinition)) {
            console.error("Cycle detected while parsing user languages: " +
                userLanguageDefinition.language + " => " +
                [...history.values()]);
            return allScopeDefinitions;
        }
        history.add(userLanguageDefinition);
        if (userLanguageDefinition.scopes) {
            allScopeDefinitions.push(userLanguageDefinition.scopes);
        }
        if (userLanguageDefinition.extends) {
            const parsedLanguage = this.intermediate.get(userLanguageDefinition.extends);
            if (parsedLanguage) {
                allScopeDefinitions.push([...parsedLanguage.scopes.values()]);
                return allScopeDefinitions;
            }
            const unParsedLanguage = this.start.get(userLanguageDefinition.extends);
            if (unParsedLanguage) {
                this.getAllScopes(unParsedLanguage, allScopeDefinitions, history);
            }
            else {
                console.error("Could not find user defined language: " + userLanguageDefinition.extends);
            }
        }
        return allScopeDefinitions;
    }
}
exports.RuleBuilder = RuleBuilder;
//# sourceMappingURL=ruleBuilder.js.map