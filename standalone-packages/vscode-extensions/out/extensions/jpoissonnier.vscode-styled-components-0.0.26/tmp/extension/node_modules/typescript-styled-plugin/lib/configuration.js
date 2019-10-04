"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = {
    tags: ['styled', 'css', 'extend'],
    validate: true,
    lint: {
        emptyRules: 'ignore',
    },
};
exports.loadConfiguration = function (config) {
    var lint = Object.assign({}, exports.defaultConfiguration.lint, config.lint || {});
    return {
        tags: config.tags || exports.defaultConfiguration.tags,
        validate: typeof config.validate !== 'undefined' ? config.validate : exports.defaultConfiguration.validate,
        lint: lint,
    };
};
