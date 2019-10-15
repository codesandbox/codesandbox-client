const { exec, spawn } = require('child_process');
const { argv } = require('yargs');
const username = require('username');

const id = argv._[0];

function spawnPromise(command, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args);

    p.stdout.on('data', data => {
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

  exec(
    `git fetch origin pull/${prId}/head:${branchName}`,
    (error, stdout, stderror) => {
      if (error) {
        throw error;
      }

      if (stderror) {
        throw new Error('Something went wrong:' + stderror);
      }

      console.info(stdout);

      spawnPromise('git', ['checkout', branchName])
        .then(() => {
          return spawnPromise('yarn', ['install']).then(() => {
            return spawnPromise('yarn', ['build:deps']);
          });
        })
        .then(() => {
          console.log('DONE!');
        })
        .catch(() => {});
    }
  );
}

if (id && Number(id)) {
  test(Number(id));
} else {
  throw new Error('You have to pass the ID of a PR, ex: yarn test:pr 1234');
}
