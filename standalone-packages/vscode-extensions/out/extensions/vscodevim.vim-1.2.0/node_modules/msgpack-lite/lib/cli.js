// cli.js

var fs = require("fs");
var Stream = require("stream");
var msgpack = require("../");

exports.CLI = CLI;

function help() {
  var cfgmap = {
    "M": "input MessagePack (default)",
    "J": "input JSON",
    "S": "input JSON(s) '\\n' separated stream",
    "m": "output MessagePack (default)",
    "j": "output JSON(s)",
    "h": "show help message",
    "1": "add a spacer for JSON output"
  };
  var keys = Object.keys(cfgmap);
  var flags = keys.join("");
  process.stderr.write("Usage: msgpack-lite [-" + flags + "] [infile] [outfile]\n");
  keys.forEach(function(key) {
    process.stderr.write("  -" + key + "  " + cfgmap[key] + "\n");
  });
  process.exit(1);
}

function CLI() {
  var input;
  var pass = new Stream.PassThrough({objectMode: true});
  var output;

  var args = {};
  Array.prototype.forEach.call(arguments, function(val) {
    if (val[0] === "-") {
      val.split("").forEach(function(c) {
        args[c] = true;
      });
    } else if (!input) {
      input = val;
    } else {
      output = val;
    }
  });

  if (args.h) return help();
  if (!Object.keys(args).length) return help();

  if (input === "-") input = null;
  if (output === "-") output = null;
  input = input ? fs.createReadStream(input) : process.stdin;
  output = output ? fs.createWriteStream(output) : process.stdout;

  if (args.j) {
    var spacer = args[2] ? "  " : args[1] ? " " : null;
    pass.on("data", function(data) {
      output.write(JSON.stringify(data, null, spacer) + "\n");
    });
  } else {
    // pass.pipe(msgpack.createEncodeStream()).pipe(output);
    pass.on("data", function(data) {
      output.write(msgpack.encode(data));
    });
  }

  if (args.J || args.S) {
    decodeJSON(input, pass, args);
  } else {
    input.pipe(msgpack.createDecodeStream()).pipe(pass);
  }
}

function decodeJSON(input, output, args) {
  var buf = "";
  input.on("data", function(chunk) {
    buf += chunk;
    if (args.S) sendStreaming();
  });
  input.on("end", function() {
    sendAll();
  });

  function sendAll() {
    if (!buf.length) return;
    output.write(JSON.parse(buf));
  }

  function sendStreaming(leave) {
    var list = buf.split("\n");
    buf = list.pop();
    list.forEach(function(str) {
      str = str.replace(/,\s*$/, "");
      if (!str.length) return;
      output.write(JSON.parse(str));
    });
  }
}