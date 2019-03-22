var net = require('net');
var repl = require('repl');
var util = require('util');
var Session = require('msgpack5rpc');
var colors = require('colors');


var socket = net.connect({port: 8124}, function() {
  var msg = 'Connected to the msgpack-rpc server.\n\n' +

            'Enter commands followed by arguments(json array) ' +
            'that will be evaluated and sent to the server.\n\n' +

            'If the command starts with the "=" character, it will be ' +
            'sent as a request. ' +
            'All other commands are sent as notifications.\n\n' +

            'Example: =add[1, 2] (send "add" request and print response)' +
            'Example: add [1, 2] (send "add" notification)\n\n';
  console.log(msg.cyan);

  var session = new Session();
  session.attach(socket, socket);

  session.on('notification', function(method, args) {
    console.log('Received notification'.blue,
                'method:'.yellow, method.yellow,
                ', args:'.yellow, util.inspect(args).yellow);
  });

  repl.start({
    prompt: 'command> ',
    input: process.stdin,
    output: process.stdout,
    eval: function(line, ctx, file, cb) {
      var result = /^([^\s]+)\s*(\[.*\])/.exec(line.slice(1));
      if (!result) {
        cb('Could not parse input'.red);
        return;
      }

      var method = result[1];
      var args;

      try {
        args = JSON.parse(result[2]);
      } catch (e) {
        cb('Could not parse arguments'.red);
        return;
      }

      var request = method[0] === '=';
      if (request) {
        session.request(method.slice(1), args, function(err, res) {
          if (err) {
            cb('Server error: '.red + err.yellow);
            return;
          }

          cb('Server response: '.green + util.inspect(res).yellow);
        });
      } else {
        session.notify(method, args);
      }
    }
  }).on('exit', function() {
    session.detach();
    socket.unref();
  });
});
