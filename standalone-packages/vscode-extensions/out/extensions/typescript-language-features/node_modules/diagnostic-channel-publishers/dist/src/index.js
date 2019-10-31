"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan = require("./bunyan.pub");
exports.bunyan = bunyan;
var consolePub = require("./console.pub");
exports.console = consolePub;
var mongodbCore = require("./mongodb-core.pub");
exports.mongodbCore = mongodbCore;
var mongodb = require("./mongodb.pub");
exports.mongodb = mongodb;
var mysql = require("./mysql.pub");
exports.mysql = mysql;
var pgPool = require("./pg-pool.pub");
exports.pgPool = pgPool;
var pg = require("./pg.pub");
exports.pg = pg;
var redis = require("./redis.pub");
exports.redis = redis;
var winston = require("./winston.pub");
exports.winston = winston;
function enable() {
    bunyan.enable();
    consolePub.enable();
    mongodbCore.enable();
    mongodb.enable();
    mysql.enable();
    pg.enable();
    pgPool.enable();
    redis.enable();
    winston.enable();
}
exports.enable = enable;
//# sourceMappingURL=index.js.map