const { spawn } = require('child_process');
const { argv } = require('yargs');
const username = require('username');

const id = argv._[0];

function spawnPromise(command, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args);

    p.stdout.on('data', data => {
      // eslint-disable-next-line
      console.log(data.toString());
    });

    p.stderr.on('data', data => {
      console.error(data.toString());
    });

    p.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

async function test(prId) {
  const branchName = `pr-${username.sync()}-${prId}`;

  Promise.resolve()
    .then(() => spawnPromise('git', ['checkout', 'main']))
    .then(() => spawnPromise('git', ['branch', '-D', branchName]))
    .catch(() => {
      /* Do not care if this fails */
    })
    .then(() => spawnPromise('git', ['pull']))
    .then(() =>
      spawnPromise('git', [
        'fetch',
        'origin',
        `pull/${prId}/head:${branchName}`,
      ])
    )
    .then(() => spawnPromise('git', ['checkout', branchName]))
    .then(() => spawnPromise('git', ['merge', 'main']))
    .then(() => spawnPromise('yarn', ['install']))
    .then(() => spawnPromise('yarn', ['build:deps']))
    .then(() => spawnPromise('yarn', ['typecheck']))
    .then(() => spawnPromise('yarn', ['lint']))
    .catch(() => {
      console.error(
        'Something wrong happened building the deps, maybe missing a new package added. Please install and run build:deps manually before continuing'
      );
    });
}

if (id && Number(id)) {
  test(Number(id));
} else {
  throw new Error('You have to pass the ID of a PR, ex: yarn test:pr 1234');
}
