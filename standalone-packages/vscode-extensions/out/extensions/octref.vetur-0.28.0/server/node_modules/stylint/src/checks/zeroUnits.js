'use strict'

var aboveZeroRe = /\d0/
var hasUnitRe = /[ :]0+?(?=px|%|em|rem|v(h|w)|v(min|max)|ex|ch|mm|cm|in|pt|pc|mozmm)/
var relativeValRe = /line-height|font-size|font-weight/


/**
* @description check for 0unit
* @param {string} [line] current line being linted
* @returns {boolean | undefined} true if has units, else false, undefined if skipped
*/
var zeroUnits = function( line ) {
	// if in keyframes dont check
	// if no 0 on line dont check
	// if relative values like font-weight, dont check
	if ( this.state.keyframes ||
		line.indexOf( '0' ) === -1 ||
		relativeValRe.test( line ) ) {
		return
	}

	var isCorrect = true
	var always = this.state.conf === 'always'
	var never = this.state.conf === 'never'
	var hasUnit = hasUnitRe.exec( line )
	var aboveZero = aboveZeroRe.exec( line )

	// if config set to never and 0 is followed by any unit
	if ( never && hasUnit ) {
		isCorrect = false
	}
	// if config set to always, we need to do an extra check
	// to avoid throwing false positions on numbers like 50px
	else if ( always && ( !hasUnit && !aboveZero ) ) {
		isCorrect = false
	}

	if ( never && isCorrect === false ) {
		this.msg( '0 is preferred. Unit value is unnecessary', hasUnit.index )
	}
	else if ( always && isCorrect === false ) {
		this.msg( 'Including the unit value is preferred' )
	}

	return isCorrect
}

module.exports = zeroUnits
