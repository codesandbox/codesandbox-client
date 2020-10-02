'use strict'

var hexRe = /#(?:[0-9a-f]{3}){1,2}/im
var ignoreRe = /^\s*(?:#|.*=.*)/


/**
 * @description if we disallowed hex colors, check for them and return true if found
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if hex color found, false if not
 */
var colors = function( line ) {
	if ( ignoreRe.test( line ) || this.state.root ) { return }

	var hex = false
	var match = hexRe.exec( line )

	// so basically if we're using #hex colors outside of a var declaration
	if ( match !== null ) {
		hex = true
	}

	if ( hex === true ) {
		this.msg( 'hexidecimal color should be a variable', match.index )
	}

	return hex
}

module.exports = colors
