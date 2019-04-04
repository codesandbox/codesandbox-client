<?php // phpcs:ignore
/**
 * PHP is fun
 *
 * Shades of purple is genius.
 *
 * @param String hello Hello.
 * @param Number count Count of hells said.
 * @param Boolean isBye True or False.
 * @return Boolean
 * @package SOP
 * @since 1.0.0
 */

// Header.
get_header();

$ahmad = 'Ahmad';
$awais = 'Awais';

// Display the page to admins and subscribers only.
if ( current_user_can( 'administrator' ) || current_user_can( 'subscriber' ) ) {
	echo 'HELLO!';
} else {
	wp_safe_redirect( 'https://VSCode.pro', 302 );
	exit;
}

// Footer.
get_footer();



/**
 * Small  Class.
 *
 * @since 1.0.0
 */
class Small {
	/**
	 * Name.
	 *
	 * @var String
	 * @since 1.0.0
	 */
	public static $name;

	/**
	 * Sum.
	 *
	 * @param Number $num1 First number.
	 * @param Number $num2 First number.
	 * @return Number
	 * @since 1.0.0
	 */
	public static function sum( $num1, $num2 ) {
		return $num1 + $num2;
	}
}
