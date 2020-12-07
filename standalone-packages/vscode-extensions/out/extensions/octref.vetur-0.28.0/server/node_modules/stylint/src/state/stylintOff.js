'use strict'


/**
 * @description toggle stylint off
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if stylint on, false if not
 */
var stylintOff = function( line ) {
	if ( !this.state.testsEnabled ) { return }

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf( '@stylint off' ) !== -1 ) {
		this.state.testsEnabled = false
	}

	return this.state.testsEnabled
}

module.exports = stylintOff
