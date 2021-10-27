var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Queue;

function Queue(options) {
  if (!(this instanceof Queue))
    return new Queue(options);
  
  EventEmitter.call(this);
  options = options || {};
  this.concurrency = options.concurrency || Infinity;
  this.timeout = options.timeout || 0;
  this.pending = 0;
  this.session = 0;
  this.running = false;
  this.jobs = [];
}
inherits(Queue, EventEmitter);

var arrayMethods = [
  'push',
  'unshift',
  'splice',
  'pop',
  'shift',
  'slice',
  'reverse',
  'indexOf',
  'lastIndexOf'
];

for (var method in arrayMethods) (function(method) {
  Queue.prototype[method] = function() {
    return Array.prototype[method].apply(this.jobs, arguments);
  };
})(arrayMethods[method]);

Object.defineProperty(Queue.prototype, 'length', { get: function() {
  return this.pending + this.jobs.length;
}});

Queue.prototype.start = function(cb) {
  if (cb) {
    callOnErrorOrEnd.call(this, cb);
  }

  if (this.pending === this.concurrency) {
    return;
  }
  
  if (this.jobs.length === 0) {
    if (this.pending === 0) {
      done.call(this);
    }
    return;
  }
  
  var self = this;
  var job = this.jobs.shift();
  var once = true;
  var session = this.session;
  var timeoutId = null;
  var didTimeout = false;
  
  function next(err, result) {
    if (once && self.session === session) {
      once = false;
      self.pending--;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      if (err) {
        self.emit('error', err, job);
      } else if (didTimeout === false) {
        self.emit('success', result, job);
      }
      
      if (self.session === session) {
        if (self.pending === 0 && self.jobs.length === 0) {
          done.call(self);
        } else if (self.running) {
          self.start();
        }
      }
    }
  }
  
  if (this.timeout) {
    timeoutId = setTimeout(function() {
      didTimeout = true;
      if (self.listeners('timeout').length > 0) {
        self.emit('timeout', next, job);
      } else {
        next();
      }
    }, this.timeout);
  }
  
  this.pending++;
  this.running = true;
  job(next);
  
  if (this.jobs.length > 0) {
    this.start();
  }
};

Queue.prototype.stop = function() {
  this.running = false;
};

Queue.prototype.end = function(err) {
  this.jobs.length = 0;
  this.pending = 0;
  done.call(this, err);
};

function callOnErrorOrEnd(cb) {
  var self = this;
  this.on('error', onerror);
  this.on('end', onend);

  function onerror(err) { self.end(err); }
  function onend(err) {
    self.removeListener('error', onerror);
    self.removeListener('end', onend);
    cb(err);
  }
}

function done(err) {
  this.session++;
  this.running = false;
  this.emit('end', err);
}
