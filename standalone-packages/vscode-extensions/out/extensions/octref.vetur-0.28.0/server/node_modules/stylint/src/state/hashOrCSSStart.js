'use strict'

var hashStartRe = /{$|{ $|(= {)/
var stripMixinsRe = /(\(.*\))/


/**
 * @description check for start of hash or @css block
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if hash or @css starting, false if not
 */
var hashStart = function( line ) {
	if ( this.state.hashOrCSS || !this.state.testsEnabled ) { return }
	var strippedLine = line.replace( stripMixinsRe, '' )

	// ex $colorsHash = { or @css {
	if ( !this.config.cssLiteral && line.indexOf( '@css' ) !== -1 ||
		hashStartRe.test( strippedLine ) && strippedLine.indexOf( '=' ) !== -1 ) {
		this.state.hashOrCSS = true
		this.state.testsEnabled = false
	}

	// for hash one liners (ex: $hash = { foo: 'bar' } )
	if ( this.state.hashOrCSS && line.indexOf( '}' ) !== -1 ) {
		this.state.hashOrCSS = false
		this.state.testsEnabled = true
	}

	return this.state.hashOrCSS
}

module.exports = hashStart
