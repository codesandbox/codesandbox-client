'use strict'

/**
 * @description brittle function that just resets a bunch of caches when watch is running
 * @param {string} [newPath] if touching a new file, lint it
 * @returns {Function} kick off linter again
*/
var resetOnChange = function( newPath ) {
	this.state.path = newPath ? newPath : this.state.path
	this.cache.errs = []
	this.cache.warnings = []
	this.cache.alphaCache = []
	this.cache.rootCache = []
	this.cache.zCache = []
	this.cache.prevLine = ''
	this.cache.prevFile = ''
	this.cache.prevContext = 0
	this.cache.sCache = {}
	this.cache.sortOrderCache = []

	if ( this.state.watching ) {
		return this.read()
	}
}

module.exports = resetOnChange
