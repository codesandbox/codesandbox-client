'use strict'

var resetOnFileChange = 0
var ignoreMeRe = /[.#${}=>&*]|\(.*\)|(&:)|(if)|(for)|(@block)|(@import)|(@media)|(@extends)|,$/
var ordering = require( '../data/ordering.json' )


/**
 * @description check that selector properties are sorted accordingly
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var sortOrder = function( line ) {
	// we don't alphabetize the root yet
	if ( this.state.context === 0 || this.state.hash ) {
		this.cache.sortOrderCache = []
		return
	}

	/*
	 * 1 we strip out mixins, and whitespace, and get the line as an array
	 * 2 we need a sorted array to compare our cache against
	 * 3 equals the custom sorting array via the config (or the ordering json)
	 * 4 assume sorted by default
	 * 5 alphabetical by default, if custom array we output a shorter msg
	 */
	var arr = this.splitAndStrip(
		new RegExp( /[\s\t,:]/ ), line.replace( /(\(.+\))/, '' )
	) // 1
	var sortedArr = [] // 2
	var orderingArr = [] // 3
	var sorted = true // 4
	var orderName = this.state.conf // 5

	if ( ignoreMeRe.test( arr[0] ) ) return

	if ( Array.isArray( this.state.conf ) ) {
		orderName = 'custom grouped'
	}

	// if current context switched, reset array
	if ( this.state.context !== this.state.prevContext ) {
		this.cache.sortOrderCache = []
	}

	// reset on file change
	if ( this.cache.file !== resetOnFileChange ) {
		this.cache.sortOrderCache = []
		resetOnFileChange = this.cache.file
	}

	// then we push the latest property to the cache
	this.cache.sortOrderCache.push( arr[0] )

	// create a copy of the cache now for comparison against
	sortedArr = this.cache.sortOrderCache.slice( 0 )

	// and then sort it (by default alphabetically)
	if ( this.state.conf === 'alphabetical' ) {
		sortedArr = sortedArr.sort()
	}
	// if not default, we can either use the grouped option
	// or a custom sorting order, specificed by a config file
	else if ( this.state.conf === 'grouped' || Array.isArray( this.state.conf ) ) {
		// use custom ordering if specified, or fall back to in-built grouped ordering
		orderingArr = Array.isArray( this.state.conf ) ? this.state.conf : ordering.grouped

		// iterate over our cache copy, and sort it according to our config
		sortedArr = sortedArr.sort( function( a, b ) {
			var aIndex = orderingArr.indexOf( a )
			var bIndex = orderingArr.indexOf( b )

			// allow properties that don't exist in ordering array to be last
			if ( bIndex < 0 ) {
				bIndex = orderingArr.length
			}

			// -1 if our 'sorted (not yet sorted)' array is not in the right order
			if ( aIndex < bIndex ) {
				return -1
			}
			// and 1 if it is
			else if ( bIndex < aIndex ) {
				return 1
			}
		} )
	}

	// now compare our two arrays
	// one sorted according to the config, and one as appears in the file
	if ( this.state.context === this.state.prevContext ) {
		// compare each value individually
		this.cache.sortOrderCache.forEach( function( val, i ) {
			// if any value doesn't match quit the forEach
			if ( sortedArr[i] !== this.cache.sortOrderCache[i] ) {
				sorted = false
				return
			}
		}.bind( this ) )
	}

	if ( sorted === false ) {
		this.msg( 'prefer ' + orderName + ' when sorting properties' )
	}

	return sorted
}

module.exports = sortOrder
