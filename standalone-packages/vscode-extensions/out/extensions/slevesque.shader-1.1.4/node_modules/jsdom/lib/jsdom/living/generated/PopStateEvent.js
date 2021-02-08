"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertPopStateEventInit = require("./PopStateEventInit.js").convert;
const impl = utils.implSymbol;
const Event = require("./Event.js");

function PopStateEvent(type) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'PopStateEvent'. Please use the 'new' operator; this constructor " +
        "cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'PopStateEvent': 1 " + "argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'PopStateEvent': parameter 1" });

  args[1] = convertPopStateEventInit(args[1], { context: "Failed to construct 'PopStateEvent': parameter 2" });

  iface.setup(this, args);
}

Object.setPrototypeOf(PopStateEvent.prototype, Event.interface.prototype);
Object.setPrototypeOf(PopStateEvent, Event.interface);

Object.defineProperty(PopStateEvent, "prototype", {
  value: PopStateEvent.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

Object.defineProperty(PopStateEvent.prototype, "state", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["state"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(PopStateEvent.prototype, Symbol.toStringTag, {
  value: "PopStateEvent",
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
    throw new TypeError(`${context} is not of type 'PopStateEvent'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(PopStateEvent.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(PopStateEvent.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    Event._internalSetup(obj);
  },
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
  interface: PopStateEvent,
  expose: {
    Window: { PopStateEvent }
  }
}; // iface
module.exports = iface;

const Impl = require("../events/PopStateEvent-impl.js");
