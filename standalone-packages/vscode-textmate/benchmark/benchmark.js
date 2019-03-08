var path = require('path');
var fs = require('fs');
var main = require('../release/main');
var onigLibs = require('../out/onigLibs');

var Registry = main.Registry;

var onigurumaRegistry = new Registry({ loadGrammar, getOnigLib: () => onigLibs.getOniguruma()});
var onigasmRegistry = new Registry({ loadGrammar, getOnigLib: () => onigLibs.getOnigasm()});

function tokenize(grammar, content) {
	var start = Date.now();
	var ruleStack = null;
	for (var i = 0; i < content.length; i++) {
		var r = grammar.tokenizeLine(content[i], ruleStack);
		ruleStack = r.ruleStack;
	}
	return Date.now() - start;
}

async function tokenizeFile(filePath, scope, message) {
	var content = fs.readFileSync(filePath, 'utf8')
	var lines = content.split(/\r\n|\r|\n/);

	let onigurumaGrammar  = await onigurumaRegistry.loadGrammar(scope);
	let onigurumaTime = tokenize(onigurumaGrammar, lines);

	let onigasmGrammar  = await onigasmRegistry.loadGrammar(scope);
	let onigasmTime = tokenize(onigasmGrammar, lines);
	console.log();
	console.log(message);
	console.log('TOKENIZING ' + content.length + ' lines using grammar ' + scope);
	console.log(`Oniguruma: ${onigurumaTime} ms., Onigasm: ${onigasmTime} ms. (${Math.round(onigasmTime * 10 / onigurumaTime) / 10}x slower)`);
}

function loadGrammar(scopeName) {
	let grammarPath = null;
	if (scopeName === 'source.js') {
		grammarPath = path.resolve(__dirname, '..', 'test-cases/first-mate/fixtures/javascript.json');
	} else if (scopeName === 'source.ts') {
		grammarPath = path.resolve(__dirname, '..', 'test-cases/themes/syntaxes/TypeScript.tmLanguage.json');
	} else if (scopeName === 'source.css') {
		grammarPath = path.resolve(__dirname, '..', 'test-cases/first-mate/fixtures/css.json');
	} else if (scopeName === 'source.json') {
		grammarPath = path.resolve(__dirname, '..', 'test-cases/themes/syntaxes/JSON.json');
	} else {
		return null;
	}
	return Promise.resolve(main.parseRawGrammar(fs.readFileSync(grammarPath).toString(), grammarPath));
}

async function test() {
	await tokenizeFile(path.join(__dirname, 'large.js.txt'), 'source.js', 'jQuery v2.0.3');
	await tokenizeFile(path.join(__dirname, 'bootstrap.css.txt'), 'source.css', 'Bootstrap CSS v3.1.1'),
	await tokenizeFile(path.join(__dirname, 'vscode.d.ts.txt'), 'source.ts', 'vscode.d.ts');
	await tokenizeFile(path.join(__dirname, 'JavaScript.tmLanguage.json.txt'), 'source.ts', 'JSON');
	//await tokenizeFile(path.join(__dirname, 'bootstrap.min.css.txt'), 'source.css', 'Bootstrap CSS v3.1.1 minified')
	//await tokenizeFile(path.join(__dirname, 'large.min.js.txt'), 'source.js', 'jQuery v2.0.3 minified');
	//await tokenizeFile(path.join(__dirname, 'main.08642f99.css.txt'), 'source.css', 'Bootstrap with multi-byte minified')
};
test();


