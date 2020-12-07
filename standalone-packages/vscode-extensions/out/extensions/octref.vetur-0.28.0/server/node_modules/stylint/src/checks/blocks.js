'use strict'

var eqEndRe = /=$|=\s$/


/**
 * @description depending on settings, enforce of disallow @block when defining block vars
 * @param {string} [line] curr line being linted
 * @returns {boolean | undefined} true if @block found, false if not, undefined if we skip
 */
var blocks = function( line ) {
	if ( line.indexOf( '=' ) === -1 ) { return }

	var block
	var index = line.indexOf( '@block' )

	// if = ends the line and not a block var or hash
	if ( index === -1 && eqEndRe.test( line ) ) {
		block = false
	}
	else if ( index !== -1 ) {
		block = true
	}

	if ( this.state.conf === 'always' && block === false ) {
		this.msg( 'block variables must include @block', line.length )
	}
	else if ( this.state.conf === 'never' && block === true ) {
		this.msg( '@block is not allowed', index )
	}

	return block
}

module.exports = blocks
