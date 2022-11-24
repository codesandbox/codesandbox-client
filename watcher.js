const { watch } = require('fs');

const watcher = watch(`${__dirname}/.git`);

watcher.on('change', (_, file) => {
  if (file === 'index.lock') {
    return;
  }
  /* eslint-disable */
  console.log(file);
});
