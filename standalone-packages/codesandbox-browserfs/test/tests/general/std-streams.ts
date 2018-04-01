import assert from '../../harness/wrapped-assert';

export default function() {
  var datStr = "hey\nhere's some data.",
      count = 0,
      cb = function(stream: NodeJS.ReadWriteStream) {
          return function(data: Buffer) {
            assert(typeof(data) !== 'string');
            assert.equal(data.toString(), datStr);
            count++;
          }
        },
        streams = [process.stdout, <any> process.stderr, process.stdin];

  for (let i = 0; i < streams.length; i++) {
    streams[i].on('data', cb(streams[i]));
    // Write as string, receive as buffer.
    streams[i].write(datStr);
    // Write as buffer, receive as buffer.
    streams[i].write(new Buffer(datStr));
  }

  process.on('exit', function() {
    for (let i = 0; i < streams.length; i++) {
     // Remove all listeners.
     streams[i].removeAllListeners('data');
    }
    assert.equal(count, 6);
  });
};
