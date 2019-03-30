/* eslint no-console:0 */

/**
 * Spawns an embedded neovim instance and returns Neovim API
 */

const cp = require('child_process');
const attach = require('../').attach;
// const inspect = require('util').inspect;

module.exports = (async function() {
  let proc;
  let socket;

  if (process.env.NVIM_LISTEN_ADDRESS) {
    socket = process.env.NVIM_LISTEN_ADDRESS;
  } else {
    proc = cp.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {
      cwd: __dirname,
    });
  }

  const nvim = await attach({ proc, socket });
  return nvim;
})();
