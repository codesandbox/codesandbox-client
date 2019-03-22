'use strict'

var dollaRe = /\$[\-_]*\w/
var eqEndRe = /=$|=\s$/
var ignoreRe = /(\[.+\])|if|for|else|return|@require|@import|@media|@block|vendor-prefixes|calc|(=|= )$|{$/ // 3


/**
 * @description check that $ is used when declaring vars
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var prefixVarsWithDollar = function( line ) {
	if ( this.state.hashOrCSS || ignoreRe.test( line ) ) { return }

	var hasDolla = true

	// if line has a mixin, we need check each param for missing $
	// else we just check if = is present && $ is prefixing something
	if ( this.state.conf === 'always' ) {
		if ( line.indexOf( '=' ) !== -1 &&
			line.indexOf( '@block' ) === -1 &&
			!eqEndRe.test( line ) ) {

			if ( !dollaRe.test( line ) ) {
				hasDolla = false
			}
		}
	}
	// the never check is easier, since any $ means it fails
	else if ( this.state.conf === 'never' && !dollaRe.test( line ) ) {
		hasDolla = false
	}

	if ( this.state.conf === 'always' && hasDolla === false ) {
		this.msg( 'variables and parameters must be prefixed with the $ sign', 0 )
	}
	else if ( this.state.conf === 'never' && hasDolla === true ) {
		this.msg( '$ sign is disallowed for variables and parameters', 0 )
	}

	return hasDolla
}

module.exports = prefixVarsWithDollar
