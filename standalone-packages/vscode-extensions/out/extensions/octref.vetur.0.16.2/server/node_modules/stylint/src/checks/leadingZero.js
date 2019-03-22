'use strict'

var decimalRe = /[^\d+](0+\.\d+)|[\s,\(](\.\d+)/i
var leadZeroRe = /[^\d+](0+\.\d+)/
var nonZeroRe = /[\s,\(](\.\d+)/


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean|undefined} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( !decimalRe.test( line ) ) { return }

	var leadZeroFound = leadZeroRe.exec( line )
	var leadZeroMissing = nonZeroRe.exec( line )

	if ( this.state.conf === 'always' && leadZeroMissing ) {
		this.msg( 'leading zeros for decimal points are required', leadZeroMissing.index )
	}
	else if ( this.state.conf === 'never' && leadZeroFound ) {
		this.msg( 'leading zeros for decimal points are unnecessary', leadZeroFound.index )
	}

	return leadZeroFound
}

module.exports = leadingZero
