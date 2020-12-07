"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const path_1 = require("path");
const grammar_1 = require("../client/grammar");
glob('syntaxes/**/*.yaml', { nocase: true }, (_, files) => {
    for (const file of files) {
        const pathData = path_1.parse(file);
        fs_1.writeFileSync(pathData.dir + '/' + pathData.name + '.tmLanguage.json', JSON.stringify(js_yaml_1.safeLoad(fs_1.readFileSync(file).toString()), null, 2));
    }
    console.log('Built files:\n', JSON.stringify(files));
    // get default custom blocks from package json
    const pJson = JSON.parse(fs_1.readFileSync('package.json').toString());
    const defaultCustomBlocks = pJson.contributes.configuration.properties['vetur.grammar.customBlocks'].default;
    const generatedGrammar = grammar_1.getGeneratedGrammar('syntaxes/vue.tmLanguage.json', defaultCustomBlocks);
    fs_1.writeFileSync('syntaxes/vue-generated.json', generatedGrammar);
    console.log('Generated vue-generated.json');
});
//# sourceMappingURL=build_grammar.js.map