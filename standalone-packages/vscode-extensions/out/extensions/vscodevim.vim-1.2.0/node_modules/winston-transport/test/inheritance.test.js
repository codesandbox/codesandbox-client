'use strict';

const assume = require('assume');
const SimpleClassTransport = require('./fixtures/simple-class-transport');
const SimpleProtoTransport = require('./fixtures/simple-proto-transport');

describe('Inheritance patterns', () => {
  it('TransportStream (class)', function () {
    const transport = new SimpleClassTransport();
    assume(transport);
  });

  it('TransportStream (prototypal)', function () {
    const transport = new SimpleProtoTransport();
    assume(transport);
  });
});
