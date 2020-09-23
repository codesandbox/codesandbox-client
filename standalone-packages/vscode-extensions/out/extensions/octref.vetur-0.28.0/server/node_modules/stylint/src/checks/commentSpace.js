'use strict'

var commentRe = /\/\/ /


/**
 * @description // check for space after line comment
 * @param  {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @returns {boolean} true if comment found, false if not
 */
var commentSpace = function( line, origLine ) {
	if ( !this.state.hasComment ) { return }

	var spaceAfterComment = false
	var comment = this.cache.comment
	var index = origLine.indexOf( comment )

	// check for space after comment on it's own line,
	// if no space, return warning
	if ( commentRe.test( comment ) ) {
		spaceAfterComment = true
	}

	var emptyComment = /\/\/$/.test( comment )

	if ( this.state.conf === 'always' && spaceAfterComment === false && !emptyComment ) {
		this.msg( 'line comments require a space after //', index )
	}
	else if ( this.state.conf === 'never' && spaceAfterComment === true ) {
		this.msg( 'spaces after line comments disallowed', index )
	}

	return spaceAfterComment
}

module.exports = commentSpace
