'use strict'

var chalk = require( 'chalk' )


/**
 * @description format output message for console (default)
 * @param  {string} msg  error msg from one of the checks
 * @param  {string} done whether or not this is the last message to output
 * @param  {string} kill whether or not we're over one of our limits
 * @return {string | Function} either the formatted msg or done()
 */
var reporter = function( msg, done, kill ) {
	if ( done === 'done' ) {
		// total errors
		this.cache.msg = 'Stylint: ' + this.cache.errs.length + ' Errors.'
		this.cache.msg += this.config.maxErrors ? ' (Max Errors: ' + this.config.maxErrors + ')' : ''
		// total warnings
		this.cache.msg += '\nStylint: ' + this.cache.warnings.length + ' Warnings.'
		this.cache.msg += this.config.maxWarnings ? ' (Max Warnings: ' + this.config.maxWarnings + ')' : ''

		// if you set a max it kills the linter
		if ( kill === 'kill' ) {
			this.cache.msg += '\nStylint: Over Error or Warning Limit.'
		}
		else if ( this.cache.errs.length === 0 &&
			this.cache.warnings.length === 0 ) {
			this.cache.msg = ''
		}

		return this.done()
	}

	var file = chalk.underline( this.cache.file )
	var col = typeof this.cache.col === 'number' && this.cache.col > 0 ? this.cache.col : null

	var severity = this.state.severity.toLowerCase()
	severity = severity === 'warning' ?
		chalk.yellow( severity ) :
		chalk.red( severity )

	var rule = chalk.grey( this.cache.rule )

	// normal error or warning messages
	var defaultMessage = file + '\n' + this.cache.lineNo + ' ' + rule + ' ' + severity + ' ' + msg

	// if column data available, output slightly different line
	if ( typeof this.cache.col === 'number' && this.cache.col > -1 ) {
		defaultMessage = file + '\n' + this.cache.lineNo + ':' + this.cache.col + ' ' + rule + ' ' + severity + ' ' + msg
	}

	// weird syntax highlighting issue when this is inside a ternary
	var linePlusCol = this.cache.lineNo + ':' + col
	var messageObj = {
		file: file,
		lineData: col ? linePlusCol : this.cache.lineNo,
		severity: severity,
		description: msg,
		rule: rule
	}

	messageObj[file] = true
	this.cache.messages.push( messageObj )

	return defaultMessage
}

module.exports = reporter
