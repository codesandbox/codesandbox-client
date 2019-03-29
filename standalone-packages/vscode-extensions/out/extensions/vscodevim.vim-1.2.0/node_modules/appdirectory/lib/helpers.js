/* This module contains helpers for appdirectory
 *
 * instanceOf(object, constructor)
 *    - determines if an object is an instance of
 *      a constructor
 *    - ignores distinction between objects and
 *      literals - converts all literals into
 *      their object counterparts
 *    - returns a boolean
 */

var instanceOf = function(object, constructor) {
  // If object is a string/array/number literal,
  // turn it into a 'real' object
  if (typeof object != "object") {
    object = new object.constructor(object)
  }

  // Iterate up the object's prototype chain
  while (object != null) {
    if (object == constructor.prototype) {
      // We've found the correct prototype!
      return true
    }

    // Next prototype up
    object = Object.getPrototypeOf(object)
  }

  // Nothing found.
  return false
}

var formatStr = function(format) {
  // This function has been stolen liberally from 
  // http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function(match, number)  {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
  })
}

module.exports.instanceOf = instanceOf
module.exports.formatStr= formatStr