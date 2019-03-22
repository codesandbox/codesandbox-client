'use strict'


/**
 * @description check for end ofhash or @css block
 * @param {string} [line] curr line being linted
 * @returns {boolean} false if hash or css ending, true if not
 */
var hashEnd = function( line ) {
	if ( !this.state.hashOrCSS ) { return }

	// ex }, but only if we've already establish that we're in a hash'
	if ( line.indexOf( '}' ) !== -1 ) {
		this.state.hashOrCSS = false
		this.state.testsEnabled = true
	}

	return this.state.hashOrCSS
}

module.exports = hashEnd
