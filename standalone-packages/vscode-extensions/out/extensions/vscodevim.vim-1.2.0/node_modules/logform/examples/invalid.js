/* eslint no-unused-vars: 0 */
const { format } = require('../');

const invalid = format(function invalid(just, too, many, args) {
  return just;
});
