'use strict'

// if semicolons on line, but not ending the line, prolly a one-liner
var semiTest = /;+(?!$)/gm


/**
 * @description disallow one-liners
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if one-liner found, false if not
 */
var stackedProperties = function( line ) {
	var oneLiner = false
	var trimmedLine = line.replace( /(( '.*')|( ".*")|('.*')|(".*"))+;*/, '' ).trim()
	var arr = this.splitAndStrip( ';', trimmedLine )

	if ( semiTest.test( trimmedLine ) || arr.length > 1 ) {
		oneLiner = true
	}

	if ( this.state.conf === 'never' && oneLiner === true ) {
		this.msg( 'avoid one liners. put properties on their own line' )
	}

	return oneLiner
}

module.exports = stackedProperties
