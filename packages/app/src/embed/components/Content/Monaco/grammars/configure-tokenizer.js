import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'
import { Registry } from 'monaco-textmate'; // peer dependency
import { wireTmGrammars } from './set-grammars';

/* eslint-disable */
import cssGrammar from '!raw-loader!./tmGrammars/css.json.tmLanguage';
import htmlGrammar from '!raw-loader!./tmGrammars/html.json.tmLanguage';
import tsGrammar from '!raw-loader!./tmGrammars/TypeScriptReact.tmLanguage';
/* eslint-enable */

let grammarsLoaded = false;

export async function liftOff(monaco) {
  if (grammarsLoaded) {
    return;
  }
  grammarsLoaded = true;
  // eslint-disable-next-line global-require
  await loadWASM('/public/onigasm/2.2.1/onigasm.wasm'); // See https://www.npmjs.com/package/onigasm#light-it-up

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      if (scopeName === 'source.css') {
        return {
          format: 'json',
          content: cssGrammar,
        };
      }
      if (scopeName === 'text.html.basic') {
        return {
          format: 'json',
          content: htmlGrammar,
        };
      }

      return {
        format: 'plist',
        content: tsGrammar,
      };
    },
  });

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map();
  grammars.set('css', 'source.css');
  grammars.set('html', 'text.html.basic');
  grammars.set('vue', 'text.html.basic');
  grammars.set('typescript', 'source.tsx');
  grammars.set('javascript', 'source.js');

  await wireTmGrammars(monaco, registry, grammars);
}
