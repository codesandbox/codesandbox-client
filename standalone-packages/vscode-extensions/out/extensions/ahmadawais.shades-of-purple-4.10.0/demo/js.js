/**
 * JavaScript is fun
 *
 * Shades of purple is genius.
 *
 * @param String hello Hello.
 * @param Number count Count of hells said.
 * @param Boolean isBye True or False.
 * @return Boolean
 * @since 1.0.0
 */

// String.
const hello = 'Hey, hello there there there there';
console.log('hello', hello);

// Class.
class vsc extends React.Component {}
console.log(vsc);

// Const.
const ahmad = function nameAhmad() {
	return 'Ahmad';
};
ahmad();

// Let.
let awais = () => 'Awais';
console.log(awais);

/**
 * Maedah's Function.
 *
 * @param String name
 */
function maedah(name) {
	return name;
}

maedah('Maedah Batool');

// Regex.
const coursePlatformURL = new RegExp('/' + window.location.host + '/');
console.log('coursePlatformURL', coursePlatformURL);

import { btnBarSvgSpeed } from './constants';

/**
 *  Angle increment.
 *
 * — 360/(total speed values).
 * — 360/6 = 60.
 */
export const speedAngles = {
	'1': '0',
	'1.25': '60',
	'1.5': '120',
	'1.75': '180',
	'2': '240',
	'0.75': '300'
};

/**
 * Speed SVG CSS.
 *
 * @param Number Angle to rotate the SVG.
 */
export const speedCSS = (one, two, three) => {
	btnBarSvgSpeed.css({
		transform: 'rotate(' + one + 'deg)',
		transform: 'rotate(' + two + 'deg)',
		transform: 'rotate(' + three + 'deg)'
	});
};

// Conditionals.
if (ahmad) {
	console.log('Ahmad loves open source');
} else if (awais) {
	console.log('Awais is making 🦄 Shades of Purple');
} else {
	console.log(`${ hello } In the middle of no where!`);
}
