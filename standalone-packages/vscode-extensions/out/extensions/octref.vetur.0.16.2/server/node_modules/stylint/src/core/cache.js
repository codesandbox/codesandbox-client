var path = require( 'path' )

// the main cache object
var cache = {
	col: null, // column number for warning if applicable
	comment: '', // the current line comment on the line, if there is one
	customProperties: [], // an array of all declared mixins OR custom properties
	errs: [], // array of errors detected so far
	file: '', // curr filename we're testing
	files: [], // all files as an arr
	filesLen: 0, // # of files we're testing
	fileNo: 0, // curr # of filesLen we're on
	line: '', // curr line we're testing
	lineNo: 0, // curr line number we're testing
	msg: '', // the done message (55 warnings blah blah)
	messages: [], // array of message objects, containing all data needed to output
	origLine: '', // original line before stripping/trimming
	prevFile: '', // the previous file
	prevFileNo: 0, // prev file no
	prevLine: '', // the previous line
	rule: '', // rule name for current check
	sCache: { '0': [] }, // each key is an array of selectors in that context
	sortOrderCache: [], // we keep a context based arr of selectors here to check sort orde
	warnings: [], // array of the errors detected so far
	zCache: [] // array of z-index uses
}

module.exports = cache
