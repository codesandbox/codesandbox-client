'use strict'

// our stampit modules
var stampit = require( 'stampit' )
var fs = require( 'fs' )

// let there be light ( * )
// basically, with stampit we take a bunch of different objects
// and methods and compose them into one mega object, the app
// appropriately namespaced, with methods on the prototype,
// and `this` set consistently (ie, available throughout the app)
//
// basic app flow below
// init() -> read() -> parse() -> lint() -> done()
// init() -> watch() -> read() -> parse() -> lint() -> done()


/**
 * main stylint kickoff function
 * @param {string} path   [custom path if used programmatically]
 * @param {object} config [config if used programmatically]
 * @param {function} [callback] [a callback called just before exiting the process if not watching]
 * @return {Object} [the composed stylint object]
 */
var Stylint = function( path, config, callback ) {
	return stampit().compose(
		require( './src/core/' ),
		require( './src/checks/' ),
		require( './src/state/' ),
		stampit().enclose( function() {
			var pkg = null
			try {
				pkg = require( process.cwd() + '/package.json' )
			}
			catch ( err ) {
				// no output
			}

			// set safe path defaults
			if ( typeof path === 'undefined' ) {
				this.state.path = './'
			}
			else if ( path instanceof Array || typeof path === 'string' ) {
				this.state.path = path
			}

			// look for a stylintignore array
			// for ignoring specific files
			// first look in package.json
			// then look for .stylintignore in the main dir
			if ( pkg !== null &&
					typeof pkg.stylintignore !== 'undefined' &&
					pkg.stylintignore instanceof Array ) {
				this.state.exclude = pkg.stylintignore
			}
			else {
				try {
					var stylintIgnore = fs.readFileSync( process.cwd() + '/.stylintignore' )
					this.state.exclude = stylintIgnore
						.toString()
						.split( '\n' )
						.filter( function( d ) {
							return d
						} )
				}
				catch ( err ) {
					// do no-thing
				}
			}

			this.customConfig = typeof config === 'object' ? config : false
			this.callback = callback || function() {}
		} ).enclose( require( './src/core/init' ) )
	)
}

module.exports = Stylint
