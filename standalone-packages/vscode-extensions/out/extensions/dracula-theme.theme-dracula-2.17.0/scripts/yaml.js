'use strict';

const { Type, Schema, load } = require('js-yaml');

const withAlphaType = new Type('!alpha', {
    kind: 'sequence',
    construct: ([hexRGB, alpha]) => hexRGB + alpha,
    represent: ([hexRGB, alpha]) => hexRGB + alpha,
});

const schema = Schema.create([withAlphaType]);

async function loadYAML(file) {
    return load(file, { schema });
}

module.exports = {
    loadYAML,
};
