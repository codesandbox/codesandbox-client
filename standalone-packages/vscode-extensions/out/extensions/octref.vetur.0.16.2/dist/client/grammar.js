"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Dynamically generate grammar
 */
const fs_1 = require("fs");
// Available grammar scopes
const SCOPES = {
    html: 'text.html.basic',
    pug: 'text.pug',
    haml: 'text.haml',
    css: 'source.css',
    scss: 'source.css.scss',
    less: 'source.css.less',
    postcss: 'source.css.postcss',
    sass: 'source.sass',
    stylus: 'source.stylus',
    js: 'source.js',
    ts: 'source.ts',
    coffee: 'source.coffee',
    md: 'text.html.markdown',
    yaml: 'source.yaml',
    json: 'source.json',
    php: 'source.php',
    graphql: 'source.graphql'
};
function getGeneratedGrammar(grammarPath, customBlocks) {
    const grammar = JSON.parse(fs_1.readFileSync(grammarPath, 'utf-8'));
    for (const tag in customBlocks) {
        const lang = customBlocks[tag];
        if (!SCOPES[lang]) {
            throw `The language for custom block <${tag}> is invalid`;
        }
        grammar.patterns.unshift(makePattern(tag, SCOPES[lang]));
    }
    return JSON.stringify(grammar, null, 2);
}
exports.getGeneratedGrammar = getGeneratedGrammar;
function makePattern(tag, scope) {
    return JSON.parse(`
  {
    "begin": "(<)(${tag})",
    "beginCaptures": {
        "1": {
            "name": "punctuation.definition.tag.begin.html"
        },
        "2": {
            "name": "entity.name.tag.style.html"
        }
    },
    "end": "(</)(${tag})(>)",
    "endCaptures": {
        "1": {
            "name": "punctuation.definition.tag.begin.html"
        },
        "2": {
            "name": "entity.name.tag.style.html"
        },
        "3": {
            "name": "punctuation.definition.tag.end.html"
        }
    },
    "patterns": [
        {
            "include": "#tag-stuff"
        },
        {
            "begin": "(>)",
            "beginCaptures": {
                "1": {
                    "name": "punctuation.definition.tag.end.html"
                }
            },
            "end": "(?=</${tag}>)",
            "contentName": "${scope}",
            "patterns": [
                {
                    "include": "${scope}"
                }
            ]
        }
    ]
  }
  `);
}
//# sourceMappingURL=grammar.js.map