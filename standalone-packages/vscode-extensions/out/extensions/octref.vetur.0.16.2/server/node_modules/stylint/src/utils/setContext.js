'use strict'

/**
 * @description whitespace is the 1 tru god of stylus, set context based on that
 * @param {string} [line] curr line being linted
 * @returns {number} # of indents deep we are
*/
var setContext = function( line ) {
	var context = 0
	var indentPref = this.config.indentPref.expect || this.config.indentPref

	this.state.prevContext = this.state.context

	// no matter what our indentPref is,
	// try to get context as best as possible

	// get context if tabs
	if ( line.charAt( 0 ) === '\t' ) {
		context = /^\t+/.exec( line )[0].length
	}
	// get context if spaces
	else if ( line.charAt( 0 ) === ' ' ) {
		// set default if no indentPref set
		if ( typeof indentPref !== 'number' ) {
			indentPref = 2
		}

		context = /^\s+/.exec( line )[0].length / indentPref
	}

	return context
}

module.exports = setContext
