'use strict'


/**
 * @description runs tests according to config ( or all if strict is true )
 * @return {Function | undefined} undefined if just calling the method, function is linting over
 */
var lint = function() {
	var method = ''
	var checks = Object.getPrototypeOf( this ).lintMethods
	var maxErrs = typeof this.config.maxErrors === 'number' ? this.config.maxErrors : false
	var maxWarnings = typeof this.config.maxWarnings === 'number' ? this.config.maxWarnings : false

	for ( method in checks ) {
		if ( checks.hasOwnProperty( method ) ) {
			if ( this.config[method] ) {
				// save config rule name for use in reporters
				this.cache.rule = method
				// state.conf === 'always' || 'never' || etc
				this.state.conf = this.config[method].expect || this.config[method]
				// state.severity === 'error' || 'warning'
				this.state.severity = this.config[method].error ? 'Error' : 'Warning'
				// run the actual check against the line
				checks[method].call( this, this.cache.line, this.cache.origLine )
				// if check puts us over either limit, kill stylint
				if ( maxErrs &&
					this.cache.errs.length > this.config.maxErrors ) {
					return this.reporter( '', 'done', 'kill' )
				}
				if ( maxWarnings &&
					this.cache.warnings.length > this.config.maxWarnings ) {
					return this.reporter( '', 'done', 'kill' )
				}
			}
		}
	}

	// save our curr context so we can use it next time
	// this.cache.prevFile = this.cache.file
	this.cache.prevLine = this.cache.line
}

module.exports = lint
