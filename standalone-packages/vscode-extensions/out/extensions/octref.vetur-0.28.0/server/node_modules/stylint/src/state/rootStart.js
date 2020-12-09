'use strict'

/**
 * @description check for keyframes, which have some special rules
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if keyframes starting, false if not
 */
var rootStart = function( line ) {
	if ( this.state.root || !this.state.testsEnabled ) { return }

	if ( line.indexOf( ':root' ) !== -1 ) {
		this.state.root = true
	}

	return this.state.root
}

module.exports = rootStart
