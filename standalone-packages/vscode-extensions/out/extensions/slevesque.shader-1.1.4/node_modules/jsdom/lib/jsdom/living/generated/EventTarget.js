"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertAddEventListenerOptions = require("./AddEventListenerOptions.js").convert;
const convertEventListenerOptions = require("./EventListenerOptions.js").convert;
const convertEvent = require("./Event.js").convert;
const impl = utils.implSymbol;

function EventTarget() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(EventTarget, "prototype", {
  value: EventTarget.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

EventTarget.prototype.addEventListener = function addEventListener(type, callback) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'addEventListener' on 'EventTarget': " +
        "2 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 1"
  });

  if (args[1] === null || args[1] === undefined) {
    args[1] = null;
  } else {
    args[1] = utils.tryImplForWrapper(args[1]);
  }
  if (args[2] !== undefined) {
    if (args[2] === null || args[2] === undefined) {
      args[2] = convertAddEventListenerOptions(args[2], {
        context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
      });
    } else if (utils.isObject(args[2])) {
      args[2] = convertAddEventListenerOptions(args[2], {
        context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3" + " dictionary"
      });
    } else if (typeof args[2] === "boolean") {
      args[2] = conversions["boolean"](args[2], {
        context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
      });
    } else {
      args[2] = conversions["boolean"](args[2], {
        context: "Failed to execute 'addEventListener' on 'EventTarget': parameter 3"
      });
    }
  }
  return this[impl].addEventListener(...args);
};

EventTarget.prototype.removeEventListener = function removeEventListener(type, callback) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'removeEventListener' on 'EventTarget': " +
        "2 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 1"
  });

  if (args[1] === null || args[1] === undefined) {
    args[1] = null;
  } else {
    args[1] = utils.tryImplForWrapper(args[1]);
  }
  if (args[2] !== undefined) {
    if (args[2] === null || args[2] === undefined) {
      args[2] = convertEventListenerOptions(args[2], {
        context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
      });
    } else if (utils.isObject(args[2])) {
      args[2] = convertEventListenerOptions(args[2], {
        context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3" + " dictionary"
      });
    } else if (typeof args[2] === "boolean") {
      args[2] = conversions["boolean"](args[2], {
        context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
      });
    } else {
      args[2] = conversions["boolean"](args[2], {
        context: "Failed to execute 'removeEventListener' on 'EventTarget': parameter 3"
      });
    }
  }
  return this[impl].removeEventListener(...args);
};

EventTarget.prototype.dispatchEvent = function dispatchEvent(event) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'dispatchEvent' on 'EventTarget': " +
        "1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = convertEvent(args[0], { context: "Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1" });

  return this[impl].dispatchEvent(...args);
};

Object.defineProperty(EventTarget.prototype, Symbol.toStringTag, {
  value: "EventTarget",
  writable: false,
  enumerable: false,
  configurable: true
});

const iface = {
  // When an interface-module that implements this interface as a mixin is loaded, it will append its own `.is()`
  // method into this array. It allows objects that directly implements *those* interfaces to be recognized as
  // implementing this mixin interface.
  _mixedIntoPredicates: [],
  is(obj) {
    if (obj) {
      if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
        return true;
      }
      for (const isMixedInto of module.exports._mixedIntoPredicates) {
        if (isMixedInto(obj)) {
          return true;
        }
      }
    }
    return false;
  },
  isImpl(obj) {
    if (obj) {
      if (obj instanceof Impl.implementation) {
        return true;
      }

      const wrapper = utils.wrapperForImpl(obj);
      for (const isMixedInto of module.exports._mixedIntoPredicates) {
        if (isMixedInto(wrapper)) {
          return true;
        }
      }
    }
    return false;
  },
  convert(obj, { context = "The provided value" } = {}) {
    if (module.exports.is(obj)) {
      return utils.implForWrapper(obj);
    }
    throw new TypeError(`${context} is not of type 'EventTarget'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(EventTarget.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(EventTarget.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {},
  setup(obj, constructorArgs, privateData) {
    if (!privateData) privateData = {};

    privateData.wrapper = obj;

    this._internalSetup(obj);
    Object.defineProperty(obj, impl, {
      value: new Impl.implementation(constructorArgs, privateData),
      writable: false,
      enumerable: false,
      configurable: true
    });

    obj[impl][utils.wrapperSymbol] = obj;
    if (Impl.init) {
      Impl.init(obj[impl], privateData);
    }
    return obj;
  },
  interface: EventTarget,
  expose: {
    Window: { EventTarget },
    Worker: { EventTarget }
  }
}; // iface
module.exports = iface;

const Impl = require("../events/EventTarget-impl.js");
