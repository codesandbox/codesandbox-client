'use strict'

var fs = require( 'fs' )
var async = require( 'async' )


/**
 * @description determines what files to read, creates an array of them, and passes it to be parsed
 * @param {string} [filepath] [option for manually passing in a filename]
 * @returns {Function} parse function
 */
var read = function( filepath ) {
	// if user passes in a glob, we forEach over them
	// and pass it into read() as filepath
	var path = filepath || this.state.path

	// if nothing passed in, default to linting the curr dir
	// here we get all the files to parse first, then we pass to app.parse
	if ( path === process.cwd() ) {
		return this.getFiles( this.state.path + '/**/*.styl' )
	}

	// if * is array, assume glob
	if ( path instanceof Array ) {
		return this.getFiles( this.state.path )
	}

	// else we'll have either a filename or dir name to work with
	// if dir we use the glob logic to return an array of files to test
	return fs.stat( path, function( err, stats ) {
		if ( !stats || err ) {
			throw Error( 'Stylint Error: No such file or dir exists!' )
		}

		// if this path matches any regex in the excludes array, we ignore
		var isExcludes = function( path ) {
			return this.state.exclude.some( function( exclude ) {
				if ( typeof exclude !== 'string' ) return false
				var excludeRegExp = new RegExp( exclude, 'm' )
				return excludeRegExp.test( path )
			} )
		}.bind( this )

		// you shall not pass
		if ( isExcludes( path ) ) return

		if ( stats.isFile() ) {
			this.cache.filesLen = 1
			this.cache.fileNo = 1
			this.cache.file = path
			this.cache.files = [path]
			return async.map( this.cache.files, fs.readFile, this.parse.bind( this ) )
		}
		if ( stats.isDirectory() ) {
			return this.getFiles( path + '/**/*.styl' )
		}
	}.bind( this ) )
}

module.exports = read
