var net = require('net');
var Session = require('msgpack5rpc');
var has = require('has');


var handlers = {
  add: function(a, b) { return a + b; },
  sub: function(a, b) { return a - b; },
  mul: function(a, b) { return a * b; },
  div: function(a, b) { return a / b; }
};


var server = net.createServer(function(socket){
  session = new Session();
  session.attach(socket, socket);

  console.log('Client connected');

  session.on('request', function(method, args, resp) {
    if (!has(handlers, method)) {
      resp.send('cannot handle the "' + method + '" method', true);
      return;
    }

    resp.send(handlers[method].apply(null, args));
  });

  session.on('notification', function(method, args) {
    session.notify('received ' + method, args);
  });

  session.on('detach', function() {
    console.log('Client disconnected');
  });
});

server.listen(8124);
