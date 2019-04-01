// ext.js

// load both interfaces
require("./read-core");
require("./write-core");

exports.createCodec = require("./codec-base").createCodec;
