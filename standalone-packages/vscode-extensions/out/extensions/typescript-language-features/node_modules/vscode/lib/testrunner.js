/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var paths = require("path");
var glob = require("glob");
// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implementt he method statically
var tty = require('tty');
if (!tty.getWindowSize) {
    tty.getWindowSize = function () { return [80, 75]; };
}
var Mocha = require("mocha");
var mocha = new Mocha({
    ui: 'tdd',
    useColors: true
});
function configure(opts) {
    mocha = new Mocha(opts);
}
exports.configure = configure;
function run(testsRoot, clb) {
    // Enable source map support
    require('source-map-support').install();
    // Glob test files
    glob('**/**.test.js', { cwd: testsRoot }, function (error, files) {
        if (error) {
            return clb(error);
        }
        try {
            // Fill into Mocha
            files.forEach(function (f) { return mocha.addFile(paths.join(testsRoot, f)); });
            // Run the tests
            mocha.run(function (failures) {
                clb(null, failures);
            });
        }
        catch (error) {
            return clb(error);
        }
    });
}
exports.run = run;
