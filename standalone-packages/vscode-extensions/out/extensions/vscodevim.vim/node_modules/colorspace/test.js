describe('colorspace', function () {
  var colorspace = require('./');
  var assume = require('assume');

  it('returns a consistent color for a given name', function () {
    assume(colorspace('bigpipe')).equals('#20f95a');
    assume(colorspace('bigpipe')).equals('#20f95a');
    assume(colorspace('bigpipe')).equals('#20f95a');
  });

  it('tones the color when namespaced by a : char', function () {
    assume(colorspace('bigpipe:pagelet')).equals('#00FF2C');
  });
});
