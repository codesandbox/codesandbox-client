'use strict'

var columnify = require( 'columnify' )

function getExitCode( errsLength, warningsLength, maxErrors, maxWarnings ) {
	if ( errsLength > 0 ) {
		if ( typeof maxErrors === 'number' ) {
			if ( errsLength > maxErrors ) return 1
		}
		else return 1
	}

	if ( typeof maxWarnings === 'number' && warningsLength > maxWarnings ) return 1

	return 0
}

/**
 * @description outputs our messages, wipes errs/warnings if watching
 * @returns {Object | Function} returns process exit if not watching, or obj otherwise
 */
var done = function() {
	var warningsOrErrors = []
	var msg = ''
	var groupedByFile = {}
	var msgGrouped
	var group = this.config.groupOutputByFile
	var opts = this.config.reporterOptions || {}

	this.state.exitCode = getExitCode( this.cache.errs.length, this.cache.warnings.length, this.config.maxErrors, this.config.maxWarnings )

	// when testing we want to silence the console a bit, so we have the quiet option
	if ( !this.state.quiet ) {
		warningsOrErrors = [].concat( this.cache.errs, this.cache.warnings )
			.filter( function( str ) { return !!str } )

		// by default group warnings and errs by file
		if ( group && this.cache.messages ) {
			this.cache.messages.forEach( function( output ) {
				var file = output.file

				if ( groupedByFile.hasOwnProperty( file ) ) {
					groupedByFile[file].push( output )
				}
				else {
					groupedByFile[file] = [output]
				}
			} )

			// iterate over arrays of message objects
			// each array consists of all the errors and warnings for a file
			// columnify the errors/warnings and prefix them with the file name
			msgGrouped = Object.keys( groupedByFile ).map( function( key ) {
				return key + '\n' + columnify( groupedByFile[key], opts ) + '\n\n'
			} )
		}

		if ( warningsOrErrors.length ) {
			if ( group ) {
				msg += msgGrouped
			}
			else {
				msg = warningsOrErrors.join( '\n\n' ) + '\n\n'
			}
		}

		msg += this.cache.msg

		if ( msg ) {
			console.log( msg )
		}
	}

	// don't kill the linter if watch is watching
	// else there's no more to do, so exit the process
	if ( !this.state.watching ) {
		this.callback( this.state.exitCode || null )
		return process.exit( this.state.exitCode )
	}

	var returnValue = {
		errs: this.cache.errs.slice( 0 ),
		warnings: this.cache.warnings.slice( 0 ),
		exitCode: this.state.exitCode,
		msg: this.cache.msg
	}

	// if watching we reset the errors/warnings arrays
	this.cache.errs = []
	this.cache.warnings = []

	return returnValue
}

module.exports = done
