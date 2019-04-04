'use strict'

var chokidar = require( 'chokidar' )

/**
 * @description kicks off the app. sets up config and kicks off reading the files
 * @return {Function} kick off linter on each change
 */
var watch = function() {
	this.watcher = chokidar.watch( this.state.path )

	// initial watch msg
	this.watcher.on( 'ready', function() {
		this.state.watching = true
		return console.log( 'Watching: ', this.state.path, ' for changes.' )
	}.bind( this ) )

	// listen for changes, update 'dir' to curr file, wipe all the caches, do somethin
	this.watcher.on( 'change', this.resetOnChange.bind( this ) )
}

module.exports = watch
