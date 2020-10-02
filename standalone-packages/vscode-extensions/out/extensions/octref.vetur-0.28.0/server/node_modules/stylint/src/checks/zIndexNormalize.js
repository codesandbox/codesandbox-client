'use strict'


/**
* @description check for z-index values that aren't normalized
* @param {string} [line] current line being linted
* @returns {boolean} true if not normalized, false if normalized
*/
var zIndexNormalize = function( line ) {
	var badZIndex = false
	var arr = this.splitAndStrip( new RegExp( /[\s\t,:]/ ), line )
	var index = line.indexOf( 'z-index' )

	// ignore 0 or -1 values
	if ( arr[ arr.length - 1 ] === '-1' ||
		arr[ arr.length - 1 ] === '0' ) {
		return
	}

	if ( index !== -1 && arr[ arr.length - 1 ] % this.state.conf ) {
		badZIndex = true
	}

	if ( badZIndex === true ) {
		this.msg( 'this z-index value is not normalized', index )
	}

	return badZIndex
}

module.exports = zIndexNormalize
