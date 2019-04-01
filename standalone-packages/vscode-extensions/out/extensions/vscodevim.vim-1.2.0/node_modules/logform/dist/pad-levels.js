/* eslint no-unused-vars: 0 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('triple-beam'),
    configs = _require.configs,
    LEVEL = _require.LEVEL,
    MESSAGE = _require.MESSAGE;

var Padder = function () {
  function Padder() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { levels: configs.npm.levels };

    _classCallCheck(this, Padder);

    this.paddings = Padder.paddingForLevels(opts.levels, opts.filler);
    this.options = opts;
  }

  /**
   * Returns the maximum length of keys in the specified `levels` Object.
   * @param  {Object} levels Set of all levels to calculate longest level against.
   * @returns {Number} Maximum length of the longest level string.
   */


  _createClass(Padder, [{
    key: 'transform',


    /**
     * Prepends the padding onto the `message` based on the `LEVEL` of
     * the `info`. This is based on the behavior of `winston@2` which also
     * prepended the level onto the message.
     *
     * See: https://github.com/winstonjs/winston/blob/2.x/lib/winston/logger.js#L198-L201
     *
     * @param  {Info} info Logform info object
     * @param  {Object} opts Options passed along to this instance.
     * @returns {Info} Modified logform info object.
     */
    value: function transform(info, opts) {
      info.message = '' + this.paddings[info[LEVEL]] + info.message;
      if (info[MESSAGE]) {
        info[MESSAGE] = '' + this.paddings[info[LEVEL]] + info[MESSAGE];
      }

      return info;
    }
  }], [{
    key: 'getLongestLevel',
    value: function getLongestLevel(levels) {
      var lvls = Object.keys(levels).map(function (level) {
        return level.length;
      });
      return Math.max.apply(Math, _toConsumableArray(lvls));
    }

    /**
     * Returns the padding for the specified `level` assuming that the
     * maximum length of all levels it's associated with is `maxLength`.
     * @param  {String} level Level to calculate padding for.
     * @param  {String} filler Repeatable text to use for padding.
     * @param  {Number} maxLength Length of the longest level
     * @returns {String} Padding string for the `level`
     */

  }, {
    key: 'paddingForLevel',
    value: function paddingForLevel(level, filler, maxLength) {
      var targetLen = maxLength + 1 - level.length;
      var rep = Math.floor(targetLen / filler.length);
      var padding = '' + filler + filler.repeat(rep);
      return padding.slice(0, targetLen);
    }

    /**
     * Returns an object with the string paddings for the given `levels`
     * using the specified `filler`.
     * @param  {Object} levels Set of all levels to calculate padding for.
     * @param  {String} filler Repeatable text to use for padding.
     * @returns {Object} Mapping of level to desired padding.
     */

  }, {
    key: 'paddingForLevels',
    value: function paddingForLevels(levels) {
      var filler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

      var maxLength = Padder.getLongestLevel(levels);
      return Object.keys(levels).reduce(function (acc, level) {
        acc[level] = Padder.paddingForLevel(level, filler, maxLength);
        return acc;
      }, {});
    }
  }]);

  return Padder;
}();

/*
 * function padLevels (info)
 * Returns a new instance of the padLevels Format which pads
 * levels to be the same length. This was previously exposed as
 * { padLevels: true } to transports in `winston < 3.0.0`.
 */


module.exports = function (opts) {
  return new Padder(opts);
};

module.exports.Padder = module.exports.Format = Padder;