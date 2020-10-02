'use strict'

var zeroRe = /((border)|(outline))+(:|\s)+0(?!-)/
var noneRe = /((border)|(outline))+(:|\s)+(none)+(?!-)/


/**
 * @description checks for border none or outline none
 * @param {string} [line] curr line being linted
 * @return {boolean} true if none used, false if not
 */
var none = function( line ) {
	if ( line.indexOf( 'border' ) === -1 &&
		line.indexOf( 'outline' ) === -1 ) {
		return
	}

	// false if nothing wrong with line
	// true if problem found with line, regardless of config
	var badSyntax = false

	// return true if border|outline is followed by a 0
	// enforce use of none
	if ( this.state.conf === 'always' &&
			zeroRe.test( line ) &&
			!noneRe.test( line ) ) {
		badSyntax = true
		this.msg( 'none is preferred over 0', line.indexOf( '0' ) )
	}
	// return true if border|outline is followed by none
	// enforce use of 0
	else if ( this.state.conf === 'never' &&
		noneRe.test( line ) &&
		!zeroRe.test( line ) ) {
		badSyntax = true
		this.msg( '0 is preferred over none', line.indexOf( 'none' ) )
	}

	return badSyntax
}

module.exports = none
