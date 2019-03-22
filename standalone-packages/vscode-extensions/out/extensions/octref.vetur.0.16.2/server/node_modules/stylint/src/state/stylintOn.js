'use strict'


/**
 * @description toggle stylint back on
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if stylint on, false if not
 */
var stylintOn = function( line ) {
	if ( this.state.testsEnabled ) { return }

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf( '@stylint on' ) !== -1 ) {
		this.state.testsEnabled = true
	}

	return this.state.testsEnabled
}

module.exports = stylintOn
