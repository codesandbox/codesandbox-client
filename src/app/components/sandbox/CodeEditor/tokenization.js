/**
 * Orginal from
 * https://github.com/alexandrudima/monaco-typescript/blob/1af97f4c0bc7514ea1f1ba62d9098aa883595918/src/tokenization.ts
 *
 * Modified to be more powerful
 * - (filePath aware)
 * - Changed to use `classifierCache`.
 */

export const Language = { TypeScript: 0, EcmaScript5: 1 };

export function createTokenizationSupport(language) {
  var classifier = window.ts.createClassifier(),
    bracketTypeTable =
      language === Language.TypeScript
        ? tsBracketTypeTable
        : jsBracketTypeTable,
    tokenTypeTable =
      language === Language.TypeScript ? tsTokenTypeTable : jsTokenTypeTable;
  return {
    getInitialState: function() {
      return new State({
        language: language,
        eolState: ts.EndOfLineState.None,
        inJsDocComment: false,
        lineNumber: 0,
        lineStartIndex: 0,
      });
    },
    tokenize: function(line, state, filePath) {
      return tokenize(
        bracketTypeTable,
        tokenTypeTable,
        classifier,
        state,
        line,
        filePath,
      );
    },
  };
}

var State = (function() {
  function State(config) {
    this.language = config.language;
    this.eolState = config.eolState;
    this.inJsDocComment = config.inJsDocComment;
    this.lineNumber = config.lineNumber;
    this.lineStartIndex = config.lineStartIndex;
  }
  State.prototype.clone = function() {
    return new State(this);
  };
  State.prototype.equals = function(other) {
    if (other === this) {
      return true;
    }
    if (!other || !(other instanceof State)) {
      return false;
    }
    return (
      this.eolState === other.eolState &&
      this.inJsDocComment === other.inJsDocComment &&
      this.lineNumber === other.lineNumber &&
      this.lineStartIndex === other.lineStartIndex
    );
  };
  return State;
})();
function tokenize(
  bracketTypeTable,
  tokenTypeTable,
  classifier,
  state,
  text,
  filePath,
) {
  // Create result early and fill in tokens
  var ret = {
    tokens: [],
    endState: new State({
      language: state.language,
      eolState: ts.EndOfLineState.None,
      inJsDocComment: false,
      lineNumber: state.lineNumber + 1,
      lineStartIndex: state.lineStartIndex + text.length + 1,
    }),
  };
  function appendFn(startIndex, type) {
    if (
      ret.tokens.length === 0 ||
      ret.tokens[ret.tokens.length - 1].scopes !== type
    ) {
      ret.tokens.push({
        startIndex: startIndex,
        scopes: type,
      });
    }
  }
  var isTypeScript = state.language === Language.TypeScript;
  if (isTypeScript) {
    // Note: we are still keeping the classiferCache in sync (from docCache)
    // But disabled using it here for pref + requirement to use it for hovers
    // WARNING: we might eventually use the js language to tokenize stuff like `hovers`
    // So probably only use this function for .ts files
    // Alternatively we could create a new language 'jshover' and use that for hovers etc
    return tokenizeTs(classifier, state, ret, text, filePath);
  }
  if (!isTypeScript && checkSheBang(0, text, appendFn)) {
    return ret;
  }
  var result = classifier.getClassificationsForLine(text, state.eolState, true),
    offset = 0;
  ret.endState.eolState = result.finalLexState;
  ret.endState.inJsDocComment =
    result.finalLexState === ts.EndOfLineState.InMultiLineCommentTrivia &&
    (state.inJsDocComment || /\/\*\*.*$/.test(text));
  for (var _i = 0, _a = result.entries; _i < _a.length; _i++) {
    var entry = _a[_i];
    var type;
    if (entry.classification === ts.TokenClass.Punctuation) {
      // punctions: check for brackets: (){}[]
      var ch = text.charCodeAt(offset);
      type = bracketTypeTable[ch] || tokenTypeTable[entry.classification];
      appendFn(offset, type);
    } else if (entry.classification === ts.TokenClass.Comment) {
      // comments: check for JSDoc, block, and line comments
      if (
        ret.endState.inJsDocComment ||
        /\/\*\*.*\*\//.test(text.substr(offset, entry.length))
      ) {
        appendFn(offset, isTypeScript ? 'comment.doc.ts' : 'comment.doc.js');
      } else {
        appendFn(offset, isTypeScript ? 'comment.ts' : 'comment.js');
      }
    } else {
      // everything else
      appendFn(offset, tokenTypeTable[entry.classification] || '');
    }
    offset += entry.length;
  }
  return ret;
}
var tsBracketTypeTable = Object.create(null);
tsBracketTypeTable['('.charCodeAt(0)] = 'delimiter.parenthesis.ts';
tsBracketTypeTable[')'.charCodeAt(0)] = 'delimiter.parenthesis.ts';
tsBracketTypeTable['{'.charCodeAt(0)] = 'delimiter.bracket.ts';
tsBracketTypeTable['}'.charCodeAt(0)] = 'delimiter.bracket.ts';
tsBracketTypeTable['['.charCodeAt(0)] = 'delimiter.array.ts';
tsBracketTypeTable[']'.charCodeAt(0)] = 'delimiter.array.ts';
var tsTokenTypeTable = Object.create(null);
tsTokenTypeTable[ts.TokenClass.Identifier] = 'identifier.ts';
tsTokenTypeTable[ts.TokenClass.Keyword] = 'keyword.ts';
tsTokenTypeTable[ts.TokenClass.Operator] = 'delimiter.ts';
tsTokenTypeTable[ts.TokenClass.Punctuation] = 'delimiter.ts';
tsTokenTypeTable[ts.TokenClass.NumberLiteral] = 'number.ts';
tsTokenTypeTable[ts.TokenClass.RegExpLiteral] = 'regexp.ts';
tsTokenTypeTable[ts.TokenClass.StringLiteral] = 'string.ts';
var jsBracketTypeTable = Object.create(null);
jsBracketTypeTable['('.charCodeAt(0)] = 'delimiter.parenthesis.js';
jsBracketTypeTable[')'.charCodeAt(0)] = 'delimiter.parenthesis.js';
jsBracketTypeTable['{'.charCodeAt(0)] = 'delimiter.bracket.js';
jsBracketTypeTable['}'.charCodeAt(0)] = 'delimiter.bracket.js';
jsBracketTypeTable['['.charCodeAt(0)] = 'delimiter.array.js';
jsBracketTypeTable[']'.charCodeAt(0)] = 'delimiter.array.js';
var jsTokenTypeTable = Object.create(null);
jsTokenTypeTable[ts.TokenClass.Identifier] = 'identifier.js';
jsTokenTypeTable[ts.TokenClass.Keyword] = 'keyword.js';
jsTokenTypeTable[ts.TokenClass.Operator] = 'delimiter.js';
jsTokenTypeTable[ts.TokenClass.Punctuation] = 'delimiter.js';
jsTokenTypeTable[ts.TokenClass.NumberLiteral] = 'number.js';
jsTokenTypeTable[ts.TokenClass.RegExpLiteral] = 'regexp.js';
jsTokenTypeTable[ts.TokenClass.StringLiteral] = 'string.js';
function checkSheBang(deltaOffset, line, appendFn) {
  if (line.indexOf('#!') === 0) {
    appendFn(deltaOffset, 'comment.shebang');
    return true;
  }
}
function tokenizeTs(classifier, state, ret, text, filePath) {
  var classifications = classifier.getClassificationsForLine(
    filePath,
    state.lineStartIndex,
    text,
  );
  // DEBUG classifications
  // console.log('%c'+text,"font-size: 20px");
  // console.table(classifications.map(c=> ({ str: c.string, cls: c.classificationTypeName,startInLine:c.startInLine })));
  var startIndex = 0;
  var lineHasJSX =
    filePath.endsWith('x') &&
    classifications.some(function(classification) {
      return (
        classification.classificationType ===
          ts.ClassificationType.jsxOpenTagName ||
        classification.classificationType ===
          ts.ClassificationType.jsxCloseTagName ||
        classification.classificationType ===
          ts.ClassificationType.jsxSelfClosingTagName ||
        classification.classificationType === ts.ClassificationType.jsxText ||
        classification.classificationType === ts.ClassificationType.jsxAttribute
      );
    });
  classifications.forEach(function(classifiedSpan) {
    ret.tokens.push({
      startIndex: startIndex,
      scopes:
        getStyleForToken(classifiedSpan, text, startIndex, lineHasJSX) + '.ts',
    });
    startIndex = startIndex + classifiedSpan.string.length;
  });
  return ret;
}
function getStyleForToken(
  token,
  /** Full contents of the line */
  line,
  /** Start position for this token in the line */
  startIndex,
  /** Only relevant for a `.tsx` file */
  lineHasJSX,
) {
  var ClassificationType = ts.ClassificationType;
  var nextStr; // setup only if needed
  var loadNextStr = function() {
    return (
      nextStr ||
      (nextStr = line
        .substr(startIndex + token.string.length)
        .replace(/\s+/g, ''))
    );
  };
  /** used for both variable and its puncutation */
  var decoratorClassification = 'punctuation.tag';
  switch (token.classificationType) {
    case ClassificationType.numericLiteral:
      return 'constant.numeric';
    case ClassificationType.stringLiteral:
      return 'string';
    case ClassificationType.regularExpressionLiteral:
      return 'constant.character';
    case ClassificationType.operator:
      return 'keyword.operator'; // The atom grammar does keyword+operator and I actually like that
    case ClassificationType.comment:
      return 'comment';
    case ClassificationType.className:
    case ClassificationType.enumName:
    case ClassificationType.interfaceName:
    case ClassificationType.moduleName:
    case ClassificationType.typeParameterName:
    case ClassificationType.typeAliasName:
      return 'variable-2';
    case ClassificationType.keyword:
      switch (token.string) {
        case 'string':
        case 'number':
        case 'void':
        case 'bool':
        case 'boolean':
          return 'variable-2';
        case 'static':
        case 'public':
        case 'private':
        case 'protected':
        case 'get':
        case 'set':
          return 'qualifier';
        case 'function':
        case 'var':
        case 'let':
        case 'const':
          return 'qualifier';
        case 'this':
          return 'constant.language';
        default:
          return 'keyword';
      }
    case ClassificationType.identifier:
      var lastToken = line.substr(0, startIndex).trim();
      if (token.string === 'undefined') {
        return 'keyword';
      } else if (lastToken.endsWith('@')) {
        return decoratorClassification;
      } else if (lastToken.endsWith('type') || lastToken.endsWith('extends')) {
        return 'variable-2';
      } else if (
        lastToken.endsWith('let') ||
        lastToken.endsWith('const') ||
        lastToken.endsWith('var')
      ) {
        return 'def';
      } else if (
        (loadNextStr().startsWith('(') ||
          nextStr.startsWith('=(') ||
          nextStr.startsWith('=function')) &&
        !lastToken.endsWith('.')
      ) {
        return 'entity.name.function';
      } else {
        return 'variable';
      }
    case ClassificationType.parameterName:
      return 'variable.parameter';
    case ClassificationType.punctuation:
      // Only get punctuation for JSX. Otherwise these would be operator
      if (
        lineHasJSX &&
        (token.string == '>' || token.string == '<' || token.string == '>')
      ) {
        // NOTE: would be good to get `meta.begin` vs. `meta.end` for tag matching
        return 'punctuation.definition.meta.tag'; // A nice blue color
      }
      if (token.string == '/') {
        return 'punctuation.definition.meta.end.tag'; // A nice blue color
      }
      if (token.string === '{' || token.string === '}')
        return 'delimiter.bracket';
      if (token.string === '(' || token.string === ')')
        return 'delimiter.parenthesis';
      if (token.string === '=>') return 'operator.keyword';
      if (token.string === '@') return decoratorClassification;
      return 'bracket';
    case ClassificationType.jsxOpenTagName:
    case ClassificationType.jsxCloseTagName:
    case ClassificationType.jsxSelfClosingTagName:
      return 'entity.name.tag';
    case ClassificationType.jsxAttribute:
      return 'entity.other.attribute-name';
    case ClassificationType.jsxAttributeStringLiteralValue:
      return 'string';
    case ClassificationType.whiteSpace:
    default:
      return null;
  }
}
