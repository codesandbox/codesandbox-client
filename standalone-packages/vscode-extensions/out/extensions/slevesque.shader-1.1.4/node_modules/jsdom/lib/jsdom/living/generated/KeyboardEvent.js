"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertKeyboardEventInit = require("./KeyboardEventInit.js").convert;
const impl = utils.implSymbol;
const UIEvent = require("./UIEvent.js");

function KeyboardEvent(typeArg) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'KeyboardEvent'. Please use the 'new' operator; this constructor " +
        "cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'KeyboardEvent': 1 " + "argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'KeyboardEvent': parameter 1" });

  args[1] = convertKeyboardEventInit(args[1], { context: "Failed to construct 'KeyboardEvent': parameter 2" });

  iface.setup(this, args);
}

Object.setPrototypeOf(KeyboardEvent.prototype, UIEvent.interface.prototype);
Object.setPrototypeOf(KeyboardEvent, UIEvent.interface);

Object.defineProperty(KeyboardEvent, "prototype", {
  value: KeyboardEvent.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

KeyboardEvent.prototype.getModifierState = function getModifierState(keyArg) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'getModifierState' on 'KeyboardEvent': " +
        "1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 1; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'getModifierState' on 'KeyboardEvent': parameter 1"
  });

  return this[impl].getModifierState(...args);
};

KeyboardEvent.prototype.initKeyboardEvent = function initKeyboardEvent(typeArg) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': " +
        "1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 10; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 1"
  });

  if (args[1] !== undefined) {
    args[1] = conversions["boolean"](args[1], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 2"
    });
  } else {
    args[1] = false;
  }

  if (args[2] !== undefined) {
    args[2] = conversions["boolean"](args[2], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 3"
    });
  } else {
    args[2] = false;
  }

  if (args[3] !== undefined) {
    if (args[3] === null || args[3] === undefined) {
      args[3] = null;
    } else {
      args[3] = utils.tryImplForWrapper(args[3]);
    }
  } else {
    args[3] = null;
  }

  if (args[4] !== undefined) {
    args[4] = conversions["DOMString"](args[4], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 5"
    });
  } else {
    args[4] = "";
  }

  if (args[5] !== undefined) {
    args[5] = conversions["unsigned long"](args[5], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 6"
    });
  } else {
    args[5] = 0;
  }

  if (args[6] !== undefined) {
    args[6] = conversions["boolean"](args[6], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 7"
    });
  } else {
    args[6] = false;
  }

  if (args[7] !== undefined) {
    args[7] = conversions["boolean"](args[7], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 8"
    });
  } else {
    args[7] = false;
  }

  if (args[8] !== undefined) {
    args[8] = conversions["boolean"](args[8], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 9"
    });
  } else {
    args[8] = false;
  }

  if (args[9] !== undefined) {
    args[9] = conversions["boolean"](args[9], {
      context: "Failed to execute 'initKeyboardEvent' on 'KeyboardEvent': parameter 10"
    });
  } else {
    args[9] = false;
  }

  return this[impl].initKeyboardEvent(...args);
};

Object.defineProperty(KeyboardEvent.prototype, "key", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["key"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "code", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["code"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "location", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["location"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "ctrlKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["ctrlKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "shiftKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["shiftKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "altKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["altKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "metaKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["metaKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "repeat", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["repeat"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "isComposing", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["isComposing"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "charCode", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["charCode"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "keyCode", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["keyCode"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent.prototype, "which", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["which"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(KeyboardEvent, "DOM_KEY_LOCATION_STANDARD", {
  value: 0,
  enumerable: true
});
Object.defineProperty(KeyboardEvent.prototype, "DOM_KEY_LOCATION_STANDARD", {
  value: 0,
  enumerable: true
});

Object.defineProperty(KeyboardEvent, "DOM_KEY_LOCATION_LEFT", {
  value: 1,
  enumerable: true
});
Object.defineProperty(KeyboardEvent.prototype, "DOM_KEY_LOCATION_LEFT", {
  value: 1,
  enumerable: true
});

Object.defineProperty(KeyboardEvent, "DOM_KEY_LOCATION_RIGHT", {
  value: 2,
  enumerable: true
});
Object.defineProperty(KeyboardEvent.prototype, "DOM_KEY_LOCATION_RIGHT", {
  value: 2,
  enumerable: true
});

Object.defineProperty(KeyboardEvent, "DOM_KEY_LOCATION_NUMPAD", {
  value: 3,
  enumerable: true
});
Object.defineProperty(KeyboardEvent.prototype, "DOM_KEY_LOCATION_NUMPAD", {
  value: 3,
  enumerable: true
});

Object.defineProperty(KeyboardEvent.prototype, Symbol.toStringTag, {
  value: "KeyboardEvent",
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
    throw new TypeError(`${context} is not of type 'KeyboardEvent'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(KeyboardEvent.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(KeyboardEvent.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    UIEvent._internalSetup(obj);
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
  interface: KeyboardEvent,
  expose: {
    Window: { KeyboardEvent }
  }
}; // iface
module.exports = iface;

const Impl = require("../events/KeyboardEvent-impl.js");
