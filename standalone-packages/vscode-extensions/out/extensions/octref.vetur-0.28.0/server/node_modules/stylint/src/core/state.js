/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
var state = {
	conf: false, // config for currently running check ('always' || 'never' || etc)
	context: 0, // what is our level of nesting?
	exclude: [], // what files should be excluded
	exitCode: 0, // err or no err
	hasComment: false, // checks for // in a line
	hashOrCSS: false, // are we in a hash
	keyframes: false, // are we in @keyframes
	killSwitch: false, // are we over our warning limit
	openBracket: false, // is there an unclosed bracket
	path: '', // curr dir || file
	prevContext: 0, // save the last context as well
	root: false, // css4 root block, for declaring css4 variables
	severity: 'warning', // severity level for current check
	testsEnabled: true, // are we running linter tests
	quiet: false, // turn off console logs
	watching: false // are we watching
}

module.exports = state
