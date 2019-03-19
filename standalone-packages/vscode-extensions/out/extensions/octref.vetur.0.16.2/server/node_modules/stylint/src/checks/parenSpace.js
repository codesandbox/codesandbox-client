'use strict'

var parensRe = /\(.+\)/
var parensBeginWithSpaceRe = /\(\s+/
var parensEndWithSpaceRe = /\s+\)+/
var parensBeginWithNoSpaceRe = /\(\S+/
var parensEndWithNoSpaceRe = /\S+\)+/


/**
 * @description checks for extra space when using parens
 * @param {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @return {boolean} true if placeholder used, false if not
 */
var parenSpace = function( line, origLine ) {
	if ( !parensRe.test( origLine ) ) { return }

	var hasStartSpace = parensBeginWithSpaceRe.exec( origLine )
	var hasEndSpace = parensEndWithSpaceRe.exec( origLine )
	var index
	var missingStartSpace
	var missingEndSpace

	if ( this.state.conf === 'always' && ( !hasStartSpace || !hasEndSpace ) ) {
		missingStartSpace = parensBeginWithNoSpaceRe.exec( origLine )
		missingEndSpace = parensEndWithNoSpaceRe.exec( origLine )
		index = missingStartSpace && missingStartSpace.index

		if ( !index && missingEndSpace ) {
			index = missingEndSpace.index
		}

		this.msg( '( param1, param2 ) is preferred over (param1, param2)', index )
	}
	else if ( this.state.conf === 'never' && ( hasStartSpace || hasEndSpace ) ) {
		index = hasStartSpace && hasStartSpace.index

		if ( !index && hasEndSpace ) {
			index = hasEndSpace.index
		}

		this.msg( '(param1, param2) is preferred over ( param1, param2 )', index )
	}

	return hasStartSpace && hasEndSpace
}

module.exports = parenSpace
