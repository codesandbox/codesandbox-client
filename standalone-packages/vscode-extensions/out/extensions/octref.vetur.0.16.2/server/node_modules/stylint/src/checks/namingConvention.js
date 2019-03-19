'use strict'

// the alphabet, uppers
var upperRe = /[A-Z]+/m
// BEM (http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
var bemRe = /^([$.#{:][${a-z]([-]?[${}a-z0-9]+)*(_{2}[${}a-z0-9]([-]?[${}a-z0-9]+)*)?((_[${}a-z0-9]([-]?[a-z0-9}]+)*){2})*)\b/m
// camelCase or CamelCase
var camelRe = /^[$#.{:]+([a-zA-Z]|[${}])+([a-z]|[${}])+(([.A-Z0-9])+[a-z ]+)+\b/m


/**
 * @description check for names-like-this vs namesLikeThis
 * or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if convention wrong, false if not
 */
var namingConvention = function( line ) {
	var arr = this.splitAndStrip( ' ', line )
	// determine if line should be tested at all
	var doWeTestRe = /^[${:]+/m
	var badConvention = false

	// test a wider range if strict is true
	if ( this.config.namingConventionStrict === true ) {
		doWeTestRe = /^[$#.{:]+/m
	}

	// only run checks if on a class, id, or variable
	if ( doWeTestRe.test( arr[0] ) && arr[0].indexOf( '::' ) === -1 ) {
		// if all lowercase we do nothing, if -, _ or uppercase found we check convention
		if ( upperRe.test( arr[0] ) ||
			arr[0].indexOf( '-' ) !== -1 ||
			arr[0].indexOf( '_' ) !== -1 ) {

			// check conventions
			// $varName
			if ( this.state.conf === 'camelCase' ) {
				// if no A-Z present, or - present, or _ present
				if ( arr[0].indexOf( '-' ) !== -1 ||
					arr[0].indexOf( '_' ) !== -1 ||
					!camelRe.test( arr[0] ) ) {
					badConvention = true
				}
			}
			// $var_name
			else if ( this.state.conf === 'lowercase_underscore' ) {
				// if no _ present, or - present, or A-Z present
				if ( arr[0].indexOf( '-' ) !== -1 ||
					arr[0].indexOf( '_' ) === -1 ||
					upperRe.test( arr[0] ) ) {
					badConvention = true
				}
			}
			// $var-name
			else if ( this.state.conf === 'lowercase-dash' ) {
				// if no - present, or _ present, or A-Z present
				if ( arr[0].indexOf( '-' ) === -1 ||
					arr[0].indexOf( '_' ) !== -1 ||
					upperRe.test( arr[0] ) ) {
					badConvention = true
				}
			}
			// $var__element
			else if ( this.state.conf === 'BEM' ) {
				// if A-Z or not following BEM specification
				if ( upperRe.test( arr[0] ) || !bemRe.test( arr[0] ) ) {
					badConvention = true
				}
			}
			// if not one of the defaults, assume custom regExp
			else if ( typeof this.state.conf === 'string' ) {
				var conventionRe = new RegExp( this.state.conf, 'm' )

				if ( !conventionRe.test( arr[0] ) ) {
					badConvention = true
				}
			}
		}
	}

	if ( badConvention === true ) {
		var index = line.indexOf( arr[0] )
		this.msg( 'preferred naming convention is ' + this.state.conf, index )
	}

	return badConvention
}

module.exports = namingConvention
