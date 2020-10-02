'use strict'

const unclosedExpression = 'Unclosed expression.'
const unclosedTemplateLiteral = 'Unclosed ES6 template literal.'
const unexpectedCharInExpression = 'Unexpected character %1.'

/**
 * Escape special characters in a given string, in preparation to create a regex.
 *
 * @param   {string} str - Raw string
 * @returns {string} Escaped string.
 */
const escapeStr = str => str.replace(/(?=[-[\](){^*+?.$|\\])/g, '\\')

const $_ES6_BQ = '`'

/*
 * Mini-parser for expressions.
 * The main pourpose of this module is to find the end of an expression
 * and return its text without the enclosing brackets.
 * Does not works with comments, but supports ES6 template strings.
 */
/**
 * @exports exprExtr
 */
const S_SQ_STR = /'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/.source
/**
 * Matches double quoted JS strings taking care about nested quotes
 * and EOLs (escaped EOLs are Ok).
 *
 * @const
 * @private
 */
const S_STRING = `${S_SQ_STR}|${S_SQ_STR.replace(/'/g, '"')}`
/**
 * Regex cache
 *
 * @type {Object.<string, RegExp>}
 * @const
 * @private
 */
const reBr = {}
/**
 * Makes an optimal regex that matches quoted strings, brackets, backquotes
 * and the closing brackets of an expression.
 *
 * @param   {string} b - Closing brackets
 * @returns {RegExp}
 */
function _regex(b) {
  let re = reBr[b]
  if (!re) {
    let s = escapeStr(b)
    if (b.length > 1) {
      s = s + '|['
    } else {
      s = /[{}[\]()]/.test(b) ? '[' : `[${s}`
    }
    reBr[b] = re = new RegExp(`${S_STRING}|${s}\`/\\{}[\\]()]`, 'g')
  }
  return re
}

/**
 * Searches the next backquote that signals the end of the ES6 Template Literal
 * or the "${" sequence that starts a JS expression, skipping any escaped
 * character.
 *
 * @param   {string}    code  - Whole code
 * @param   {number}    pos   - The start position of the template
 * @param   {string[]}  stack - To save nested ES6 TL count
 * @returns {number}    The end of the string (-1 if not found)
 */
function skipES6TL(code, pos, stack) {
  // we are in the char following the backquote (`),
  // find the next unescaped backquote or the sequence "${"
  const re = /[`$\\]/g
  let c
  while (((re.lastIndex = pos), re.exec(code))) {
    pos = re.lastIndex
    c = code[pos - 1]
    if (c === '`') {
      return pos
    }
    if (c === '$' && code[pos++] === '{') {
      stack.push($_ES6_BQ, '}')
      return pos
    }
    // else this is an escaped char
  }
  throw formatError(code, unclosedTemplateLiteral, pos)
}

// safe characters to precced a regex (including `=>`, `**`, and `...`)
const beforeReChars = '[{(,;:?=|&!^~>%*/'
const beforeReSign = beforeReChars + '+-'

// keyword that can preceed a regex (`in` is handled as special case)
const beforeReWords = [
  'case',
  'default',
  'do',
  'else',
  'in',
  'instanceof',
  'prefix',
  'return',
  'typeof',
  'void',
  'yield'
]

// Last chars of all the beforeReWords elements to speed up the process.
const wordsEndChar = beforeReWords.reduce((s, w) => s + w.slice(-1), '')

