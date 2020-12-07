"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const impl = utils.implSymbol;

function History() {
  throw new TypeError("Illegal constructor");
}

Object.defineProperty(History, "prototype", {
  value: History.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

History.prototype.go = function go() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  if (args[0] !== undefined) {
    args[0] = conversions["long"](args[0], { context: "Failed to execute 'go' on 'History': parameter 1" });
  } else {
    args[0] = 0;
  }

  return this[impl].go(...args);
};

History.prototype.back = function back() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  return this[impl].back();
};

History.prototype.forward = function forward() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  return this[impl].forward();
};

History.prototype.pushState = function pushState(data, title) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'pushState' on 'History': " +
        "2 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["any"](args[0], { context: "Failed to execute 'pushState' on 'History': parameter 1" });

  args[1] = conversions["DOMString"](args[1], { context: "Failed to execute 'pushState' on 'History': parameter 2" });

  if (args[2] !== undefined) {
    if (args[2] === null || args[2] === undefined) {
      args[2] = null;
    } else {
      args[2] = conversions["DOMString"](args[2], {
        context: "Failed to execute 'pushState' on 'History': parameter 3"
      });
    }
  } else {
    args[2] = null;
  }

  return this[impl].pushState(...args);
};

History.prototype.replaceState = function replaceState(data, title) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'replaceState' on 'History': " +
        "2 arguments required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["any"](args[0], { context: "Failed to execute 'replaceState' on 'History': parameter 1" });

  args[1] = conversions["DOMString"](args[1], {
    context: "Failed to execute 'replaceState' on 'History': parameter 2"
  });

  if (args[2] !== undefined) {
    if (args[2] === null || args[2] === undefined) {
      args[2] = null;
    } else {
      args[2] = conversions["DOMString"](args[2], {
        context: "Failed to execute 'replaceState' on 'History': parameter 3"
      });
    }
  } else {
    args[2] = null;
  }

  return this[impl].replaceState(...args);
};

Object.defineProperty(History.prototype, "length", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["length"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(History.prototype, "state", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["state"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(History.prototype, Symbol.toStringTag, {
  value: "History",
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
    throw new TypeError(`${context} is not of type 'History'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(History.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(History.prototype);
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
  interface: History,
  expose: {
    Window: { History }
  }
}; // iface
module.exports = iface;

const Impl = require("../window/History-impl.js");
