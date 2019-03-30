#!/usr/bin/env mocha -R spec

var assert = require("assert");
var EventLite = require("../event-lite");
var TITLE = __filename.replace(/^.*\//, "");

events_test();

function events_test() {
  describe(TITLE, function() {
    it("off without on", function() {
      var event = EventLite();
      event.off("foo");
    });

    it("off after off", function() {
      var event = EventLite();
      event.on("foo");
      event.off("foo");
      event.off("bar");
    });
  });
}
