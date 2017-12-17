var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
import React from 'react';
var Playground = /** @class */ (function(_super) {
  __extends(Playground, _super);
  function Playground() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Playground.prototype.render = function() {
    return React.createElement('div', null, 'Hey hoi');
  };
  return Playground;
})(React.Component);
export default Playground;
//# sourceMappingURL=index.js.map
