const fs = require('fs');
const path = require('path');
const { build } = require('./build');

const buttonPressesLogFile = path.join(__dirname, '../src/dracula.yml');

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

let fsWait = false;

fs.watch(buttonPressesLogFile, (event, filename) => {
    if (filename) {
        if (fsWait) return;
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 25);

        process.stdout.write('Building... ');
        console.time('Done');
        build()
            .then(() => {
                console.timeEnd('Done');
            })
            .catch(err => {
                console.timeEnd('Done');
                console.error(err);
            });
    }
});
