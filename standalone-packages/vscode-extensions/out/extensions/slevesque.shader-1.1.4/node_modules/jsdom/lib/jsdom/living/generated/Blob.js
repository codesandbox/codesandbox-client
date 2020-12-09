"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertBlobPropertyBag = require("./BlobPropertyBag.js").convert;
const impl = utils.implSymbol;

function Blob() {
  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }

  if (args[0] !== undefined) {
    if (!utils.isObject(args[0])) {
      throw new TypeError("Failed to construct 'Blob': parameter 1" + " is not an iterable object.");
    } else {
      const V = [];
      const tmp = args[0];
      for (let nextItem of tmp) {
        if (module.exports.is(nextItem)) {
          nextItem = utils.implForWrapper(nextItem);
        } else if (nextItem instanceof ArrayBuffer) {
        } else if (ArrayBuffer.isView(nextItem)) {
        } else {
          nextItem = conversions["USVString"](nextItem, {
            context: "Failed to construct 'Blob': parameter 1" + "'s element"
          });
        }
        V.push(nextItem);
      }
      args[0] = V;
    }
  }
  args[1] = convertBlobPropertyBag(args[1], { context: "Failed to construct 'Blob': parameter 2" });

  iface.setup(this, args);
}

Object.defineProperty(Blob, "prototype", {
  value: Blob.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

Blob.prototype.slice = function slice() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  if (args[0] !== undefined) {
    args[0] = conversions["long long"](args[0], {
      context: "Failed to execute 'slice' on 'Blob': parameter 1",
      clamp: true
    });
  }
  if (args[1] !== undefined) {
    args[1] = conversions["long long"](args[1], {
      context: "Failed to execute 'slice' on 'Blob': parameter 2",
      clamp: true
    });
  }
  if (args[2] !== undefined) {
    args[2] = conversions["DOMString"](args[2], { context: "Failed to execute 'slice' on 'Blob': parameter 3" });
  }
  return utils.tryWrapperForImpl(this[impl].slice(...args));
};

Object.defineProperty(Blob.prototype, "size", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["size"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(Blob.prototype, "type", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["type"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
  value: "Blob",
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
    throw new TypeError(`${context} is not of type 'Blob'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(Blob.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(Blob.prototype);
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
  interface: Blob,
  expose: {
    Window: { Blob },
    Worker: { Blob }
  }
}; // iface
module.exports = iface;

const Impl = require("../file-api/Blob-impl.js");
