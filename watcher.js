const { watch } = require('fs');

const watcher = watch(`${__dirname}/.git`);

const packagesWatcher = watcher(`${__dirname}/packages`);

watcher.on('change', (_, file) => {
  if (file === 'index.lock') {
    return;
  }
  /* eslint-disable */
  console.log(file);
});

packagesWatcher.on('change', (_, file) => {
  /* eslint-disable */
  console.log(file);
});
