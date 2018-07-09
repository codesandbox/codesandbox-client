import { loadWASM } from 'onigasm'; // peer dependency of 'monaco-textmate'
import { Registry } from 'monaco-textmate'; // peer dependency
import { wireTmGrammars } from './setGrammars';

export async function liftOff(monaco) {
  console.log('spaniaxie');
  await loadWASM(`https://unpkg.com/onigasm@2.2.1/lib/onigasm.wasm`); // See https://www.npmjs.com/package/onigasm#light-it-up

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: 'plist',
        content: await (await fetch(
          `https://raw.githubusercontent.com/Microsoft/TypeScript-TmLanguage/master/TypeScriptReact.tmLanguage`
        )).text(),
      };
    },
  });

  console.log(registry);

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map();
  grammars.set('css', 'source.css');
  grammars.set('html', 'text.html.basic');
  grammars.set('typescript', 'source.tsx');
  grammars.set('javascript', 'source.tsx');

  const aa = await registry.loadGrammar('source.tsx');

  console.log(aa);

  await wireTmGrammars(monaco, registry, grammars);
}
