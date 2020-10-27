'use strict'


/**
 * @description basically just sets the severity and routes output to the reporter
 * @param {string} [str] outputted string from one of the checks
 * @param {number} [column] column number if applicable to the check
 * @returns {Function} push formatted output to appropriate array
*/
var msg = function( str, column ) {
	// determine which group the msg belongs to
	var arr = this.state.severity === 'Warning' ? this.cache.warnings : this.cache.errs
	this.cache.col = column

	// push the final output
	return arr.push( this.reporter( str ) )
}

module.exports = msg
