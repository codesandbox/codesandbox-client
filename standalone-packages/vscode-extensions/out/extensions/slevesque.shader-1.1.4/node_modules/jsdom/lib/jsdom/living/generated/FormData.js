"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertHTMLFormElement = require("./HTMLFormElement.js").convert;
const impl = utils.implSymbol;

const IteratorPrototype = Object.create(utils.IteratorPrototype, {
  next: {
    value: function next() {
      const internal = this[utils.iterInternalSymbol];
      const { target, kind, index } = internal;
      const values = Array.from(target[impl]);
      const len = values.length;
      if (index >= len) {
        return { value: undefined, done: true };
      }

      const pair = values[index];
      internal.index = index + 1;
      const [key, value] = pair.map(utils.tryWrapperForImpl);

      let result;
      switch (kind) {
        case "key":
          result = key;
          break;
        case "value":
          result = value;
          break;
        case "key+value":
          result = [key, value];
          break;
      }
      return { value: result, done: false };
    },
    writable: true,
    enumerable: true,
    configurable: true
  },
  [Symbol.toStringTag]: {
    value: "FormDataIterator",
    writable: false,
    enumerable: false,
    configurable: true
  }
});

function FormData() {
  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  if (args[0] !== undefined) {
    args[0] = convertHTMLFormElement(args[0], { context: "Failed to construct 'FormData': parameter 1" });
  }

  iface.setup(this, args);
}

Object.defineProperty(FormData, "prototype", {
  value: FormData.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

Object.defineProperty(FormData.prototype, Symbol.iterator, {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function entries() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }
    return module.exports.createDefaultIterator(this, "key+value");
  }
});
FormData.prototype.forEach = function forEach(callback) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to execute 'forEach' on 'FormData': 1 argument required, " + "but only 0 present.");
  }
  if (typeof callback !== "function") {
    throw new TypeError(
      "Failed to execute 'forEach' on 'FormData': The callback provided " + "as parameter 1 is not a function."
    );
  }
  const thisArg = arguments[1];
  let pairs = Array.from(this[impl]);
  let i = 0;
  while (i < pairs.length) {
    const [key, value] = pairs[i].map(utils.tryWrapperForImpl);
    callback.call(thisArg, value, key, this);
    pairs = Array.from(this[impl]);
    i++;
  }
};
FormData.prototype.append = function append(name, value) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'append' on 'FormData': " + "2 arguments required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'append' on 'FormData': parameter 1" });

  args[1] = conversions["any"](args[1], { context: "Failed to execute 'append' on 'FormData': parameter 2" });

  if (args[2] !== undefined) {
    args[2] = conversions["USVString"](args[2], { context: "Failed to execute 'append' on 'FormData': parameter 3" });
  }
  return this[impl].append(...args);
};

FormData.prototype.delete = function _(name) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'delete' on 'FormData': " + "1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'delete' on 'FormData': parameter 1" });

  return this[impl].delete(...args);
};

FormData.prototype.get = function get(name) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'get' on 'FormData': " + "1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'get' on 'FormData': parameter 1" });

  return utils.tryWrapperForImpl(this[impl].get(...args));
};

FormData.prototype.getAll = function getAll(name) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'getAll' on 'FormData': " + "1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'getAll' on 'FormData': parameter 1" });

  return utils.tryWrapperForImpl(this[impl].getAll(...args));
};

FormData.prototype.has = function has(name) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'has' on 'FormData': " + "1 argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'has' on 'FormData': parameter 1" });

  return this[impl].has(...args);
};

FormData.prototype.set = function set(name, value) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to execute 'set' on 'FormData': " + "2 arguments required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 3; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["USVString"](args[0], { context: "Failed to execute 'set' on 'FormData': parameter 1" });

  args[1] = conversions["any"](args[1], { context: "Failed to execute 'set' on 'FormData': parameter 2" });

  if (args[2] !== undefined) {
    args[2] = conversions["USVString"](args[2], { context: "Failed to execute 'set' on 'FormData': parameter 3" });
  }
  return this[impl].set(...args);
};

FormData.prototype.entries = FormData.prototype[Symbol.iterator];

FormData.prototype.keys = function keys() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return module.exports.createDefaultIterator(this, "key");
};

FormData.prototype.values = function values() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }
  return module.exports.createDefaultIterator(this, "value");
};

Object.defineProperty(FormData.prototype, Symbol.toStringTag, {
  value: "FormData",
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
    throw new TypeError(`${context} is not of type 'FormData'.`);
  },

  createDefaultIterator(target, kind) {
    const iterator = Object.create(IteratorPrototype);
    Object.defineProperty(iterator, utils.iterInternalSymbol, {
      value: { target, kind, index: 0 },
      writable: false,
      enumerable: false,
      configurable: true
    });
    return iterator;
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(FormData.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(FormData.prototype);
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
  interface: FormData,
  expose: {
    Window: { FormData },
    Worker: { FormData }
  }
}; // iface
module.exports = iface;

const Impl = require("../xhr/FormData-impl.js");
