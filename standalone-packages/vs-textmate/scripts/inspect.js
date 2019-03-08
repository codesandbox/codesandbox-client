if (process.argv.length < 4) {
	console.log('usage: node index.js <mainGrammarPath> [<additionalGrammarPath1> ...] <filePath>');
	process.exit(0);
}

var GRAMMAR_PATHS = process.argv.slice(2, process.argv.length - 1);
var FILE_PATH = process.argv[process.argv.length - 1];

process.env['VSCODE_TEXTMATE_DEBUG'] = true;

var fs = require('fs');
var main = require('../out/main');

var Registry = main.Registry;
var registry = new Registry();
var grammarPromise = null;
for (let path of GRAMMAR_PATHS) {
	console.log('LOADING GRAMMAR: ' + path);
	var content = fs.readFileSync(path).toString();
	var rawGrammar = main.parseRawGrammar(content, path);
	var g = registry.addGrammar(rawGrammar);
	grammarPromise = grammarPromise || g;
}
grammarPromise.then(grammar => {
	var fileContents = fs.readFileSync(FILE_PATH).toString();
	var lines = fileContents.split(/\r\n|\r|\n/);
	var ruleStack = null;
	var lastElementId = 0;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		console.log('');
		console.log('');
		console.log('===========================================');
		console.log('TOKENIZING LINE ' + (i + 1) + ': |' + line + '|');

		var r = grammar.tokenizeLine(line, ruleStack);

		console.log('');

		var stackElement = r.ruleStack;
		var cnt = 0;
		while (stackElement) {
			cnt++;
			stackElement = stackElement._parent;
		}

		console.log('@@LINE END RULE STACK CONTAINS ' + cnt + ' RULES:');
		stackElement = r.ruleStack;
		var list = [];
		while (stackElement) {
			if (!stackElement._instanceId) {
				stackElement._instanceId = (++lastElementId);
			}
			var ruleDesc = grammar._ruleId2desc[stackElement._ruleId]
			if (!ruleDesc) {
				list.push('  * no rule description found for rule id: ' + stackElement._ruleId);
			} else {
				list.push('  * ' + ruleDesc.debugName + '  -- [' + ruleDesc.id + ',' + stackElement._instanceId + '] "' + stackElement._scopeName + '"');
			}
			stackElement = stackElement._parent;
		}
		list.reverse();
		console.log(list.join('\n'));

		ruleStack = r.ruleStack;
	}
});