// Matches literal regex from the start of the buffer.
// The buffer to search must not include line-endings.
const RE_LIT_REGEX = /^\/(?=[^*>/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuy]*/

// Valid characters for JavaScript variable names and literal numbers.
const RE_JS_VCHAR = /[$\w]/

// Match dot characters that could be part of tricky regex
const RE_DOT_CHAR = /.*/g

/**
 * Searches the position of the previous non-blank character inside `code`,
 * starting with `pos - 1`.
 *
 * @param   {string} code - Buffer to search
 * @param   {number} pos  - Starting position
 * @returns {number} Position of the first non-blank character to the left.
 * @private
 */
function _prev(code, pos) {
  while (--pos >= 0 && /\s/.test(code[pos]));
  return pos
}

/**
 * Check if the character in the `start` position within `code` can be a regex
 * and returns the position following this regex or `start+1` if this is not
 * one.
 *
 * NOTE: Ensure `start` points to a slash (this is not checked).
 *
 * @function skipRegex
 * @param   {string} code  - Buffer to test in
 * @param   {number} start - Position the first slash inside `code`
 * @returns {number} Position of the char following the regex.
 *
 */
/* istanbul ignore next */
function skipRegex(code, start) {
  let pos = (RE_DOT_CHAR.lastIndex = start++)

  // `exec()` will extract from the slash to the end of the line
  //   and the chained `match()` will match the possible regex.
  const match = (RE_DOT_CHAR.exec(code) || ' ')[0].match(RE_LIT_REGEX)

  if (match) {
    const next = pos + match[0].length // result comes from `re.match`

    pos = _prev(code, pos)
    let c = code[pos]

    // start of buffer or safe prefix?
    if (pos < 0 || beforeReChars.includes(c)) {
      return next
    }

    // from here, `pos` is >= 0 and `c` is code[pos]
    if (c === '.') {
      // can be `...` or something silly like 5./2
      if (code[pos - 1] === '.') {
        start = next
      }
    } else {
      if (c === '+' || c === '-') {
        // tricky case
        if (
          code[--pos] !== c || // if have a single operator or
          (pos = _prev(code, pos)) < 0 || // ...have `++` and no previous token
          beforeReSign.includes((c = code[pos]))
        ) {
          return next // ...this is a regex
        }
      }

      if (wordsEndChar.includes(c)) {
        // looks like a keyword?
        const end = pos + 1

        // get the complete (previous) keyword
        while (--pos >= 0 && RE_JS_VCHAR.test(code[pos]));

        // it is in the allowed keywords list?
        if (beforeReWords.includes(code.slice(pos + 1, end))) {
          start = next
        }
      }
    }
  }

  return start
}

/**
 * Update the scopes stack removing or adding closures to it
 * @param   {array} stack - array stacking the expression closures
 * @param   {string} char - current char to add or remove from the stack
 * @param   {string} idx  - matching index
 * @param   {string} code - expression code
 * @returns {object} result
 * @returns {object} result.char - either the char received or the closing braces
 * @returns {object} result.index - either a new index to skip part of the source code,
 *                                  or 0 to keep from parsing from the old position
 */
function updateStack(stack, char, idx, code) {
  let index = 0

  switch (char) {
    case '[':
    case '(':
    case '{':
      stack.push(char === '[' ? ']' : char === '(' ? ')' : '}')
      break
    case ')':
    case ']':
    case '}':
      if (char !== stack.pop()) {
        panic(code, unexpectedCharInExpression.replace('%1', char), index)
      }

      if (char === '}' && stack[stack.length - 1] === $_ES6_BQ) {
        char = stack.pop()
      }

      index = idx + 1
      break
    case '/':
      index = skipRegex(code, idx)
  }

  return { char, index }
}

/**
 * Parses the code string searching the end of the expression.
 * It skips braces, quoted strings, regexes, and ES6 template literals.
 *
 * @function exprExtr
 * @param   {string}  code  - Buffer to parse
 * @param   {number}  start - Position of the opening brace
 * @param   {[string,string]} bp - Brackets pair
 * @returns {Object} Expression's end (after the closing brace) or -1
 *                            if it is not an expr.
 */
function exprExtr(code, start, bp) {
  const [openingBraces, closingBraces] = bp
  const offset = start + openingBraces.length // skips the opening brace
  const stack = [] // expected closing braces ('`' for ES6 TL)
  const re = _regex(closingBraces)

  re.lastIndex = offset // begining of the expression

  let end
  let match

  while ((match = re.exec(code))) {
    const idx = match.index
    const str = match[0]
    end = re.lastIndex

    // end the iteration
    if (str === closingBraces && !stack.length) {
      return {
        text: code.slice(offset, idx),
        start,
        end
      }
    }

    const { char, index } = updateStack(stack, str[0], idx, code)
    // update the end value depending on the new index received
    end = index || end
    // update the regex last index
    re.lastIndex = char === $_ES6_BQ ? skipES6TL(code, end, stack) : end
  }

  if (stack.length) {
    panic(code, unclosedExpression, end)
  }
}

/**
 * Creates a regex for the given string and the left bracket.
 * The string is captured in $1.
 *
 * @param   {ParserState} state  - Parser state
 * @param   {string} str - String to search
 * @returns {RegExp} Resulting regex.
 * @private
 */
function b0re(state, str) {
  const { brackets } = state

  const b0 = escapeStr(brackets[0])
  const b1 = escapeStr(str)

  return new RegExp(`(${b1})|${b0}`, 'g')
}

/**
 * Find the end of the attribute value or text node
 * Extract expressions.
 * Detect if value have escaped brackets.
 *
 * @param   {ParserState} state  - Parser state
 * @returns {number} Ending position
 * @private
 */
function expr(state) {
  const re = b0re(state, state.brackets[1])
  const node = {}

  const { unescape, expressions } = parseExpressions(state, re)

  if (node) {
    if (unescape) {
      node.unescape = unescape
    }
    if (expressions.length) {
      node.expressions = expressions
    }
  }

  return node
}

/**
 * Parse a text chunk finding all the expressions in it
 * @param   {ParserState} state  - Parser state
 * @param   {RegExp} re - regex to match the expressions contents
 * @returns {object} result containing the expression found, the string to unescape and the end position
 */
function parseExpressions(state, re) {
  const { data, brackets } = state
  const expressions = []
  let unescape, pos, match

  // Anything captured in $1 (closing quote or character) ends the loop...
  while ((match = re.exec(data))) {
    // ...else, we have an opening bracket and maybe an expression.
    pos = match.index
    if (data[pos - 1] === '\\') {
      unescape = match[0] // it is an escaped opening brace
    } else {
      const tmpExpr = exprExtr(data, pos, brackets)
      if (tmpExpr) {
        expressions.push(tmpExpr)
        re.lastIndex = tmpExpr.end
      }
    }
  }

  return {
    unescape,
    expressions
  }
}

function formatError(data, message, pos) {
  if (!pos) {
    pos = data.length
  }
  // count unix/mac/win eols
  const line = (data.slice(0, pos).match(/\r\n?|\n/g) || '').length + 1
  let col = 0
  while (--pos >= 0 && !/[\r\n]/.test(data[pos])) {
    ++col
  }
  return `[${line},${col}]: ${message}`
}

/**
 * Custom error handler can be implemented replacing this method.
 * The `state` object includes the buffer (`data`)
 * The error position (`loc`) contains line (base 1) and col (base 0).
 *
 * @param {string} msg   - Error message
 * @param {pos} [number] - Position of the error
 */
function panic(data, msg, pos) {
  const message = formatError(data, msg, pos)
  throw new Error(message)
}

function parse(data, state) {
  return expr({ ...state, data })
}

module.exports = parse
