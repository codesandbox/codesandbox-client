'use strict'

/**
 * @description used in conjunction with the valid check (for valid html)
 * @param {string} [prop] the property to prepend prefixes to
 * @param {string} [html] the html we're checking against (from valid.json)
 * @param {Object} [valid] the valid.json object
 * @returns {boolean} true if at least one match found, false if not
*/
var checkPseudo = function( prop, html, valid ) {
	return valid.pseudo.some( function( pseudo ) {
		return prop === html + pseudo
	} )
}

module.exports = checkPseudo
