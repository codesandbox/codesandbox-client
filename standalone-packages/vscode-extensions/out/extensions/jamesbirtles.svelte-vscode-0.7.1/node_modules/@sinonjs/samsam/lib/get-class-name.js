"use strict";

var valueToString = require("@sinonjs/commons").valueToString;

var re = /function (\w+)\s*\(/;

function getClassName(value) {
    if (value.constructor && "name" in value.constructor) {
        return value.constructor.name;
    }

    if (typeof value.constructor === "function") {
        var match = valueToString(value.constructor).match(re);
        if (match.length > 1) {
            return match[1];
        }
    }

    return null;
}

module.exports = getClassName;
