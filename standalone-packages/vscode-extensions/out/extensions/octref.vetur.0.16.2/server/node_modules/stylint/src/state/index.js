var stampit = require( 'stampit' )

// group together all the functions that determine state in this folder
var stateMethods = stampit().methods( {
	hashOrCSSEnd: require( './hashOrCSSEnd' ),
	hashOrCSSStart: require( './hashOrCSSStart' ),
	keyframesEnd: require( './keyframesEnd' ),
	keyframesStart: require( './keyframesStart' ),
	startsWithComment: require( './startsWithComment' ),
	rootEnd: require( './rootEnd' ),
	rootStart: require( './rootStart' ),
	stylintOff: require( './stylintOff' ),
	stylintOn: require( './stylintOn' )
} )

module.exports = stateMethods
