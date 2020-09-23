'use strict'

// check for unnecessary tabs or whitespace at eol
var whitespaceRe = /[ \t]+$/
// anything BUT whitespace (we dont want to return false positives on empty lines)
var anythingElseRe = /[^ \t]/

/**
 * @description check for trailing whitespace
 * @param  {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @return {boolean} true if whitespace found, false if not
 */
var trailingWhitespace = function( line, origLine ) {
	var whitespace = false
	var hasWhitespace = whitespaceRe.exec( origLine )

	// not an empty line, with whitespace at the end
	if ( anythingElseRe.test( origLine ) && hasWhitespace ) {
		whitespace = true
	}

	if ( this.state.conf === 'never' && whitespace ) {
		this.msg( 'trailing whitespace', hasWhitespace.index )
	}

	return whitespace
}

module.exports = trailingWhitespace
