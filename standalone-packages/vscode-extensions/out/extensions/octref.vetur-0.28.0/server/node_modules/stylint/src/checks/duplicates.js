'use strict'

var ignoreRe = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)|,$/
var lastFile = ''


/**
 * @description check that selector properties are sorted alphabetically
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if dupe found, false if not
 */
var duplicates = function( line ) {
	var arr = this.splitAndStrip( new RegExp( /[\s\t]/ ), line )
	var dupe = false
	var dupeIndex
	var origFile

	// if root check not global, obliterate cache on each new file
	if ( !this.config.globalDupe &&
		lastFile !== this.cache.file ) {
		this.cache.sCache = {}
		lastFile = this.cache.file
	}

	// if cache for curr context doesn't exist yet (or was obliterated), make one
	if ( typeof this.cache.sCache[ this.state.context ] === 'undefined' ) {
		this.cache.sCache[ this.state.context ] = []
	}

	// if context changes, reset arrays except root
	// basically, root can persist across files potentially
	// caches above root only persist as long as they are within their context
	if ( this.state.context !== this.state.prevContext ) {
		Object.keys( this.cache.sCache ).forEach( function( val ) {
			// string cause key
			if ( val === '0' ) { return }
			this.cache.sCache[val] = []
		}.bind( this ) )
	}

	// if not in a list
	// and not ignored syntax
	// and property exists in the array already
	// then dupe
	if ( line.indexOf( ',' ) === -1 &&
		this.cache.prevLine.indexOf( ',' ) === -1 &&
		!ignoreRe.test( line ) ) {

		// -1 if no dupe found
		dupeIndex = this.cache.sCache[this.state.context].indexOf( arr[0] )

		// if match found at right context, is dupe
		if ( dupeIndex !== -1 ) {
			dupe = true
		}

		// push selector (and file name) to cache
		this.cache.sCache[this.state.context].push( arr[0], this.cache.file )
	}

	if ( dupe === true ) {
		// location of original selector use if global dupe on
		origFile = this.cache.sCache[this.state.context][dupeIndex + 1]

		// this.msg( 'duplicate property or selector, consider merging' )
		if ( !this.config.globalDupe ) {
			this.msg(
				'duplicate property or selector, consider merging'
			)
		}
		else {
			this.msg(
				'duplicate property or selector, consider merging\nsee file: ' + origFile + ' for the original selector'
			)
		}
	}

	return dupe
}

module.exports = duplicates
