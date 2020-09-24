'use strict'

// if , is present on line and its not followed by a space
var noSpaceRe = /,\S/
var withSpaceRe = /,\s/
var removeQuotesRe = /(["'])(?:(?=(\\?))\2.)*?\1/g

/**
 * @description if set to always, enforces spaces after commas. if set to never, disallows spaces
 * @param {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @returns {boolean} true if space missing, false if not
 */
var commaSpace = function( line, origLine ) {
	// conditions where testing isn't needed.
	// 1: no comma on line at all
	// 2: comma ends the line, as in a list
	// 3: comma is
	if ( origLine.indexOf( ',' ) === -1 ||
		origLine.trim().indexOf( ',' ) === origLine.length - 1 ) {
		return
	}

	// just strip content between quotes, leave rest of syntax intact
	// this is so we don't get false positives with , in strings
	var trimmedLine = origLine.replace( removeQuotesRe, '""' ).trim()

	var noSpace = noSpaceRe.exec( trimmedLine )
	var hasSpace = withSpaceRe.exec( trimmedLine )

	// if spaces should be follow commas, but there is no space on the line
	if ( this.state.conf === 'always' && noSpace ) {
		this.msg( 'commas must be followed by a space for readability', noSpace.index )
	}
	// if spaces should not be followed by a comma, but there are spaces anyway
	else if ( this.state.conf === 'never' && hasSpace ) {
		this.msg( 'spaces after commas are not allowed', hasSpace.index )
	}

	return !!( noSpace && !hasSpace )
}

module.exports = commaSpace
