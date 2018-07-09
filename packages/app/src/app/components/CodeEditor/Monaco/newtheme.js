import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'
import { Registry } from 'monaco-textmate'; // peer dependency
import { wireTmGrammars } from './setGrammars';

export async function liftOff(monaco) {
  await loadWASM(`https://unpkg.com/onigasm@2.2.1/lib/onigasm.wasm`); // See https://www.npmjs.com/package/onigasm#light-it-up

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      if (scopeName === 'typescript' || scopeName === 'javascript') {
        return {
          format: 'plist',
          content: await (await fetch(
            `https://raw.githubusercontent.com/Microsoft/TypeScript-TmLanguage/master/TypeScriptReact.tmLanguage`
          )).text(),
        };
      } else if (scopeName === 'css') {
        return {
          format: 'json',
          content: await (await fetch(
            `https://raw.githubusercontent.com/Microsoft/vscode/master/extensions/css/syntaxes/css.tmLanguage.json`
          )).text(),
        };
      } else if (scopeName === 'html') {
        return {
          format: 'json',
          content: await (await fetch(
            `https://raw.githubusercontent.com/Microsoft/vscode/master/extensions/html/syntaxes/html.tmLanguage.json`
          )).text(),
        };
      }
    },
  });

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map();
  grammars.set('css', 'source.css');
  grammars.set('html', 'text.html.basic');
  grammars.set('vue', 'text.html.basic');
  grammars.set('typescript', 'source.tsx');
  grammars.set('javascript', 'source.tsx');

  await registry.loadGrammar('source.tsx');

  await wireTmGrammars(monaco, registry, grammars);
}
