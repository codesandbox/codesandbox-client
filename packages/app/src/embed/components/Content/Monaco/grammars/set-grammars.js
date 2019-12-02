const monacoTextmate1 = require('monaco-textmate');

class TokenizerState {
  constructor(_ruleStack) {
    this._ruleStack = _ruleStack;
  }

  get ruleStack() {
    return this._ruleStack;
  }

  clone() {
    return new TokenizerState(this._ruleStack);
  }

  equals(other) {
    if (
      !other ||
      !(other instanceof TokenizerState) ||
      other !== this ||
      other._ruleStack !== this._ruleStack
    ) {
      return false;
    }
    return true;
  }
}

/**
 * Wires up monaco-editor with monaco-textmate
 *
 * @param monaco monaco namespace this operation should apply to (usually the `monaco` global unless you have some other setup)
 * @param registry TmGrammar `Registry` this wiring should rely on to provide the grammars
 * @param languages `Map` of language ids (string) to TM names (string)
 */
export function wireTmGrammars(monaco, registry, languages) {
  return Promise.all(
    Array.from(languages.keys()).map(async languageId => {
      try {
        const grammar = await registry.loadGrammar(languages.get(languageId));

        monaco.languages.setTokensProvider(languageId, {
          getInitialState: () => new TokenizerState(monacoTextmate1.INITIAL),
          tokenize: (line, state) => {
            const res = grammar.tokenizeLine(line, state.ruleStack);

            return {
              endState: new TokenizerState(res.ruleStack),
              tokens: res.tokens.map(token => ({
                ...token,
                // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
                scopes: token.scopes[token.scopes.length - 1],
              })),
            };
          },
        });
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(e); // eslint-disable-line
        }
      }
    })
  );
}
