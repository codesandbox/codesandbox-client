/* jshint loopfunc: true */
var assert = require('assert');
var cp = require('child_process');
var which = require('which');
var Session = require('..');


try {
  which.sync('nvim');
} catch (e) {
  console.error('A Neovim installation is required to run the tests',
                '(see https://github.com/neovim/neovim/wiki/Installing)');
  process.exit(1);
}


for (var k in assert) global[k] = assert[k];


function Buffer(data) { this.data = data; }
function Window(data) { this.data = data; }
function Tabpage(data) { this.data = data; }


describe('Session', function() {
  var nvim, session, requests, notifications;

  before(function(done) {
    nvim = cp.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {
      cwd: __dirname
    });
    session = new Session([]);
    session.attach(nvim.stdin, nvim.stdout);
    session.request('vim_get_api_info', [], function(err, res) {
      var metadata = res[1];
      var types = [];
      var constructors = [Buffer, Window, Tabpage];

      for (var i = 0, l = constructors.length; i < l; i++) {
        (function(constructor) {
          types.push({
            constructor: constructor,
            code: metadata.types[constructor.name].id,
            decode: function(data) { return new constructor(data); },
            encode: function(obj) { return obj.data; }
          });
        })(constructors[i]);
      }

      session.detach();
      session = new Session(types);
      session.attach(nvim.stdin, nvim.stdout);
      session.on('request', function(method, args, resp) {
        requests.push({method: method, args: args});
        resp.send('received ' + method + '(' + args.toString() + ')');
      });
      session.on('notification', function(method, args) {
        notifications.push({method: method, args: args});
      });
      done();
    });
  });

  beforeEach(function() {
    requests = [];
    notifications = [];
  });

  it('can send requests and receive response', function(done) {
    session.request('vim_eval', ['{"k1": "v1", "k2": 2}'], function(err, res) {
      equal(err, null);
      res.k1 = res.k1.toString();
      deepEqual(res, {k1: 'v1', k2: 2});
      done();
    });
  });

  it('can receive requests and send responses', function(done) {
    session.request('vim_eval', ['rpcrequest(1, "request", 1, 2, 3)'],
                    function(err, res) {
      equal(err, null);
      equal(res.toString(), 'received request(1,2,3)');
      deepEqual(requests, [{method: 'request', args: [1, 2, 3]}]);
      deepEqual(notifications, []);
      done();
    });
  });

  it('can receive notifications', function(done) {
    session.request('vim_eval', ['rpcnotify(1, "notify", 1, 2, 3)'],
                    function(err, res) {
      res = res.toString();
      equal(err, null);
      equal(res, 1);
      deepEqual(requests, []);
      setImmediate(function() {
        deepEqual(notifications, [{method: 'notify', args: [1, 2, 3]}]);
        done();
      });
    });
  });

  it('can deal with custom types', function(done) {
    session.request('vim_command', ['vsp'], function(err, res) {
      session.request('vim_get_windows', [], function(err, windows) {
        equal(windows.length, 2);
        equal(windows[0] instanceof Window, true);
        equal(windows[1] instanceof Window, true);
        session.request('vim_set_current_window', [windows[1]],
                        function(err, res) {
          session.request('vim_get_current_window', [], function(err, win) {
            equal(win.data.toString(), windows[1].data.toString());
            done();
          });
        });
      });
    });
  });
});
