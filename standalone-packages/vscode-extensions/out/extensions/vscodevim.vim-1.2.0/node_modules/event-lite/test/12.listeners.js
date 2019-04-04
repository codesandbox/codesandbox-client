#!/usr/bin/env mocha -R spec

var assert = require("assert");
var EventLite = require("../event-lite");
var TITLE = __filename.replace(/^.*\//, "");

events_test();

function events_test() {
  describe(TITLE, function() {

    it("on() adds listeners property", function(done) {
      var event = EventLite();
      event.on("foo");
      assert.ok(event.listeners instanceof Object, "listeners property should be an Object");
      assert.ok(event.listeners.foo instanceof Array, "listeners.foo property should be an Array");
      done();
    });

    it("emit() should NOT add listeners property", function(done) {
      var event = EventLite();
      event.emit("foo");
      assert.equal(event.listeners, null, "listeners property should NOT exist");
      done();
    });

    it("off() should removes listeners property", function(done) {
      var event = EventLite();
      event.on("foo", NOP);
      event.off("foo", NOP);
      assert.equal(event.listeners, null, "listeners property should be removed");
      done();
    });
    
    it("off() should treat \"\" as a valid event name", function(done) {
      var event = EventLite();
      event.on("", NOP);
      event.on("foo", NOP);
      event.off("");
      assert.ok(event.listeners instanceof Object, "listeners property should be an Object");
      assert.ok(event.listeners[""] === undefined, "the \"\" event should be removed");
      assert.ok(event.listeners.foo.length === 1, "the \"foo\" event should have one listener");
      done();
    });
    
    it("off() should remove listeners that were added by once()", function(done) {
      var event = EventLite();
      event.once("foo", NOP);
      event.off("foo", NOP);
      assert.equal(event.listeners, null, "listeners property should be removed");
      done();
    });
  });
}

function NOP() {
}
