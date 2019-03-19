var util = require('util');
var EventEmitter = require('events').EventEmitter;

var msgpack5 = require('msgpack5');


function Response(encoder, request_id) {
  this._encoder = encoder;
  this._request_id = request_id;
}


Response.prototype.send = function(resp, is_error) {
  if (this._sent) {
    throw new Error('Response to id ' + this._request_id + ' already sent');
  }
  if (is_error) {
    this._encoder.write([1, this._request_id, resp, null]);
  } else {
    this._encoder.write([1, this._request_id, null, resp]);
  }
  this._sent = true;
};


function Session(types) {
  var _this = this;
  var opts = {header: false};

  this._msgpack = msgpack5();

  this.addTypes(types)

  this._pending_requests = {};
  this._next_request_id = 1;
  this._encoder = this._msgpack.encoder(opts);
  this._decoder = this._msgpack.decoder(opts);
  this._decoder.on('data', function(msg) {
    _this._parse_message(msg);
  });
  this._decoder.on('end', function() {
    _this.detach();
    _this.emit('detach');
  });
}
util.inherits(Session, EventEmitter);


Session.prototype.addTypes = function(types) {
  if (types)
    for (var i = 0, l = types.length; i < l; i++) {
      var type = types[i];
      this._msgpack.register(type.code, type.constructor, type.encode, type.decode);
    }
}

Session.prototype.attach = function(writer, reader) {
  this._encoder.pipe(writer);
  reader.pipe(this._decoder);
  this._writer = writer;
  this._reader = reader;
};


Session.prototype.detach = function() {
  this._encoder.unpipe(this._writer);
  this._reader.unpipe(this._decoder);
};


Session.prototype.request = function(method, args, cb) {
  var request_id = this._next_request_id++;
  this._encoder.write([0, request_id, method, args]);
  this._pending_requests[request_id] = cb;
};


Session.prototype.notify = function(method, args) {
  this._encoder.write([2, method, args]);
};


Session.prototype._parse_message = function(msg) {
  var msg_type = msg[0];

  if (msg_type === 0) {
    // request
    //   - msg[1]: id
    //   - msg[2]: method name
    //   - msg[3]: arguments
    this.emit('request', msg[2].toString(), msg[3],
              new Response(this._encoder, msg[1]));
  } else if (msg_type === 1) {
    // response to a previous request:
    //   - msg[1]: the id
    //   - msg[2]: error(if any)
    //   - msg[3]: result(if not errored)
    var id = msg[1];
    var handler = this._pending_requests[id];
    delete this._pending_requests[id];
    handler(msg[2], msg[3]);
  } else if (msg_type === 2) {
    // notification/event
    //   - msg[1]: event name
    //   - msg[2]: arguments
    this.emit('notification', msg[1].toString(), msg[2]);
  } else {
    this._encoder.write([1, 0, 'Invalid message type', null]);
  }
};

module.exports = Session;
