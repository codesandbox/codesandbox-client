#!/usr/bin/env node

const ps = require('process')

const process = require('./commandLineProcessor')

const errors = process(ps.argv[2], ps.argv.slice(3))
if (errors.length > 0) {
	console.error(`Done with ${errors.length} error${errors.length === 1 ? '' : 's'}.`)
	ps.exit(1)
}