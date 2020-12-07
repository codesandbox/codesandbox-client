'use strict'


/**
 * @description check for keyframes end
 * @returns {boolean} false if keyframes ending, true if not
 */
var rootEnd = function() {
	if ( !this.state.root ) { return }

	if ( this.state.root && this.state.context === 0 ) {
		this.state.root = false
	}

	return this.state.root
}

module.exports = rootEnd
