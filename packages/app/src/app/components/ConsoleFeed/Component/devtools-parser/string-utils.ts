// Taken from the source of chrome devtools:
// https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/platform/utilities.js#L805-L1006

// Copyright 2014 The Chromium Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

export namespace String {
  /**
   * @param {string} string
   * @param {number} index
   * @return {boolean}
   */
  function isDigitAt(string: any, index: any) {
    var c = string.charCodeAt(index)
    return 48 <= c && c <= 57
  }

  /**
   * @param {string} format
   * @param {!Object.<string, function(string, ...):*>} formatters
   * @return {!Array.<!Object>}
   */
  function tokenizeFormatString(format: any, formatters: any) {
    var tokens: any = []
    var substitutionIndex = 0

    function addStringToken(str: any) {
      if (tokens.length && tokens[tokens.length - 1].type === 'string')
        tokens[tokens.length - 1].value += str
      else tokens.push({ type: 'string', value: str })
    }

    function addSpecifierToken(specifier: any, precision: any, substitutionIndex: any) {
      tokens.push({
        type: 'specifier',
        specifier: specifier,
        precision: precision,
        substitutionIndex: substitutionIndex
      })
    }

    var index = 0
    for (
      var precentIndex = format.indexOf('%', index);
      precentIndex !== -1;
      precentIndex = format.indexOf('%', index)
    ) {
      if (format.length === index)
        // unescaped % sign at the end of the format string.
        break
      addStringToken(format.substring(index, precentIndex))
      index = precentIndex + 1

      if (format[index] === '%') {
        // %% escape sequence.
        addStringToken('%')
        ++index
        continue
      }

      if (isDigitAt(format, index)) {
        // The first character is a number, it might be a substitution index.
        var number = parseInt(format.substring(index), 10)
        while (isDigitAt(format, index)) ++index

        // If the number is greater than zero and ends with a "$",
        // then this is a substitution index.
        if (number > 0 && format[index] === '$') {
          substitutionIndex = number - 1
          ++index
        }
      }

      var precision = -1
      if (format[index] === '.') {
        // This is a precision specifier. If no digit follows the ".",
        // then the precision should be zero.
        ++index
        precision = parseInt(format.substring(index), 10)
        if (isNaN(precision)) precision = 0

        while (isDigitAt(format, index)) ++index
      }

      if (!(format[index] in formatters)) {
        addStringToken(format.substring(precentIndex, index + 1))
        ++index
        continue
      }

      addSpecifierToken(format[index], precision, substitutionIndex)

      ++substitutionIndex
      ++index
    }

    addStringToken(format.substring(index))

    return tokens
  }


  /**
   * @param {string} format
   * @param {?ArrayLike} substitutions
   * @param {!Object.<string, function(string, ...):Q>} formatters
   * @param {!T} initialValue
   * @param {function(T, Q): T|undefined} append
   * @param {!Array.<!Object>=} tokenizedFormat
   * @return {!{formattedResult: T, unusedSubstitutions: ?ArrayLike}};
   * @template T, Q
   */
  export function format(
    format?: any,
    substitutions?: any,
    formatters?: any,
    initialValue?: any,
    append?: any,
    tokenizedFormat?: any
  ) {
    if (!format || !substitutions || !substitutions.length)
      return {
        formattedResult: append(initialValue, format),
        unusedSubstitutions: substitutions
      }

    function prettyFunctionName() {
      return (
        'String.format("' +
        format +
        '", "' +
        Array.prototype.join.call(substitutions, '", "') +
        '")'
      )
    }

    function warn(msg: any) {
      console.warn(prettyFunctionName() + ': ' + msg)
    }

    function error(msg: any) {
      console.error(prettyFunctionName() + ': ' + msg)
    }

    var result = initialValue
    var tokens =
      tokenizedFormat || tokenizeFormatString(format, formatters)
    var usedSubstitutionIndexes = {}

    for (var i = 0; i < tokens.length; ++i) {
      var token = tokens[i]

      if (token.type === 'string') {
        result = append(result, token.value)
        continue
      }

      if (token.type !== 'specifier') {
        error('Unknown token type "' + token.type + '" found.')
        continue
      }

      if (token.substitutionIndex >= substitutions.length) {
        // If there are not enough substitutions for the current substitutionIndex
        // just output the format specifier literally and move on.
        error(
          'not enough substitution arguments. Had ' +
            substitutions.length +
            ' but needed ' +
            (token.substitutionIndex + 1) +
            ', so substitution was skipped.'
        )
        result = append(
          result,
          '%' + (token.precision > -1 ? token.precision : '') + token.specifier
        )
        continue
      }

      usedSubstitutionIndexes[token.substitutionIndex] = true

      if (!(token.specifier in formatters)) {
        // Encountered an unsupported format character, treat as a string.
        warn(
          'unsupported format character \u201C' +
            token.specifier +
            '\u201D. Treating as a string.'
        )
        result = append(result, substitutions[token.substitutionIndex])
        continue
      }

      result = append(
        result,
        formatters[token.specifier](
          substitutions[token.substitutionIndex],
          token
        )
      )
    }

    var unusedSubstitutions = [] as any
    for (var i = 0; i < substitutions.length; ++i) {
      if (i in usedSubstitutionIndexes) continue
      unusedSubstitutions.push(substitutions[i])
    }

    return { formattedResult: result, unusedSubstitutions: unusedSubstitutions }
  }
}
