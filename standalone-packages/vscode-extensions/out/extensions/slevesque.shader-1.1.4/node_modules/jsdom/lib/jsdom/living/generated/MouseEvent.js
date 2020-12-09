"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertMouseEventInit = require("./MouseEventInit.js").convert;
const convertEventTarget = require("./EventTarget.js").convert;
const impl = utils.implSymbol;
const UIEvent = require("./UIEvent.js");

function MouseEvent(typeArg) {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'MouseEvent'. Please use the 'new' operator; this constructor " +
        "cannot be called as a function."
    );
  }
  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'MouseEvent': 1 " + "argument required, but only " + arguments.length + " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 2; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], { context: "Failed to construct 'MouseEvent': parameter 1" });

  args[1] = convertMouseEventInit(args[1], { context: "Failed to construct 'MouseEvent': parameter 2" });

  iface.setup(this, args);
}

Object.setPrototypeOf(MouseEvent.prototype, UIEvent.interface.prototype);
Object.setPrototypeOf(MouseEvent, UIEvent.interface);

Object.defineProperty(MouseEvent, "prototype", {
  value: MouseEvent.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

MouseEvent.prototype.getModifierState = function getModifierState(keyArg) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'getModifierState' on 'MouseEvent': " +
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
    context: "Failed to execute 'getModifierState' on 'MouseEvent': parameter 1"
  });

  return this[impl].getModifierState(...args);
};

MouseEvent.prototype.initMouseEvent = function initMouseEvent(typeArg) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'initMouseEvent' on 'MouseEvent': " +
        "1 argument required, but only " +
        arguments.length +
        " present."
    );
  }

  const args = [];
  for (let i = 0; i < arguments.length && i < 15; ++i) {
    args[i] = arguments[i];
  }

  args[0] = conversions["DOMString"](args[0], {
    context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 1"
  });

  if (args[1] !== undefined) {
    args[1] = conversions["boolean"](args[1], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 2"
    });
  } else {
    args[1] = false;
  }

  if (args[2] !== undefined) {
    args[2] = conversions["boolean"](args[2], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 3"
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
    args[4] = conversions["long"](args[4], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 5"
    });
  } else {
    args[4] = 0;
  }

  if (args[5] !== undefined) {
    args[5] = conversions["long"](args[5], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 6"
    });
  } else {
    args[5] = 0;
  }

  if (args[6] !== undefined) {
    args[6] = conversions["long"](args[6], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 7"
    });
  } else {
    args[6] = 0;
  }

  if (args[7] !== undefined) {
    args[7] = conversions["long"](args[7], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 8"
    });
  } else {
    args[7] = 0;
  }

  if (args[8] !== undefined) {
    args[8] = conversions["long"](args[8], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 9"
    });
  } else {
    args[8] = 0;
  }

  if (args[9] !== undefined) {
    args[9] = conversions["boolean"](args[9], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 10"
    });
  } else {
    args[9] = 0;
  }

  if (args[10] !== undefined) {
    args[10] = conversions["boolean"](args[10], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 11"
    });
  } else {
    args[10] = 0;
  }

  if (args[11] !== undefined) {
    args[11] = conversions["boolean"](args[11], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 12"
    });
  } else {
    args[11] = 0;
  }

  if (args[12] !== undefined) {
    args[12] = conversions["boolean"](args[12], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 13"
    });
  } else {
    args[12] = 0;
  }

  if (args[13] !== undefined) {
    args[13] = conversions["short"](args[13], {
      context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 14"
    });
  } else {
    args[13] = 0;
  }

  if (args[14] !== undefined) {
    if (args[14] === null || args[14] === undefined) {
      args[14] = null;
    } else {
      args[14] = convertEventTarget(args[14], {
        context: "Failed to execute 'initMouseEvent' on 'MouseEvent': parameter 15"
      });
    }
  } else {
    args[14] = null;
  }

  return this[impl].initMouseEvent(...args);
};

Object.defineProperty(MouseEvent.prototype, "screenX", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["screenX"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "screenY", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["screenY"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "clientX", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["clientX"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "clientY", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["clientY"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "ctrlKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["ctrlKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "shiftKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["shiftKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "altKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["altKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "metaKey", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["metaKey"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "button", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["button"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "relatedTarget", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return utils.tryWrapperForImpl(this[impl]["relatedTarget"]);
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, "buttons", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["buttons"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(MouseEvent.prototype, Symbol.toStringTag, {
  value: "MouseEvent",
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
    throw new TypeError(`${context} is not of type 'MouseEvent'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(MouseEvent.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(MouseEvent.prototype);
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
  interface: MouseEvent,
  expose: {
    Window: { MouseEvent }
  }
}; // iface
module.exports = iface;

const Impl = require("../events/MouseEvent-impl.js");
