'use strict'

var keyframeRe = /@(?:-(?:[\w\d]+-)*)?keyframes/

/**
 * @description check for keyframes, which have some special rules
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if keyframes starting, false if not
 */
var keyframesStart = function( line ) {
	if ( this.state.keyframes || !this.state.testsEnabled ) { return }

	if ( keyframeRe.test( line ) ) {
		this.state.keyframes = true
	}

	return this.state.keyframes
}

module.exports = keyframesStart
