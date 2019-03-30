const { it, describe } = require('mocha');
const assume = require('assume');
const kuler = require('./');

describe('kuler', function () {
  it('renders colors in the terminal', function () {
    console.log('     VISUAL INSPECTION');
    console.log('     '+ kuler('red').style('red'));
    console.log('     '+ kuler('black').style('#000'));
    console.log('     '+ kuler('white').style('#FFFFFF'));
    console.log('     '+ kuler('lime').style('AAFF5B'));
    console.log('     '+ kuler('violet').style('violetred 1'));
    console.log('     '+ kuler('purple').style('purple'));
    console.log('     '+ kuler('purple').style('purple'), 'correctly reset to normal color');
    console.log('     '+ kuler('green', 'green'));
  });

  it('supports color names and hex values', function () {
    assume(kuler('black', 'black')).equals(kuler('black', '#000'));
  })

  describe('#style', function () {
    it('has a style method', function () {
      assume(kuler('what').style).is.a('function');
    });
  });
});
