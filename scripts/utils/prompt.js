var rl = require('readline');

// Convention: "no" should be the conservative choice.
// If you mistype the answer, we'll always take it as a "no".
// You can control the behavior on <Enter> with `isYesDefault`.
module.exports = function (question, isYesDefault) {
  if (typeof isYesDefault !== 'boolean') {
    throw new Error('Provide explicit boolean isYesDefault as second argument.');
  }
  return new Promise(resolve => {
    var rlInterface = rl.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    var hint = isYesDefault === true ? '[Y/n]' : '[y/N]';
    var message = question + ' ' + hint + '\n';

    rlInterface.question(message, function(answer) {
      rlInterface.close();

      var useDefault = answer.trim().length === 0;
      if (useDefault) {
        return resolve(isYesDefault);
      }

      var isYes = answer.match(/^(yes|y)$/i);
      return resolve(isYes);
    });
  });
};
