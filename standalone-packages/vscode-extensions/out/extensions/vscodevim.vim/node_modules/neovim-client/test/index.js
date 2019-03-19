var assert = require('assert');
var cp = require('child_process');
var which = require('which');
var attach = require('..');

for (var k in assert) global[k] = assert[k];

try {
  which.sync('nvim');
} catch (e) {
  console.error('A Neovim installation is required to run the tests',
                '(see https://github.com/neovim/neovim/wiki/Installing)');
  process.exit(1);
}

describe('Nvim', function() {
  var nvim, requests, notifications;

  before(function(done) {
    nvim = cp.spawn('nvim', ['-u', 'NONE', '-N', '--embed'], {
      cwd: __dirname
    });

    attach(nvim.stdin, nvim.stdout, function(err, n) {
      nvim = n;
      nvim.on('request', function(method, args, resp) {
        requests.push({method: method, args: args});
        resp.send('received ' + method + '(' + args + ')');
      });
      nvim.on('notification', function(method, args) {
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
    nvim.eval('{"k1": "v1", "k2": 2}', function(err, res) {
      equal(err, null);
      deepEqual(res, {k1: 'v1', k2: 2});
      done();
    });
  });

  it('can receive requests and send responses', function(done) {
    nvim.eval('rpcrequest(1, "request", 1, 2, 3)', function(err, res) {
      equal(err, null);
      equal(res, 'received request(1,2,3)');
      deepEqual(requests, [{method: 'request', args: [1, 2, 3]}]);
      deepEqual(notifications, []);
      done();
    });
  });

  it('can receive notifications', function(done) {
    nvim.eval('rpcnotify(1, "notify", 1, 2, 3)', function(err, res) {
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
    nvim.command('vsp', function(err, res) {
      nvim.getWindows(function(err, windows) {
        equal(windows.length, 2);
        equal(windows[0] instanceof nvim.Window, true);
        equal(windows[1] instanceof nvim.Window, true);
        nvim.setCurrentWindow(windows[1], function(err, res) {
          nvim.getCurrentWindow(function(err, win) {
            equal(win.equals(windows[1]), true);
            nvim.getCurrentBuffer(function(err, buf) {
              equal(buf instanceof nvim.Buffer, true);
              buf.getLineSlice(0, -1, true, true, function(err, lines) {
                deepEqual(lines, ['']);
                buf.setLineSlice(0, -1, true, true, ['line1', 'line2'], function(err) {
                  buf.getLineSlice(0, -1, true, true, function(err, lines) {
                    deepEqual(lines, ['line1', 'line2']);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

  });

  it('emits "disconnect" after quit', function(done) {
    nvim.on('disconnect', done);
    nvim.quit();
  });
});
