# VSCode TextMate [![Build Status](https://travis-ci.org/Microsoft/vscode-textmate.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-textmate) [![Coverage Status](https://coveralls.io/repos/github/Microsoft/vscode-textmate/badge.svg?branch=master)](https://coveralls.io/github/Microsoft/vscode-textmate?branch=master)

An interpreter for grammar files as defined by TextMate. Supports loading grammar files from JSON or PLIST format. Cross - grammar injections are currently not supported.

## Installing

```sh
npm install vscode-textmate
```

## Using

```javascript
var vsctm = require('vscode-textmate');
var grammarPaths = {
	'source.js': './javascript.tmbundle/Syntaxes/JavaScript.plist'
};

var registry = new vsctm.Registry({
	loadGrammar: function (scopeName) {
		var path = grammarPaths[scopeName];
		if (path) {
			return new Promise((c,e) => {
				fs.readFile(path, (error, content) => {
					if (error) {
						e(error);
					} else {
						var rawGrammar = vsctm.parseRawGrammar(content.toString(), path);
						c(rawGrammar);
					}
				});
			});
		}
		return null;
	}
});

// Load the JavaScript grammar and any other grammars included by it async.
registry.loadGrammar('source.js').then(grammar => {
	// at this point `grammar` is available...
	var lineTokens = grammar.tokenizeLine('function add(a,b) { return a+b; }');
	for (var i = 0; i < lineTokens.tokens.length; i++) {
		var token = lineTokens.tokens[i];
		console.log('Token from ' + token.startIndex + ' to ' + token.endIndex + ' with scopes ' + token.scopes);
	}
});

```

## Tokenizing multiple lines

To tokenize multiple lines, you must pass in the previous returned `ruleStack`.

```javascript
var ruleStack = null;
for (var i = 0; i < lines.length; i++) {
	var r = grammar.tokenizeLine(lines[i], ruleStack);
	console.log('Line: #' + i + ', tokens: ' + r.tokens);
	ruleStack = r.ruleStack;
}
```

## API doc

See [the main.ts file](./src/main.ts)

## Developing

* Clone the repository
* Run `npm install`
* Compile in the background with `npm run watch`
* Run tests with `npm test`
* Run benchmark with `npm run benchmark`
* Troubleshoot a grammar with `npm run inspect -- PATH_TO_GRAMMAR PATH_TO_FILE`

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


## License
[MIT](https://github.com/Microsoft/vscode-textmate/blob/master/LICENSE.md)

