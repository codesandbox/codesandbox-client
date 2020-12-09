'use strict'


/**
 * @description checks that the # of spaces used is consistent
 * @returns {boolean} true if # of spaces correct, false if not
 */
var indentPref = function() {
	var spaces = this.state.conf
	var context = this.state.context

	if ( typeof spaces !== 'number' ) { return }

	var indentCorrect = true

	if ( context % 1 !== 0 ) {
		indentCorrect = false
	}

	// if spaces === 2 and context === 1.5 (meaning 1.5 levels... or 3 spaces)
	// then the index for the warning msg is 2 * 1.5, or 3 spaces
	var index = spaces * context

	if ( indentCorrect === false ) {
		this.msg( 'incorrect # of spaces for indent, use ' + spaces, index )
	}

	return indentCorrect
}

module.exports = indentPref
