'use strict'

// was a tab used, at all
var tabs = /\t/
// check for 2 or more spaces (if hard tabs, shouldn't find anything)
var spaces = /( {2,})+/
// don't throw false positives if line ends in comment
var trimRightRe = /( |\t)+(\/\/)+.+$/gm


/**
 * @description check for mixed spaces and tabs
 * @param {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @returns {boolean} true if mixed, false if not
 */
var mixed = function( line, origLine ) {
	var trimRight = origLine.replace( trimRightRe, '' )
	var isMixed = false
	var indentPref = this.config.indentPref.expect || this.config.indentPref
	var isNum = typeof indentPref === 'number'

	// regexp obj or null
	var hasTabs = tabs.exec( trimRight )
	var hasSpaces = spaces.exec( trimRight )

	// if this isnt set to false then we're indenting with spaces,
	// so check against tabs
	if ( isNum ) {
		if ( hasTabs ) {
			isMixed = true
		}
	}
	// else you're a hard tab believer (go you)
	// look for 2 or more spaces
	else if ( hasSpaces ) {
		isMixed = true
	}

	if ( isMixed === true ) {
		var index = isNum ? hasTabs.index : hasSpaces.index
		this.msg( 'mixed spaces and tabs', index )
	}

	return isMixed
}

module.exports = mixed
