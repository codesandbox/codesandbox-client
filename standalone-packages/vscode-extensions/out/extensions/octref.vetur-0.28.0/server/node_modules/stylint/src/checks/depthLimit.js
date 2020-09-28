'use strict'

// check if using selector before we count depth
// definitely not the best way to do this,
var ampRe = /^(&|\/{1}|\.\.\/|~\/)/


/**
 * @description check nesting depth
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if nesting is too deep, false if not
 * @todo this is kinda not 100% reliable in it's current form, also could be refactors
 */
var depthLimit = function( line ) {
	var context = this.state.context
	var badNesting = false
	var limit = this.config.depthLimit ? this.config.depthLimit : 5

	// trim string and check if line starts with &
	// reduce context in that case
	// @TODO not really ideal
	if ( ampRe.test( line.trim() ) ) {
		context -= 1
	}

	if ( context > limit ) {
		badNesting = true
	}

	if ( badNesting === true ) {
		this.msg( 'selector depth greater than ' + limit )
	}

	return badNesting
}

module.exports = depthLimit
