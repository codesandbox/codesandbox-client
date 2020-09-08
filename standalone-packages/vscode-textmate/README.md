# VSCode TextMate [![Build Status](https://travis-ci.org/Microsoft/vscode-textmate.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-textmate) [![Coverage Status](https://coveralls.io/repos/github/Microsoft/vscode-textmate/badge.svg?branch=master)](https://coveralls.io/github/Microsoft/vscode-textmate?branch=master)

Интерпретатор для файлов грамматики, как это определено TextMate. Поддерживает загрузку файлов грамматики из формата JSON или PLIST. 
Внедрение кросс-грамматики в настоящее время не поддерживается.

## Установка

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

// Загрузите грамматику JavaScript и любые другие грамматики, включенные в нее async.
registry.loadGrammar('source.js').then(grammar => {
	// на данный момент доступна `грамматика` ...
	var lineTokens = grammar.tokenizeLine('function add(a,b) { return a+b; }');
	for (var i = 0; i < lineTokens.tokens.length; i++) {
		var token = lineTokens.tokens[i];
		console.log('Token from ' + token.startIndex + ' to ' + token.endIndex + ' with scopes ' + token.scopes);
	}
});

```

## Токенизация нескольких строк

Чтобы токенизировать несколько строк, вы должны передать предыдущий возвращенный `ruleStack`.

```javascript
var ruleStack = null;
for (var i = 0; i < lines.length; i++) {
	var r = grammar.tokenizeLine(lines[i], ruleStack);
	console.log('Line: #' + i + ', tokens: ' + r.tokens);
	ruleStack = r.ruleStack;
}
```

## API doc

См. [main.ts файл](./src/main.ts)

## Развитие

* Клонировать репозиторий
* Грузить `npm install`
* Компилировать в фоновом режиме с `npm run watch`
* Выполнить тесты с `npm test`
* Запустить бенчмарк с помощью `npm run benchmark`
* Устранить неполадки грамматики с помощью `npm run inspect -- PATH_TO_GRAMMAR PATH_TO_FILE`

## Кодекс поведения

Этот проект был принят на вооружение [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). Для получения дополнительной информации см. [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) или контакт [opencode@microsoft.com](mailto:opencode@microsoft.com) с любыми дополнительными вопросами или комментариями.


## License
[MIT](https://github.com/Microsoft/vscode-textmate/blob/master/LICENSE.md)

