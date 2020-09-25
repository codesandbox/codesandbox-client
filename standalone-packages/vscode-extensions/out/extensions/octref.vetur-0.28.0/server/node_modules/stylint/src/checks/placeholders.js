'use strict'

var extendRe = /(@extend)+s?\s/


/**
 * @description check that @extend is only used with a $placeholderVar
 * @param {string} [line] curr line being linted
 * @return {boolean} true if placeholder used, false if not
 */
var placeholders = function( line ) {
	if ( line.indexOf( '@extend' ) === -1 ) { return }

	var placeholder = false

	// stylus supports multiple, mixed extends and optional extends
	// so lets pull them out of the line and check individually
	// @extends .biz !optional, $extendable !optional =>
	// ['.biz !optional', '$extendable !optional']
	var extendArr = line.replace( extendRe, '' ).split( ',' )

	// if any item in the list is not a placeholder, fail
	placeholder = extendArr.every( function( line ) {
		var trimmed = line.trim()
		return trimmed.substr( 0, 1 ) === '$'
	} )

	if ( this.state.conf === 'always' && placeholder === false ) {
		this.msg( 'always use a placeholder variable when extending' )
	}
	else if ( this.state.conf === 'never' && placeholder === true ) {
		this.msg( 'placeholder variables are disallowed' )
	}

	return placeholder
}

module.exports = placeholders
