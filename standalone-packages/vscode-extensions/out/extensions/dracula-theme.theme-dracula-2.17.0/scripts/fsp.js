'use strict';

const fs = require('fs');
const util = require('util');

module.exports = {
    exists: util.promisify(fs.exists),
    mkdir: util.promisify(fs.mkdir),
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile),
};
