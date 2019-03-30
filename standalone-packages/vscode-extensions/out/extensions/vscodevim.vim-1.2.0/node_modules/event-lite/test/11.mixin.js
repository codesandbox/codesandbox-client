#!/usr/bin/env mocha -R spec

var assert = require("assert");
var EventLite = require("../event-lite");
var TITLE = __filename.replace(/^.*\//, "");

function MyEvent() {
  if (!(this instanceof MyEvent)) return new MyEvent();
  EventLite.apply(this, arguments);
}

EventLite.mixin(MyEvent.prototype);

events_test();

function events_test() {
  describe(TITLE, function() {
    var event = MyEvent();

    event.on("foo", foo);
    event.on("bar", bar);
    event.on("baz", baz);
    event.on("barz", bar);
    event.on("barz", baz);
    event.once("qux", qux);

    it("first emit", function(done) {
      event.emit("foo");
      event.emit("bar");
      event.emit("baz");
      event.emit("barz");
      event.emit("qux");
      assert.equal(foo.count, 1, "foo should be fired once");
      assert.equal(bar.count, 2, "bar should be fired twice");
      assert.equal(baz.count, 2, "baz should be fired twice");
      assert.equal(qux.count, 1, "qux should be fired once");
      done();
    });

    it("second emit", function(done) {
      event.emit("foo");
      event.emit("bar");
      event.emit("baz");
      event.emit("barz");
      event.emit("qux");
      assert.equal(foo.count, 2, "foo should be fired twice");
      assert.equal(bar.count, 4, "bar should be fired four times");
      assert.equal(baz.count, 4, "baz should be fired four times");
      assert.equal(qux.count, 1, "qux should be fired once");
      done();
    });

    it("third emit after some off()", function(done) {
      event.off("foo", foo);
      event.off("bar");
      event.emit("foo");
      event.emit("bar");
      event.emit("baz");
      event.emit("barz");
      assert.equal(foo.count, 2, "foo should not be fired");
      assert.equal(bar.count, 5, "bar should be fired once more");
      assert.equal(baz.count, 6, "baz should be fired again");
      done();
    });

    it("fourth emit after all off()", function(done) {
      event.off();
      event.emit("bar");
      event.emit("baz");
      event.emit("barz");
      assert.equal(bar.count, 5, "bar should not be fired");
      assert.equal(baz.count, 6, "baz should not be fired");
      done();
    });

    it("emit with arguments", function(done) {
      event.on("quux", quux);
      event.emit("quux");
      assert.equal(quux.args.length, 0, "no arguments");

      event.emit("quux", "hoge");
      assert.equal(quux.args.length, 1, "one argument");
      assert.equal(quux.args[0], "hoge", "first argument");

      event.emit("quux", "hoge", "pomu");
      assert.equal(quux.args.length, 2, "two arguments");
      assert.equal(quux.args[0], "hoge", "first argument");
      assert.equal(quux.args[1], "pomu", "second argument");
      done();
    });

    it("return value", function() {
      assert.equal(event.on(), event);
      assert.equal(event.once(), event);
      assert.equal(event.off(), event);
      assert.equal(event.emit(), false);
    });
  });
}

function foo() {
  foo.count = (foo.count || 0) + 1;
}

function bar() {
  bar.count = (bar.count || 0) + 1;
}

function baz() {
  baz.count = (baz.count || 0) + 1;
}

function qux() {
  qux.count = (qux.count || 0) + 1;
}

function quux() {
  quux.args = Array.prototype.slice.call(arguments);
}