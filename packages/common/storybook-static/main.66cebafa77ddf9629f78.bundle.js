(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    106: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  transition: 0.3s ease border-color;\n  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNC45NSAxMCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xLjQxIDQuNjdsMS4wNy0xLjQ5IDEuMDYgMS40OUgxLjQxek0zLjU0IDUuMzNMMi40OCA2LjgyIDEuNDEgNS4zM2gyLjEzeiI+PC9wYXRoPjwvc3ZnPg==);\n  background-color: rgba(0, 0, 0, 0.3);\n  background-position: right;\n  background-repeat: no-repeat;\n  color: white;\n  border: none;\n  outline: none;\n  border-radius: 4px;\n  padding: 0.2em 1em 0.2em 0.2em;\n  width: inherit;\n  box-sizing: border-box;\n  font-weight: 400;\n  height: 1.75em;\n  appearance: none;\n\n  border: 1px solid\n    ',
          ';\n\n  &:focus {\n    border-color: ',
          ';\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      __webpack_exports__.a = styled_components__WEBPACK_IMPORTED_MODULE_1__.d.select(
        _templateObject(),
        function(props) {
          return props.error
            ? props.theme.red.clearer(0.5)
            : 'rgba(0, 0, 0, 0.1)';
        },
        function(props) {
          return props.theme.secondary.clearer(0.6);
        }
      );
    },
    107: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var classCallCheck = __webpack_require__(10),
        createClass = __webpack_require__(11),
        possibleConstructorReturn = __webpack_require__(12),
        getPrototypeOf = __webpack_require__(8),
        inherits = __webpack_require__(13),
        assertThisInitialized = __webpack_require__(6),
        defineProperty = __webpack_require__(5),
        react = __webpack_require__(0),
        Tooltip = __webpack_require__(89),
        Switch = __webpack_require__(76),
        PreferenceSwitch_PreferenceSwitch = (function(_React$Component) {
          function PreferenceSwitch() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, PreferenceSwitch);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  PreferenceSwitch
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleClick',
                function() {
                  _this.props.setValue(!_this.props.value);
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(PreferenceSwitch, _React$Component),
            Object(createClass.a)(PreferenceSwitch, [
              {
                key: 'render',
                value: function render() {
                  var value = this.props.value;
                  return react.createElement(Switch.a, {
                    onClick: this.handleClick,
                    small: !0,
                    style: { width: '3rem' },
                    offMode: !0,
                    secondary: !0,
                    right: value,
                  });
                },
              },
            ]),
            PreferenceSwitch
          );
        })(react.Component),
        Select = __webpack_require__(106),
        PreferenceDropdown_PreferenceInput = (function(_React$PureComponent) {
          function PreferenceInput() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, PreferenceInput);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  PreferenceInput
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleChange',
                function(e) {
                  var value = e.target.value;
                  _this.props.setValue(value);
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(PreferenceInput, _React$PureComponent),
            Object(createClass.a)(PreferenceInput, [
              {
                key: 'render',
                value: function render() {
                  var _this$props = this.props,
                    value = _this$props.value,
                    options = _this$props.options,
                    mapName = _this$props.mapName;
                  return react.createElement(
                    Select.a,
                    { onChange: this.handleChange, value: value },
                    options.map(function(op) {
                      return react.createElement(
                        'option',
                        { key: op, value: op },
                        mapName ? mapName(op) : op
                      );
                    })
                  );
                },
              },
            ]),
            PreferenceInput
          );
        })(react.PureComponent),
        objectSpread = __webpack_require__(15),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1),
        Input = __webpack_require__(23);
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  text-align: center;\n',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Container = styled_components_browser_esm.d.div(_templateObject()),
        StyledInput = Object(styled_components_browser_esm.d)(Input.b)(
          _templateObject2()
        ),
        PreferenceNumber_PreferenceInput = (function(_React$PureComponent) {
          function PreferenceInput() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, PreferenceInput);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  PreferenceInput
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleChange',
                function(e) {
                  var value = e.target.value;
                  Number.isNaN(+value) || _this.props.setValue(+value);
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(PreferenceInput, _React$PureComponent),
            Object(createClass.a)(PreferenceInput, [
              {
                key: 'render',
                value: function render() {
                  var _this$props = this.props,
                    value = _this$props.value,
                    style = _this$props.style,
                    step = _this$props.step;
                  return react.createElement(StyledInput, {
                    step: step,
                    style: Object(objectSpread.a)({ width: '3rem' }, style),
                    type: 'number',
                    value: value,
                    onChange: this.handleChange,
                  });
                },
              },
            ]),
            PreferenceInput
          );
        })(react.PureComponent),
        objectWithoutProperties = __webpack_require__(34),
        PreferenceText_PreferenceText = (function(_React$PureComponent) {
          function PreferenceText() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, PreferenceText);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  PreferenceText
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleChange',
                function(e) {
                  var value = e.target.value;
                  _this.props.setValue(value);
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(PreferenceText, _React$PureComponent),
            Object(createClass.a)(PreferenceText, [
              {
                key: 'render',
                value: function render() {
                  var _this$props = this.props,
                    value = _this$props.value,
                    placeholder = _this$props.placeholder,
                    isTextArea = _this$props.isTextArea,
                    props = Object(objectWithoutProperties.a)(_this$props, [
                      'value',
                      'placeholder',
                      'isTextArea',
                    ]);
                  return react.createElement(
                    isTextArea ? Input.a : Input.b,
                    Object(objectSpread.a)(
                      {
                        style: { width: '9rem' },
                        value: value,
                        placeholder: placeholder,
                        onChange: this.handleChange,
                      },
                      props
                    )
                  );
                },
              },
            ]),
            PreferenceText
          );
        })(react.PureComponent),
        toConsumableArray = __webpack_require__(75),
        isIOS =
          'undefined' != typeof navigator &&
          !!navigator.platform.match(/(iPhone|iPod|iPad)/i),
        isMac = ('undefined' != typeof navigator &&
          /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        'undefined' != typeof navigator &&
          (isIOS || !!navigator.platform.match(/Mac/i))),
        keyCodeMapping = { 188: ',' };
      function formatKey(key) {
        switch (key) {
          case 'Meta':
            return isMac ? '⌘' : 'Win';
          case 'Control':
            return 'Ctrl';
          case ' ':
            return 'Space';
          case 'Shift':
            return '⇧';
          default:
            return 1 === key.split('').length ? key.toUpperCase() : key;
        }
      }
      var SPECIAL_KEYS = [
          'Meta',
          'Control',
          'Alt',
          'Shift',
          'Enter',
          'Backspace',
        ],
        IGNORED_KEYS = ['Backspace', 'Escape', 'CapsLock'];
      var KeybindingInput_KeybindingInput = (function(_React$Component) {
          function KeybindingInput() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, KeybindingInput);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  KeybindingInput
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'state',
                { recording: !1, recordedKeys: [] }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleChange',
                function(e) {
                  var value = e.target.value;
                  _this.props.setValue(value);
                }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'keypresses',
                0
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleKeyDown',
                function(e) {
                  if (
                    (e.preventDefault(),
                    e.stopPropagation(),
                    'Enter' === e.key
                      ? _this.props.setValue(_this.state.recordedKeys)
                      : 'Backspace' === e.key && _this.props.setValue(void 0),
                    'Escape' === e.key ||
                      'Enter' === e.key ||
                      'Backspace' === e.key)
                  )
                    return (
                      _this.setState({ recordedKeys: [] }), void e.target.blur()
                    );
                  var keys,
                    upperCaseKey = (function normalizeKey(e) {
                      var key;
                      if (e.key)
                        return 1 === e.key.split('').length
                          ? ' ' ===
                            (key = Object.prototype.hasOwnProperty.call(
                              keyCodeMapping,
                              e.keyCode
                            )
                              ? keyCodeMapping[e.keyCode]
                              : String.fromCharCode(e.keyCode).toUpperCase())
                            ? 'Space'
                            : key
                          : e.key;
                    })(e);
                  -1 === _this.state.recordedKeys.indexOf(upperCaseKey) &&
                    -1 === IGNORED_KEYS.indexOf(e.key) &&
                    ((_this.keypresses += 1),
                    _this.setState({
                      recordedKeys: ((keys = Object(toConsumableArray.a)(
                        _this.state.recordedKeys
                      ).concat([upperCaseKey])),
                      keys.sort(function(a, b) {
                        var isASpecial = SPECIAL_KEYS.indexOf(a) > -1,
                          isBSpecial = SPECIAL_KEYS.indexOf(b) > -1;
                        return isASpecial && isBSpecial
                          ? 0
                          : isASpecial
                            ? -1
                            : isBSpecial
                              ? 1
                              : 0;
                      })),
                    }));
                }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleKeyUp',
                function(e) {
                  e.preventDefault(),
                    e.stopPropagation(),
                    (_this.keypresses -= 1);
                }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleKeyPress',
                function(e) {
                  e.preventDefault(), e.stopPropagation();
                }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleFocus',
                function() {
                  _this.setState({ recording: !0, recordedKeys: [] }),
                    document.addEventListener('keydown', _this.handleKeyDown),
                    document.addEventListener('keyup', _this.handleKeyUp),
                    document.addEventListener('keypress', _this.handleKeyPress);
                }
              ),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'handleBlur',
                function() {
                  (_this.keypresses = 0),
                    _this.state.recording &&
                      (_this.setState({ recording: !1 }),
                      document.removeEventListener(
                        'keydown',
                        _this.handleKeyDown
                      ),
                      document.removeEventListener('keyup', _this.handleKeyUp),
                      document.removeEventListener(
                        'keypress',
                        _this.handleKeyPress
                      ));
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(KeybindingInput, _React$Component),
            Object(createClass.a)(KeybindingInput, [
              {
                key: 'render',
                value: function render() {
                  var _this$state = this.state,
                    recording = _this$state.recording,
                    recordedKeys = _this$state.recordedKeys,
                    _this$props = this.props,
                    value = _this$props.value,
                    _this$props$placehold = _this$props.placeholder,
                    placeholder =
                      void 0 === _this$props$placehold
                        ? 'Enter Keystroke'
                        : _this$props$placehold,
                    keys = recording ? recordedKeys : value || [];
                  return (
                    console.log(this.props),
                    react.createElement(Input.b, {
                      style: Object(objectSpread.a)(
                        { width: '6rem' },
                        this.props.style
                      ),
                      value: keys.map(formatKey).join(' + '),
                      placeholder: placeholder,
                      onFocus: this.handleFocus,
                      onBlur: this.handleBlur,
                      readOnly: !0,
                    })
                  );
                },
              },
            ]),
            KeybindingInput
          );
        })(react.Component),
        PreferenceKeybinding_PreferenceKeybinding = (function(
          _React$PureComponent
        ) {
          function PreferenceKeybinding() {
            var _getPrototypeOf2, _this;
            Object(classCallCheck.a)(this, PreferenceKeybinding);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(possibleConstructorReturn.a)(
                this,
                (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                  PreferenceKeybinding
                )).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(defineProperty.a)(
                Object(assertThisInitialized.a)(
                  Object(assertThisInitialized.a)(_this)
                ),
                'setValue',
                function(index) {
                  return function(value) {
                    var result = Object(toConsumableArray.a)(_this.props.value);
                    (result[index] = value), _this.props.setValue(result);
                  };
                }
              ),
              _this
            );
          }
          return (
            Object(inherits.a)(PreferenceKeybinding, _React$PureComponent),
            Object(createClass.a)(PreferenceKeybinding, [
              {
                key: 'render',
                value: function render() {
                  var value = this.props.value;
                  return react.createElement(
                    'div',
                    null,
                    react.createElement(
                      KeybindingInput_KeybindingInput,
                      Object.assign({}, this.props, {
                        placeholder: 'First',
                        value: value[0],
                        setValue: this.setValue(0),
                      })
                    ),
                    ' - ',
                    react.createElement(
                      KeybindingInput_KeybindingInput,
                      Object.assign({}, this.props, {
                        placeholder: 'Second',
                        value: 2 === value.length && value[1],
                        setValue: this.setValue(1),
                        disabled: !value[0] || 0 === value[0].length,
                      })
                    )
                  );
                },
              },
            ]),
            PreferenceKeybinding
          );
        })(react.PureComponent);
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return Preference_Preference;
      });
      var Preference_Preference = (function(_React$Component) {
        function Preference() {
          var _getPrototypeOf2, _this;
          Object(classCallCheck.a)(this, Preference);
          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          )
            args[_key] = arguments[_key];
          return (
            (_this = Object(possibleConstructorReturn.a)(
              this,
              (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                Preference
              )).call.apply(_getPrototypeOf2, [this].concat(args))
            )),
            Object(defineProperty.a)(
              Object(assertThisInitialized.a)(
                Object(assertThisInitialized.a)(_this)
              ),
              'getOptionComponent',
              function() {
                var props = _this.props;
                return 'boolean' === props.type
                  ? react.createElement(
                      PreferenceSwitch_PreferenceSwitch,
                      Object.assign({}, props, {
                        setValue: props.setValue,
                        value: props.value,
                      })
                    )
                  : 'string' === props.type
                    ? react.createElement(
                        PreferenceText_PreferenceText,
                        Object.assign({}, props, {
                          setValue: props.setValue,
                          value: props.value,
                        })
                      )
                    : 'dropdown' === props.type
                      ? react.createElement(
                          PreferenceDropdown_PreferenceInput,
                          Object.assign({}, props, {
                            options: props.options,
                            setValue: props.setValue,
                            value: props.value,
                          })
                        )
                      : 'keybinding' === props.type
                        ? react.createElement(
                            PreferenceKeybinding_PreferenceKeybinding,
                            Object.assign({}, props, {
                              setValue: props.setValue,
                              value: props.value,
                            })
                          )
                        : react.createElement(
                            PreferenceNumber_PreferenceInput,
                            Object.assign({}, props, {
                              setValue: props.setValue,
                              value: props.value,
                            })
                          );
              }
            ),
            _this
          );
        }
        return (
          Object(inherits.a)(Preference, _React$Component),
          Object(createClass.a)(Preference, [
            {
              key: 'render',
              value: function render() {
                var _this$props = this.props,
                  title = _this$props.title,
                  style = _this$props.style,
                  className = _this$props.className,
                  tooltip = _this$props.tooltip,
                  Title = tooltip
                    ? react.createElement(
                        Tooltip.a,
                        { position: 'right', title: tooltip },
                        title
                      )
                    : react.createElement('span', null, title);
                return react.createElement(
                  Container,
                  { style: style, className: className },
                  Title,
                  react.createElement('div', null, this.getOptionComponent())
                );
              },
            },
          ]),
          Preference
        );
      })(react.Component);
    },
    145: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
        styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
      function _templateObject3() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n  width: 100%;\n  max-width: ', 'px;\n']);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n      @media (max-width: 768px) {\n        padding: 0;\n      }\n    ',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  box-sizing: border-box;\n  display: flex;\n\n  padding: 0 2rem;\n\n  width: 100%;\n  justify-content: center;\n\n  ',
          ';\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Container = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject(),
          function(props) {
            return (
              props.responsive &&
              Object(styled_components__WEBPACK_IMPORTED_MODULE_2__.c)(
                _templateObject2()
              )
            );
          }
        ),
        InnerContainer = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject3(),
          function(props) {
            return props.width;
          }
        );
      __webpack_exports__.a = function(_ref) {
        var children = _ref.children,
          _ref$width = _ref.width,
          width = void 0 === _ref$width ? 1280 : _ref$width,
          className = _ref.className,
          _ref$responsive = _ref.responsive,
          responsive = void 0 !== _ref$responsive && _ref$responsive;
        return react__WEBPACK_IMPORTED_MODULE_1__.createElement(
          Container,
          { responsive: responsive },
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(
            InnerContainer,
            { className: className, width: width },
            children
          )
        );
      };
    },
    146: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          15
        ),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
      __webpack_exports__.a = function(_ref) {
        var _ref$width = _ref.width,
          width = void 0 === _ref$width ? 35 : _ref$width,
          _ref$height = _ref.height,
          height = void 0 === _ref$height ? 35 : _ref$height,
          className = _ref.className,
          style = _ref.style;
        return react__WEBPACK_IMPORTED_MODULE_1__.createElement(
          'svg',
          {
            'aria-label': 'CodeSandbox',
            role: 'presentation',
            x: '0px',
            y: '0px',
            className: className,
            width: 'number' == typeof width ? ''.concat(width, 'px') : width,
            height:
              'number' == typeof height ? ''.concat(height, 'px') : height,
            viewBox: '0 0 1024 1024',
            style: Object(
              _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_0__.a
            )({ verticalAlign: 'middle' }, style),
          },
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(
            'title',
            null,
            'CodeSandbox'
          ),
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(
            'g',
            { id: 'Layer_1' },
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('polyline', {
              fill: 'currentColor',
              points:
                '719.001,851 719.001,639.848 902,533.802 902,745.267 719.001,851',
            }),
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('polyline', {
              fill: 'currentColor',
              points:
                '302.082,643.438 122.167,539.135 122.167,747.741 302.082,852.573 302.082,643.438',
            }),
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('polyline', {
              fill: 'currentColor',
              points:
                '511.982,275.795 694.939,169.633 512.06,63 328.436,169.987 511.982,275.795',
            })
          ),
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(
            'g',
            { id: 'Layer_2' },
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('polyline', {
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '80',
              strokeMiterlimit: '10',
              points: '899,287.833 509,513 509,963',
            }),
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('line', {
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '80',
              strokeMiterlimit: '10',
              x1: '122.167',
              y1: '289',
              x2: '511.5',
              y2: '513',
            }),
            react__WEBPACK_IMPORTED_MODULE_1__.createElement('polygon', {
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '80',
              strokeMiterlimit: '10',
              points:
                '121,739.083 510.917,963.042 901,738.333 901,288 511,62 121,289',
            })
          )
        );
      };
    },
    206: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var objectWithoutProperties = __webpack_require__(34),
        react = __webpack_require__(0),
        eye = __webpack_require__(332),
        eye_default = __webpack_require__.n(eye),
        repo_forked = __webpack_require__(333),
        repo_forked_default = __webpack_require__.n(repo_forked),
        heart = __webpack_require__(334),
        heart_default = __webpack_require__.n(heart),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1);
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n      justify-content: center;\n    ',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  ',
          ';\n  align-items: center;\n  display: inline-flex;\n  flex-direction: row;\n  margin-bottom: 0.5rem;\n\n  width: ',
          ';\n\n  svg {\n    opacity: 0.75;\n    font-size: 1.125em;\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var CenteredText = styled_components_browser_esm.d.div(
        _templateObject(),
        function(props) {
          return (
            !props.disableCenter &&
            Object(styled_components_browser_esm.c)(_templateObject2())
          );
        },
        function(props) {
          return props.text ? '10em' : '5em';
        }
      );
      var Stats_Stat = function Stat(_ref) {
        var Icon = _ref.Icon,
          text = _ref.text,
          textOne = _ref.textOne,
          count = _ref.count,
          vertical = _ref.vertical;
        return react.createElement(
          CenteredText,
          { text: text, disableCenter: vertical },
          Icon,
          react.createElement(
            'span',
            { style: { marginLeft: '0.5em' } },
            (function format(count) {
              return count >= 1e6
                ? ''.concat((count / 1e6).toFixed(1), 'M')
                : count >= 1e3
                  ? ''.concat((count / 1e3).toFixed(1), 'k')
                  : ''.concat(count);
            })(count),
            ' ',
            text && ((1 === count && textOne) || text)
          )
        );
      };
      function _templateObject3() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n          flex-direction: row;\n          align-items: center;\n        ',
        ]);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function elements_templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n          flex-direction: column;\n        ',
        ]);
        return (
          (elements_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function elements_templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: flex;\n\n  ',
          ';\n\n  height: 100%;\n',
        ]);
        return (
          (elements_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Stats = styled_components_browser_esm.d.div(
        elements_templateObject(),
        function(props) {
          return props.vertical
            ? Object(styled_components_browser_esm.c)(
                elements_templateObject2()
              )
            : Object(styled_components_browser_esm.c)(_templateObject3());
        }
      );
      __webpack_exports__.a = function StatsComponent(_ref) {
        var viewCount = _ref.viewCount,
          likeCount = _ref.likeCount,
          forkCount = _ref.forkCount,
          vertical = _ref.vertical,
          text = _ref.text,
          props = Object(objectWithoutProperties.a)(_ref, [
            'viewCount',
            'likeCount',
            'forkCount',
            'vertical',
            'text',
          ]);
        return react.createElement(
          Stats,
          Object.assign({ vertical: vertical }, props),
          react.createElement(Stats_Stat, {
            text: text ? 'views' : void 0,
            textOne: text ? 'view' : void 0,
            vertical: vertical,
            Icon: react.createElement(eye_default.a, null),
            count: viewCount,
          }),
          react.createElement(Stats_Stat, {
            text: text ? 'likes' : void 0,
            textOne: text ? 'like' : void 0,
            vertical: vertical,
            Icon: react.createElement(heart_default.a, null),
            count: likeCount,
          }),
          react.createElement(Stats_Stat, {
            text: text ? 'forks' : void 0,
            textOne: text ? 'fork' : void 0,
            vertical: vertical,
            Icon: react.createElement(repo_forked_default.a, null),
            count: forkCount,
          })
        );
      };
    },
    23: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return styles;
      }),
        __webpack_require__.d(__webpack_exports__, 'a', function() {
          return TextArea;
        });
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
      function _templateObject3() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n  ', ';\n']);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n  ', ';\n']);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  transition: 0.3s ease border-color;\n  background-color: ',
          ';\n  color: ',
          ';\n  border: none;\n  outline: none;\n  border-radius: 4px;\n  padding: 0.25em;\n  width: ',
          ';\n  box-sizing: border-box;\n\n  border: 1px solid\n    ',
          ';\n\n  &:focus {\n    border-color: ',
          ';\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var styles = Object(styled_components__WEBPACK_IMPORTED_MODULE_1__.c)(
          _templateObject(),
          function(props) {
            return props.theme['input.background'] || 'rgba(0, 0, 0, 0.3)';
          },
          function(props) {
            return (
              props.theme['input.foreground'] ||
              (props.theme.light ? '#636363' : 'white')
            );
          },
          function(_ref) {
            var block = _ref.block,
              fullWidth = _ref.fullWidth;
            return block || fullWidth ? '100%' : 'inherit';
          },
          function(props) {
            return props.error
              ? props.theme.red.clearer(0.5)
              : 'rgba(0, 0, 0, 0.1)';
          },
          function(props) {
            return props.theme.secondary.clearer(0.6);
          }
        ),
        Input = styled_components__WEBPACK_IMPORTED_MODULE_1__.d.input(
          _templateObject2(),
          styles
        ),
        TextArea = styled_components__WEBPACK_IMPORTED_MODULE_1__.d.textarea(
          _templateObject3(),
          styles
        );
      __webpack_exports__.b = Input;
    },
    3: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return decorateSelector;
      });
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          5
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          15
        ),
        memoize_one__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(312),
        color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(142),
        color__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(
          color__WEBPACK_IMPORTED_MODULE_3__
        ),
        _themes_codesandbox_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          311
        ),
        colorMethods = [
          'negate',
          'lighten',
          'darken',
          'saturate',
          'desaturate',
          'greyscale',
          'whiten',
          'blacken',
          'clearer',
          'opaquer',
          'rotate',
        ],
        decorateSelector = function decorateSelector(selector) {
          return (
            colorMethods.forEach(function(method) {
              selector[method] = Object(
                memoize_one__WEBPACK_IMPORTED_MODULE_2__.a
              )(function() {
                for (
                  var _len2 = arguments.length,
                    args = new Array(_len2),
                    _key2 = 0;
                  _key2 < _len2;
                  _key2++
                )
                  args[_key2] = arguments[_key2];
                return decorateSelector(
                  function addModifier(fn, method) {
                    for (
                      var _len = arguments.length,
                        modifierArgs = new Array(_len > 2 ? _len - 2 : 0),
                        _key = 2;
                      _key < _len;
                      _key++
                    )
                      modifierArgs[_key - 2] = arguments[_key];
                    return function() {
                      var _Color;
                      return (_Color = color__WEBPACK_IMPORTED_MODULE_3___default()(
                        fn.apply(void 0, arguments)
                      ))[method]
                        .apply(_Color, modifierArgs)
                        .rgbString();
                    };
                  }.apply(void 0, [selector, method].concat(args))
                );
              });
            }),
            selector
          );
        };
      function createTheme(colors) {
        return Object.keys(colors)
          .map(function(c) {
            return { key: c, value: colors[c] };
          })
          .map(function(_ref) {
            var key = _ref.key,
              value = _ref.value;
            return {
              key: key,
              value: decorateSelector(function() {
                return value;
              }),
            };
          })
          .reduce(function(prev, _ref2) {
            var key = _ref2.key,
              value = _ref2.value;
            return Object(
              _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__.a
            )({}, prev, Object(_Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__.a)({}, key, value));
          }, {});
      }
      var theme = Object(
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_1__.a
      )(
        {},
        createTheme({
          background: '#24282A',
          background2: '#1C2022',
          background3: '#374140',
          background4: '#141618',
          background5: '#111518',
          primary: '#FFD399',
          primaryText: '#7F694C',
          secondary: '#40A9F3',
          shySecondary: '#66b9f4',
          white: '#E0E0E0',
          gray: '#C0C0C0',
          black: '#74757D',
          green: '#5da700',
          redBackground: '#400000',
          red: '#F27777',
          dangerBackground: '#DC3545',
        }),
        {
          vscodeTheme: _themes_codesandbox_json__WEBPACK_IMPORTED_MODULE_4__,
          new: createTheme({
            title: '#EEEEFF',
            description: '#777788',
            bg: '#2B2E41',
          }),
        }
      );
      __webpack_exports__.b = theme;
    },
    311: function(module) {
      module.exports = {
        $schema: 'vscode://schemas/color-theme',
        isCodeSandbox: !0,
        type: 'dark',
        colors: {
          'activityBar.background': '#1C2022',
          'badge.background': '#374140',
          'button.background': '#40A9F3',
          'button.hoverBackground': '#66B9F4',
          'editor.background': '#1C2022',
          'editor.selectionBackground': '#40a8f348',
          'editorCursor.foreground': '#66b9f4',
          'editorGroup.border': '#111518',
          'editorGroupHeader.tabsBackground': '#111518',
          'editorHoverWidget.background': '#1C2022',
          'input.background': '#111518',
          'input.foreground': '#C0C0C0',
          'list.hoverBackground': '#37414050',
          'menu.background': '#111518',
          'menu.selectionBackground': '#24282A',
          'menu.selectionForeground': '#40A9F3',
          'scrollbarSlider.activeBackground': '#374140',
          'scrollbarSlider.background': '#37414050',
          'sideBar.background': '#191d1f',
          'sideBar.border': '#111518',
          'statusBar.background': '#40A9F3',
          'tab.activeBackground': '#1C2022',
          'tab.border': '#111518',
          'tab.inactiveBackground': '#111518',
          'titleBar.activeBackground': '#1C2022',
          'titleBar.border': '#111518',
          'editorSuggestWidget.background': '#111518',
          'editorSuggestWidget.selectedBackground': '#24282A',
          'editorSuggestWidget.border': '#111518',
          'editorHoverWidget.border': '#111518',
          'inputOption.activeBorder': '#66b9f4',
          focusBorder: '#66b9f4',
          'peekViewEditor.background': '#111518',
        },
        tokenColors: [
          {
            name: 'Comment',
            scope: ['comment'],
            settings: { foreground: '#5C6370', fontStyle: 'italic' },
          },
          {
            name: 'Comment Markup Link',
            scope: ['comment markup.link'],
            settings: { foreground: '#5C6370' },
          },
          {
            name: 'Entity Name Type',
            scope: ['entity.name.type'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Entity Other Inherited Class',
            scope: ['entity.other.inherited-class'],
            settings: { foreground: '#98C379' },
          },
          {
            name: 'Keyword',
            scope: ['keyword'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Keyword Control',
            scope: ['keyword.control'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Keyword Operator',
            scope: ['keyword.operator'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Keyword Other Special Method',
            scope: ['keyword.other.special-method'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Keyword Other Unit',
            scope: ['keyword.other.unit'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Storage',
            scope: ['storage'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Storage Type Annotation,storage Type Primitive',
            scope: ['storage.type.annotation', 'storage.type.primitive'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Storage Modifier Package,storage Modifier Import',
            scope: ['storage.modifier.package', 'storage.modifier.import'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Constant',
            scope: ['constant'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Constant Variable',
            scope: ['constant.variable'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Constant Character Escape',
            scope: ['constant.character.escape'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Constant Numeric',
            scope: ['constant.numeric'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Constant Other Color',
            scope: ['constant.other.color'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Constant Other Symbol',
            scope: ['constant.other.symbol'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Variable',
            scope: ['variable'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Variable Interpolation',
            scope: ['variable.interpolation'],
            settings: { foreground: '#BE5046' },
          },
          {
            name: 'Variable Parameter',
            scope: ['variable.parameter'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'String',
            scope: ['string'],
            settings: { foreground: '#98C379' },
          },
          {
            name: 'String Regexp',
            scope: ['string.regexp'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'String Regexp Source Ruby Embedded',
            scope: ['string.regexp source.ruby.embedded'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'String Other Link',
            scope: ['string.other.link'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Punctuation Definition Comment',
            scope: ['punctuation.definition.comment'],
            settings: { foreground: '#5C6370' },
          },
          {
            name:
              'Punctuation Definition Method Parameters,punctuation Definition Function Parameters,punctuation Definition Parameters,punctuation Definition Separator,punctuation Definition Seperator,punctuation Definition Array',
            scope: [
              'punctuation.definition.method-parameters',
              'punctuation.definition.function-parameters',
              'punctuation.definition.parameters',
              'punctuation.definition.separator',
              'punctuation.definition.seperator',
              'punctuation.definition.array',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name:
              'Punctuation Definition Heading,punctuation Definition Identity',
            scope: [
              'punctuation.definition.heading',
              'punctuation.definition.identity',
            ],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Punctuation Definition Bold',
            scope: ['punctuation.definition.bold'],
            settings: { foreground: '#E5C07B', fontStyle: 'bold' },
          },
          {
            name: 'Punctuation Definition Italic',
            scope: ['punctuation.definition.italic'],
            settings: { foreground: '#C678DD', fontStyle: 'italic' },
          },
          {
            name: 'Punctuation Section Embedded',
            scope: ['punctuation.section.embedded'],
            settings: { foreground: '#BE5046' },
          },
          {
            name:
              'Punctuation Section Method,punctuation Section Class,punctuation Section Inner Class',
            scope: [
              'punctuation.section.method',
              'punctuation.section.class',
              'punctuation.section.inner-class',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Support Class',
            scope: ['support.class'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Support Type',
            scope: ['support.type'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Support Function',
            scope: ['support.function'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Support Function Any Method',
            scope: ['support.function.any-method'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Entity Name Function',
            scope: ['entity.name.function'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Entity Name Class,entity Name Type Class',
            scope: ['entity.name.class', 'entity.name.type.class'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Entity Name Section',
            scope: ['entity.name.section'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Entity Name Tag',
            scope: ['entity.name.tag'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Entity Other Attribute Name',
            scope: ['entity.other.attribute-name'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Entity Other Attribute Name Id',
            scope: ['entity.other.attribute-name.id'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Meta Class',
            scope: ['meta.class'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Meta Class Body',
            scope: ['meta.class.body'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Meta Method Call,meta Method',
            scope: ['meta.method-call', 'meta.method'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Meta Definition Variable',
            scope: ['meta.definition.variable'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Meta Link',
            scope: ['meta.link'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Meta Require',
            scope: ['meta.require'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Meta Selector',
            scope: ['meta.selector'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Meta Separator',
            scope: ['meta.separator'],
            settings: { background: '#373B41', foreground: '#ABB2BF' },
          },
          {
            name: 'Meta Tag',
            scope: ['meta.tag'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Underline',
            scope: ['underline'],
            settings: { 'text-decoration': 'underline' },
          },
          {
            name: 'None',
            scope: ['none'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Invalid Deprecated',
            scope: ['invalid.deprecated'],
            settings: { foreground: '#523D14', background: '#E0C285' },
          },
          {
            name: 'Invalid Illegal',
            scope: ['invalid.illegal'],
            settings: { foreground: 'white', background: '#E05252' },
          },
          {
            name: 'Markup Bold',
            scope: ['markup.bold'],
            settings: { foreground: '#D19A66', fontStyle: 'bold' },
          },
          {
            name: 'Markup Changed',
            scope: ['markup.changed'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Markup Deleted',
            scope: ['markup.deleted'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Markup Italic',
            scope: ['markup.italic'],
            settings: { foreground: '#C678DD', fontStyle: 'italic' },
          },
          {
            name: 'Markup Heading',
            scope: ['markup.heading'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Markup Heading Punctuation Definition Heading',
            scope: ['markup.heading punctuation.definition.heading'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Markup Link',
            scope: ['markup.link'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Markup Inserted',
            scope: ['markup.inserted'],
            settings: { foreground: '#98C379' },
          },
          {
            name: 'Markup Quote',
            scope: ['markup.quote'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Markup Raw',
            scope: ['markup.raw'],
            settings: { foreground: '#98C379' },
          },
          {
            name: 'Source C Keyword Operator',
            scope: ['source.c keyword.operator'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Cpp Keyword Operator',
            scope: ['source.cpp keyword.operator'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Cs Keyword Operator',
            scope: ['source.cs keyword.operator'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Css Property Name,source Css Property Value',
            scope: ['source.css property-name', 'source.css property-value'],
            settings: { foreground: '#828997' },
          },
          {
            name:
              'Source Css Property Name Support,source Css Property Value Support',
            scope: [
              'source.css property-name.support',
              'source.css property-value.support',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Source Gfm Markup',
            scope: ['source.gfm markup'],
            settings: { '-webkit-font-smoothing': 'auto' },
          },
          {
            name: 'Source Gfm Link Entity',
            scope: ['source.gfm link entity'],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: 'Source Go Storage Type String',
            scope: ['source.go storage.type.string'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Ini Keyword Other Definition Ini',
            scope: ['source.ini keyword.other.definition.ini'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Source Java Storage Modifier Import',
            scope: ['source.java storage.modifier.import'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Source Java Storage Type',
            scope: ['source.java storage.type'],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: 'Source Java Keyword Operator Instanceof',
            scope: ['source.java keyword.operator.instanceof'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Java Properties Meta Key Pair',
            scope: ['source.java-properties meta.key-pair'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: 'Source Java Properties Meta Key Pair > Punctuation',
            scope: ['source.java-properties meta.key-pair > punctuation'],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: 'Source Js Keyword Operator',
            scope: ['source.js keyword.operator'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name:
              'Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void',
            scope: [
              'source.js keyword.operator.delete',
              'source.js keyword.operator.in',
              'source.js keyword.operator.of',
              'source.js keyword.operator.instanceof',
              'source.js keyword.operator.new',
              'source.js keyword.operator.typeof',
              'source.js keyword.operator.void',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name:
              'Source Json Meta Structure Dictionary Json > String Quoted Json',
            scope: [
              'source.json meta.structure.dictionary.json > string.quoted.json',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name:
              'Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String',
            scope: [
              'source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name:
              'Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation',
            scope: [
              'source.json meta.structure.dictionary.json > value.json > string.quoted.json',
              'source.json meta.structure.array.json > value.json > string.quoted.json',
              'source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation',
              'source.json meta.structure.array.json > value.json > string.quoted.json > punctuation',
            ],
            settings: { foreground: '#98C379' },
          },
          {
            name:
              'Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json',
            scope: [
              'source.json meta.structure.dictionary.json > constant.language.json',
              'source.json meta.structure.array.json > constant.language.json',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: 'Source Ruby Constant Other Symbol > Punctuation',
            scope: ['source.ruby constant.other.symbol > punctuation'],
            settings: { foreground: 'inherit' },
          },
          {
            name: 'Source Python Keyword Operator Logical Python',
            scope: ['source.python keyword.operator.logical.python'],
            settings: { foreground: '#C678DD' },
          },
          {
            name: 'Source Python Variable Parameter',
            scope: ['source.python variable.parameter'],
            settings: { foreground: '#D19A66' },
          },
          {
            name: 'Meta Attribute Rust',
            scope: ['meta.attribute.rust'],
            settings: { foreground: '#BCC199' },
          },
          {
            name: 'Storage Modifier Lifetime Rust,entity Name Lifetime Rust',
            scope: [
              'storage.modifier.lifetime.rust',
              'entity.name.lifetime.rust',
            ],
            settings: { foreground: '#33E8EC' },
          },
          {
            name: 'Keyword Unsafe Rust',
            scope: ['keyword.unsafe.rust'],
            settings: { foreground: '#CC6B73' },
          },
          {
            name: 'customrule',
            scope: 'customrule',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Support Type Property Name',
            scope: 'support.type.property-name',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Punctuation for Quoted String',
            scope: 'string.quoted.double punctuation',
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] Support Constant',
            scope: 'support.constant',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] JSON Property Name',
            scope: 'support.type.property-name.json',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JSON Punctuation for Property Name',
            scope: 'support.type.property-name.json punctuation',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation for key-value',
            scope: [
              'punctuation.separator.key-value.ts',
              'punctuation.separator.key-value.js',
              'punctuation.separator.key-value.tsx',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Embedded Operator',
            scope: [
              'source.js.embedded.html keyword.operator',
              'source.ts.embedded.html keyword.operator',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Variable Other Readwrite',
            scope: [
              'variable.other.readwrite.js',
              'variable.other.readwrite.ts',
              'variable.other.readwrite.tsx',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Support Variable Dom',
            scope: ['support.variable.dom.js', 'support.variable.dom.ts'],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Support Variable Property Dom',
            scope: [
              'support.variable.property.dom.js',
              'support.variable.property.dom.ts',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Interpolation String Punctuation',
            scope: [
              'meta.template.expression.js punctuation.definition',
              'meta.template.expression.ts punctuation.definition',
            ],
            settings: { foreground: '#BE5046' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation Type Parameters',
            scope: [
              'source.ts punctuation.definition.typeparameters',
              'source.js punctuation.definition.typeparameters',
              'source.tsx punctuation.definition.typeparameters',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Definition Block',
            scope: [
              'source.ts punctuation.definition.block',
              'source.js punctuation.definition.block',
              'source.tsx punctuation.definition.block',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation Separator Comma',
            scope: [
              'source.ts punctuation.separator.comma',
              'source.js punctuation.separator.comma',
              'source.tsx punctuation.separator.comma',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Variable Property',
            scope: [
              'support.variable.property.js',
              'support.variable.property.ts',
              'support.variable.property.tsx',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Default Keyword',
            scope: [
              'keyword.control.default.js',
              'keyword.control.default.ts',
              'keyword.control.default.tsx',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Instanceof Keyword',
            scope: [
              'keyword.operator.expression.instanceof.js',
              'keyword.operator.expression.instanceof.ts',
              'keyword.operator.expression.instanceof.tsx',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Of Keyword',
            scope: [
              'keyword.operator.expression.of.js',
              'keyword.operator.expression.of.ts',
              'keyword.operator.expression.of.tsx',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Braces/Brackets',
            scope: [
              'meta.brace.round.js',
              'meta.array-binding-pattern-variable.js',
              'meta.brace.square.js',
              'meta.brace.round.ts',
              'meta.array-binding-pattern-variable.ts',
              'meta.brace.square.ts',
              'meta.brace.round.tsx',
              'meta.array-binding-pattern-variable.tsx',
              'meta.brace.square.tsx',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation Accessor',
            scope: [
              'source.js punctuation.accessor',
              'source.ts punctuation.accessor',
              'source.tsx punctuation.accessor',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation Terminator Statement',
            scope: [
              'punctuation.terminator.statement.js',
              'punctuation.terminator.statement.ts',
              'punctuation.terminator.statement.tsx',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Array variables',
            scope: [
              'meta.array-binding-pattern-variable.js variable.other.readwrite.js',
              'meta.array-binding-pattern-variable.ts variable.other.readwrite.ts',
              'meta.array-binding-pattern-variable.tsx variable.other.readwrite.tsx',
            ],
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Support Variables',
            scope: [
              'source.js support.variable',
              'source.ts support.variable',
              'source.tsx support.variable',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Support Variables',
            scope: [
              'variable.other.constant.property.js',
              'variable.other.constant.property.ts',
              'variable.other.constant.property.tsx',
            ],
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Keyword New',
            scope: [
              'keyword.operator.new.ts',
              'keyword.operator.new.j',
              'keyword.operator.new.tsx',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] TS Keyword Operator',
            scope: [
              'source.ts keyword.operator',
              'source.tsx keyword.operator',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Punctuation Parameter Separator',
            scope: [
              'punctuation.separator.parameter.js',
              'punctuation.separator.parameter.ts',
              'punctuation.separator.parameter.tsx ',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Import',
            scope: [
              'constant.language.import-export-all.js',
              'constant.language.import-export-all.ts',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JSX/TSX Import',
            scope: [
              'constant.language.import-export-all.jsx',
              'constant.language.import-export-all.tsx',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Keyword Control As',
            scope: [
              'keyword.control.as.js',
              'keyword.control.as.ts',
              'keyword.control.as.jsx',
              'keyword.control.as.tsx',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Variable Alias',
            scope: [
              'variable.other.readwrite.alias.js',
              'variable.other.readwrite.alias.ts',
              'variable.other.readwrite.alias.jsx',
              'variable.other.readwrite.alias.tsx',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Constants',
            scope: [
              'variable.other.constant.js',
              'variable.other.constant.ts',
              'variable.other.constant.jsx',
              'variable.other.constant.tsx',
            ],
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Export Variable',
            scope: [
              'meta.export.default.js variable.other.readwrite.js',
              'meta.export.default.ts variable.other.readwrite.ts',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Template Strings Punctuation Accessor',
            scope: [
              'source.js meta.template.expression.js punctuation.accessor',
              'source.ts meta.template.expression.ts punctuation.accessor',
              'source.tsx meta.template.expression.tsx punctuation.accessor',
            ],
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Import equals',
            scope: [
              'source.js meta.import-equals.external.js keyword.operator',
              'source.jsx meta.import-equals.external.jsx keyword.operator',
              'source.ts meta.import-equals.external.ts keyword.operator',
              'source.tsx meta.import-equals.external.tsx keyword.operator',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Type Module',
            scope:
              'entity.name.type.module.js,entity.name.type.module.ts,entity.name.type.module.jsx,entity.name.type.module.tsx',
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Meta Class',
            scope: 'meta.class.js,meta.class.ts,meta.class.jsx,meta.class.tsx',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Property Definition Variable',
            scope: [
              'meta.definition.property.js variable',
              'meta.definition.property.ts variable',
              'meta.definition.property.jsx variable',
              'meta.definition.property.tsx variable',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Meta Type Parameters Type',
            scope: [
              'meta.type.parameters.js support.type',
              'meta.type.parameters.jsx support.type',
              'meta.type.parameters.ts support.type',
              'meta.type.parameters.tsx support.type',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Meta Tag Keyword Operator',
            scope: [
              'source.js meta.tag.js keyword.operator',
              'source.jsx meta.tag.jsx keyword.operator',
              'source.ts meta.tag.ts keyword.operator',
              'source.tsx meta.tag.tsx keyword.operator',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Meta Tag Punctuation',
            scope: [
              'meta.tag.js punctuation.section.embedded',
              'meta.tag.jsx punctuation.section.embedded',
              'meta.tag.ts punctuation.section.embedded',
              'meta.tag.tsx punctuation.section.embedded',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Meta Array Literal Variable',
            scope: [
              'meta.array.literal.js variable',
              'meta.array.literal.jsx variable',
              'meta.array.literal.ts variable',
              'meta.array.literal.tsx variable',
            ],
            settings: { foreground: '#E5C07B' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Module Exports',
            scope: [
              'support.type.object.module.js',
              'support.type.object.module.jsx',
              'support.type.object.module.ts',
              'support.type.object.module.tsx',
            ],
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] JSON Constants',
            scope: ['constant.language.json'],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Object Constants',
            scope: [
              'variable.other.constant.object.js',
              'variable.other.constant.object.jsx',
              'variable.other.constant.object.ts',
              'variable.other.constant.object.tsx',
            ],
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Properties Keyword',
            scope: [
              'storage.type.property.js',
              'storage.type.property.jsx',
              'storage.type.property.ts',
              'storage.type.property.tsx',
            ],
            settings: { foreground: '#56B6C2' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Single Quote Inside Templated String',
            scope: [
              'meta.template.expression.js string.quoted punctuation.definition',
              'meta.template.expression.jsx string.quoted punctuation.definition',
              'meta.template.expression.ts string.quoted punctuation.definition',
              'meta.template.expression.tsx string.quoted punctuation.definition',
            ],
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS Backtick inside Templated String',
            scope: [
              'meta.template.expression.js string.template punctuation.definition.string.template',
              'meta.template.expression.jsx string.template punctuation.definition.string.template',
              'meta.template.expression.ts string.template punctuation.definition.string.template',
              'meta.template.expression.tsx string.template punctuation.definition.string.template',
            ],
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] JS/TS In Keyword for Loops',
            scope: [
              'keyword.operator.expression.in.js',
              'keyword.operator.expression.in.jsx',
              'keyword.operator.expression.in.ts',
              'keyword.operator.expression.in.tsx',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Constants Other',
            scope: 'source.python constant.other',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Constants',
            scope: 'source.python constant',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Placeholder Character',
            scope: 'constant.character.format.placeholder.other.python storage',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Magic',
            scope: 'support.variable.magic.python',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Meta Function Parameters',
            scope: 'meta.function.parameters.python',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Function Separator Annotation',
            scope: 'punctuation.separator.annotation.python',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Python Function Separator Punctuation',
            scope: 'punctuation.separator.parameters.python',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Fields',
            scope: 'entity.name.variable.field.cs',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Keyword Operators',
            scope: 'source.cs keyword.operator',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Variables',
            scope: 'variable.other.readwrite.cs',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Variables Other',
            scope: 'variable.other.object.cs',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Property Other',
            scope: 'variable.other.object.property.cs',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Property',
            scope: 'entity.name.variable.property.cs',
            settings: { foreground: '#61AFEF' },
          },
          {
            name: '[VSCODE-CUSTOM] CSharp Storage Type',
            scope: 'storage.type.cs',
            settings: { foreground: '#E5C07B' },
          },
          {
            name: '[VSCODE-CUSTOM] Rust Unsafe Keyword',
            scope: 'keyword.other.unsafe.rust',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Raw Block',
            scope: 'markup.raw.block.markdown',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Shell Variables Punctuation Definition',
            scope: 'punctuation.definition.variable.shell',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Css Support Constant Value',
            scope: 'support.constant.property-value.css',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Css Punctuation Definition Constant',
            scope: 'punctuation.definition.constant.css',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Sass Punctuation for key-value',
            scope: 'punctuation.separator.key-value.scss',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Sass Punctuation for constants',
            scope: 'punctuation.definition.constant.scss',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Sass Punctuation for key-value',
            scope:
              'meta.property-list.scss punctuation.separator.key-value.scss',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Java Storage Type Primitive Array',
            scope: 'storage.type.primitive.array.java',
            settings: { foreground: '#E5C07B' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown headings',
            scope: 'entity.name.section.markdown',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown heading Punctuation Definition',
            scope: 'punctuation.definition.heading.markdown',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown heading setext',
            scope: 'markup.heading.setext',
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Punctuation Definition Bold',
            scope: 'punctuation.definition.bold.markdown',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Inline Raw',
            scope: 'markup.inline.raw.markdown',
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown List Punctuation Definition',
            scope: 'beginning.punctuation.definition.list.markdown',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Quote',
            scope: 'markup.quote.markdown',
            settings: { foreground: '#5C6370', fontStyle: 'italic' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Punctuation Definition String',
            scope: [
              'punctuation.definition.string.begin.markdown',
              'punctuation.definition.string.end.markdown',
              'punctuation.definition.metadata.markdown',
            ],
            settings: { foreground: '#ABB2BF' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Punctuation Definition Link',
            scope: 'punctuation.definition.metadata.markdown',
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Underline Link/Image',
            scope: [
              'markup.underline.link.markdown',
              'markup.underline.link.image.markdown',
            ],
            settings: { foreground: '#C678DD' },
          },
          {
            name: '[VSCODE-CUSTOM] Markdown Link Title/Description',
            scope: [
              'string.other.link.title.markdown',
              'string.other.link.description.markdown',
            ],
            settings: { foreground: '#61AFEF' },
          },
          {
            name: '[VSCODE-CUSTOM] Ruby Punctuation Separator Variable',
            scope: 'punctuation.separator.variable.ruby',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] Ruby Other Constant Variable',
            scope: 'variable.other.constant.ruby',
            settings: { foreground: '#D19A66' },
          },
          {
            name: '[VSCODE-CUSTOM] Ruby Keyword Operator Other',
            scope: 'keyword.operator.other.ruby',
            settings: { foreground: '#98C379' },
          },
          {
            name: '[VSCODE-CUSTOM] PHP Punctuation Variable Definition',
            scope: 'punctuation.definition.variable.php',
            settings: { foreground: '#E06C75' },
          },
          {
            name: '[VSCODE-CUSTOM] PHP Meta Class',
            scope: 'meta.class.php',
            settings: { foreground: '#ABB2BF' },
          },
          { scope: 'token.info-token', settings: { foreground: '#6796e6' } },
          { scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
          { scope: 'token.error-token', settings: { foreground: '#f44747' } },
          { scope: 'token.debug-token', settings: { foreground: '#b267e6' } },
        ],
      };
    },
    313: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _storybook_theming__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        314
      );
      __webpack_require__(3);
      __webpack_exports__.a = Object(
        _storybook_theming__WEBPACK_IMPORTED_MODULE_0__.create
      )({
        base: 'dark',
        brandTitle: 'CodeSandbox Storybook',
        brandUrl: 'https://codesandbox.io',
        brandImage:
          'https://pbs.twimg.com/profile_images/990658498940751873/Ri8HxX9d_400x400.jpg',
      });
    },
    316: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1),
        react_input_autosize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          317
        ),
        react_input_autosize__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(
          react_input_autosize__WEBPACK_IMPORTED_MODULE_2__
        ),
        _Input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23);
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n  input {\n    ', ';\n  }\n']);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      __webpack_exports__.a = Object(
        styled_components__WEBPACK_IMPORTED_MODULE_1__.d
      )(react_input_autosize__WEBPACK_IMPORTED_MODULE_2___default.a)(
        _templateObject(),
        _Input__WEBPACK_IMPORTED_MODULE_3__.c
      );
    },
    320: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var react_textarea_autosize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          321
        ),
        _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
      __webpack_exports__.a = _Input__WEBPACK_IMPORTED_MODULE_1__.b.withComponent(
        react_textarea_autosize__WEBPACK_IMPORTED_MODULE_0__.a
      );
    },
    323: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + 'static/media/parcel.7fe6607b.png';
    },
    324: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__.p + 'static/media/cxjs.330661d2.svg';
    },
    325: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + 'static/media/static.90767561.svg';
    },
    328: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_1__
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1),
        _flex_MaxWidth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(145),
        _utils_media__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(90);
      function _templateObject7() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  position: relative;\n  background-color: ',
          ';\n  padding: 1rem;\n  z-index: 5;\n',
        ]);
        return (
          (_templateObject7 = function _templateObject7() {
            return data;
          }),
          data
        );
      }
      function _templateObject6() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  color: white;\n  font-size: 0.875rem;\n  text-align: right;\n',
        ]);
        return (
          (_templateObject6 = function _templateObject6() {
            return data;
          }),
          data
        );
      }
      function _templateObject5() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  color: rgba(255, 255, 255, 0.7);\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n\n  li {\n    a {\n      transition: 0.3s ease color;\n      text-decoration: none;\n      color: rgba(255, 255, 255, 0.7);\n\n      &:hover {\n        color: rgba(255, 255, 255, 0.9);\n      }\n    }\n  }\n',
        ]);
        return (
          (_templateObject5 = function _templateObject5() {
            return data;
          }),
          data
        );
      }
      function _templateObject4() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  font-size: 1.125rem;\n  font-weight: 400;\n  margin: 0;\n  margin-bottom: 1rem;\n\n  color: ',
          ';\n',
        ]);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n    width: 100%;\n    margin-bottom: 1rem;\n  ']);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n  width: calc(33% - 2rem);\n  margin: 0 1rem;\n\n  ', ';\n']);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n  padding-top: 5rem;\n  padding-bottom: 3rem;\n  flex-wrap: wrap;\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Container = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject()
        ),
        Column = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject2(),
          _utils_media__WEBPACK_IMPORTED_MODULE_4__.a.phone(_templateObject3())
        ),
        Title = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.h5(
          _templateObject4(),
          function(_ref) {
            return _ref.theme.secondary;
          }
        ),
        List = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.ul(
          _templateObject5()
        ),
        Authors = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject6()
        ),
        Background = styled_components__WEBPACK_IMPORTED_MODULE_2__.d.div(
          _templateObject7(),
          function(props) {
            return props.theme.background2.darken(0.2);
          }
        ),
        BasComponent = function BasComponent() {
          return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
            'a',
            {
              id: 'bas',
              href: 'https://www.aedin.com/in/basbuursma/',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Bas Buursma'
          );
        };
      __webpack_exports__.a = function() {
        return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
          Background,
          { id: 'footer' },
          react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
            _flex_MaxWidth__WEBPACK_IMPORTED_MODULE_3__.a,
            { width: 1280 },
            react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
              react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment,
              null,
              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                Container,
                null,
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  Column,
                  null,
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    Title,
                    null,
                    'CodeSandbox'
                  ),
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    List,
                    null,
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: '/s',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Create Sandbox'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: '/search',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Search'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        { href: '/docs' },
                        'Documentation'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: '/patron',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Patron'
                      )
                    )
                  )
                ),
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  Column,
                  null,
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    Title,
                    null,
                    'About'
                  ),
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    List,
                    null,
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: 'https://medium.com/@compuives',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Blog'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href:
                            'https://github.com/CompuIves/codesandbox-client',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'GitHub'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        { href: '/legal' },
                        'Legal'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        { href: 'mailto:hello@codesandbox.io' },
                        'Contact Us'
                      )
                    )
                  )
                ),
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  Column,
                  null,
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    Title,
                    null,
                    'Social'
                  ),
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    List,
                    null,
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: 'https://twitter.com/codesandbox',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Twitter'
                      )
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      'li',
                      null,
                      react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                        'a',
                        {
                          href: 'https://spectrum.chat/codesandbox',
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        'Spectrum'
                      )
                    )
                  )
                )
              ),
              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                Authors,
                null,
                'By ',
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  BasComponent,
                  null
                ),
                ' and',
                ' ',
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  'a',
                  {
                    id: 'ives',
                    href: 'https://twitter.com/CompuIves',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  'Ives van Hoorne'
                )
              )
            )
          )
        );
      };
    },
    330: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return Navigation;
      });
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          10
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          12
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
          8
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          13
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          6
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
          5
        ),
        _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
          2
        ),
        react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_8___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_8__
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1),
        _Logo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(146),
        _flex_MaxWidth__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(145),
        _utils_media__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(90);
      function _templateObject12() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )([
          '\n  width: 1.75em;\n  height: 1.75em;\n  border-radius: 4px;\n  margin-left: 0.75rem;\n  margin-bottom: 0;\n',
        ]);
        return (
          (_templateObject12 = function _templateObject12() {
            return data;
          }),
          data
        );
      }
      function _templateObject11() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n  display: flex;\n  align-items: center;\n']);
        return (
          (_templateObject11 = function _templateObject11() {
            return data;
          }),
          data
        );
      }
      function _templateObject10() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )([
          '\n      @media (max-width: ',
          'px) {\n        display: none;\n      }\n    ',
        ]);
        return (
          (_templateObject10 = function _templateObject10() {
            return data;
          }),
          data
        );
      }
      function _templateObject9() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n      display: none;\n    ']);
        return (
          (_templateObject9 = function _templateObject9() {
            return data;
          }),
          data
        );
      }
      function _templateObject8() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n      ', ';\n    ']);
        return (
          (_templateObject8 = function _templateObject8() {
            return data;
          }),
          data
        );
      }
      function _templateObject7() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n    font-size: 1rem;\n    margin: 0 .5rem;\n  ']);
        return (
          (_templateObject7 = function _templateObject7() {
            return data;
          }),
          data
        );
      }
      function _templateObject6() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )([
          '\n      transition: 0.3s ease all;\n      padding: 0.2rem 0.8rem;\n      border-radius: 4px;\n      font-weight: 600;\n      background-color: ',
          ';\n      border: 2px solid rgba(255, 255, 255, 0.3);\n\n      &:hover {\n        color: white;\n        background-color: #7fc3f7;\n        border-color: transparent;\n      }\n    ',
        ]);
        return (
          (_templateObject6 = function _templateObject6() {
            return data;
          }),
          data
        );
      }
      function _templateObject5() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )([
          '\n  display: inline-flex;\n  align-items: center;\n  transition: 0.2s ease color;\n  font-size: 1.125rem;\n  text-decoration: none;\n  color: white;\n\n  margin: 0 1rem;\n  font-weight: 400;\n\n  &:hover {\n    color: ',
          ';\n  }\n\n  ',
          ';\n\n  ',
          ';\n\n  ',
          ';\n\n  ',
          ';\n',
        ]);
        return (
          (_templateObject5 = function _templateObject5() {
            return data;
          }),
          data
        );
      }
      function _templateObject4() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n    width: 38px;\n    height: 38px;\n  ']);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n  color: white;\n  ', ';\n']);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )(['\n  display: flex;\n  align-items: center;\n  flex: auto;\n']);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_7__.a
        )([
          '\n  display: flex;\n  align-items: center;\n  padding: 1rem 0;\n  width: 100%;\n  color: white;\n  z-index: 5;\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Container = styled_components__WEBPACK_IMPORTED_MODULE_9__.d.div(
          _templateObject()
        ),
        Left = styled_components__WEBPACK_IMPORTED_MODULE_9__.d.div(
          _templateObject2()
        ),
        StyledLogo = Object(styled_components__WEBPACK_IMPORTED_MODULE_9__.d)(
          _Logo__WEBPACK_IMPORTED_MODULE_10__.a
        )(
          _templateObject3(),
          _utils_media__WEBPACK_IMPORTED_MODULE_12__.a.phone(_templateObject4())
        ),
        Item = styled_components__WEBPACK_IMPORTED_MODULE_9__.d.a(
          _templateObject5(),
          function(props) {
            return props.theme.secondary;
          },
          function(props) {
            return (
              props.button &&
              Object(styled_components__WEBPACK_IMPORTED_MODULE_9__.c)(
                _templateObject6(),
                props.theme.secondary
              )
            );
          },
          _utils_media__WEBPACK_IMPORTED_MODULE_12__.a.phone(
            _templateObject7()
          ),
          function(props) {
            return (
              props.hidePhone &&
              Object(styled_components__WEBPACK_IMPORTED_MODULE_9__.c)(
                _templateObject8(),
                _utils_media__WEBPACK_IMPORTED_MODULE_12__.a.phone(
                  _templateObject9()
                )
              )
            );
          },
          function(props) {
            return (
              props.hideOn &&
              Object(styled_components__WEBPACK_IMPORTED_MODULE_9__.c)(
                _templateObject10(),
                props.hideOn
              )
            );
          }
        ),
        Right = styled_components__WEBPACK_IMPORTED_MODULE_9__.d.div(
          _templateObject11()
        ),
        Image = styled_components__WEBPACK_IMPORTED_MODULE_9__.d.img(
          _templateObject12()
        ),
        Navigation = (function(_React$PureComponent) {
          function Navigation() {
            var _getPrototypeOf2, _this;
            Object(
              _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__.a
            )(this, Navigation);
            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            )
              args[_key] = arguments[_key];
            return (
              (_this = Object(
                _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__.a
              )(
                this,
                (_getPrototypeOf2 = Object(
                  _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__.a
                )(Navigation)).call.apply(_getPrototypeOf2, [this].concat(args))
              )),
              Object(
                _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__.a
              )(
                Object(
                  _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__.a
                )(
                  Object(
                    _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__.a
                  )(_this)
                ),
                'state',
                { user: null }
              ),
              Object(
                _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__.a
              )(
                Object(
                  _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__.a
                )(
                  Object(
                    _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__.a
                  )(_this)
                ),
                'fetchCurrentUser',
                function() {
                  var jwt = JSON.parse(localStorage.getItem('jwt'));
                  window
                    .fetch('/api/v1/users/current', {
                      headers: { Authorization: 'Bearer '.concat(jwt) },
                    })
                    .then(function(x) {
                      return x.json();
                    })
                    .then(function(_ref) {
                      var data = _ref.data;
                      return _this.setState({ user: data });
                    })
                    .catch(function() {});
                }
              ),
              _this
            );
          }
          return (
            Object(
              _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__.a
            )(Navigation, _React$PureComponent),
            Object(
              _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__.a
            )(Navigation, [
              {
                key: 'componentDidMount',
                value: function componentDidMount() {
                  localStorage.getItem('jwt') && this.fetchCurrentUser();
                },
              },
              {
                key: 'render',
                value: function render() {
                  var user = this.state.user;
                  return react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                    _flex_MaxWidth__WEBPACK_IMPORTED_MODULE_11__.a,
                    { width: 1440 },
                    react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                      Container,
                      null,
                      react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                        Left,
                        null,
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          'a',
                          { href: '/' },
                          react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                            StyledLogo,
                            {
                              width: 40,
                              height: 40,
                              style: { marginRight: '1rem' },
                            }
                          )
                        ),
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          Item,
                          { href: '/explore' },
                          'Explore'
                        ),
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          Item,
                          { href: '/docs' },
                          'Docs'
                        ),
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          Item,
                          {
                            href: 'https://medium.com/@compuives',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          },
                          'Blog'
                        ),
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          Item,
                          {
                            href:
                              'https://github.com/CompuIves/codesandbox-client',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          },
                          'GitHub'
                        )
                      ),
                      react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                        Right,
                        null,
                        !user &&
                          react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                            Item,
                            { hideOn: 730, href: '/signin' },
                            'Sign In'
                          ),
                        react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                          Item,
                          {
                            hidePhone: !0,
                            href: '/s',
                            rel: 'noopener noreferrer',
                            button: !user,
                          },
                          'Create Sandbox'
                        ),
                        user &&
                          react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                            Item,
                            {
                              hidePhone: !0,
                              href: '/dashboard',
                              rel: 'noopener noreferrer',
                            },
                            user.username,
                            react__WEBPACK_IMPORTED_MODULE_8___default.a.createElement(
                              Image,
                              { alt: user.username, src: user.avatar_url }
                            )
                          )
                      )
                    )
                  );
                },
              },
            ]),
            Navigation
          );
        })(react__WEBPACK_IMPORTED_MODULE_8___default.a.PureComponent);
    },
    331: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__.p + 'static/media/play.f40d6682.svg';
    },
    336: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var taggedTemplateLiteral = __webpack_require__(2),
        react = __webpack_require__(0),
        react_default = __webpack_require__.n(react),
        IconBase = __webpack_require__(144),
        IconBase_default = __webpack_require__.n(IconBase),
        Tooltip = __webpack_require__(89),
        React = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            style = _ref.style,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              style: style,
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 256 228',
            },
            react.createElement(
              'g',
              null,
              react.createElement('path', {
                d:
                  'M210.483381,73.8236374 C207.827698,72.9095503 205.075867,72.0446761 202.24247,71.2267368 C202.708172,69.3261098 203.135596,67.4500894 203.515631,65.6059664 C209.753843,35.3248922 205.675082,10.9302478 191.747328,2.89849283 C178.392359,-4.80289661 156.551327,3.22703567 134.492936,22.4237776 C132.371761,24.2697233 130.244662,26.2241201 128.118477,28.2723861 C126.701777,26.917204 125.287358,25.6075897 123.876584,24.3549348 C100.758745,3.82852863 77.5866802,-4.82157937 63.6725966,3.23341515 C50.3303869,10.9571328 46.3792156,33.8904224 51.9945178,62.5880206 C52.5367729,65.3599011 53.1706189,68.1905639 53.8873982,71.068617 C50.6078941,71.9995641 47.4418534,72.9920277 44.4125156,74.0478303 C17.3093297,83.497195 0,98.3066828 0,113.667995 C0,129.533287 18.5815786,145.446423 46.8116526,155.095373 C49.0394553,155.856809 51.3511025,156.576778 53.7333796,157.260293 C52.9600965,160.37302 52.2875179,163.423318 51.7229345,166.398431 C46.3687351,194.597975 50.5500231,216.989464 63.8566899,224.664425 C77.6012619,232.590464 100.66852,224.443422 123.130185,204.809231 C124.905501,203.257196 126.687196,201.611293 128.472081,199.886102 C130.785552,202.113904 133.095375,204.222319 135.392897,206.199955 C157.14963,224.922338 178.637969,232.482469 191.932332,224.786092 C205.663234,216.837268 210.125675,192.78347 204.332202,163.5181 C203.88974,161.283006 203.374826,158.99961 202.796573,156.675661 C204.416503,156.196743 206.006814,155.702335 207.557482,155.188332 C236.905331,145.46465 256,129.745175 256,113.667995 C256,98.2510906 238.132466,83.3418093 210.483381,73.8236374 L210.483381,73.8236374 Z M204.118035,144.807565 C202.718197,145.270987 201.281904,145.718918 199.818271,146.153177 C196.578411,135.896354 192.205739,124.989735 186.854729,113.72131 C191.961041,102.721277 196.164656,91.9540963 199.313837,81.7638014 C201.93261,82.5215915 204.474374,83.3208483 206.923636,84.1643056 C230.613348,92.3195488 245.063763,104.377206 245.063763,113.667995 C245.063763,123.564379 229.457753,136.411268 204.118035,144.807565 L204.118035,144.807565 Z M193.603754,165.642007 C196.165567,178.582766 196.531475,190.282717 194.834536,199.429057 C193.309843,207.64764 190.243595,213.12715 186.452366,215.321689 C178.384612,219.991462 161.131788,213.921395 142.525146,197.909832 C140.392124,196.074366 138.243609,194.114502 136.088259,192.040261 C143.301619,184.151133 150.510878,174.979732 157.54698,164.793993 C169.922699,163.695814 181.614905,161.900447 192.218042,159.449363 C192.740247,161.555956 193.204126,163.621993 193.603754,165.642007 L193.603754,165.642007 Z M87.2761866,214.514686 C79.3938934,217.298414 73.1160375,217.378157 69.3211631,215.189998 C61.2461189,210.532528 57.8891498,192.554265 62.4682434,168.438039 C62.9927272,165.676183 63.6170041,162.839142 64.3365173,159.939216 C74.8234575,162.258154 86.4299951,163.926841 98.8353334,164.932519 C105.918826,174.899534 113.336329,184.06091 120.811247,192.08264 C119.178102,193.65928 117.551336,195.16028 115.933685,196.574699 C106.001303,205.256705 96.0479605,211.41654 87.2761866,214.514686 L87.2761866,214.514686 Z M50.3486141,144.746959 C37.8658105,140.48046 27.5570398,134.935332 20.4908634,128.884403 C14.1414664,123.446815 10.9357817,118.048415 10.9357817,113.667995 C10.9357817,104.34622 24.8334611,92.4562517 48.0123604,84.3748281 C50.8247961,83.3942121 53.7689223,82.4701001 56.8242337,81.6020363 C60.0276398,92.0224477 64.229889,102.917218 69.3011135,113.93411 C64.1642716,125.11459 59.9023288,136.182975 56.6674809,146.725506 C54.489347,146.099407 52.3791089,145.440499 50.3486141,144.746959 L50.3486141,144.746959 Z M62.7270678,60.4878073 C57.9160346,35.9004118 61.1112387,17.3525532 69.1516515,12.6982729 C77.7160924,7.74005624 96.6544653,14.8094222 116.614922,32.5329619 C117.890816,33.6657739 119.171723,34.8514442 120.456275,36.0781256 C113.018267,44.0647686 105.66866,53.1573386 98.6480514,63.0655695 C86.6081646,64.1815215 75.0831931,65.9741531 64.4868907,68.3746571 C63.8206914,65.6948233 63.2305903,63.0619242 62.7270678,60.4878073 L62.7270678,60.4878073 Z M173.153901,87.7550367 C170.620796,83.3796304 168.020249,79.1076627 165.369124,74.9523483 C173.537126,75.9849113 181.362914,77.3555864 188.712066,79.0329319 C186.505679,86.1041206 183.755673,93.4974728 180.518546,101.076741 C178.196419,96.6680702 175.740322,92.2229454 173.153901,87.7550367 L173.153901,87.7550367 Z M128.122121,43.8938899 C133.166461,49.3588189 138.218091,55.4603279 143.186789,62.0803968 C138.179814,61.8439007 133.110868,61.720868 128.000001,61.720868 C122.937434,61.720868 117.905854,61.8411667 112.929865,62.0735617 C117.903575,55.515009 122.99895,49.4217021 128.122121,43.8938899 L128.122121,43.8938899 Z M82.8018984,87.830679 C80.2715265,92.2183886 77.8609975,96.6393627 75.5753239,101.068539 C72.3906004,93.5156998 69.6661103,86.0886276 67.440586,78.9171899 C74.7446255,77.2826781 82.5335049,75.9461789 90.6495601,74.9332099 C87.9610684,79.1268011 85.3391054,83.4302106 82.8018984,87.8297677 L82.8018984,87.830679 L82.8018984,87.830679 Z M90.8833221,153.182899 C82.4979621,152.247395 74.5919739,150.979704 67.289757,149.390303 C69.5508242,142.09082 72.3354636,134.505173 75.5876271,126.789657 C77.8792246,131.215644 80.2993228,135.638441 82.8451877,140.03572 L82.8456433,140.03572 C85.4388987,144.515476 88.1255676,148.90364 90.8833221,153.182899 L90.8833221,153.182899 Z M128.424691,184.213105 C123.24137,178.620587 118.071264,172.434323 113.021912,165.780078 C117.923624,165.972373 122.921029,166.0708 128.000001,166.0708 C133.217953,166.0708 138.376211,165.953235 143.45336,165.727219 C138.468257,172.501308 133.434855,178.697141 128.424691,184.213105 L128.424691,184.213105 Z M180.622896,126.396409 C184.044571,134.195313 186.929004,141.741317 189.219234,148.9164 C181.796719,150.609693 173.782736,151.973534 165.339049,152.986959 C167.996555,148.775595 170.619884,144.430263 173.197646,139.960532 C175.805484,135.438399 178.28163,130.90943 180.622896,126.396409 L180.622896,126.396409 Z M163.724586,134.496971 C159.722835,141.435557 155.614455,148.059271 151.443648,154.311611 C143.847063,154.854776 135.998946,155.134562 128.000001,155.134562 C120.033408,155.134562 112.284171,154.887129 104.822013,154.402745 C100.48306,148.068386 96.285368,141.425078 92.3091341,134.556664 L92.3100455,134.556664 C88.3442923,127.706935 84.6943232,120.799333 81.3870228,113.930466 C84.6934118,107.045648 88.3338117,100.130301 92.276781,93.292874 L92.2758697,93.294241 C96.2293193,86.4385872 100.390102,79.8276317 104.688954,73.5329157 C112.302398,72.9573964 120.109505,72.6571055 127.999545,72.6571055 L128.000001,72.6571055 C135.925583,72.6571055 143.742714,72.9596746 151.353879,73.5402067 C155.587114,79.7888993 159.719645,86.3784378 163.688588,93.2350031 C167.702644,100.168578 171.389978,107.037901 174.724618,113.77508 C171.400003,120.627999 167.720871,127.566587 163.724586,134.496971 L163.724586,134.496971 Z M186.284677,12.3729198 C194.857321,17.3165548 198.191049,37.2542268 192.804953,63.3986692 C192.461372,65.0669011 192.074504,66.7661189 191.654369,68.4881206 C181.03346,66.0374921 169.500286,64.2138746 157.425315,63.0810626 C150.391035,53.0639249 143.101577,43.9572289 135.784778,36.073113 C137.751934,34.1806885 139.716356,32.3762092 141.672575,30.673346 C160.572216,14.2257007 178.236518,7.73185406 186.284677,12.3729198 L186.284677,12.3729198 Z M128.000001,90.8080696 C140.624975,90.8080696 150.859926,101.042565 150.859926,113.667995 C150.859926,126.292969 140.624975,136.527922 128.000001,136.527922 C115.375026,136.527922 105.140075,126.292969 105.140075,113.667995 C105.140075,101.042565 115.375026,90.8080696 128.000001,90.8080696 L128.000001,90.8080696 Z',
                fill: '#00D8FF',
              })
            )
          );
        },
        Angular = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 250 250',
            },
            react.createElement('polygon', {
              className: 'st0',
              fill: '#DD0031',
              points:
                '125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2 \t',
            }),
            react.createElement('polygon', {
              className: 'st1',
              fill: '#C3002F',
              points:
                '125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30 \t',
            }),
            react.createElement('path', {
              className: 'st2',
              fill: '#FFFFFF',
              d:
                'M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z',
            })
          );
        },
        Ember = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              className: className,
              viewBox: '0 0 260 260',
              version: '1.1',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            react.createElement(
              'g',
              {
                id: 'ember-favicon',
                stroke: 'none',
                strokeWidth: '1',
                fill: 'none',
                fillRule: 'evenodd',
              },
              react.createElement('rect', {
                id: 'Rectangle-26',
                fill: '#E05C43',
                fillRule: 'nonzero',
                x: '0',
                y: '0',
                width: '260',
                height: '260',
                rx: '25',
              }),
              react.createElement(
                'g',
                {
                  id: 'EmberConf-E-Icon',
                  transform: 'translate(24.086426, 47.469141)',
                  fill: '#FEFEFE',
                },
                react.createElement('path', {
                  d:
                    'M81.5351136,83.6911518 C82.5979161,41.7118285 110.145557,23.3659028 119.685713,32.5488798 C129.22587,41.7118285 125.686537,61.4647424 107.67404,73.8121913 C89.6665555,86.1646472 81.5351136,83.6911518 81.5351136,83.6911518 M107.67404,126.376473 C83.1995025,126.992343 85.7762972,110.934651 85.7762972,110.934651 C85.7762972,110.934651 175.13192,80.3914888 150.767674,20.0612328 C139.818803,4.53929794 127.095252,-0.337593864 109.087768,0.0179085163 C91.0752702,0.36840382 68.8967874,11.3389068 54.4135965,43.7997791 C47.5053801,59.2916715 45.1591935,73.9674106 43.7504788,85.0881259 C43.7504788,85.0881259 27.9237451,88.2626119 19.446391,81.2226634 C10.9740502,74.1727007 6.51729813,81.2226634 6.51729813,81.2226634 C6.51729813,81.2226634 -8.07618362,98.2767635 6.41202052,103.929752 C20.8952114,109.577734 43.4496856,110.719347 43.4496856,110.719347 L43.4396592,110.719347 C45.515132,125.740574 50.6236026,140.180981 69.1925674,152.243026 C100.329673,172.476619 146.536517,151.10642 146.536517,151.10642 C174.229541,139.545082 192.623043,121.649793 200.463718,112.932474 C202.990381,110.113491 202.905156,105.862483 200.278229,103.138634 L191.259447,93.7804095 C188.652573,91.0715815 184.411389,90.8212277 181.503722,93.2045957 C169.456956,103.058521 137.793462,126.376473 107.67404,126.376473',
                  id: 'Fill-1',
                })
              )
            )
          );
        },
        parcel = __webpack_require__(323),
        parcel_default = __webpack_require__.n(parcel),
        Parcel = function(props) {
          return react.createElement(
            'img',
            Object.assign({ alt: 'parcel', src: parcel_default.a }, props)
          );
        },
        Preact = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 256 296',
            },
            react.createElement(
              'g',
              null,
              react.createElement('polygon', {
                fill: '#673AB8',
                points:
                  '128 0 256 73.8999491 256 221.699847 128 295.599796 0 221.699847 0 73.8999491',
              }),
              react.createElement('path', {
                d:
                  'M34.8647584,220.478469 C51.8814262,242.25881 105.959701,225.662965 157.014868,185.774297 C208.070035,145.885628 237.255632,97.428608 220.238964,75.6482664 C203.222296,53.8679249 149.144022,70.4637701 98.0888543,110.352439 C47.0336869,150.241107 17.8480906,198.698127 34.8647584,220.478469 Z M42.1343351,214.798853 C36.4908625,207.575537 38.9565723,193.395881 49.7081913,175.544904 C61.0297348,156.747677 80.2490923,135.997367 103.76847,117.622015 C127.287848,99.2466634 152.071368,85.6181573 173.049166,79.1803727 C192.970945,73.066665 207.325915,74.1045667 212.969387,81.3278822 C218.61286,88.5511977 216.14715,102.730854 205.395531,120.581832 C194.073987,139.379058 174.85463,160.129368 151.335252,178.50472 C127.815874,196.880072 103.032354,210.508578 82.054556,216.946362 C62.1327769,223.06007 47.7778077,222.022168 42.1343351,214.798853 Z',
                fill: '#FFFFFF',
              }),
              react.createElement('path', {
                d:
                  'M220.238964,220.478469 C237.255632,198.698127 208.070035,150.241107 157.014868,110.352439 C105.959701,70.4637701 51.8814262,53.8679249 34.8647584,75.6482664 C17.8480906,97.428608 47.0336869,145.885628 98.0888543,185.774297 C149.144022,225.662965 203.222296,242.25881 220.238964,220.478469 Z M212.969387,214.798853 C207.325915,222.022168 192.970945,223.06007 173.049166,216.946362 C152.071368,210.508578 127.287848,196.880072 103.76847,178.50472 C80.2490923,160.129368 61.0297348,139.379058 49.7081913,120.581832 C38.9565723,102.730854 36.4908625,88.5511977 42.1343351,81.3278822 C47.7778077,74.1045667 62.1327769,73.066665 82.054556,79.1803727 C103.032354,85.6181573 127.815874,99.2466634 151.335252,117.622015 C174.85463,135.997367 194.073987,156.747677 205.395531,175.544904 C216.14715,193.395881 218.61286,207.575537 212.969387,214.798853 Z',
                fill: '#FFFFFF',
              }),
              react.createElement('path', {
                d:
                  'M127.551861,167.666971 C138.378632,167.666971 147.155465,158.890139 147.155465,148.063368 C147.155465,137.236596 138.378632,128.459764 127.551861,128.459764 C116.72509,128.459764 107.948257,137.236596 107.948257,148.063368 C107.948257,158.890139 116.72509,167.666971 127.551861,167.666971 L127.551861,167.666971 Z',
                fill: '#FFFFFF',
              })
            )
          );
        },
        Vue = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 256 221',
            },
            react.createElement(
              'g',
              null,
              react.createElement('path', {
                d:
                  'M204.8,0 L256,0 L128,220.8 L0,0 L50.56,0 L97.92,0 L128,51.2 L157.44,0 L204.8,0 Z',
                fill: '#41B883',
              }),
              react.createElement('path', {
                d:
                  'M0,0 L128,220.8 L256,0 L204.8,0 L128,132.48 L50.56,0 L0,0 Z',
                fill: '#41B883',
              }),
              react.createElement('path', {
                d:
                  'M50.56,0 L128,133.12 L204.8,0 L157.44,0 L128,51.2 L97.92,0 L50.56,0 Z',
                fill: '#35495E',
              })
            )
          );
        },
        Svelte = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 200 200',
            },
            react.createElement('path', {
              d:
                'M0 100v100h200V0H0v100zm140.9-71.6c.7.9 1.1 4.2.9 8.8l-.3 7.3-27 .5c-23.2.5-27.5.8-30.6 2.3-6.4 3.1-8.3 6-8.7 13.1-.5 7.5 1.4 12.4 6.2 16.1 1.8 1.3 13.5 7 26.1 12.6 24.7 11 29.6 13.8 34.5 19.6 6.8 8.3 9.7 30.1 5.6 42.3-2.7 7.8-10.1 14.9-18.6 18-6.2 2.2-8.1 2.3-39.1 2.8-38 .5-35.9 1-35.9-9.2 0-3.9.5-6.8 1.3-7.4.8-.7 11.9-1.2 30.2-1.4 32.3-.4 35.3-.9 39.8-7.2 1.9-2.7 2.2-4.4 2.2-12.1-.1-15-2.7-17.8-24.9-27-33.6-14-41.2-18.8-46.1-29.1-4.5-9.4-4.4-24.5.2-34.2 2.3-4.8 8.3-10.7 13-12.8 7.8-3.5 15.3-4.2 42.9-4.3 22.2-.1 27.4.2 28.3 1.3z',
              fill: '#A82022',
            })
          );
        },
        Sapper = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 200 200',
            },
            react.createElement('path', {
              d:
                'M0 100v100h200V0H0v100zm140.9-71.6c.7.9 1.1 4.2.9 8.8l-.3 7.3-27 .5c-23.2.5-27.5.8-30.6 2.3-6.4 3.1-8.3 6-8.7 13.1-.5 7.5 1.4 12.4 6.2 16.1 1.8 1.3 13.5 7 26.1 12.6 24.7 11 29.6 13.8 34.5 19.6 6.8 8.3 9.7 30.1 5.6 42.3-2.7 7.8-10.1 14.9-18.6 18-6.2 2.2-8.1 2.3-39.1 2.8-38 .5-35.9 1-35.9-9.2 0-3.9.5-6.8 1.3-7.4.8-.7 11.9-1.2 30.2-1.4 32.3-.4 35.3-.9 39.8-7.2 1.9-2.7 2.2-4.4 2.2-12.1-.1-15-2.7-17.8-24.9-27-33.6-14-41.2-18.8-46.1-29.1-4.5-9.4-4.4-24.5.2-34.2 2.3-4.8 8.3-10.7 13-12.8 7.8-3.5 15.3-4.2 42.9-4.3 22.2-.1 27.4.2 28.3 1.3z',
              fill: '#105E10',
            })
          );
        },
        Dojo = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: ''.concat(width, 'px'),
              height: ''.concat(height, 'px'),
              viewBox: '0 0 292.24 208.8',
            },
            react.createElement(
              'defs',
              null,
              react.createElement(
                'style',
                null,
                '.cls-4{fill:#f15a24}.cls-6{fill:#c1272d}'
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient',
                  x1: '69.16',
                  y1: '140.13',
                  x2: '68.94',
                  y2: '141.08',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#ff1d25',
                  stopOpacity: '.5',
                }),
                react.createElement('stop', {
                  offset: '.06',
                  stopColor: '#ff1d25',
                  stopOpacity: '.54',
                }),
                react.createElement('stop', {
                  offset: '.37',
                  stopColor: '#ff1d25',
                  stopOpacity: '.74',
                }),
                react.createElement('stop', {
                  offset: '.64',
                  stopColor: '#ff1d25',
                  stopOpacity: '.88',
                }),
                react.createElement('stop', {
                  offset: '.86',
                  stopColor: '#ff1d25',
                  stopOpacity: '.97',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#ff1d25',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-2',
                  x1: '76.7',
                  y1: '161.55',
                  x2: '76.7',
                  y2: '138.5',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#fffa8f',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#fb784b',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-3',
                  x1: '248.45',
                  y1: '60.44',
                  x2: '256.95',
                  y2: '53.44',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#5bcb99',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#85a8e8',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-4',
                  x1: '87.5',
                  y1: '144.92',
                  x2: '352.5',
                  y2: '7.42',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#34e28b',
                }),
                react.createElement('stop', { offset: '1' })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-5',
                  x1: '136.18',
                  y1: '171.56',
                  x2: '157.02',
                  y2: '171.56',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#c297ff',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#ae31bb',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-6',
                  x1: '51.23',
                  y1: '271.95',
                  x2: '314.73',
                  y2: '66.45',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', { offset: '0' }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#d23de2',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-7',
                  x1: '246.16',
                  y1: '48.83',
                  x2: '235.49',
                  y2: '84.83',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', { offset: '0' }),
                react.createElement('stop', { offset: '1', stopOpacity: '0' })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-8',
                  x1: '148.62',
                  y1: '188.16',
                  x2: '223.55',
                  y2: '206.3',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0',
                  stopColor: '#2db5f9',
                }),
                react.createElement('stop', { offset: '1' })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'linear-gradient-9',
                  x1: '90.05',
                  y1: '-.52',
                  x2: '40.55',
                  y2: '135.48',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', { offset: '0' }),
                react.createElement('stop', {
                  offset: '.21',
                  stopColor: '#48080a',
                }),
                react.createElement('stop', {
                  offset: '.42',
                  stopColor: '#891014',
                }),
                react.createElement('stop', {
                  offset: '.61',
                  stopColor: '#bc151b',
                }),
                react.createElement('stop', {
                  offset: '.78',
                  stopColor: '#e01a21',
                }),
                react.createElement('stop', {
                  offset: '.91',
                  stopColor: '#f71c24',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#ff1d25',
                })
              )
            ),
            react.createElement(
              'g',
              { style: { isolation: 'isolate' } },
              react.createElement(
                'g',
                { id: 'Layer_2', 'data-name': 'Layer 2' },
                react.createElement(
                  'g',
                  { id: 'Layer_1-2', 'data-name': 'Layer 1' },
                  react.createElement('path', {
                    d:
                      'M35.5 134.36c.23.37.46.73.7 1.09a77.28 77.28 0 0 0 12.36 13.73A60.52 60.52 0 0 0 87 162.89c.86 0 1.75 0 2.64-.07a90 90 0 0 0 28.26-7 89.8 89.8 0 0 1-12.15 1.11 49.36 49.36 0 0 1-36.69-16.28 89.37 89.37 0 0 1-33.56-6.29z',
                    fill: 'url(#linear-gradient-2)',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M87 41.39a60.71 60.71 0 0 1 52 29.33 49.52 49.52 0 0 0-47.13-10.85c11.08 5.37 26.3 9.47 47.19 10.9 0 0-1-19.89-26.48-30.28C77.05 26 72 28.88 63 13.88c0 0-2.93 15 8.07 29.62A60.88 60.88 0 0 1 87 41.39z',
                  }),
                  react.createElement('path', {
                    d:
                      'M112.58 40.49c-12.16-5-20.75-7.89-27.15-10.2A44.61 44.61 0 0 0 92 41.6a60.72 60.72 0 0 1 47 29.12 49.36 49.36 0 0 0-27.46-12.49 145 145 0 0 0 26.73 12.47l.79.07S138 50.88 112.58 40.49z',
                    fill: '#ed1c24',
                  }),
                  react.createElement('path', {
                    className: 'cls-6',
                    d:
                      'M139 70.76h.12c.39-2.17 2.78-19.34-16.58-34.38C93.67 14 88 11.88 86.65 0a37.16 37.16 0 0 0-1.22 30.29c6.4 2.31 15 5.23 27.15 10.2 25.42 10.39 26.48 30.28 26.48 30.28z',
                  }),
                  react.createElement('path', {
                    d:
                      'M226.74 51.2a45 45 0 0 1 29.52 11c10.4.62 19.41 4.74 25.44 10.63 0 0-24.29-35.29-67.13-20.62a55.76 55.76 0 0 0-11 5.36 45 45 0 0 1 23.17-6.37z',
                    fill: 'url(#linear-gradient-3)',
                  }),
                  react.createElement('path', {
                    d:
                      'M226.74 51.2a44.93 44.93 0 0 0-23.12 6.37c.41-.26.83-.5 1.24-.75-34.61 20.39-77 83-135.81 83.79a49.36 49.36 0 0 0 36.69 16.28 89.8 89.8 0 0 0 12.15-1.11c38.26-15.76 75-53.46 91.68-71.73C225 67.1 242 61.34 256.26 62.21a45 45 0 0 0-29.52-11.01z',
                    fill: 'url(#linear-gradient-4)',
                  }),
                  react.createElement('path', {
                    d:
                      'M137.4 172.57a28.13 28.13 0 0 0-1.22 7.83 29.91 29.91 0 0 0 1.37 9 22.14 22.14 0 0 1 7.36-19.71c.06-.23.12-.45.19-.68a27.24 27.24 0 0 1 11.9-15.32h-.12a52.24 52.24 0 0 0-5.33 2.05 27.93 27.93 0 0 0-14.15 16.83z',
                    fill: 'url(#linear-gradient-5)',
                  }),
                  react.createElement('path', {
                    d:
                      'M292.24 105.89a56.71 56.71 0 0 0-10.62-33.12c-6-5.85-15-9.94-25.36-10.56a45 45 0 0 1 15.65 34.17c0 15.17-5.5 32.51-23.34 41.84-26 13.59-65.81 7.12-91.66 15.51h.11A27.21 27.21 0 0 0 145.1 169c-.07.23-.13.45-.19.68 7.58-6.64 22.52-11.42 51.66-7.67 20.82 2.68 37.35 3.41 51.55-.66a55.09 55.09 0 0 0 33.74-22.73 56.74 56.74 0 0 0 10.38-32.73z',
                    fill: 'url(#linear-gradient-6)',
                  }),
                  react.createElement('path', {
                    d:
                      'M292.24 105.89a56.71 56.71 0 0 0-10.62-33.12c-6-5.85-15-9.94-25.36-10.56a45 45 0 0 1 15.65 34.17c0 15.17-5.5 32.51-23.34 41.84-26 13.59-65.81 7.12-91.66 15.51h.11A27.21 27.21 0 0 0 145.1 169c-.07.23-.13.45-.19.68 7.58-6.64 22.52-11.42 51.66-7.67 20.82 2.68 37.35 3.41 51.55-.66a55.09 55.09 0 0 0 33.74-22.73 56.74 56.74 0 0 0 10.38-32.73z',
                    opacity: '.49',
                    fill: 'url(#linear-gradient-7)',
                  }),
                  react.createElement('path', {
                    d:
                      'M163.24 203.2a27.35 27.35 0 0 1-18.3-33.6v.11a22.14 22.14 0 0 0-7.36 19.7 28 28 0 0 0 45 12.54 27.27 27.27 0 0 1-19.34 1.25z',
                    fill: 'url(#linear-gradient-8)',
                  }),
                  react.createElement('path', {
                    d:
                      'M172.74 201.22c2.84-8.26 12-21 21.83-15.17 0 0 8 4.5 9.67-8.16 0 0 6 29.79-22.87 28.79 0 0 6.5-4.75 6.43-9.63 0-.05-6.87 4.19-15.06 4.17z',
                    style: { mixBlendMode: 'screen' },
                    fill: '#2db5f9',
                  }),
                  react.createElement('path', {
                    d:
                      'M184.27 183c2.85-1.45 5.55-2.92 10.8-.58 4.08 1.81 9.21-5.27 4.77-11.59 0 0 .29 6.53-5 6.47s-8.22 2.24-10.57 5.7z',
                    style: { mixBlendMode: 'screen' },
                    fill: '#5fd2ff',
                  }),
                  react.createElement('path', {
                    d:
                      'M213.27 88.19c-6.91 9.42-17.05 17.31-18.24 19.24s2 8.18 6.75 8.63 1.1-1.81.7-4 1.41 1.4 7.05.55-2-2.93-1.52-5.79 6.34-8.26 8.66-13.7 6.29 0 4.26 4.25c-.81 1.68 6.44-4.74 2.78-9.64s-6.41-5.04-10.44.46zm-19.72 20.6c-1 1-4 3.17-4 3.17s2.94 4.08 6.72 4c0 0 .81-.39-.36-1.59s-2.63-4.86-2.36-5.58z',
                    fill: '#219058',
                  }),
                  react.createElement('path', {
                    d:
                      'M91.87 59.87C82 55.1 75.46 49.33 71.09 43.5a60.74 60.74 0 0 0-35.59 90.86 89.37 89.37 0 0 0 33.55 6.25 49.5 49.5 0 0 1 22.82-80.74z',
                    fill: 'url(#linear-gradient-9)',
                  }),
                  react.createElement('path', {
                    d:
                      'M92 41.6c2.7 3.89 10.44 10.61 19.56 16.64A49.25 49.25 0 0 1 139 70.72 60.7 60.7 0 0 0 92 41.6z',
                    fill: '#f7b852',
                  }),
                  react.createElement('path', {
                    d:
                      'M92 41.6c-1.65-.14-3.32-.21-5-.21a60.88 60.88 0 0 0-15.9 2.11c4.37 5.83 11 11.6 20.78 16.37a49.57 49.57 0 0 1 13.87-2 48.34 48.34 0 0 1 5.81.35C102.43 52.21 94.69 45.49 92 41.6z',
                    fill: '#ff8431',
                  }),
                  react.createElement('path', {
                    d:
                      'M125.7 55.43c.32 0-7.42-7-16.33-9.75 3.94 7.45 7.31 9.75 16.33 9.75z',
                    fill: '#fffb69',
                  }),
                  react.createElement('path', {
                    className: 'cls-6',
                    d:
                      'M108.52 23.7a83.68 83.68 0 0 1 8.75 6.12c.7.53-1.25-4.75-3.5-5.75a10 10 0 0 0-5.25-.37zm10.79 7.64a97.41 97.41 0 0 1 8.69 6.21c.71.51-1.2-4.76-3.44-5.78a10.08 10.08 0 0 0-5.25-.43zm10.17 7.48a25.66 25.66 0 0 1 4.7 5.87c.35.51.09-3.46-1.23-4.58a7 7 0 0 0-3.47-1.29z',
                  }),
                  react.createElement('path', {
                    d:
                      'M82.66 135.09c-.28-.87 3.13-2 4-2a16 16 0 0 1 4.77 1.58 21.71 21.71 0 0 1-6.5 1.33 5.8 5.8 0 0 1-2.27-.91zm12.28-2.9c-.3-.67 2.34-1.84 3.06-1.95a12.73 12.73 0 0 1 4 .87 18 18 0 0 1-5.12 1.65 4.82 4.82 0 0 1-1.94-.57zm10.27-3.77c-.3-.53 1.77-1.72 2.35-1.88a10.55 10.55 0 0 1 3.32.36 14.3 14.3 0 0 1-4.06 1.81 3.93 3.93 0 0 1-1.61-.29zm8.17-3.71c-.31-.46 1.49-1.7 2-1.89a9.94 9.94 0 0 1 3.06.1 13.21 13.21 0 0 1-3.58 1.94 3.68 3.68 0 0 1-1.48-.15zm7.62-4.17c-.3-.39 1.2-1.55 1.65-1.74a8.58 8.58 0 0 1 2.66-.07 11.78 11.78 0 0 1-3 1.87 3.29 3.29 0 0 1-1.31-.06zm-50.65 15.54c-.14-1 3.66-1.56 4.63-1.46a17.05 17.05 0 0 1 4.77 2.49 23.44 23.44 0 0 1-7.15.34 6.34 6.34 0 0 1-2.25-1.37z',
                    fill: '#44c688',
                  }),
                  react.createElement('path', {
                    className: 'cls-6',
                    d:
                      'M72.68 21.24c2.65 3 8.94 5 8.94 5s-1.5-3.49-1.25-10.13c0-.23-7.69-.12-9-6.43-.27-1.26-1.37 8.53 1.31 11.56z',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M46.54 166.82a7.35 7.35 0 0 1 3-5.19c.08-.06.16-.09.24-.14a16.17 16.17 0 0 0-1.91-.33c-9.16-1.37-11.48 4.09-12 10.21a9.21 9.21 0 0 0 0 1 11.11 11.11 0 0 1 10.54-5.61z',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M57.7 164.83c-9.1-5.53-14.22-5.93-16.25 9.55 0 0 9.58-7.58 14.11-2.57 4.91 5.45 11.61.43 8.09-2.75a25.19 25.19 0 0 0-5.95-4.23z',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M53.92 166.62c-5.16 3.44-5.15 11.53-5.15 11.53s9.42-5.1 8.68-8.27a3.92 3.92 0 0 0-3.53-3.26zM11 103a7.33 7.33 0 0 1 6-.9 2.18 2.18 0 0 1 .27.11 17.74 17.74 0 0 0-.94-1.7c-4.66-8-10.37-6.4-15.45-3-.3.2-.57.41-.84.63a11.11 11.11 0 0 1 11 4.72.53.53 0 0 1-.04.14z',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M20.8 112.52c-3.31-13.13-6-18.21-18.68-9.13 0 0 10.87-3.13 12.11 12.33.59 7.32 7.61 8.78 7.53 4a24.9 24.9 0 0 0-.96-7.2z',
                  }),
                  react.createElement('path', {
                    className: 'cls-4',
                    d:
                      'M16.17 105.49c-6-1.43-12 4.09-12 4.09s9.28-.32 10.41 5.31c.67 3.19 1.59-9.4 1.59-9.4z',
                  }),
                  react.createElement('path', {
                    d:
                      'M209.57 84.05a74 74 0 0 1 20.71-16.71c7.55-4 18.27-6.48 24.74-6.16l2.48 2.13-1.3-.11a50.57 50.57 0 0 0-25.47 5 73.67 73.67 0 0 0-21.16 15.85z',
                    fill: '#29b36e',
                  }),
                  react.createElement('path', {
                    d:
                      'M255.94 61.25a45.88 45.88 0 0 1 14 3.59 36.75 36.75 0 0 1 11.79 8 36.45 36.45 0 0 0-12.15-7.08 58.3 58.3 0 0 0-12.06-2.45L255 61.18z',
                    fill: '#6fd191',
                  }),
                  react.createElement('path', {
                    d:
                      'M145.48 167.88a36.33 36.33 0 0 1 4.16-2.55c1-.5 2-1 3.09-1.39s2.12-.77 3.18-1.13a61.33 61.33 0 0 1 13.17-2.42 127.82 127.82 0 0 1 26.53 1.05 260.84 260.84 0 0 0 26.3 2.52c8.79.28 17.68-.24 26.21-2.57-8.49 2.49-17.4 3.19-26.22 3.08a261.92 261.92 0 0 1-26.41-2 126.86 126.86 0 0 0-26.27-.54 59.18 59.18 0 0 0-12.77 2.59c-1 .36-2 .69-3 1.14a30.87 30.87 0 0 0-2.91 1.37 29 29 0 0 0-5.26 3.61l-.71.62a24.83 24.83 0 0 1 .91-3.38z',
                    fill: '#c83ad7',
                  }),
                  react.createElement('path', {
                    className: 'cls-6',
                    d:
                      'M93.51 63.8c-8.5 1.88-7.19 8.63-7.19 8.63s2.69-3.25 17.5-5a70.07 70.07 0 0 1-10.31-3.63z',
                  }),
                  react.createElement('path', {
                    d:
                      'M137.55 189.42a22.32 22.32 0 0 1-.11-5.66 24.87 24.87 0 0 1 3.72-10.82 26.7 26.7 0 0 1 3.72-4.52l.61-.56s-.84 2.7-.94 3.36a24.54 24.54 0 0 0-2.16 2.58 23.79 23.79 0 0 0-4.45 10 21.38 21.38 0 0 0-.39 5.62z',
                    fill: '#fba9ff',
                  }),
                  react.createElement('path', {
                    d:
                      'M67.07 140.61c-4.83-5.31-8.9-13.76-10.62-21.67a48.81 48.81 0 0 1-1.1-12.69l.18-3.18.47-3.15a30.19 30.19 0 0 1 .62-3.12 27.19 27.19 0 0 1 .81-3.07 47.28 47.28 0 0 1 5.12-11.56A52.69 52.69 0 0 1 66.11 77l2-2.4c.67-.81 1.46-1.51 2.19-2.27a49.79 49.79 0 0 1 10-7.59 53.25 53.25 0 0 1 11.53-4.84 53 53 0 0 0-11.3 5.1 49.38 49.38 0 0 0-9.65 7.8c-.69.77-1.45 1.48-2.09 2.29l-1.94 2.42a52.85 52.85 0 0 0-3.35 5.2 46.33 46.33 0 0 0-4.65 11.4 25.56 25.56 0 0 0-.69 3 28.17 28.17 0 0 0-.51 3l-.34 3-.09 3.07a47.22 47.22 0 0 0 1.42 12.14 48.39 48.39 0 0 0 11.52 21.28l.89 1s-3.24.06-3.98.01z',
                    fill: '#ff737d',
                  }),
                  react.createElement('path', {
                    d:
                      'M117.89 155.78a63.46 63.46 0 0 1-13.28 1.51 49.93 49.93 0 0 1-13.28-2.19 62.42 62.42 0 0 1-12.47-5.24A46.43 46.43 0 0 1 68 141.62l-.93-1s3.19 0 4-.08a44.77 44.77 0 0 0 9 7.35 60.26 60.26 0 0 0 11.79 5.71 48.25 48.25 0 0 0 12.82 2.83 64 64 0 0 0 13.21-.65z',
                    fill: '#fff4c0',
                  })
                )
              )
            )
          );
        },
        cxjs = __webpack_require__(324),
        cxjs_default = __webpack_require__.n(cxjs),
        CxJS = function(props) {
          return react.createElement(
            'img',
            Object.assign({ alt: 'cxjs', src: cxjs_default.a }, props)
          );
        },
        Reason = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 35 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 35 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              className: className,
              width: width,
              height: height,
              viewBox: '0 0 218 218',
              xmlns: 'http://www.w3.org/2000/svg',
              xmlnsXlink: 'http://www.w3.org/1999/xlink',
            },
            react.createElement(
              'defs',
              null,
              react.createElement('rect', {
                id: 'path-1',
                width: '216',
                height: '216',
              }),
              react.createElement(
                'filter',
                {
                  x: '-.5%',
                  y: '-.5%',
                  width: '100.9%',
                  height: '101.9%',
                  filterUnits: 'objectBoundingBox',
                  id: 'filter-2',
                },
                react.createElement('feOffset', {
                  dy: '2',
                  in: 'SourceAlpha',
                  result: 'shadowOffsetOuter1',
                }),
                react.createElement('feComposite', {
                  in: 'shadowOffsetOuter1',
                  in2: 'SourceAlpha',
                  operator: 'out',
                  result: 'shadowOffsetOuter1',
                }),
                react.createElement('feColorMatrix', {
                  values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0',
                  in: 'shadowOffsetOuter1',
                })
              ),
              react.createElement('path', {
                d:
                  'M128.128,197 L103.702,197 L91.666,174.108 L75.618,174.108 L75.618,197 L54.024,197 L54.024,114.282 L91.194,114.282 C113.142,114.282 125.65,124.902 125.65,143.31 C125.65,155.818 120.458,165.022 110.9,169.978 L128.128,197 Z M75.618,131.51 L75.618,156.88 L91.312,156.88 C100.044,156.88 105.118,152.396 105.118,144.018 C105.118,135.876 100.044,131.51 91.312,131.51 L75.618,131.51 Z M139.456,114.282 L204.71,114.282 L204.71,131.51 L161.05,131.51 L161.05,146.968 L200.462,146.968 L200.462,164.078 L161.05,164.196 L161.05,179.772 L205.89,179.772 L205.89,197 L139.456,197 L139.456,114.282 Z',
                id: 'path-3',
              }),
              react.createElement(
                'filter',
                {
                  x: '-.7%',
                  y: '-1.2%',
                  width: '101.3%',
                  height: '102.4%',
                  filterUnits: 'objectBoundingBox',
                  id: 'filter-4',
                },
                react.createElement('feOffset', {
                  dy: '2',
                  in: 'SourceAlpha',
                  result: 'shadowOffsetInner1',
                }),
                react.createElement('feComposite', {
                  in: 'shadowOffsetInner1',
                  in2: 'SourceAlpha',
                  operator: 'arithmetic',
                  k2: '-1',
                  k3: '1',
                  result: 'shadowInnerInner1',
                }),
                react.createElement('feColorMatrix', {
                  values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0',
                  in: 'shadowInnerInner1',
                })
              )
            ),
            react.createElement(
              'g',
              { id: 'Page-1', fill: 'none', fillRule: 'evenodd' },
              react.createElement(
                'g',
                { id: 'Path' },
                react.createElement(
                  'g',
                  { id: 'Rectangle-1' },
                  react.createElement('use', {
                    fill: '#000',
                    filter: 'url(#filter-2)',
                    xlinkHref: '#path-1',
                  }),
                  react.createElement('use', {
                    fill: '#DD4B39',
                    xlinkHref: '#path-1',
                  }),
                  react.createElement('rect', {
                    stroke: '#D74837',
                    x: '0.5',
                    y: '0.5',
                    width: '215',
                    height: '215',
                  })
                ),
                react.createElement(
                  'g',
                  { id: '[RE]ASON' },
                  react.createElement('use', {
                    fill: '#FFF',
                    xlinkHref: '#path-3',
                  }),
                  react.createElement('use', {
                    fill: '#000',
                    filter: 'url(#filter-4)',
                    xlinkHref: '#path-3',
                  })
                )
              )
            )
          );
        },
        Gatsby = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              viewBox: '0 0 28 28',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            react.createElement(
              'g',
              { id: 'Page-1', fill: 'none', fillRule: 'evenodd' },
              react.createElement(
                'g',
                { id: 'logo', fillRule: 'nonzero' },
                react.createElement(
                  'g',
                  { id: 'Group' },
                  react.createElement(
                    'g',
                    { fill: '#FFF', id: 'Shape' },
                    react.createElement('path', {
                      d:
                        'M22,11 L15,11 L15,13 L19.8,13 C19.1,16 16.9,18.5 14,19.5 L2.5,8 C3.7,4.5 7.1,2 11,2 C14,2 16.7,3.5 18.4,5.8 L19.9,4.5 C17.9,1.8 14.7,0 11,0 C5.8,0 1.4,3.7 0.3,8.6 L13.5,21.8 C18.3,20.6 22,16.2 22,11 Z',
                      transform: 'translate(3 3)',
                    }),
                    react.createElement('path', {
                      d:
                        'M0,11.1 C0,13.9 1.1,16.6 3.2,18.7 C5.3,20.8 8.1,21.9 10.8,21.9 L0,11.1 Z',
                      transform: 'translate(3 3)',
                    })
                  ),
                  react.createElement('path', {
                    d:
                      'M14,0 C6.3,0 0,6.3 0,14 C0,21.7 6.3,28 14,28 C21.7,28 28,21.7 28,14 C28,6.3 21.7,0 14,0 Z M6.2,21.8 C4.1,19.7 3,16.9 3,14.2 L13.9,25 C11.1,24.9 8.3,23.9 6.2,21.8 Z M16.4,24.7 L3.3,11.6 C4.4,6.7 8.8,3 14,3 C17.7,3 20.9,4.8 22.9,7.5 L21.4,8.8 C19.7,6.5 17,5 14,5 C10.1,5 6.8,7.5 5.5,11 L17,22.5 C19.9,21.5 22.1,19 22.8,16 L18,16 L18,14 L25,14 C25,19.2 21.3,23.6 16.4,24.7 Z',
                    id: 'Shape',
                    fill: '#639',
                  })
                )
              )
            )
          );
        },
        Next = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              viewBox: '0 0 512 309',
              xmlns: 'http://www.w3.org/2000/svg',
              preserveAspectRatio: 'xMidYMid',
            },
            react.createElement('path', {
              fill: 'white',
              d:
                'M120.81043,80.5613102 L217.378325,80.5613102 L217.378325,88.2366589 L129.662487,88.2366589 L129.662487,146.003758 L212.147564,146.003758 L212.147564,153.679106 L129.662487,153.679106 L129.662487,217.101725 L218.384241,217.101725 L218.384241,224.777073 L120.81043,224.777073 L120.81043,80.5613102 Z M226.0292,80.5613102 L236.289538,80.5613102 L281.756922,143.983929 L328.230222,80.5613102 L391.441486,0 L287.591232,150.649363 L341.105941,224.777073 L330.443237,224.777073 L281.756922,157.314798 L232.869425,224.777073 L222.407904,224.777073 L276.324978,150.649363 L226.0292,80.5613102 Z M344.928421,88.2366588 L344.928421,80.5613102 L454.975585,80.5613102 L454.975585,88.2366589 L404.27744,88.2366589 L404.27744,224.777073 L395.425382,224.777073 L395.425382,88.2366589 L344.928421,88.2366588 Z M1.42108547e-14,80.5613102 L11.0650714,80.5613102 L163.64593,308.884007 L100.591558,224.777073 L9.25442331,91.4683847 L8.85205708,224.777073 L1.42108547e-14,224.777073 L1.42108547e-14,80.5613102 Z M454.083705,214.785469 C452.275167,214.785469 450.918762,213.38418 450.918762,211.573285 C450.918762,209.762388 452.275167,208.361099 454.083705,208.361099 C455.913774,208.361099 457.248648,209.762388 457.248648,211.573285 C457.248648,213.38418 455.913774,214.785469 454.083705,214.785469 Z M462.781915,206.334618 L467.518563,206.334618 C467.583153,208.900055 469.456284,210.624719 472.212151,210.624719 C475.290972,210.624719 477.03492,208.770705 477.03492,205.29982 L477.03492,183.310363 L481.85769,183.310363 L481.85769,205.321379 C481.85769,211.573285 478.240613,215.173518 472.255212,215.173518 C466.635824,215.173518 462.781915,211.681076 462.781915,206.334618 Z M488.166045,206.054362 L492.945754,206.054362 C493.354828,209.007848 496.239878,210.883419 500.395211,210.883419 C504.270652,210.883419 507.11264,208.878498 507.11264,206.119036 C507.11264,203.747625 505.304102,202.324777 501.191828,201.354653 L497.187209,200.384531 C491.56782,199.069474 489.005723,196.353129 489.005723,191.782772 C489.005723,186.24229 493.527071,182.555823 500.30909,182.555823 C506.617445,182.555823 511.224912,186.24229 511.504805,191.480955 L506.811217,191.480955 C506.359083,188.613703 503.861576,186.824365 500.244499,186.824365 C496.43365,186.824365 493.893085,188.656819 493.893085,191.459398 C493.893085,193.679901 495.52938,194.95184 499.577063,195.900406 L503.000368,196.741178 C509.373314,198.228702 512,200.815695 512,205.493846 C512,211.443935 507.392533,215.173518 500.029197,215.173518 C493.139526,215.173518 488.51053,211.6164 488.166045,206.054362 Z',
            })
          );
        },
        Nuxt = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              viewBox: '0 0 223 158',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            react.createElement(
              'g',
              { id: 'Page-1', fill: 'none', fillRule: 'evenodd' },
              react.createElement(
                'g',
                { id: 'nuxt', fillRule: 'nonzero' },
                react.createElement(
                  'g',
                  { id: 'Group' },
                  react.createElement('polyline', {
                    id: 'Shape',
                    fill: '#41B883',
                    points:
                      '70.6465795 158 36.7703219 158 0.157042254 158 91.7126761 0 183.26831 158 147.103722 158 113.227465 158',
                  }),
                  react.createElement('polyline', {
                    id: 'Shape',
                    fill: '#328170',
                    points:
                      '174.272032 158 222.842958 158 143.424447 21.4332386 64.6789738 158 113.249899 158',
                  }),
                  react.createElement('polyline', {
                    id: 'Shape',
                    fill: '#35495E',
                    points:
                      '145.421127 158 181.204326 158 122.694869 57.4096591 64.6789738 158 100.462173 158',
                  })
                )
              )
            )
          );
        },
        Node = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 259.58 260.47',
              style: { transform: 'scale(2, 2)' },
            },
            react.createElement(
              'defs',
              null,
              react.createElement(
                'clipPath',
                { id: 'a', transform: 'translate(55 55.1)' },
                react.createElement('path', {
                  fill: 'none',
                  d:
                    'M71.61 4.24L15.44 36.67A6.78 6.78 0 0 0 12 42.54v64.89a6.78 6.78 0 0 0 3.39 5.87l56.18 32.45a6.8 6.8 0 0 0 6.79 0l56.17-32.45a6.79 6.79 0 0 0 3.39-5.87V42.54a6.78 6.78 0 0 0-3.4-5.87L78.4 4.24a6.83 6.83 0 0 0-6.8 0',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'b',
                  x1: '-245.73',
                  x2: '-244.14',
                  y1: '504.44',
                  y2: '504.44',
                  gradientTransform:
                    'matrix(-50.8 103.5 103.5 50.8 -64583.4 -167)',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0.3',
                  stopColor: '#3e863d',
                }),
                react.createElement('stop', {
                  offset: '0.5',
                  stopColor: '#55934f',
                }),
                react.createElement('stop', {
                  offset: '0.8',
                  stopColor: '#5aad45',
                })
              ),
              react.createElement(
                'clipPath',
                { id: 'c', transform: 'translate(55 55.1)' },
                react.createElement('path', {
                  fill: 'none',
                  d:
                    'M13.44 111.55a6.8 6.8 0 0 0 2 1.75l48.19 27.83 8 4.61a6.81 6.81 0 0 0 3.91.89 6.94 6.94 0 0 0 1.33-.24l59.27-108.47a6.72 6.72 0 0 0-1.58-1.25L97.78 15.42 78.34 4.24a7.09 7.09 0 0 0-1.76-.71z',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'd',
                  x1: '-247.4',
                  x2: '-246.37',
                  y1: '501.46',
                  y2: '501.46',
                  gradientTransform:
                    'rotate(-36.5 113113.8 -110864.6) scale(177.1)',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0.57',
                  stopColor: '#3e863d',
                }),
                react.createElement('stop', {
                  offset: '0.72',
                  stopColor: '#619857',
                }),
                react.createElement('stop', {
                  offset: '1',
                  stopColor: '#76ac64',
                })
              ),
              react.createElement(
                'clipPath',
                { id: 'e', transform: 'translate(55 55.1)' },
                react.createElement('path', {
                  fill: 'none',
                  d:
                    'M74.33 3.38a6.85 6.85 0 0 0-2.71.87l-56 32.33 60.4 110a6.74 6.74 0 0 0 2.41-.83l56.17-32.45a6.81 6.81 0 0 0 3.28-4.63L76.29 3.49a7.05 7.05 0 0 0-1.37-.14h-.56',
                })
              ),
              react.createElement(
                'linearGradient',
                {
                  id: 'f',
                  x1: '-245.84',
                  x2: '-244.9',
                  y1: '501.11',
                  y2: '501.11',
                  gradientTransform: 'matrix(129.9 0 0 -129.9 31948.1 65164.3)',
                  gradientUnits: 'userSpaceOnUse',
                },
                react.createElement('stop', {
                  offset: '0.16',
                  stopColor: '#6bbf47',
                }),
                react.createElement('stop', {
                  offset: '0.38',
                  stopColor: '#79b461',
                }),
                react.createElement('stop', {
                  offset: '0.47',
                  stopColor: '#75ac64',
                }),
                react.createElement('stop', {
                  offset: '0.7',
                  stopColor: '#659e5a',
                }),
                react.createElement('stop', {
                  offset: '0.9',
                  stopColor: '#3e863d',
                })
              )
            ),
            react.createElement(
              'g',
              { clipPath: 'url(#a)' },
              react.createElement('path', {
                fill: 'url(#b)',
                d: 'M194.72 31.16L36.44-46.42l-81.16 165.56 158.28 77.59z',
                transform: 'translate(55 55.1)',
              })
            ),
            react.createElement(
              'g',
              { clipPath: 'url(#c)' },
              react.createElement('path', {
                fill: 'url(#d)',
                d: 'M-55 54.11L56.76 205.38 204.58 96.17 92.8-55.09z',
                transform: 'translate(55 55.1)',
              })
            ),
            react.createElement(
              'g',
              { clipPath: 'url(#e)' },
              react.createElement('path', {
                fill: 'url(#f)',
                d: 'M15.6 3.35v143.24h122.24V3.35H15.6z',
                transform: 'translate(55 55.1)',
              })
            )
          );
        },
        Apollo = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              viewBox: '0 0 256 256',
              xmlns: 'http://www.w3.org/2000/svg',
              preserveAspectRatio: 'xMidYMid',
            },
            react.createElement('path', {
              d:
                'M160.227,178.5186 L187.857,178.5186 L143.75,64.0486 L113.201,64.0486 L69.094,178.5186 L96.726,178.5186 L103.934,159.1286 L145.609,159.1286 L138.065,137.6726 L110.625,137.6726 L128.475,88.4186 L160.227,178.5186 Z M251.339,93.768 C250.357,90.232 246.705,88.155 243.154,89.141 C239.617,90.123 237.544,93.787 238.526,97.324 C241.299,107.309 242.704,117.63 242.704,128 C242.704,191.248 191.248,242.702 128,242.702 C64.752,242.702 13.297,191.248 13.297,128 C13.297,64.751 64.752,13.296 128,13.296 C154.793,13.296 180.718,22.814 201.179,39.752 C200.383,41.652 199.941,43.737 199.941,45.925 C199.941,54.76 207.103,61.922 215.938,61.922 C224.773,61.922 231.935,54.76 231.935,45.925 C231.935,37.09 224.773,29.928 215.938,29.928 C214.237,29.928 212.6,30.199 211.062,30.691 C188.022,11.056 158.513,0 128,0 C57.421,0 0,57.42 0,128 C0,198.579 57.421,255.999 128,255.999 C198.579,255.999 256,198.579 256,128 C256,116.428 254.433,104.91 251.339,93.768 Z',
              fill: 'white',
            })
          );
        },
        Nest = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              id: 'svg8',
              version: '1.1',
              viewBox: '0 0 259.58 260.47',
              height: height,
              width: width,
              className: className,
            },
            react.createElement(
              'defs',
              { id: 'defs2' },
              react.createElement('pattern', {
                id: 'EMFhbasepattern',
                patternUnits: 'userSpaceOnUse',
                width: '6',
                height: '6',
                x: '0',
                y: '0',
              })
            ),
            react.createElement(
              'g',
              { transform: 'translate(0,-41.412483)', id: 'layer1' },
              react.createElement('path', {
                fill: '#e0234e',
                d:
                  'm 153.60541,44.155399 c -1.83107,0 -3.53136,0.392387 -5.10086,0.915541 3.33516,2.223454 5.16625,5.166288 6.08182,8.501469 0.0655,0.457764 0.19618,0.784759 0.26167,1.242509 0.0655,0.392386 0.13071,0.784759 0.13071,1.177144 0.2617,5.754822 -1.50414,6.474175 -2.74664,9.874762 -1.89649,4.381541 -1.37334,9.090038 0.91553,12.883009 0.1962,0.457752 0.45777,0.980919 0.78477,1.438696 -2.48507,-16.54516 11.31349,-19.030204 13.8639,-24.196467 0.19619,-4.512325 -3.53136,-7.520537 -6.47416,-9.613208 -2.81203,-1.700287 -5.3625,-2.223455 -7.71674,-2.223455 z m 20.79589,3.727566 c -0.26168,1.504102 -0.0655,1.111728 -0.13068,1.896486 -0.0655,0.523155 -0.0655,1.17713 -0.13069,1.700286 -0.13069,0.523169 -0.2617,1.046323 -0.45779,1.569516 -0.13068,0.523156 -0.32697,1.046324 -0.52316,1.569478 -0.2617,0.523194 -0.45776,0.980946 -0.71935,1.504113 -0.19618,0.261691 -0.32697,0.523156 -0.52316,0.784758 -0.13069,0.196186 -0.26169,0.392374 -0.39237,0.58856 -0.32697,0.457789 -0.65398,0.91554 -0.98094,1.307912 -0.39239,0.392386 -0.71936,0.850138 -1.17716,1.177145 0,0.06548 0,0.06548 0,0.06548 -0.39236,0.326981 -0.78474,0.719354 -1.2425,1.046323 -1.37332,1.046323 -2.9428,1.831081 -4.38153,2.812025 -0.45775,0.32697 -0.91554,0.588573 -1.30791,0.980945 -0.45776,0.326969 -0.85015,0.653938 -1.2425,1.046323 -0.4578,0.392373 -0.78477,0.784758 -1.17716,1.242534 -0.32697,0.392386 -0.71934,0.850139 -0.98091,1.307927 -0.32701,0.457751 -0.65397,0.915529 -0.91557,1.373292 -0.26168,0.523155 -0.45776,0.980944 -0.71935,1.5041 -0.19618,0.523155 -0.39238,0.980945 -0.52316,1.504099 -0.19619,0.588572 -0.32698,1.11174 -0.45777,1.634921 -0.0655,0.26169 -0.0655,0.588547 -0.1307,0.850137 -0.0655,0.26169 -0.0655,0.523155 -0.13068,0.784758 0,0.523155 -0.0655,1.111727 -0.0655,1.634882 0,0.392385 0,0.784758 0.0655,1.177143 0,0.523156 0.0655,1.046312 0.19618,1.634883 0.0655,0.523154 0.19618,1.046322 0.327,1.569516 0.1962,0.523155 0.32698,1.046323 0.52316,1.569478 0.13071,0.327008 0.32697,0.653976 0.45779,0.915541 l -15.04106,-5.820235 c -2.55046,-0.719354 -5.03548,-1.373292 -7.58594,-1.961864 -1.3733,-0.326969 -2.7466,-0.653962 -4.11993,-0.980944 -3.92376,-0.784745 -7.91287,-1.373293 -11.90204,-1.765665 -0.13068,0 -0.19618,-0.06548 -0.32697,-0.06548 -3.92378,-0.392373 -7.78211,-0.58856 -11.70586,-0.58856 -2.87744,0 -5.75487,0.130683 -8.566892,0.32697 -3.989152,0.261691 -7.97831,0.784758 -11.967434,1.438695 -0.980946,0.130695 -1.961891,0.327007 -2.942838,0.523194 -2.027264,0.392347 -3.989125,0.850137 -5.885608,1.307912 -0.980945,0.261691 -1.961891,0.523169 -2.942837,0.784735 -0.980913,0.392371 -1.896452,0.850162 -2.812022,1.242533 -0.71935,0.326969 -1.438698,0.653951 -2.158048,0.980944 -0.130691,0.06548 -0.261688,0.06548 -0.326972,0.130696 -0.653973,0.326969 -1.24254,0.588534 -1.831077,0.91554 -0.19619,0.06548 -0.327003,0.130683 -0.457786,0.196187 -0.719348,0.32697 -1.438696,0.719342 -2.027265,1.046323 -0.457785,0.196187 -0.915538,0.457777 -1.307915,0.653976 -0.19619,0.130683 -0.457787,0.261678 -0.588569,0.326969 -0.588566,0.326969 -1.177133,0.653937 -1.700294,0.980944 -0.588568,0.326969 -1.111729,0.653938 -1.569513,0.980907 -0.457753,0.327007 -0.915536,0.588572 -1.307917,0.915541 -0.06551,0.06548 -0.13069,0.06548 -0.196189,0.130696 -0.392377,0.26169 -0.85013,0.588558 -1.242508,0.915565 0,0 -0.06551,0.06548 -0.13069,0.130693 -0.326972,0.261691 -0.653975,0.523157 -0.980946,0.784722 -0.13069,0.06548 -0.261688,0.196186 -0.392378,0.26169 -0.326971,0.261692 -0.653943,0.588572 -0.980915,0.850162 -0.06551,0.130694 -0.196188,0.196186 -0.261687,0.261691 -0.392378,0.392372 -0.784757,0.719341 -1.177135,1.111727 -0.06551,0 -0.06551,0.06548 -0.13069,0.130682 -0.392378,0.326982 -0.784755,0.719355 -1.177133,1.11174 -0.06551,0.06548 -0.06551,0.130681 -0.130691,0.130681 -0.326971,0.32697 -0.653942,0.653976 -0.980945,1.046323 -0.130689,0.130695 -0.326971,0.261692 -0.457754,0.392373 -0.326971,0.392385 -0.719349,0.784758 -1.111726,1.177144 -0.06551,0.130683 -0.196189,0.196187 -0.261689,0.326969 -0.523162,0.523193 -0.980946,1.046348 -1.504106,1.569515 -0.06551,0.06548 -0.130689,0.13068 -0.196188,0.196187 -1.046353,1.111726 -2.158081,2.223453 -3.335185,3.204388 -1.177133,1.046318 -2.419644,2.027268 -3.662184,2.877408 -1.307917,0.91557 -2.550427,1.70029 -3.92375,2.48504 -1.307917,0.71934 -2.68124,1.37332 -4.119938,1.96189 -1.373324,0.58856 -2.812022,1.11174 -4.250723,1.56949 -2.746645,0.58856 -5.558669,1.70029 -7.978313,1.89648 -0.52316,0 -1.111727,0.1307 -1.634889,0.19618 -0.588565,0.13069 -1.111726,0.26169 -1.634886,0.39239 -0.523161,0.19618 -1.046352,0.39237 -1.569514,0.58855 -0.523161,0.19619 -1.046322,0.45779 -1.569483,0.71937 -0.457784,0.32696 -0.980944,0.58856 -1.43873,0.91553 -0.457755,0.32697 -0.91554,0.71934 -1.307918,1.11173 -0.457753,0.327 -0.9155376,0.78476 -1.307916,1.17712 -0.3923787,0.4578 -0.7847562,0.85017 -1.1117275,1.30791 -0.3269714,0.52317 -0.7193499,0.98096 -0.980946,1.50413 -0.3269713,0.45778 -0.6539426,0.98094 -0.9155387,1.50408 -0.2616879,0.58859 -0.5231601,1.11174 -0.7193499,1.70031 -0.1961888,0.52317 -0.3923776,1.11172 -0.5885665,1.7003 -0.1306896,0.52315 -0.2616878,1.04632 -0.3269712,1.56947 0,0.0655 -0.065496,0.1307 -0.065496,0.19619 -0.1306906,0.5886 -0.1306906,1.37336 -0.1961898,1.76575 -0.065496,0.45775 -0.1306886,0.85012 -0.1306886,1.30791 0,0.26168 0,0.58853 0.065496,0.85012 0.065496,0.4578 0.1306885,0.85016 0.2616879,1.24256 0.1306896,0.39233 0.2616878,0.78471 0.4577539,1.1771 0,0.0655 0,0.0655 0,0.0655 0.1961888,0.3924 0.4577848,0.78477 0.7193499,1.17714 0.2616878,0.39239 0.5231911,0.78476 0.8501624,1.17714 0.3269713,0.32697 0.71935,0.71933 1.1117274,1.04632 0.3923786,0.39237 0.7847572,0.71934 1.2425101,1.04631 1.5695126,1.37334 1.9618906,1.83113 3.9891596,2.87743 0.326969,0.1962 0.653973,0.32699 1.046351,0.52318 0.0655,0 0.13069,0.0655 0.196189,0.0655 0,0.13068 0,0.19619 0.0655,0.32701 0.0655,0.52317 0.196188,1.04631 0.326971,1.56948 0.13069,0.58857 0.327003,1.11175 0.523192,1.56951 0.196189,0.39238 0.326971,0.78475 0.523161,1.17714 0.0655,0.1307 0.130691,0.26169 0.196189,0.32697 0.261688,0.52315 0.523161,0.98096 0.784725,1.4387 0.327003,0.45777 0.653973,0.91553 0.980944,1.37333 0.326973,0.39236 0.719352,0.85014 1.111729,1.2425 0.392378,0.39239 0.784757,0.71938 1.242542,1.11172 0,0 0.06551,0.0655 0.130688,0.0655 0.39238,0.32701 0.784757,0.65399 1.177136,0.91554 0.457754,0.32699 0.915538,0.58856 1.438698,0.85016 0.457785,0.26169 0.980946,0.52315 1.504106,0.71936 0.392378,0.19619 0.850132,0.32699 1.307918,0.45777 0.06551,0.0655 0.130689,0.0655 0.261688,0.13071 0.261687,0.0655 0.588535,0.13067 0.850131,0.19617 -0.196188,3.53137 -0.261688,6.86655 0.261689,8.0437 0.588537,1.30791 3.465964,-2.68123 6.343394,-7.25894 -0.392377,4.51232 -0.653974,9.80935 0,11.37889 0.719349,1.63486 4.643099,-3.46602 8.043687,-9.09005 46.365652,-10.72489 88.676835,21.31907 93.123735,66.57299 -0.85015,-7.06275 -9.54779,-10.9865 -13.53693,-10.00555 -1.9619,4.83928 -5.29709,11.05189 -10.65953,14.91024 0.45777,-4.31613 0.26167,-8.76303 -0.65395,-13.07917 -1.43873,6.01642 -4.25076,11.64049 -8.10912,16.47977 v 0 c -6.212612,0.45775 -12.425232,-2.55046 -15.695037,-7.06275 -0.261689,-0.1962 -0.326972,-0.58858 -0.523161,-0.85016 -0.196191,-0.4578 -0.392378,-0.91553 -0.523162,-1.37333 -0.196188,-0.45775 -0.32697,-0.91554 -0.392377,-1.37328 -0.06551,-0.4578 -0.06551,-0.91556 -0.06551,-1.43871 0,-0.327 0,-0.65396 0,-0.98093 0.06551,-0.45781 0.196188,-0.91558 0.326972,-1.37335 0.130689,-0.45776 0.261687,-0.91553 0.457784,-1.37331 0.261689,-0.45775 0.457754,-0.91553 0.784757,-1.37329 1.111726,-3.13904 1.111726,-5.68945 -0.915538,-7.19355 -0.392379,-0.26169 -0.784757,-0.45779 -1.242541,-0.65398 -0.26169,-0.0655 -0.588568,-0.19619 -0.850132,-0.26168 -0.19619,-0.0655 -0.326971,-0.13071 -0.523161,-0.1962 -0.457785,-0.13069 -0.91557,-0.26169 -1.373324,-0.32697 -0.457785,-0.13068 -0.915538,-0.19619 -1.373322,-0.19619 -0.457755,-0.0655 -0.980947,-0.13069 -1.438701,-0.13069 -0.32697,0 -0.653973,0.0655 -0.980945,0.0655 -0.523159,0 -0.980944,0.0655 -1.438699,0.19619 -0.457784,0.0655 -0.915538,0.13068 -1.373322,0.26167 -0.457755,0.1307 -0.91554,0.26169 -1.373325,0.45781 -0.457753,0.19618 -0.850132,0.39237 -1.307915,0.58855 -0.392347,0.1962 -0.784727,0.45776 -1.24251,0.65395 -15.237247,9.94017 -6.147206,33.22109 4.250722,39.95688 -3.923751,0.71934 -7.912877,1.56952 -9.024606,2.41964 -0.06551,0.0655 -0.130689,0.1307 -0.130689,0.1307 2.812022,1.70027 5.754829,3.13899 8.828415,4.3815 4.185347,1.37332 8.632256,2.61584 10.594146,3.13902 0,0 0,0.0655 0,0.0655 5.427856,1.11173 10.921121,1.50411 16.479761,1.17714 28.97039,-2.02727 52.70909,-24.0657 57.02523,-53.10146 0.1307,0.58858 0.26169,1.11172 0.39238,1.7003 v 0 c 0.19619,1.1771 0.45775,2.41963 0.58854,3.66215 0,0 0,0 0,0.0655 0.13069,0.58857 0.19618,1.17713 0.26168,1.70029 0,0.13069 0,0.19619 0,0.2617 0.0655,0.58856 0.1307,1.17713 0.1307,1.70028 0.0655,0.71936 0.13069,1.4387 0.13069,2.15809 0,0.32697 0,0.65395 0,1.04631 0,0.32701 0.0655,0.71935 0.0655,1.04635 0,0.39239 -0.0655,0.78474 -0.0655,1.17711 0,0.32701 0,0.65397 0,0.91554 0,0.4578 -0.0655,0.85015 -0.0655,1.30793 0,0.26166 0,0.52317 -0.0655,0.85015 0,0.45779 -0.0655,0.91553 -0.0655,1.4387 -0.0655,0.19618 -0.0655,0.39237 -0.0655,0.58858 -0.0655,0.52317 -0.13069,0.98094 -0.1962,1.50411 0,0.1962 0,0.39236 -0.0655,0.58857 -0.0655,0.65394 -0.19617,1.24252 -0.26166,1.89646 0,0 0,0.0655 0,0.0655 v 0.0655 c -0.13069,0.58855 -0.2617,1.2425 -0.3924,1.83106 0,0.0655 0,0.13069 0,0.1962 -0.13067,0.58855 -0.26169,1.17713 -0.39236,1.76567 0,0.0655 -0.0655,0.19619 -0.0655,0.26167 -0.13071,0.58858 -0.2617,1.17714 -0.45776,1.76573 0,0.0655 0,0.13067 0,0.19618 -0.19618,0.65393 -0.39238,1.2425 -0.52318,1.83107 -0.0655,0.0655 -0.0655,0.13069 -0.0655,0.13069 -0.1962,0.65398 -0.39236,1.30792 -0.58854,1.96187 -0.26168,0.65397 -0.45777,1.24253 -0.71934,1.8965 -0.26169,0.65396 -0.4578,1.30792 -0.71938,1.89646 -0.26169,0.65398 -0.52318,1.24255 -0.78474,1.89649 0,0 -0.0655,0 -0.0655,0 -0.2617,0.58856 -0.5232,1.24254 -0.85019,1.83111 0,0 0,0 0,0 0,0 0,0 0,0 -0.0655,0.19617 -0.13067,0.32697 -0.19617,0.45774 -0.0655,0.0655 -0.0655,0.13069 -0.13069,0.1962 -4.25072,8.56684 -10.52875,16.08737 -18.37623,21.97301 v 0 c -0.52316,0.32697 -1.04634,0.71936 -1.56949,1.11172 0,0 0,0 0,0 -0.1307,0.1307 -0.327,0.19621 -0.45779,0.32697 -0.45778,0.32698 -0.91554,0.65394 -1.43868,0.98095 l 0.19617,0.39238 h 0.0655 v 0 c 0.91552,-0.13068 1.83107,-0.26168 2.74662,-0.39238 h 0.0655 c 1.7003,-0.26169 3.4006,-0.58857 5.1009,-0.91554 0.45774,-0.0655 0.98094,-0.19617 1.43868,-0.327 0.32698,-0.0655 0.58858,-0.13068 0.91555,-0.19619 0.45778,-0.0655 0.91554,-0.19618 1.37333,-0.26167 0.39237,-0.13069 0.78475,-0.19621 1.17713,-0.32698 6.53957,-1.56952 12.88299,-3.7276 18.96477,-6.27802 -10.39792,14.19088 -24.32725,25.63518 -40.61082,33.1557 7.52054,-0.52317 15.04106,-1.76568 22.3,-3.85834 26.35454,-7.78214 48.52372,-25.5044 61.79908,-49.3739 -2.68123,15.10646 -8.69765,29.49355 -17.59148,42.04956 6.34339,-4.18536 12.16362,-9.02465 17.4607,-14.5179 14.64866,-15.30263 24.26188,-34.72517 27.53165,-55.5865 2.22346,10.33256 2.87743,20.99212 1.89648,31.52083 47.21582,-65.85364 3.92376,-134.12693 -14.19089,-152.110785 -0.0655,-0.130684 -0.13069,-0.196187 -0.13069,-0.32697 -0.0655,0.06548 -0.0655,0.06548 -0.0655,0.130696 0,-0.06548 0,-0.06548 -0.0655,-0.130696 0,0.784758 -0.0655,1.569479 -0.13069,2.354237 -0.1962,1.504105 -0.39237,2.942806 -0.65397,4.381538 -0.32697,1.4387 -0.71935,2.87738 -1.11173,4.31612 -0.45776,1.37329 -0.98091,2.812 -1.56949,4.18532 -0.58857,1.3079 -1.24253,2.68123 -1.96188,3.98916 -0.71936,1.24253 -1.50411,2.55044 -2.35424,3.72755 -0.85015,1.24255 -1.7657,2.41965 -2.68125,3.53136 -0.98095,1.17715 -2.02726,2.22349 -3.07361,3.26982 -0.65394,0.58857 -1.2425,1.11173 -1.89649,1.63487 -0.52315,0.4578 -0.98091,0.85018 -1.5041,1.30792 -1.17711,0.91555 -2.35424,1.7657 -3.66215,2.55046 -1.24252,0.78474 -2.55042,1.56949 -3.85834,2.22346 -1.37332,0.65396 -2.74665,1.24251 -4.11994,1.83109 -1.37332,0.52314 -2.81202,0.98093 -4.25077,1.37331 -1.43869,0.39236 -2.94278,0.71936 -4.3815,0.98092 -1.50409,0.2617 -3.00821,0.39238 -4.44692,0.52319 -1.04633,0.0655 -2.09266,0.1307 -3.139,0.1307 -1.50412,0 -3.0082,-0.1307 -4.44691,-0.26169 -1.5041,-0.13069 -3.00822,-0.32702 -4.44692,-0.65399 -1.5041,-0.26168 -2.94283,-0.65397 -4.38154,-1.11171 h -0.0655 c 1.43871,-0.13069 2.87743,-0.2617 4.31615,-0.52318 1.50408,-0.26168 2.94279,-0.58855 4.38152,-0.98095 1.43869,-0.39236 2.8774,-0.85015 4.25072,-1.37331 1.4387,-0.52317 2.81203,-1.1771 4.11995,-1.83109 1.37331,-0.65397 2.61583,-1.3733 3.92374,-2.15806 1.24251,-0.85014 2.48504,-1.70027 3.66216,-2.61584 1.17713,-0.91553 2.28884,-1.89645 3.33521,-2.94279 1.11173,-0.98096 2.09265,-2.09268 3.07359,-3.20442 0.98093,-1.17709 1.89648,-2.35423 2.74663,-3.53136 0.1307,-0.1962 0.2617,-0.45776 0.3924,-0.65395 0.65393,-1.04634 1.30788,-2.09267 1.89644,-3.13902 0.71936,-1.30792 1.37334,-2.61584 1.96189,-3.98913 0.58857,-1.37332 1.11173,-2.74665 1.56951,-4.18534 0.45776,-1.37333 0.78474,-2.81202 1.11173,-4.250714 0.2617,-1.504113 0.52315,-2.942843 0.65395,-4.381539 0.13069,-1.504099 0.26168,-3.008212 0.26168,-4.446907 0,-1.046349 -0.0655,-2.092671 -0.13067,-3.138995 -0.1307,-1.504101 -0.32699,-2.942833 -0.52318,-4.38153 -0.26169,-1.504113 -0.58855,-2.942807 -0.98095,-4.381541 -0.45775,-1.373293 -0.91553,-2.812014 -1.43869,-4.185306 -0.5232,-1.37333 -1.17712,-2.746646 -1.83111,-4.054573 -0.71935,-1.307914 -1.43869,-2.615827 -2.22344,-3.858336 -0.85014,-1.24251 -1.70031,-2.419641 -2.61585,-3.596784 -0.98091,-1.111727 -1.96186,-2.223454 -3.00822,-3.335181 -0.52314,-0.523157 -1.11172,-1.111728 -1.70028,-1.634883 -2.94281,-2.28887 -6.01642,-4.446946 -9.09001,-6.408809 -0.45776,-0.261679 -0.85014,-0.457776 -1.30792,-0.653975 -2.15808,-1.373294 -4.18535,-2.092672 -6.2126,-2.74661 z',
                id: 'path818',
              })
            )
          );
        },
        logos_static = __webpack_require__(325),
        static_default = __webpack_require__.n(logos_static),
        Static = function(props) {
          return react.createElement(
            'img',
            Object.assign({ alt: 'static', src: static_default.a }, props)
          );
        },
        Styleguidist = function(_ref) {
          var _ref$width = _ref.width,
            width = void 0 === _ref$width ? 32 : _ref$width,
            _ref$height = _ref.height,
            height = void 0 === _ref$height ? 32 : _ref$height,
            className = _ref.className;
          return react.createElement(
            'svg',
            {
              width: width,
              height: height,
              className: className,
              viewBox: '0 0 543 370',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            react.createElement(
              'defs',
              null,
              react.createElement('path', {
                d:
                  'M85.371 102.978s-27.08 7.268-40.621 7.268c-13.54 0-40.123-7.268-40.123-7.268a4.175 4.175 0 0 1-4.175-4.175V4.313A4.175 4.175 0 0 1 4.627.138h80.744a4.175 4.175 0 0 1 4.175 4.175v94.49a4.173 4.173 0 0 1-4.175 4.175z',
                id: 'a',
              }),
              react.createElement('path', {
                d:
                  'M111.85 177.15s-24.116 4.848-36.174 4.848c-11.843 0-35.528-4.848-35.528-4.848-22.132 0-40.073-13.093-40.073-35.225V76.324C.075 34.432 34.035.472 75.927.472c42.035 0 75.995 33.96 75.995 75.852v65.601c.001 22.132-17.941 35.225-40.072 35.225z',
                id: 'c',
              })
            ),
            react.createElement(
              'g',
              { fill: 'none', fillRule: 'evenodd' },
              react.createElement('path', {
                d:
                  'M161.353 335.17C171.486 349.31 185.778 357 204 357c23.615 0 42.626-9.765 55.617-26.99C270.933 315.009 277 295.018 277 275v-28.364l-56.724.397L218 286.857c0 13.615-4.831 18.143-17 18.143-9.426 0-16.1-9.866-18.214-27.098l-9.65-70.89c-3.765-24.442-12.935-43.425-26.703-57.197-11.796-11.8-26.591-19.4-43.24-23.2l-46.756-12.33c-6.594 0-11.361 5.178-11.361 11.066 0 9.763 1.157 14.544 6.838 21.507 1.625 1.992 4.247 3.755 7.915 5.593 3.786 1.897 8.703 3.859 14.513 5.867 4.675 1.617 9.665 3.173 14.654 4.617a337.303 337.303 0 0 0 6.18 1.724c17.794 4.795 31.454 21.882 33.45 39.75l16.205 83.035c2.527 19.41 7.928 35.736 16.522 47.726zM276.534 248h-54.28l.081 5.08.514 32.104c0 13.436-9.743 21.681-22.894 21.681-9.452 0-18.313-9.966-28.881-30.674l-30.694-59.497c-13.703-23.775-32.092-36.768-60.818-42.41l-43.527-11.182c-6.95 0-12.267 8.601-12.267 14.735 0 7.008 3.056 14.433 7.749 20.23 4.24 5.24 13.244 9.809 21.63 11.571l18.271 3.894c14.518 4.903 27.975 14.899 34.233 26.706l23.118 55.414c8.713 19.089 17.628 33.058 28.29 43.142 12.491 11.815 27.204 17.956 44.76 17.956 16.085 0 32.778-5.724 45.691-15.975 14.352-11.393 23.162-27.514 24.333-46.645l4.691-46.13z',
                fill: '#053949',
                fillRule: 'nonzero',
              }),
              react.createElement('path', {
                d:
                  'M148.545 254.331l-10.004-51.24c-2.52-21.746-18.927-42.202-40.342-47.976a235.15 235.15 0 0 1-1.747-.47c-1.41-.385-2.982-.826-4.677-1.316-4.836-1.4-9.67-2.908-14.166-4.462-5.43-1.877-9.976-3.69-13.3-5.356-1.32-.662-2.416-1.286-3.26-1.854-.723-.485-1.196-.887-1.386-1.12-3.937-4.826-4.587-7.51-4.587-15.186 0-.262.13-.584.352-.826.049-.052 45.296 11.78 45.296 11.78 15.103 3.437 28.236 10.175 38.637 20.58 12.215 12.218 20.44 29.246 23.878 51.563l9.63 70.737C175.513 300.739 185.159 315 201 315c17.507 0 26.952-8.81 27-27.854l1.724-30.179 37.276-.26V275c0 17.935-5.424 35.807-15.367 48.99C240.505 338.742 224.43 347 204 347a49.22 49.22 0 0 1-6.079-.367c-25.955-1.583-43.67-19.273-59.955-54.908l-23.256-55.743c-7.679-14.69-23.423-26.37-40.39-32.025l-19.102-4.102c-6.345-1.334-13.343-4.884-15.928-8.079-3.346-4.133-5.522-9.42-5.522-13.94 0-.558.547-2.133 1.36-3.447.246-.399.495-.742.724-1.01l41.505 10.662c26.093 5.097 42.04 16.324 54.244 37.446l16.944 32.844z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M148.545 254.331l-10.004-51.24c-2.52-21.746-18.927-42.202-40.342-47.976a235.15 235.15 0 0 1-1.747-.47c-1.41-.385-2.982-.826-4.677-1.316-4.836-1.4-9.67-2.908-14.166-4.462-5.43-1.877-9.976-3.69-13.3-5.356-1.32-.662-2.416-1.286-3.26-1.854-.723-.485-1.196-.887-1.386-1.12-3.937-4.826-4.587-7.51-4.587-15.186 0-.262.13-.584.352-.826.049-.052 45.296 11.78 45.296 11.78 15.103 3.437 28.236 10.175 38.637 20.58 12.215 12.218 20.44 29.246 23.878 51.563l9.63 70.737C175.513 300.739 185.159 315 201 315c17.507 0 26.952-8.81 27-27.854l1.724-30.179 37.276-.26V275c0 17.935-5.424 35.807-15.367 48.99C240.505 338.742 224.43 347 204 347a49.22 49.22 0 0 1-6.079-.367c-25.955-1.583-43.67-19.273-59.955-54.908l-23.256-55.743c-7.679-14.69-23.423-26.37-40.39-32.025l-19.102-4.102c-6.345-1.334-13.343-4.884-15.928-8.079-3.346-4.133-5.522-9.42-5.522-13.94 0-.558.547-2.133 1.36-3.447.246-.399.495-.742.724-1.01l41.505 10.662c26.093 5.097 42.04 16.324 54.244 37.446l16.944 32.844z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M35.717 172.543a26.929 26.929 0 0 0 3.046 4.233c2.808 3.195 10.405 6.745 17.294 8.079l20.74 4.102c18.422 5.655 35.516 17.336 43.854 32.025l25.25 55.743c3.434 6.92 6.926 13.164 10.532 18.745a155.212 155.212 0 0 1-1.706-10.47l-6.182-31.67-16.944-32.844c-12.204-21.122-28.151-32.349-54.244-37.446l-41.505-10.66-.135.164z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement('path', {
                d:
                  'M238 256.902V285c0 19.297-7.781 39-35.156 39-16.658 0-33.625-10.254-39.157-48.854L152.925 201c-2.792-21.746-24.439-52.111-48.176-57.885-.908-.218-33.88-9.939-37.564-11.604-1.464-.662-4.94-2.741-5.151-2.975-1.274-1.408-2.237-2.634-2.963-3.855 5.396 1.39 43.687 11.624 43.687 11.624 14.777 3.437 27.626 10.175 37.802 20.58 11.95 12.218 19.998 29.246 23.361 51.563l9.421 70.737C175.93 300.739 185.368 315 200.865 315c17.129 0 26.37-8.81 26.416-27.854l1.687-30.179 9.032-.065z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement('path', {
                d:
                  'M278 281v-35h-58v5c0 45.007-12.335 64.5-40 64.5-24.413 0-41.205-17.44-51.894-46.054C115.912 236.802 97.418 222 61.363 222H12C5.762 222 .837 227.144.837 233.357a29.172 29.172 0 0 0 8.586 20.695 29.261 29.261 0 0 0 20.752 8.577l31.307-.129c6.507 0 12.796 4.762 19.256 14.494 5.384 8.112 9.919 17.723 17.126 35.187 6.462 15.658 15.32 28.932 27.167 38.934C139.525 363.352 157.769 370 180 370c23.934 0 48.281-8.724 66.667-23.997C266.517 329.513 278 306.76 278 281z',
                fill: '#053949',
                fillRule: 'nonzero',
              }),
              react.createElement('path', {
                d:
                  'M268 256v25c0 22.676-10.085 42.659-27.723 57.31C223.693 352.087 201.61 360 180 360c-19.873 0-35.831-5.815-48.518-16.526-10.496-8.862-18.48-20.825-24.374-35.108-7.453-18.058-12.177-28.072-18.039-36.902-8.122-12.237-17.007-18.964-27.608-18.964l-31.307.129a19.25 19.25 0 0 1-13.666-5.654 19.175 19.175 0 0 1-5.651-13.618c0-.785.548-1.357 1.163-1.357h49.363c31.584 0 46.557 11.984 57.375 40.945 5.17 13.842 11.962 25.767 20.713 34.856C150.426 319.199 163.94 325.5 180 325.5c33.225 0 48.916-23.012 49.946-69.5H268z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M11.146 232.434c.912 1.16 2.2 2.2 3.812 3.663C18.403 239.222 23.037 241 28 241h41c22.855 0 34.738 17.856 49.665 50.724C124.291 304.11 139.635 334 183 334c43.365 0 56-42.336 56-62v-16h-9.054c-1.03 46.488-16.721 69.5-49.946 69.5-16.06 0-29.574-6.301-40.55-17.7-8.75-9.088-15.541-21.013-20.712-34.855C107.92 243.985 92.947 232 61.363 232H12c-.328 0-.637.163-.854.434z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement('path', {
                d:
                  'M382.647 335.17C372.514 349.31 358.222 357 340 357c-23.615 0-42.626-9.765-55.617-26.99C273.067 315.009 267 295.018 267 275v-28.364l56.724.397L326 286.857c0 13.615 4.831 18.143 17 18.143 9.426 0 16.1-9.866 18.214-27.098l9.65-70.89c3.765-24.442 12.935-43.425 26.703-57.197 11.796-11.8 26.591-19.4 43.24-23.2l46.756-12.33c6.594 0 11.361 5.178 11.361 11.066 0 9.763-1.157 14.544-6.838 21.507-1.625 1.992-4.247 3.755-7.915 5.593-3.786 1.897-8.703 3.859-14.513 5.867-4.675 1.617-9.665 3.173-14.654 4.617a337.303 337.303 0 0 1-6.18 1.724c-17.794 4.795-31.454 21.882-33.45 39.75l-16.205 83.035c-2.527 19.41-7.928 35.736-16.522 47.726zM267.466 248h54.28l-.081 5.08-.514 32.104c0 13.436 9.743 21.681 22.894 21.681 9.452 0 18.313-9.966 28.881-30.674l30.694-59.497c13.703-23.775 32.092-36.768 60.818-42.41l43.527-11.182c6.95 0 12.267 8.601 12.267 14.735 0 7.008-3.056 14.433-7.749 20.23-4.24 5.24-13.244 9.809-21.63 11.571l-18.271 3.894c-14.518 4.903-27.975 14.899-34.233 26.706l-23.118 55.414c-8.713 19.089-17.628 33.058-28.29 43.142-12.491 11.815-27.204 17.956-44.76 17.956-16.085 0-32.778-5.724-45.691-15.975-14.352-11.393-23.162-27.514-24.333-46.645L267.466 248z',
                fill: '#053949',
                fillRule: 'nonzero',
              }),
              react.createElement('path', {
                d:
                  'M395.455 254.331l10.004-51.24c2.52-21.746 18.927-42.202 40.342-47.976a328.793 328.793 0 0 0 6.424-1.786c4.836-1.4 9.67-2.908 14.166-4.462 5.43-1.877 9.976-3.69 13.3-5.356 1.32-.662 2.416-1.286 3.26-1.854.723-.485 1.196-.887 1.386-1.12 3.937-4.826 4.587-7.51 4.587-15.186 0-.262-.13-.584-.352-.826-.049-.052-45.296 11.78-45.296 11.78-15.103 3.437-28.236 10.175-38.637 20.58-12.215 12.218-20.44 29.246-23.878 51.563l-9.63 70.737C368.487 300.739 358.841 315 343 315c-17.507 0-26.952-8.81-27-27.854l-1.724-30.179-37.276-.26V275c0 17.935 5.424 35.807 15.367 48.99C303.495 338.742 319.57 347 340 347c2.093 0 4.12-.123 6.079-.367 25.955-1.583 43.67-19.273 59.955-54.908l23.256-55.743c7.679-14.69 23.423-26.37 40.39-32.025l19.102-4.102c6.345-1.334 13.343-4.884 15.928-8.079 3.346-4.133 5.522-9.42 5.522-13.94 0-.558-.547-2.133-1.36-3.447a8.245 8.245 0 0 0-.724-1.01l-41.505 10.662c-26.093 5.097-42.04 16.324-54.244 37.446l-16.944 32.844z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M395.455 254.331l10.004-51.24c2.52-21.746 18.927-42.202 40.342-47.976a328.793 328.793 0 0 0 6.424-1.786c4.836-1.4 9.67-2.908 14.166-4.462 5.43-1.877 9.976-3.69 13.3-5.356 1.32-.662 2.416-1.286 3.26-1.854.723-.485 1.196-.887 1.386-1.12 3.937-4.826 4.587-7.51 4.587-15.186 0-.262-.13-.584-.352-.826-.049-.052-45.296 11.78-45.296 11.78-15.103 3.437-28.236 10.175-38.637 20.58-12.215 12.218-20.44 29.246-23.878 51.563l-9.63 70.737C368.487 300.739 358.841 315 343 315c-17.507 0-26.952-8.81-27-27.854l-1.724-30.179-37.276-.26V275c0 17.935 5.424 35.807 15.367 48.99C303.495 338.742 319.57 347 340 347c2.093 0 4.12-.123 6.079-.367 25.955-1.583 43.67-19.273 59.955-54.908l23.256-55.743c7.679-14.69 23.423-26.37 40.39-32.025l19.102-4.102c6.345-1.334 13.343-4.884 15.928-8.079 3.346-4.133 5.522-9.42 5.522-13.94 0-.558-.547-2.133-1.36-3.447a8.245 8.245 0 0 0-.724-1.01l-41.505 10.662c-26.093 5.097-42.04 16.324-54.244 37.446l-16.944 32.844z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M508.283 172.543a26.929 26.929 0 0 1-3.046 4.233c-2.808 3.195-10.405 6.745-17.294 8.079l-20.74 4.102c-18.422 5.655-35.516 17.336-43.854 32.025l-25.25 55.743c-3.434 6.92-6.926 13.164-10.532 18.745a155.212 155.212 0 0 0 1.706-10.47l6.182-31.67 16.944-32.844c12.204-21.122 28.151-32.349 54.244-37.446l41.505-10.662.135.164z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement('path', {
                d:
                  'M306 256.902V285c0 19.297 7.781 39 35.156 39 16.658 0 33.625-10.254 39.157-48.854L391.075 201c2.792-21.746 24.439-52.111 48.176-57.885.908-.218 33.88-9.939 37.564-11.604 1.464-.662 4.94-2.741 5.151-2.975 1.274-1.408 2.237-2.634 2.963-3.855-5.396 1.39-43.687 11.624-43.687 11.624-14.777 3.437-27.626 10.175-37.802 20.58-11.95 12.218-19.998 29.246-23.361 51.563l-9.421 70.737C368.07 300.739 358.632 315 343.135 315c-17.129 0-26.37-8.81-26.416-27.854l-1.687-30.179-9.032-.065z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement('path', {
                d:
                  'M266 281v-35h58v5c0 45.007 12.335 64.5 40 64.5 24.413 0 41.205-17.44 51.894-46.054C428.088 236.802 446.582 222 482.637 222H532c6.238 0 11.163 5.144 11.163 11.357a29.172 29.172 0 0 1-8.586 20.695 29.261 29.261 0 0 1-20.752 8.577l-31.307-.129c-6.507 0-12.796 4.762-19.256 14.494-5.384 8.112-9.919 17.723-17.126 35.187-6.462 15.658-15.32 28.932-27.167 38.934C404.475 363.352 386.231 370 364 370c-23.934 0-48.281-8.724-66.667-23.997C277.483 329.513 266 306.76 266 281z',
                fill: '#053949',
                fillRule: 'nonzero',
              }),
              react.createElement('path', {
                d:
                  'M276 256v25c0 22.676 10.085 42.659 27.723 57.31C320.307 352.087 342.39 360 364 360c19.873 0 35.831-5.815 48.518-16.526 10.496-8.862 18.48-20.825 24.374-35.108 7.453-18.058 12.177-28.072 18.039-36.902 8.122-12.237 17.007-18.964 27.608-18.964l31.307.129c5.2 0 10.057-2.05 13.666-5.654a19.175 19.175 0 0 0 5.651-13.618c0-.785-.548-1.357-1.163-1.357h-49.363c-31.584 0-46.557 11.984-57.375 40.945-5.17 13.842-11.962 25.767-20.713 34.856C393.574 319.199 380.06 325.5 364 325.5c-33.225 0-48.916-23.012-49.946-69.5H276z',
                fill: '#00D8FE',
              }),
              react.createElement('path', {
                d:
                  'M532.854 232.434c-.912 1.16-2.2 2.2-3.812 3.663C525.597 239.222 520.963 241 516 241h-41c-22.855 0-34.738 17.856-49.665 50.724C419.709 304.11 404.365 334 361 334c-43.365 0-56-42.336-56-62v-16h9.054c1.03 46.488 16.721 69.5 49.946 69.5 16.06 0 29.574-6.301 40.55-17.7 8.75-9.088 15.541-21.013 20.712-34.855C436.08 243.985 451.053 232 482.637 232H532c.328 0 .637.163.854.434z',
                fillOpacity: '.25',
                fill: '#000',
              }),
              react.createElement(
                'g',
                { transform: 'translate(225 164)' },
                react.createElement(
                  'g',
                  { fillRule: 'nonzero' },
                  react.createElement('use', {
                    fill: '#00D8FE',
                    fillRule: 'evenodd',
                  }),
                  react.createElement('path', {
                    stroke: '#043849',
                    strokeWidth: '12',
                    d:
                      'M86.313 108.935c5.18-.476 9.235-4.831 9.233-10.135V4.313c0-5.62-4.555-10.175-10.175-10.175H4.627c-5.62 0-10.175 4.555-10.175 10.175v94.49c0 5.296 4.046 9.647 9.216 10.13.182.05.382.102.597.159a345.67 345.67 0 0 0 14.068 3.383c3.16.688 6.229 1.305 9.158 1.832 6.911 1.244 12.738 1.94 17.259 1.94 4.568 0 10.516-.71 17.606-1.979 2.893-.518 5.922-1.12 9.042-1.79a361.489 361.489 0 0 0 14.915-3.543z',
                  })
                ),
                react.createElement('path', {
                  fillOpacity: '.25',
                  fill: '#000',
                  mask: 'url(#b)',
                  d: 'M0 30h22l-12 84H0z',
                })
              ),
              react.createElement(
                'g',
                { transform: 'translate(199 185)', fillRule: 'nonzero' },
                react.createElement('ellipse', {
                  stroke: '#063A49',
                  strokeWidth: '12',
                  fill: '#FFF',
                  cx: '25.455',
                  cy: '25.327',
                  rx: '25.043',
                  ry: '24.996',
                }),
                react.createElement('circle', {
                  fill: '#053949',
                  cx: '25.455',
                  cy: '25.348',
                  r: '7.837',
                })
              ),
              react.createElement(
                'g',
                { transform: 'translate(289 185)', fillRule: 'nonzero' },
                react.createElement('ellipse', {
                  stroke: '#063A49',
                  strokeWidth: '12',
                  fill: '#FFF',
                  cx: '25.455',
                  cy: '25.327',
                  rx: '25.043',
                  ry: '24.996',
                }),
                react.createElement('circle', {
                  fill: '#053949',
                  cx: '25.455',
                  cy: '25.348',
                  r: '7.837',
                })
              ),
              react.createElement(
                'g',
                { transform: 'translate(194 12)' },
                react.createElement(
                  'g',
                  { fillRule: 'nonzero' },
                  react.createElement('use', {
                    fill: '#00D8FE',
                    fillRule: 'evenodd',
                  }),
                  react.createElement('path', {
                    stroke: '#043849',
                    strokeWidth: '12',
                    d:
                      'M112.452 183.148c26.036-.25 45.471-16.624 45.47-41.223V76.324c0-45.23-36.67-81.852-81.995-81.852-45.206 0-81.852 36.646-81.852 81.852v65.601c0 24.596 19.43 40.97 45.46 41.222l.49.098a400.748 400.748 0 0 0 12.476 2.25c2.723.446 5.366.847 7.89 1.191 6.167.842 11.337 1.312 15.285 1.312 4.007 0 9.263-.47 15.534-1.31a307.85 307.85 0 0 0 8.027-1.19 414.587 414.587 0 0 0 13.215-2.35z',
                  })
                ),
                react.createElement('path', {
                  d:
                    'M20.973 139.925V54.324c0-38.37 28.495-70.066 65.475-75.128a76.401 76.401 0 0 0-10.378-.725h-.143C34.035-21.529.074 12.431.074 54.323v85.601c0 22.132 17.941 40.073 40.073 40.073h20.898c-22.131.001-40.072-17.94-40.072-40.072z',
                  fillOpacity: '.25',
                  fill: '#000',
                  fillRule: 'nonzero',
                  mask: 'url(#d)',
                }),
                react.createElement('circle', {
                  fillOpacity: '.25',
                  fill: '#000',
                  fillRule: 'nonzero',
                  mask: 'url(#d)',
                  cx: '67.837',
                  cy: '138.837',
                  r: '7.837',
                }),
                react.createElement('circle', {
                  fillOpacity: '.25',
                  fill: '#000',
                  fillRule: 'nonzero',
                  mask: 'url(#d)',
                  cx: '46.837',
                  cy: '97.837',
                  r: '7.837',
                }),
                react.createElement('circle', {
                  fillOpacity: '.25',
                  fill: '#000',
                  fillRule: 'nonzero',
                  mask: 'url(#d)',
                  cx: '75.999',
                  cy: '59.58',
                  r: '7.837',
                }),
                react.createElement('circle', {
                  fillOpacity: '.25',
                  fill: '#000',
                  fillRule: 'nonzero',
                  mask: 'url(#d)',
                  cx: '104.837',
                  cy: '99.837',
                  r: '7.837',
                })
              )
            )
          );
        },
        classCallCheck = __webpack_require__(10),
        createClass = __webpack_require__(11),
        possibleConstructorReturn = __webpack_require__(12),
        getPrototypeOf = __webpack_require__(8),
        inherits = __webpack_require__(13);
      function normalize(path) {
        var isAbs = (function isAbsolute(path) {
            return '/' === path.charAt(0);
          })(path),
          trailingSlash = path && '/' === path[path.length - 1],
          newPath = path;
        return (
          (newPath = (function normalizeArray(parts, allowAboveRoot) {
            for (var res = [], i = 0; i < parts.length; i += 1) {
              var p = parts[i];
              p &&
                '.' !== p &&
                ('..' === p
                  ? res.length && '..' !== res[res.length - 1]
                    ? res.pop()
                    : allowAboveRoot && res.push('..')
                  : res.push(p));
            }
            return res;
          })(newPath.split('/'), !isAbs).join('/')) ||
            isAbs ||
            (newPath = '.'),
          newPath && trailingSlash && (newPath += '/'),
          (isAbs ? '/' : '') + newPath
        );
      }
      function join() {
        for (var path = '', i = 0; i < arguments.length; i += 1) {
          var segment = i < 0 || arguments.length <= i ? void 0 : arguments[i];
          if ('string' != typeof segment)
            throw new TypeError('Arguments to path.join must be strings');
          segment && (path += path ? '/'.concat(segment) : segment);
        }
        return normalize(path);
      }
      function absolute(path) {
        return path.startsWith('/')
          ? path
          : path.startsWith('./')
            ? path.replace('./', '/')
            : '/' + path;
      }
      var toConsumableArray = __webpack_require__(75),
        objectSpread = __webpack_require__(15),
        defineProperty = __webpack_require__(5);
      var package_json = {
          title: 'package.json',
          type: 'package',
          description: 'Describes the overall configuration of your project.',
          moreInfoUrl: 'https://docs.npmjs.com/files/package.json',
          generateFileFromSandbox: function generateFileFromSandbox(sandbox) {
            var text,
              a,
              p,
              jsonFile = {
                name: ((text = sandbox.title || sandbox.id),
                (a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'),
                (p = new RegExp(a.split('').join('|'), 'g')),
                text
                  .toString()
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(p, function(c) {
                    return 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'.charAt(
                      a.indexOf(c)
                    );
                  })
                  .replace(/&/g, '-and-')
                  .replace(/[^\w\-]+/g, '')
                  .replace(/\-\-+/g, '-')
                  .replace(/^-+/, '')
                  .replace(/-+$/, '')),
                version: '1.0.0',
                description: sandbox.description || '',
                keywords: sandbox.tags,
                main: sandbox.entry,
                dependencies: sandbox.npmDependencies,
              };
            return JSON.stringify(jsonFile, null, 2);
          },
          schema:
            'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/package.json',
        },
        prettify_default_config = {
          printWidth: 80,
          tabWidth: 2,
          useTabs: !1,
          semi: !0,
          singleQuote: !1,
          trailingComma: 'none',
          bracketSpacing: !0,
          jsxBracketSameLine: !1,
        },
        prettierRC = {
          title: '.prettierrc',
          type: 'prettier',
          description: 'Defines how all files will be prettified by Prettier.',
          moreInfoUrl: 'https://prettier.io/docs/en/configuration.html',
          generateFileFromState: function generateFileFromState(state) {
            return JSON.stringify(
              Object(objectSpread.a)(
                {},
                prettify_default_config,
                state.get('preferences.settings.prettierConfig') || {}
              ),
              null,
              2
            );
          },
          schema:
            'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/prettierrc.json',
        },
        configuration_sandbox = {
          title: 'sandbox.config.json',
          type: 'sandbox',
          description: 'Configuration specific to the current sandbox.',
          moreInfoUrl:
            'https://codesandbox.io/docs/configuration#sandbox-configuration',
          getDefaultCode: function getDefaultCode() {
            return JSON.stringify(
              {
                infiniteLoopProtection: !0,
                hardReloadOnChange: !1,
                view: 'browser',
              },
              null,
              2
            );
          },
        },
        semver = __webpack_require__(326),
        semver_default = __webpack_require__.n(semver);
      function isBabel7() {
        var dependencies =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          devDependencies =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return (
          !!devDependencies['@vue/cli-plugin-babel'] ||
          (!!devDependencies['@babel/core'] ||
            (('typescript' in devDependencies &&
              !dependencies['@angular/core']) ||
              !!(function isCRAVersion2(dependencies, devDependencies) {
                var reactScriptsVersion =
                  dependencies['react-scripts'] ||
                  devDependencies['react-scripts'];
                return (
                  !!reactScriptsVersion &&
                  (/^[a-z]/.test(reactScriptsVersion) ||
                    semver_default.a.intersects(reactScriptsVersion, '^2.0.0'))
                );
              })(dependencies, devDependencies)))
        );
      }
      var JSX_PRAGMA = { react: 'React.createElement', preact: 'h' },
        tsconfig_JSX_PRAGMA = { react: 'React.createElement', preact: 'h' },
        configuration = {
          babelrc: {
            title: '.babelrc',
            type: 'babel',
            description:
              'Custom configuration for Babel, the transpiler we use.',
            moreInfoUrl: 'https://babeljs.io/docs/usage/babelrc/',
            getDefaultCode: function getDefaultCode(template, resolveModule) {
              var isV7 = !1;
              try {
                var packageJSON = resolveModule('/package.json'),
                  parsed = JSON.parse(packageJSON.code || '');
                isV7 = isBabel7(parsed.dependencies, parsed.devDependencies);
              } catch (e) {
                console.error(e);
              }
              if ('preact-cli' === template)
                return JSON.stringify(
                  {
                    presets: ['latest', 'stage-1'],
                    plugins: [
                      'transform-object-assign',
                      'transform-decorators-legacy',
                      ['transform-react-jsx', { pragma: 'h' }],
                      [
                        'jsx-pragmatic',
                        { module: 'preact', export: 'h', import: 'h' },
                      ],
                    ],
                  },
                  null,
                  2
                );
              if ('vue-cli' === template)
                return isV7
                  ? JSON.stringify({ presets: ['@vue/app'] })
                  : JSON.stringify(
                      {
                        presets: [
                          [
                            'env',
                            {
                              modules: !1,
                              targets: {
                                browsers: [
                                  '> 1%',
                                  'last 2 versions',
                                  'not ie <= 8',
                                ],
                              },
                            },
                          ],
                          'stage-2',
                        ],
                        plugins: ['transform-vue-jsx', 'transform-runtime'],
                        env: {
                          test: {
                            presets: ['env', 'stage-2'],
                            plugins: [
                              'transform-vue-jsx',
                              'transform-es2015-modules-commonjs',
                              'dynamic-import-node',
                            ],
                          },
                        },
                      },
                      null,
                      2
                    );
              if ('parcel' === template) {
                var plugins = isV7
                    ? ['transform-runtime']
                    : [
                        [
                          'transform-runtime',
                          { polyfill: !1, regenerator: !0 },
                        ],
                        'transform-object-rest-spread',
                      ],
                  packageJSONModule = resolveModule('/package.json');
                if (packageJSONModule)
                  try {
                    var _parsed = JSON.parse(packageJSONModule.code),
                      pragma = null;
                    Object.keys(JSX_PRAGMA).forEach(function(dep) {
                      ((_parsed.dependencies && _parsed.dependencies[dep]) ||
                        (_parsed.devDependencies &&
                          _parsed.devDependencies[dep])) &&
                        (pragma = JSX_PRAGMA[dep]);
                    }),
                      null !== pragma &&
                        plugins.push([
                          'transform-react-jsx',
                          { pragma: pragma },
                        ]);
                  } catch (e) {}
                return JSON.stringify(
                  { presets: ['env'], plugins: plugins },
                  null,
                  2
                );
              }
              return 'cxjs' === template
                ? isV7
                  ? JSON.stringify(
                      {
                        presets: ['env'],
                        plugins: [
                          '@babel/plugin-proposal-class-properties',
                          '@babel/plugin-proposal-object-rest-spread',
                          '@babel/plugin-proposal-function-bind',
                          'transform-cx-jsx',
                          '@babel/plugin-transform-parameters',
                          '@babel/plugin-syntax-dynamic-import',
                          [
                            '@babel/plugin-transform-react-jsx',
                            { pragma: 'VDOM.createElement' },
                          ],
                        ],
                      },
                      null,
                      2
                    )
                  : JSON.stringify(
                      {
                        presets: [
                          [
                            'env',
                            {
                              targets: {
                                chrome: 50,
                                ie: 11,
                                ff: 30,
                                edge: 12,
                                safari: 9,
                              },
                              modules: !1,
                              loose: !0,
                              useBuiltIns: !0,
                            },
                          ],
                          'stage-2',
                        ],
                        plugins: [
                          ['transform-cx-jsx'],
                          [
                            'transform-react-jsx',
                            { pragma: 'VDOM.createElement' },
                          ],
                          'transform-function-bind',
                          'transform-runtime',
                          'transform-regenerator',
                        ],
                      },
                      null,
                      2
                    )
                : JSON.stringify({ presets: [], plugins: [] }, null, 2);
            },
            schema:
              'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/babelrc.json',
          },
          babelTranspiler: {
            title: 'babel-transpiler.json',
            type: 'babelTranspiler',
            description: 'Configuration for the Babel REPL.',
            moreInfoUrl: 'https://eslint.org/docs/user-guide/configuring',
            getDefaultCode: function getDefaultCode() {
              return '{}';
            },
          },
          packageJSON: package_json,
          prettierRC: prettierRC,
          sandboxConfig: configuration_sandbox,
          angularCli: {
            title: '.angular-cli.json',
            type: 'angular-cli',
            description:
              'The configuration used for angular-cli, the cli to run angular projects.',
            moreInfoUrl:
              'https://github.com/angular/angular-cli/wiki/angular-cli',
            getDefaultCode: function getDefaultCode() {
              return JSON.stringify(
                {
                  apps: [
                    {
                      root: 'src',
                      outDir: 'dist',
                      index: 'index.html',
                      main: 'main.ts',
                      polyfills: 'polyfills.ts',
                      styles: [],
                      scripts: [],
                    },
                  ],
                },
                null,
                2
              );
            },
            schema:
              'https://raw.githubusercontent.com/angular/angular-cli/master/packages/@angular/cli/lib/config/schema.json',
          },
          angularJSON: {
            title: 'angular.json',
            type: 'angular-config',
            description:
              'The configuration used for angular-cli v6, the new cli to run angular projects.',
            moreInfoUrl:
              'https://github.com/angular/angular-cli/wiki/angular-cli',
            partialSupportDisclaimer:
              'Only `project.build` field is supported.',
            getDefaultCode: function getDefaultCode() {
              return JSON.stringify(
                {
                  version: 1,
                  newProjectRoot: 'projects',
                  projects: {
                    codesandbox: {
                      root: '',
                      sourceRoot: 'src',
                      projectType: 'application',
                      prefix: 'app',
                      schematics: {},
                      architect: {
                        build: {
                          builder: '@angular-devkit/build-angular:browser',
                          options: {
                            outputPath: 'dist/codesandbox',
                            index: 'src/index.html',
                            main: 'src/main.ts',
                            polyfills: 'src/polyfills.ts',
                            tsConfig: 'src/tsconfig.app.json',
                            assets: ['src/favicon.png', 'src/assets'],
                            styles: ['src/styles.css'],
                            scripts: [],
                          },
                          configurations: {
                            production: {
                              fileReplacements: [
                                {
                                  replace: 'src/environments/environment.ts',
                                  with: 'src/environments/environment.prod.ts',
                                },
                              ],
                              optimization: !0,
                              outputHashing: 'all',
                              sourceMap: !1,
                              extractCss: !0,
                              namedChunks: !1,
                              aot: !0,
                              extractLicenses: !0,
                              vendorChunk: !1,
                              buildOptimizer: !0,
                            },
                          },
                        },
                        serve: {
                          builder: '@angular-devkit/build-angular:dev-server',
                          options: { browserTarget: 'codesandbox:build' },
                          configurations: {
                            production: {
                              browserTarget: 'codesandbox:build:production',
                            },
                          },
                        },
                        'extract-i18n': {
                          builder: '@angular-devkit/build-angular:extract-i18n',
                          options: { browserTarget: 'codesandbox:build' },
                        },
                        test: {
                          builder: '@angular-devkit/build-angular:karma',
                          options: {
                            main: 'src/test.ts',
                            polyfills: 'src/polyfills.ts',
                            tsConfig: 'src/tsconfig.spec.json',
                            karmaConfig: 'src/karma.conf.js',
                            styles: ['src/styles.css'],
                            scripts: [],
                            assets: ['src/favicon.png', 'src/assets'],
                          },
                        },
                        lint: {
                          builder: '@angular-devkit/build-angular:tslint',
                          options: {
                            tsConfig: [
                              'src/tsconfig.app.json',
                              'src/tsconfig.spec.json',
                            ],
                            exclude: ['**/node_modules/**'],
                          },
                        },
                      },
                    },
                    'codesandbox-e2e': {
                      root: 'e2e/',
                      projectType: 'application',
                      architect: {
                        e2e: {
                          builder: '@angular-devkit/build-angular:protractor',
                          options: {
                            protractorConfig: 'e2e/protractor.conf.js',
                            devServerTarget: 'codesandbox:serve',
                          },
                          configurations: {
                            production: {
                              devServerTarget: 'codesandbox:serve:production',
                            },
                          },
                        },
                        lint: {
                          builder: '@angular-devkit/build-angular:tslint',
                          options: {
                            tsConfig: 'e2e/tsconfig.e2e.json',
                            exclude: ['**/node_modules/**'],
                          },
                        },
                      },
                    },
                  },
                  defaultProject: 'codesandbox',
                },
                null,
                2
              );
            },
            schema:
              'https://raw.githubusercontent.com/angular/angular-cli/master/packages/angular/cli/lib/config/schema.json',
          },
          tsconfig: {
            title: 'tsconfig.json',
            type: 'typescript',
            description: 'Configuration for how TypeScript transpiles.',
            moreInfoUrl:
              'http://www.typescriptlang.org/docs/handbook/tsconfig-json.html',
            getDefaultCode: function getDefaultCode(template, resolveModule) {
              if ('create-react-app-typescript' === template)
                return JSON.stringify(
                  {
                    compilerOptions: {
                      outDir: 'build/dist',
                      module: 'esnext',
                      target: 'es5',
                      lib: ['es6', 'dom'],
                      sourceMap: !0,
                      allowJs: !0,
                      jsx: 'react',
                      moduleResolution: 'node',
                      rootDir: 'src',
                      forceConsistentCasingInFileNames: !0,
                      noImplicitReturns: !0,
                      noImplicitThis: !0,
                      noImplicitAny: !0,
                      strictNullChecks: !0,
                      suppressImplicitAnyIndexErrors: !0,
                      noUnusedLocals: !0,
                    },
                    exclude: [
                      'node_modules',
                      'build',
                      'scripts',
                      'acceptance-tests',
                      'webpack',
                      'jest',
                      'src/setupTests.ts',
                    ],
                  },
                  null,
                  2
                );
              if ('parcel' === template) {
                var tsconfig = {
                    compilerOptions: {
                      module: 'commonjs',
                      jsx: 'preserve',
                      jsxFactory: void 0,
                      esModuleInterop: !0,
                      sourceMap: !0,
                      allowJs: !0,
                      lib: ['es6', 'dom'],
                      rootDir: 'src',
                      moduleResolution: 'node',
                    },
                  },
                  packageJSONModule = resolveModule('/package.json');
                if (packageJSONModule)
                  try {
                    var parsed = JSON.parse(packageJSONModule.code),
                      pragma = null;
                    Object.keys(tsconfig_JSX_PRAGMA).forEach(function(dep) {
                      ((parsed.dependencies && parsed.dependencies[dep]) ||
                        (parsed.devDependencies &&
                          parsed.devDependencies[dep])) &&
                        (pragma = tsconfig_JSX_PRAGMA[dep]);
                    }),
                      null !== pragma &&
                        ((tsconfig.compilerOptions.jsx = 'react'),
                        (tsconfig.compilerOptions.jsxFactory = pragma));
                  } catch (e) {}
                return JSON.stringify(tsconfig, null, 2);
              }
              return 'nest' === template
                ? JSON.stringify(
                    {
                      compilerOptions: {
                        module: 'commonjs',
                        declaration: !0,
                        noImplicitAny: !1,
                        removeComments: !0,
                        noLib: !1,
                        allowSyntheticDefaultImports: !0,
                        emitDecoratorMetadata: !0,
                        experimentalDecorators: !0,
                        target: 'es6',
                        sourceMap: !0,
                        outDir: './dist',
                        baseUrl: './src',
                      },
                    },
                    null,
                    2
                  )
                : '@dojo/cli-create-app' === template
                  ? JSON.stringify({
                      compilerOptions: {
                        declaration: !1,
                        experimentalDecorators: !0,
                        jsx: 'react',
                        jsxFactory: 'tsx',
                        lib: [
                          'dom',
                          'es5',
                          'es2015.promise',
                          'es2015.iterable',
                          'es2015.symbol',
                          'es2015.symbol.wellknown',
                        ],
                        module: 'commonjs',
                        moduleResolution: 'node',
                        noUnusedLocals: !0,
                        outDir: '_build/',
                        removeComments: !1,
                        importHelpers: !0,
                        downLevelIteration: !0,
                        sourceMap: !0,
                        strict: !0,
                        target: 'es5',
                      },
                    })
                  : JSON.stringify(
                      {
                        compilerOptions: {
                          outDir: 'build/dist',
                          module: 'esnext',
                          target: 'es5',
                          lib: ['es6', 'dom'],
                          sourceMap: !0,
                          allowJs: !0,
                          jsx: 'react',
                          moduleResolution: 'node',
                          rootDir: 'src',
                          forceConsistentCasingInFileNames: !0,
                          noImplicitReturns: !0,
                          noImplicitThis: !0,
                          noImplicitAny: !0,
                          strictNullChecks: !0,
                          suppressImplicitAnyIndexErrors: !0,
                          noUnusedLocals: !0,
                        },
                      },
                      null,
                      2
                    );
            },
            schema:
              'https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json',
            partialSupportDisclaimer:
              'Only `compilerOptions` field is supported.',
          },
          customCodeSandbox: {
            title: 'template.json',
            type: 'customTemplate',
            description: 'Configuration for the custom template',
            moreInfoUrl: 'https://codesandbox.io',
            getDefaultCode: function getDefaultCode() {
              return JSON.stringify(
                {
                  templateName: 'custom',
                  templateColor: '#aaa',
                  sandpack: {
                    defaultExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
                    aliases: {},
                    transpilers: {
                      '\\.jsx?$': ['codesandbox:babel'],
                      '\\.json$': ['codesandbox:json'],
                    },
                  },
                },
                null,
                2
              );
            },
          },
          nowConfig: {
            title: 'now.json',
            type: 'now',
            description: 'Configuration for your deployments on now.',
            moreInfoUrl: 'https://zeit.co/docs/features/configuration',
            getDefaultCode: function getDefaultCode() {
              return JSON.stringify({}, null, 2);
            },
          },
        },
        defaultConfigurations = {
          '/package.json': configuration.packageJSON,
          '/.prettierrc': configuration.prettierRC,
          '/sandbox.config.json': configuration.sandboxConfig,
          '/now.json': configuration.nowConfig,
        },
        CLIENT_VIEWS = [
          {
            views: [{ id: 'codesandbox.browser' }, { id: 'codesandbox.tests' }],
          },
          {
            views: [
              { id: 'codesandbox.console' },
              { id: 'codesandbox.problems' },
            ],
          },
        ],
        SERVER_VIEWS = [
          { views: [{ id: 'codesandbox.browser' }] },
          {
            open: !0,
            views: [
              { id: 'codesandbox.terminal' },
              { id: 'codesandbox.console' },
            ],
          },
        ],
        template_Template = (function() {
          function Template(name, niceName, url, shortid, color) {
            var _this = this,
              options =
                arguments.length > 5 && void 0 !== arguments[5]
                  ? arguments[5]
                  : {};
            Object(classCallCheck.a)(this, Template),
              Object(defineProperty.a)(this, 'name', void 0),
              Object(defineProperty.a)(this, 'niceName', void 0),
              Object(defineProperty.a)(this, 'shortid', void 0),
              Object(defineProperty.a)(this, 'url', void 0),
              Object(defineProperty.a)(this, 'main', void 0),
              Object(defineProperty.a)(this, 'color', void 0),
              Object(defineProperty.a)(this, 'backgroundColor', void 0),
              Object(defineProperty.a)(this, 'showOnHomePage', void 0),
              Object(defineProperty.a)(this, 'distDir', void 0),
              Object(defineProperty.a)(this, 'configurationFiles', void 0),
              Object(defineProperty.a)(this, 'isTypescript', void 0),
              Object(defineProperty.a)(
                this,
                'externalResourcesEnabled',
                void 0
              ),
              Object(defineProperty.a)(this, 'showCube', void 0),
              Object(defineProperty.a)(this, 'isServer', void 0),
              Object(defineProperty.a)(this, 'mainFile', void 0),
              Object(defineProperty.a)(this, 'alterDeploymentData', function(
                apiData
              ) {
                var packageJSONFile = apiData.files.find(function(x) {
                    return 'package.json' === x.file;
                  }),
                  parsedFile = JSON.parse(packageJSONFile.data),
                  newParsedFile = Object(objectSpread.a)({}, parsedFile, {
                    devDependencies: Object(objectSpread.a)(
                      {},
                      parsedFile.devDependencies,
                      { serve: '^10.1.1' }
                    ),
                    scripts: Object(objectSpread.a)(
                      {
                        'now-start': 'cd '.concat(
                          _this.distDir,
                          ' && serve -s ./'
                        ),
                      },
                      parsedFile.scripts
                    ),
                  });
                return Object(objectSpread.a)({}, apiData, {
                  files: Object(toConsumableArray.a)(
                    apiData.files.filter(function(x) {
                      return 'package.json' !== x.file;
                    })
                  ).concat([
                    {
                      file: 'package.json',
                      data: JSON.stringify(newParsedFile, null, 2),
                    },
                  ]),
                });
              }),
              (this.name = name),
              (this.niceName = niceName),
              (this.url = url),
              (this.shortid = shortid),
              (this.color = color),
              (this.isServer = options.isServer || !1),
              (this.main = options.main || !1),
              (this.showOnHomePage = options.showOnHomePage || !1),
              (this.distDir = options.distDir || 'build'),
              (this.configurationFiles = Object(objectSpread.a)(
                {},
                defaultConfigurations,
                options.extraConfigurations || {}
              )),
              (this.isTypescript = options.isTypescript || !1),
              (this.externalResourcesEnabled =
                null == options.externalResourcesEnabled ||
                options.externalResourcesEnabled),
              (this.mainFile = options.mainFile),
              (this.backgroundColor = options.backgroundColor),
              (this.showCube = null == options.showCube || options.showCube);
          }
          return (
            Object(createClass.a)(Template, [
              {
                key: 'getEntries',
                value: function getEntries(configurationFiles) {
                  return [
                    configurationFiles.package &&
                      configurationFiles.package.parsed &&
                      configurationFiles.package.parsed.main &&
                      absolute(configurationFiles.package.parsed.main),
                    '/index.' + (this.isTypescript ? 'ts' : 'js'),
                    '/src/index.' + (this.isTypescript ? 'ts' : 'js'),
                    '/src/index.ts',
                    '/src/index.tsx',
                    '/src/index.js',
                    '/src/pages/index.js',
                    '/src/pages/index.vue',
                    '/index.js',
                    '/index.ts',
                    '/index.tsx',
                  ]
                    .concat(Object(toConsumableArray.a)(this.mainFile || []))
                    .filter(function(x) {
                      return x;
                    });
                },
              },
              {
                key: 'getDefaultOpenedFiles',
                value: function getDefaultOpenedFiles(configurationFiles) {
                  return this.getEntries(configurationFiles);
                },
              },
              {
                key: 'getViews',
                value: function getViews() {
                  return this.isServer ? SERVER_VIEWS : CLIENT_VIEWS;
                },
              },
              {
                key: 'getHTMLEntries',
                value: function getHTMLEntries(configurationFiles) {
                  return ['/public/index.html', '/index.html'];
                },
              },
            ]),
            Template
          );
        })(),
        src_theme = __webpack_require__(3);
      var angular = new ((function(_Template) {
          function AngularTemplate() {
            return (
              Object(classCallCheck.a)(this, AngularTemplate),
              Object(possibleConstructorReturn.a)(
                this,
                Object(getPrototypeOf.a)(AngularTemplate).apply(this, arguments)
              )
            );
          }
          return (
            Object(inherits.a)(AngularTemplate, _Template),
            Object(createClass.a)(AngularTemplate, [
              {
                key: 'getEntries',
                value: function getEntries(configurationFiles) {
                  var entries = [];
                  if (configurationFiles['angular-config'].generated) {
                    var _parsed = configurationFiles['angular-cli'].parsed;
                    entries = entries.concat(
                      (function getAngularCLIEntries(parsed) {
                        var entries = [];
                        if (parsed) {
                          var app = parsed.apps && parsed.apps[0];
                          app &&
                            app.root &&
                            app.main &&
                            entries.push(absolute(join(app.root, app.main)));
                        }
                        return entries;
                      })(_parsed)
                    );
                  } else {
                    var parsed = configurationFiles['angular-config'].parsed;
                    entries = entries.concat(
                      (function getAngularJSONEntries(parsed) {
                        var entries = [];
                        if (parsed) {
                          var defaultProject = parsed.defaultProject,
                            project = parsed.projects[defaultProject],
                            build = project.architect.build;
                          build.options.main &&
                            entries.push(
                              absolute(join(project.root, build.options.main))
                            );
                        }
                        return entries;
                      })(parsed)
                    );
                  }
                  return (
                    configurationFiles.package.parsed &&
                      configurationFiles.package.parsed.main &&
                      entries.push(
                        absolute(configurationFiles.package.parsed.main)
                      ),
                    entries.push('/src/main.ts'),
                    entries.push('/main.ts'),
                    entries
                  );
                },
              },
              {
                key: 'getHTMLEntries',
                value: function getHTMLEntries(configurationFiles) {
                  var entries = [];
                  if (configurationFiles['angular-config'].generated) {
                    var _parsed2 = configurationFiles['angular-cli'].parsed;
                    entries = entries.concat(
                      (function getAngularCLIHTMLEntry(parsed) {
                        if (parsed) {
                          var app = parsed.apps && parsed.apps[0];
                          if (app && app.root && app.index)
                            return [absolute(join(app.root, app.index))];
                        }
                        return [];
                      })(_parsed2)
                    );
                  } else {
                    var parsed = configurationFiles['angular-config'].parsed;
                    entries = entries.concat(
                      (function getAngularJSONHTMLEntry(parsed) {
                        if (parsed) {
                          var defaultProject = parsed.defaultProject,
                            project = parsed.projects[defaultProject],
                            build = project.architect.build;
                          if (
                            build &&
                            null != project.root &&
                            build.options &&
                            build.options.index
                          )
                            return [
                              absolute(join(project.root, build.options.index)),
                            ];
                        }
                        return [];
                      })(parsed)
                    );
                  }
                  return (
                    entries.push('/public/index.html'),
                    entries.push('/index.html'),
                    entries
                  );
                },
              },
            ]),
            AngularTemplate
          );
        })(template_Template))(
          'angular-cli',
          'Angular',
          'https://github.com/angular/angular',
          'angular',
          Object(src_theme.a)(function() {
            return '#DD0031';
          }),
          {
            extraConfigurations: {
              '/.angular-cli.json': configuration.angularCli,
              '/angular.json': configuration.angularJSON,
            },
            isTypescript: !0,
            distDir: 'dist',
            showOnHomePage: !0,
            main: !0,
          }
        ),
        babel = new template_Template(
          'babel-repl',
          'Babel',
          'https://github.com/@babel/core',
          'babel',
          Object(src_theme.a)(function() {
            return '#F5DA55';
          }),
          {
            extraConfigurations: {
              '/.babelrc': configuration.babelrc,
              '/babel-transpiler.json': configuration.babelTranspiler,
            },
          }
        ),
        templates_parcel = new ((function(_Template) {
          function ParcelTemplate() {
            return (
              Object(classCallCheck.a)(this, ParcelTemplate),
              Object(possibleConstructorReturn.a)(
                this,
                Object(getPrototypeOf.a)(ParcelTemplate).apply(this, arguments)
              )
            );
          }
          return (
            Object(inherits.a)(ParcelTemplate, _Template),
            Object(createClass.a)(ParcelTemplate, [
              {
                key: 'getEntries',
                value: function getEntries(configurationFiles) {
                  var entries = [];
                  return (
                    'undefined' != typeof document &&
                      '/' !== document.location.pathname &&
                      entries.push(document.location.pathname),
                    entries.push(
                      configurationFiles.package &&
                        configurationFiles.package.parsed &&
                        configurationFiles.package.parsed.main &&
                        absolute(configurationFiles.package.parsed.main)
                    ),
                    entries.push('/index.html'),
                    entries.push('/src/index.html'),
                    entries.filter(Boolean)
                  );
                },
              },
              {
                key: 'getDefaultOpenedFiles',
                value: function getDefaultOpenedFiles(configFiles) {
                  var entries = [];
                  return (
                    entries.push('/index.js'),
                    entries.push('/src/index.js'),
                    entries.concat(this.getEntries(configFiles)),
                    entries
                  );
                },
              },
            ]),
            ParcelTemplate
          );
        })(template_Template))(
          'parcel',
          'Vanilla',
          'https://parceljs.org/',
          'vanilla',
          Object(src_theme.a)(function() {
            return '#dfb07a';
          }),
          {
            showOnHomePage: !0,
            showCube: !0,
            extraConfigurations: {
              '/.babelrc': configuration.babelrc,
              '/tsconfig.json': configuration.tsconfig,
            },
            externalResourcesEnabled: !1,
            distDir: 'dist',
            main: !0,
            isTypescript: !0,
          }
        ),
        preact = new template_Template(
          'preact-cli',
          'Preact',
          'https://github.com/developit/preact-cli',
          'preact',
          Object(src_theme.a)(function() {
            return '#AD78DC';
          }),
          {
            showOnHomePage: !0,
            extraConfigurations: { '/.babelrc': configuration.babelrc },
          }
        ),
        reason = new template_Template(
          'reason',
          'Reason',
          'https://reasonml.github.io/reason-react/en/',
          'reason',
          Object(src_theme.a)(function() {
            return '#CB5747';
          }),
          {
            showOnHomePage: !0,
            main: !1,
            mainFile: ['/src/Main.re', 'App.re', 'Index.re'],
          }
        ),
        templates_react = new template_Template(
          'create-react-app',
          'React',
          'https://github.com/facebookincubator/create-react-app',
          'new',
          Object(src_theme.a)(function() {
            return '#61DAFB';
          }),
          {
            showOnHomePage: !0,
            main: !0,
            mainFile: ['/src/index.js', '/src/index.tsx', '/src/index.ts'],
          }
        ),
        react_ts = new template_Template(
          'create-react-app-typescript',
          'React + TS',
          'https://github.com/wmonk/create-react-app-typescript',
          'react-ts',
          Object(src_theme.a)(function() {
            return '#009fff';
          }),
          {
            isTypescript: !0,
            showOnHomePage: !1,
            extraConfigurations: { '/tsconfig.json': configuration.tsconfig },
          }
        ),
        svelte = new template_Template(
          'svelte',
          'Svelte',
          'https://github.com/sveltejs/svelte',
          'svelte',
          Object(src_theme.a)(function() {
            return '#AA1E1E';
          }),
          { showOnHomePage: !0, showCube: !1, distDir: 'public' }
        ),
        get = __webpack_require__(147),
        vue = new ((function(_Template) {
          function VueTemplate() {
            return (
              Object(classCallCheck.a)(this, VueTemplate),
              Object(possibleConstructorReturn.a)(
                this,
                Object(getPrototypeOf.a)(VueTemplate).apply(this, arguments)
              )
            );
          }
          return (
            Object(inherits.a)(VueTemplate, _Template),
            Object(createClass.a)(VueTemplate, [
              {
                key: 'getEntries',
                value: function getEntries(configurationFiles) {
                  var entries = Object(get.a)(
                    Object(getPrototypeOf.a)(VueTemplate.prototype),
                    'getEntries',
                    this
                  ).call(this, configurationFiles);
                  return (
                    entries.push('/src/main.js'),
                    entries.push('/main.js'),
                    entries
                  );
                },
              },
              {
                key: 'getHTMLEntries',
                value: function getHTMLEntries(configurationFiles) {
                  return ['/static/index.html', '/index.html'];
                },
              },
            ]),
            VueTemplate
          );
        })(template_Template))(
          'vue-cli',
          'Vue',
          'https://github.com/vuejs/vue-cli',
          'vue',
          Object(src_theme.a)(function() {
            return '#41B883';
          }),
          {
            showOnHomePage: !0,
            extraConfigurations: { '/.babelrc': configuration.babelrc },
            distDir: 'dist',
            main: !0,
          }
        ),
        ember = new template_Template(
          'ember',
          'Ember',
          'https://emberjs.com/',
          'github/mike-north/ember-new-output',
          Object(src_theme.a)(function() {
            return '#E04E39';
          }),
          { isServer: !0, showOnHomePage: !0, main: !1 }
        ),
        templates_cxjs = new ((function(_Template) {
          function CxJSTemplate() {
            return (
              Object(classCallCheck.a)(this, CxJSTemplate),
              Object(possibleConstructorReturn.a)(
                this,
                Object(getPrototypeOf.a)(CxJSTemplate).apply(this, arguments)
              )
            );
          }
          return (
            Object(inherits.a)(CxJSTemplate, _Template),
            Object(createClass.a)(CxJSTemplate, [
              {
                key: 'getEntries',
                value: function getEntries() {
                  return ['/app/index.js', '/src/index.js', '/index.html'];
                },
              },
              {
                key: 'getHTMLEntries',
                value: function getHTMLEntries() {
                  return ['/app/index.html', '/src/index.html', '/index.html'];
                },
              },
            ]),
            CxJSTemplate
          );
        })(template_Template))(
          'cxjs',
          'CxJS',
          'https://cxjs.io/',
          'github/codaxy/cxjs-codesandbox-template',
          Object(src_theme.a)(function() {
            return '#11689f';
          }),
          {
            showOnHomePage: !0,
            showCube: !1,
            extraConfigurations: {
              '/.babelrc': configuration.babelrc,
              '/tsconfig.json': configuration.tsconfig,
            },
            externalResourcesEnabled: !1,
            distDir: 'dist',
          }
        ),
        dojo = new ((function(_Template) {
          function DojoTemplate() {
            return (
              Object(classCallCheck.a)(this, DojoTemplate),
              Object(possibleConstructorReturn.a)(
                this,
                Object(getPrototypeOf.a)(DojoTemplate).apply(this, arguments)
              )
            );
          }
          return (
            Object(inherits.a)(DojoTemplate, _Template),
            Object(createClass.a)(DojoTemplate, [
              {
                key: 'getHTMLEntries',
                value: function getHTMLEntries(configurationFiles) {
                  return ['/src/index.html'];
                },
              },
              {
                key: 'getEntries',
                value: function getEntries(configurationFiles) {
                  var entries = Object(get.a)(
                    Object(getPrototypeOf.a)(DojoTemplate.prototype),
                    'getEntries',
                    this
                  ).call(this, configurationFiles);
                  return entries.push('/src/main.ts'), entries;
                },
              },
            ]),
            DojoTemplate
          );
        })(template_Template))(
          '@dojo/cli-create-app',
          'Dojo',
          'https://github.com/dojo/cli-create-app',
          'github/dojo/dojo-codesandbox-template',
          Object(src_theme.a)(function() {
            return '#D3471C';
          }),
          {
            showOnHomePage: !0,
            showCube: !1,
            isTypescript: !0,
            extraConfigurations: { '/tsconfig.json': configuration.tsconfig },
          }
        ),
        custom = new template_Template(
          'custom',
          'Custom',
          'https://codesandbox.io',
          'custom',
          Object(src_theme.a)(function() {
            return '#F5DA55';
          }),
          {
            extraConfigurations: {
              '/.codesandbox/template.json': configuration.customCodeSandbox,
            },
          }
        ),
        gatsby = new template_Template(
          'gatsby',
          'Gatsby',
          'https://www.gatsbyjs.org/',
          'github/gatsbyjs/gatsby-starter-default',
          Object(src_theme.a)(function() {
            return '#8C65B3';
          }),
          {
            extraConfigurations: { '/.babelrc': configuration.babelrc },
            isServer: !0,
            mainFile: ['/src/pages/index.js'],
            showOnHomePage: !0,
            main: !0,
          }
        ),
        nuxt = new template_Template(
          'nuxt',
          'Nuxt.js',
          'https://nuxtjs.org/',
          'github/nuxt/codesandbox-nuxt',
          Object(src_theme.a)(function() {
            return '#3B8070';
          }),
          {
            extraConfigurations: { '/.babelrc': configuration.babelrc },
            isServer: !0,
            mainFile: ['/pages/index.vue'],
            showOnHomePage: !0,
            main: !0,
          }
        ),
        next = new template_Template(
          'next',
          'Next.js',
          'https://nextjs.org/',
          'github/zeit/next.js/tree/master/examples/hello-world',
          Object(src_theme.a)(function() {
            return '#ffffff';
          }),
          {
            extraConfigurations: { '/.babelrc': configuration.babelrc },
            isServer: !0,
            mainFile: ['/pages/index.js'],
            backgroundColor: Object(src_theme.a)(function() {
              return '#000000';
            }),
            showOnHomePage: !0,
            main: !0,
          }
        ),
        node = new template_Template(
          'node',
          'Node',
          'https://codesandbox.io/docs/sse',
          'node',
          Object(src_theme.a)(function() {
            return '#66cc33';
          }),
          {
            isServer: !0,
            showOnHomePage: !0,
            main: !0,
            mainFile: [
              '/pages/index.vue',
              '/pages/index.js',
              '/src/pages/index.js',
            ],
          }
        ),
        apollo_server = new template_Template(
          'apollo',
          'Apollo',
          'https://www.apollographql.com/docs/apollo-server/',
          'apollo-server',
          Object(src_theme.a)(function() {
            return '#c4198b';
          }),
          { isServer: !0, mainFile: ['/src/index.js'], showOnHomePage: !0 }
        ),
        extendedSandboxConfig = Object(objectSpread.a)(
          {},
          configuration.sandboxConfig,
          {
            getDefaultCode: function getDefaultCode() {
              return JSON.stringify({ container: { port: 3e3 } }, null, 2);
            },
          }
        ),
        sapper = new template_Template(
          'sapper',
          'Sapper',
          'https://sapper.svelte.technology/',
          'github/codesandbox-app/sapper-template',
          Object(src_theme.a)(function() {
            return '#105E10';
          }),
          {
            extraConfigurations: {
              '/sandbox.config.json': extendedSandboxConfig,
            },
            isServer: !0,
            mainFile: ['/src/routes/index.html'],
            showOnHomePage: !0,
          }
        ),
        nest = new template_Template(
          'nest',
          'Nest',
          'https://nestjs.com/',
          'github/nestjs/typescript-starter',
          Object(src_theme.a)(function() {
            return '#ed2945';
          }),
          {
            extraConfigurations: { '/tsconfig.json': configuration.tsconfig },
            isServer: !0,
            mainFile: ['/src/main.ts'],
            showOnHomePage: !0,
          }
        ),
        templates_static = new template_Template(
          'static',
          'Static',
          'https://developer.mozilla.org/en-US/docs/Learn/HTML',
          'github/codesandbox-app/static-template',
          Object(src_theme.a)(function() {
            return '#3AA855';
          }),
          { showOnHomePage: !0, main: !1, mainFile: ['/index.html'] }
        ),
        styleguidist = new template_Template(
          'styleguidist',
          'Styleguidist',
          'https://react-styleguidist.js.org/',
          'github/styleguidist/example',
          Object(src_theme.a)(function() {
            return '#25d8fc';
          }),
          {
            extraConfigurations: { '/.babelrc': configuration.babelrc },
            isServer: !0,
            mainFile: [],
            showOnHomePage: !0,
          }
        );
      var node_modules_color = __webpack_require__(142),
        color_default = __webpack_require__.n(node_modules_color);
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  max-width: 30%;\n  left: 50%;\n  position: absolute;\n  top: 6px;\n  transform: translateX(-50%);\n\n  svg,\n  img {\n    max-width: 100%;\n    filter: grayscale(0.4);\n    height: auto;\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var IconContainer = __webpack_require__(1).d.div(_templateObject());
      __webpack_exports__.a = function(_ref) {
        var style = _ref.style,
          sandboxesNumber = _ref.sandboxesNumber,
          template = _ref.template,
          templateInfo = (function getDefinition(theme) {
            switch (theme) {
              case templates_react.name:
                return templates_react;
              case vue.name:
                return vue;
              case preact.name:
                return preact;
              case react_ts.name:
                return react_ts;
              case svelte.name:
                return svelte;
              case angular.name:
                return angular;
              case templates_parcel.name:
                return templates_parcel;
              case babel.name:
                return babel;
              case templates_cxjs.name:
                return templates_cxjs;
              case dojo.name:
                return dojo;
              case custom.name:
                return custom;
              case gatsby.name:
                return gatsby;
              case nuxt.name:
                return nuxt;
              case next.name:
                return next;
              case reason.name:
                return reason;
              case node.name:
                return node;
              case apollo_server.name:
                return apollo_server;
              case sapper.name:
                return sapper;
              case nest.name:
                return nest;
              case templates_static.name:
                return templates_static;
              case styleguidist.name:
                return styleguidist;
              case ember.name:
                return ember;
              default:
                return templates_react;
            }
          })(template),
          color = templateInfo.color(),
          lighter = color_default()(color)
            .lighten(0.2)
            .rgb(),
          Icon = (function getIcon(theme) {
            switch (theme) {
              case templates_react.name:
                return React;
              case vue.name:
                return Vue;
              case preact.name:
                return Preact;
              case react_ts.name:
                return React;
              case svelte.name:
                return Svelte;
              case angular.name:
                return Angular;
              case templates_parcel.name:
                return Parcel;
              case dojo.name:
                return Dojo;
              case ember.name:
                return Ember;
              case sapper.name:
                return Sapper;
              case templates_cxjs.name:
                return CxJS;
              case reason.name:
                return Reason;
              case gatsby.name:
                return Gatsby;
              case next.name:
                return Next;
              case nuxt.name:
                return Nuxt;
              case node.name:
                return Node;
              case apollo_server.name:
                return Apollo;
              case nest.name:
                return Nest;
              case templates_static.name:
                return Static;
              case styleguidist.name:
                return Styleguidist;
              default:
                return React;
            }
          })(template);
        return sandboxesNumber >= 50
          ? react_default.a.createElement(
              Tooltip.a,
              {
                style: { display: 'flex', position: 'relative' },
                title: ''
                  .concat(
                    sandboxesNumber < 100 ? 'Silver' : 'Gold',
                    ' medal for '
                  )
                  .concat(templateInfo.niceName),
              },
              react_default.a.createElement(
                IconBase_default.a,
                {
                  style: style,
                  width: '1em',
                  height: '0.67em',
                  viewBox: '0 0 204 320',
                  fill: 'none',
                },
                react_default.a.createElement('path', {
                  d: 'M162.478 320V182H102v104.895L162.478 320z',
                  fill: color,
                }),
                react_default.a.createElement('path', {
                  d: 'M41.522 319.628V182H102v105.639l-60.478 31.989z',
                  fill: 'rgb('
                    .concat(lighter.r, ',')
                    .concat(lighter.g, ',')
                    .concat(lighter.b, ')'),
                }),
                react_default.a.createElement('circle', {
                  cx: 102,
                  cy: '102.355',
                  r: 102,
                  transform: 'rotate(180 102 102.355)',
                  fill: sandboxesNumber < 100 ? '#EBEBEB' : '#EAC17A',
                }),
                react_default.a.createElement('circle', {
                  cx: 102,
                  cy: '102.355',
                  r: '92.7273',
                  transform: 'rotate(180 102 102.355)',
                  fill: sandboxesNumber < 100 ? '#C8C8C8' : '#CFAE72',
                })
              ),
              react_default.a.createElement(
                IconContainer,
                null,
                react_default.a.createElement(Icon, null)
              )
            )
          : null;
      };
    },
    337: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var objectWithoutProperties = __webpack_require__(34),
        react = __webpack_require__(0),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1);
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  margin: ',
          ';\n  box-sizing: border-box;\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Margin = styled_components_browser_esm.d.div(
          _templateObject(),
          function(_ref) {
            var margin = _ref.margin,
              top = _ref.top,
              right = _ref.right,
              left = _ref.left,
              bottom = _ref.bottom,
              horizontal = _ref.horizontal,
              vertical = _ref.vertical,
              topMargin =
                [top, vertical, margin].find(function(s) {
                  return null != s;
                }) || 0,
              rightMargin =
                [right, horizontal, margin].find(function(s) {
                  return null != s;
                }) || 0,
              bottomMargin =
                [bottom, vertical, margin].find(function(s) {
                  return null != s;
                }) || 0,
              leftMargin =
                [left, horizontal, margin].find(function(s) {
                  return null != s;
                }) || 0;
            return ''
              .concat(topMargin, 'rem ')
              .concat(rightMargin, 'rem ')
              .concat(bottomMargin, 'rem ')
              .concat(leftMargin, 'rem');
          }
        ),
        clear = __webpack_require__(335),
        clear_default = __webpack_require__.n(clear);
      function _templateObject4() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  transition: 0.3s ease all;\n  position: absolute;\n  right: 0.3rem;\n  top: 0;\n  bottom: 0;\n\n  margin: auto;\n  cursor: pointer;\n  color: rgba(255, 255, 255, 0.5);\n\n  &:hover {\n    color: white;\n  }\n',
        ]);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n      padding-right: 1.5rem;\n    ',
        ]);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  position: relative;\n  color: white;\n  background-color: ',
          ';\n  padding: 0.3em 0.5em;\n  border-radius: 4px;\n  font-weight: 500;\n\n  ',
          ';\n',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function elements_templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  margin-left: -0.2rem;\n  margin-right: -0.2rem;\n  ',
          ';\n',
        ]);
        return (
          (elements_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var TagContainer = styled_components_browser_esm.d.div(
          elements_templateObject(),
          function(props) {
            return 'right' === props.align && 'justify-content: flex-end;';
          }
        ),
        Container = styled_components_browser_esm.d.span(
          _templateObject2(),
          function(props) {
            return props.theme.secondary;
          },
          function(props) {
            return (
              props.canRemove &&
              Object(styled_components_browser_esm.c)(_templateObject3())
            );
          }
        ),
        DeleteIcon = Object(styled_components_browser_esm.d)(clear_default.a)(
          _templateObject4()
        );
      function Tag(_ref) {
        var tag = _ref.tag,
          removeTag = _ref.removeTag;
        return react.createElement(
          Container,
          { canRemove: !!removeTag },
          tag,
          removeTag &&
            react.createElement(DeleteIcon, {
              onClick: function onClick() {
                removeTag({ tag: tag });
              },
            })
        );
      }
      __webpack_exports__.a = function Tags(_ref) {
        var tags = _ref.tags,
          _ref$align = _ref.align,
          align = void 0 === _ref$align ? 'left' : _ref$align,
          props = Object(objectWithoutProperties.a)(_ref, ['tags', 'align']);
        return react.createElement(
          TagContainer,
          Object.assign({ align: align }, props),
          tags.sort().map(function(tag) {
            return react.createElement(
              Margin,
              { key: tag, vertical: 0.5, horizontal: 0.2 },
              react.createElement(Tag, { tag: tag })
            );
          })
        );
      };
    },
    338: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var react = __webpack_require__(0),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1);
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: flex;\n  flex: auto;\n  width: 100%;\n  height: 100%;\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Fullscreen = styled_components_browser_esm.d.div(_templateObject());
      function Centered_templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  position: relative;\n  display: flex;\n  ',
          ';\n  ',
          ';\n\n  flex-direction: column;\n  width: 100%;\n',
        ]);
        return (
          (Centered_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Centered = styled_components_browser_esm.d.div(
          Centered_templateObject(),
          function(props) {
            return props.vertical && 'justify-content: center;';
          },
          function(props) {
            return props.horizontal && 'align-items: center;';
          }
        ),
        theme = __webpack_require__(3),
        play = __webpack_require__(331),
        play_default = __webpack_require__.n(play);
      __webpack_exports__.a = function RunOnClick(_ref) {
        var onClick = _ref.onClick;
        return react.createElement(
          Fullscreen,
          {
            style: { backgroundColor: theme.b.primary(), cursor: 'pointer' },
            onClick: onClick,
          },
          react.createElement(
            Centered,
            { horizontal: !0, vertical: !0 },
            react.createElement('img', {
              width: 170,
              height: 170,
              src: play_default.a,
              alt: 'Run Sandbox',
            }),
            react.createElement(
              'div',
              {
                style: {
                  color: theme.b.red(),
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginTop: 24,
                  textTransform: 'uppercase',
                },
              },
              'Click to run'
            )
          )
        );
      };
    },
    339: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var objectWithoutProperties = __webpack_require__(34),
        react = __webpack_require__(0),
        mark_github = __webpack_require__(329),
        mark_github_default = __webpack_require__.n(mark_github),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1);
      function _templateObject5() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  text-decoration: none;\n',
        ]);
        return (
          (_templateObject5 = function _templateObject5() {
            return data;
          }),
          data
        );
      }
      function _templateObject4() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: inline-block;\n  padding: 3px 5px;\n  background-color: #4f5459;\n  border-radius: 2px;\n  color: ',
          ';\n',
        ]);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  display: inline-block;\n\n  color: ',
          ';\n  border-radius: 4px;\n  padding: 3px 5px;\n\n  &:hover {\n    color: rgba(255, 255, 255, 0.6);\n  }\n',
        ]);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n      &:hover {\n        background-color: #4f5459;\n      }\n    ',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  transition: 0.3s ease all;\n  border-radius: 4px;\n  border: 1px solid #4f5459;\n  font-size: 0.75em;\n  margin-right: 1rem;\n\n  display: flex;\n\n  ',
          ';\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var BorderRadius = styled_components_browser_esm.d.div(
          _templateObject(),
          function(props) {
            return (
              props.hasUrl &&
              Object(styled_components_browser_esm.c)(_templateObject2())
            );
          }
        ),
        Text = styled_components_browser_esm.d.span(
          _templateObject3(),
          function(props) {
            return props.theme.light ? '#636363' : 'rgba(255, 255, 255, 0.6)';
          }
        ),
        Icon = styled_components_browser_esm.d.span(
          _templateObject4(),
          function(props) {
            return props.theme.background;
          }
        ),
        StyledA = styled_components_browser_esm.d.a(_templateObject5()),
        GithubBadge_DivOrA = function DivOrA(_ref) {
          var href = _ref.href,
            props = Object(objectWithoutProperties.a)(_ref, ['href']);
          return href
            ? react.createElement(
                StyledA,
                Object.assign(
                  { target: '_blank', rel: 'noopener noreferrer', href: href },
                  props
                )
              )
            : react.createElement('div', props);
        };
      __webpack_exports__.a = function GithubBadge(_ref2) {
        var username = _ref2.username,
          repo = _ref2.repo,
          url = _ref2.url,
          branch = _ref2.branch,
          props = Object(objectWithoutProperties.a)(_ref2, [
            'username',
            'repo',
            'url',
            'branch',
          ]);
        return react.createElement(
          GithubBadge_DivOrA,
          Object.assign({}, props, { href: url }),
          react.createElement(
            BorderRadius,
            { hasUrl: !!url },
            react.createElement(
              Icon,
              null,
              react.createElement(mark_github_default.a, null)
            ),
            react.createElement(
              Text,
              null,
              username,
              '/',
              repo,
              branch && 'master' !== branch ? '@'.concat(branch) : ''
            )
          )
        );
      };
    },
    340: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var contributors,
        fetchPromise,
        classCallCheck = __webpack_require__(10),
        createClass = __webpack_require__(11),
        possibleConstructorReturn = __webpack_require__(12),
        getPrototypeOf = __webpack_require__(8),
        inherits = __webpack_require__(13),
        assertThisInitialized = __webpack_require__(6),
        defineProperty = __webpack_require__(5),
        react = __webpack_require__(0),
        react_default = __webpack_require__.n(react),
        IconBase = __webpack_require__(144),
        IconBase_default = __webpack_require__.n(IconBase),
        Tooltip = __webpack_require__(89),
        regenerator = __webpack_require__(205),
        regenerator_default = __webpack_require__.n(regenerator),
        asyncToGenerator = __webpack_require__(327);
      function _isContributor() {
        return (_isContributor = Object(asyncToGenerator.a)(
          regenerator_default.a.mark(function _callee(username) {
            return regenerator_default.a.wrap(
              function _callee$(_context) {
                for (;;)
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (contributors) {
                        _context.next = 3;
                        break;
                      }
                      return (
                        (_context.next = 3),
                        fetchPromise ||
                          (fetchPromise = window
                            .fetch(
                              'https://raw.githubusercontent.com/CompuIves/codesandbox-client/master/.all-contributorsrc'
                            )
                            .then(function(x) {
                              return x.json();
                            })
                            .then(function(x) {
                              return x.contributors.map(function(u) {
                                return u.login;
                              });
                            })
                            .then(function(names) {
                              contributors = names;
                            })
                            .catch(function() {}))
                      );
                    case 3:
                      return _context.abrupt(
                        'return',
                        contributors && contributors.indexOf(username) > -1
                      );
                    case 4:
                    case 'end':
                      return _context.stop();
                  }
              },
              _callee,
              this
            );
          })
        )).apply(this, arguments);
      }
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return ContributorsBadge_ContributorsBadge;
      });
      var ContributorsBadge_ContributorsBadge = (function(_React$Component) {
        function ContributorsBadge() {
          var _getPrototypeOf2, _this;
          Object(classCallCheck.a)(this, ContributorsBadge);
          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          )
            args[_key] = arguments[_key];
          return (
            (_this = Object(possibleConstructorReturn.a)(
              this,
              (_getPrototypeOf2 = Object(getPrototypeOf.a)(
                ContributorsBadge
              )).call.apply(_getPrototypeOf2, [this].concat(args))
            )),
            Object(defineProperty.a)(
              Object(assertThisInitialized.a)(
                Object(assertThisInitialized.a)(_this)
              ),
              'state',
              { isContributor: !1 }
            ),
            _this
          );
        }
        return (
          Object(inherits.a)(ContributorsBadge, _React$Component),
          Object(createClass.a)(ContributorsBadge, [
            {
              key: 'updateContributorStatus',
              value: function updateContributorStatus() {
                var _this2 = this;
                (function isContributor(_x) {
                  return _isContributor.apply(this, arguments);
                })(
                  (arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : this.props
                  ).username
                ).then(function(contributor) {
                  _this2.setState({ isContributor: contributor });
                });
              },
            },
            {
              key: 'componentDidMount',
              value: function componentDidMount() {
                this.updateContributorStatus();
              },
            },
            {
              key: 'componentWillReceiveProps',
              value: function componentWillReceiveProps(nextProps) {
                this.updateContributorStatus(nextProps);
              },
            },
            {
              key: 'render',
              value: function render() {
                var _this$props = this.props,
                  username = _this$props.username,
                  style = _this$props.style;
                return (
                  !!this.state.isContributor &&
                  react_default.a.createElement(
                    'a',
                    {
                      target: '_blank',
                      rel: 'noreferrer noopener',
                      onClick: function onClick(e) {
                        e.stopPropagation();
                      },
                      href:
                        'https://github.com/CompuIves/codesandbox-client/commits?author=' +
                        username,
                    },
                    react_default.a.createElement(
                      Tooltip.a,
                      {
                        style: { display: 'flex' },
                        title: 'Open Source Contributor to CodeSandbox',
                      },
                      react_default.a.createElement(
                        IconBase_default.a,
                        {
                          style: style,
                          width: '1em',
                          height: '0.67em',
                          viewBox: '0 0 284 192',
                          fill: 'none',
                        },
                        react_default.a.createElement('path', {
                          d:
                            'M276 30.9916C229.5 58.0917 180.5 77.5917 130 79.5917C59.1265 79.5917 0 61.5917 0 34.0917C0 15.5917 41 -0.408325 114.803 2.99163C185.677 2.99163 314.5 -13.5084 276 30.9916Z',
                          transform: 'translate(0 112.408)',
                          fill: '#C5A56B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M270.493 40.3281C255 56.5 184.008 89 125.796 89C55.5 89 2.78651e-06 72.0001 0 44.0001C-1.84109e-06 25.5001 72.3769 0 137.189 0C202.002 0 284.165 22.25 270.493 40.3281Z',
                          transform: 'translate(0 99.9999)',
                          fill: '#EAC17A',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M256.656 123.303C256.656 143.23 211.803 163.158 127.082 164.404C48.5987 165.557 0 143.23 0 123.303C0 64.8345 43.6066 0 133.311 0C223.016 0 256.656 64.8345 256.656 123.303Z',
                          transform: 'translate(26.3443 2.85638)',
                          fill: '#E1BD7B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M166.951 122.057C100.918 140.739 25.3333 134.097 0 127.039C89.7049 119.566 115.356 113.806 153.246 93.4111C201.836 67.256 181.902 24.9096 166.951 0C186.885 18.6822 204.328 43.5918 204.328 95.9021C203.082 102.129 194.361 114.302 166.951 122.057Z',
                          transform: 'translate(78.6721 32.7479)',
                          fill: '#CFAE72',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M30.5 175.564C11.5 169.564 3.50001 163.464 0 159.564C-2.68221e-06 158.351 0 158.064 0 157.351C14.9649 150.535 24.6407 147.961 34.7869 144.58C50.9836 12.5587 118.262 5.0858 138.197 1.34936C152.558 -1.34245 178.066 0.420214 190.525 2.91111V5.30307C183.049 6.54874 166.852 10.0704 153.148 15.2671C95.3377 37.1876 72.5793 119.156 69.6721 157.351C54.7213 165.239 37.5 173.564 30.5 175.564Z',
                          transform: 'translate(9 2.43616)',
                          fill: '#AD915F',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M14.2869 164.285C-4.40165 159.303 7.47541 161.512 0 155.285C13.7049 149.057 2.32624 148.394 14.2869 144.409C30.4836 12.3875 97.7623 4.91469 117.697 1.17824C133.644 -1.81091 158.811 1.39569 170.025 5.13196C162.549 6.37762 146.352 9.89933 132.648 15.096C74.8377 37.0165 51.1656 110.998 47.4279 158.326C32.477 166.214 21.7623 163.039 14.2869 164.285Z',
                          transform: 'translate(29.5 0.21521)',
                          fill: '#CFAE72',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M67.9279 13.7003C52.977 10.7111 39.3552 3.32128 34.7869 0C28.5574 1.24548 6.22951 11.2222 0 14.9587C7 23.1587 24.5 30.1587 30.5 31.6587C38 29.1587 53.1432 21.1732 67.9279 13.7003Z',
                          transform: 'translate(9.00001 144.841)',
                          fill: '#E1BD7B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M0 3.73644C22.9246 3.73644 43.6066 1.24548 51.082 0C51.082 0.2764 52.3279 0.949887 52.3279 1.24548C52.3279 9.8297 51.082 25.7564 51.082 28.6461C40.3189 30.6023 14.0129 33.1877 1.2459 33.628C1.00761 33.6362 0.228282 32.3749 0 32.3825V3.73644Z',
                          transform: 'translate(154.672 134.877)',
                          fill: '#AD915F',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M51.082 28.6461C40.118 30.6388 12.459 31.9674 0 32.3825V3.73644C22.9246 3.73644 43.6066 1.24548 51.082 0V28.6461Z',
                          transform: 'translate(155.918 136.123)',
                          fill: '#C5A56B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M2.49181 7.47289C10.4656 6.4765 19.1038 2.0758 22.4262 0L23.2984 0.373644L24.1705 0.747289C25.9146 7.88228 27.4098 21.2484 27.4098 24.9096C18.1916 31.3602 8.08792 37.0438 2.4918 38.6099L0 37.7381C0.415301 29.0197 1.49509 10.462 2.49181 7.47289Z',
                          transform: 'translate(245 117.4)',
                          fill: '#AD915F',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M27.4098 25.4077C17.4426 32.3824 4.98361 36.617 0 37.8625C0.415301 29.1441 1.49508 10.9601 2.4918 7.97096C10.4656 6.97457 18.3563 2.0758 21.6787 0C23.3399 6.64257 27.4098 21.4222 27.4098 25.4077Z',
                          transform: 'translate(247.492 118.148)',
                          fill: '#C5A56B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M0.2748 36.6952C-1.46234 18.9764 5.45728 6.8743 9.22109 3.25526C30.7616 -3.34589 59.5983 1.51809 71.2371 5.3398C70.8897 5.42666 66.2863 6.29523 51.3468 9.76952C24.4211 16.2838 8.35253 28.8781 0.2748 36.6952Z',
                          transform: 'translate(128.293)',
                          fill: '#E1BD7B',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M38.2685 0C19.5942 10.4229 9.98857 14.5613 0 18.9042C6 20.4042 11 21.4042 15.2086 22.2042C20.42 19.5985 39.5713 9.9451 54.337 2.56224C49.9943 1.91083 49.9942 1.91081 38.2692 0.000126629L38.2685 0Z',
                          transform: 'translate(48 161.596)',
                          fill: '#FCF7DE',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M59.1142 3.12681L19 22.9042C22.5 23.4042 22.5 23.4042 26.5 24.0042C33.4486 20.0956 50.5732 11.4651 64.7599 3.64796C59.1142 3.12681 64.7599 3.5611 59.1142 3.12681Z',
                          transform: 'translate(48 161.596)',
                          fill: '#FCF7DE',
                        }),
                        react_default.a.createElement('path', {
                          d:
                            'M5.71143 19.8105C15.2114 16.3105 24.2114 10.8105 41.6486 1.73714L36.4371 0C23.9297 6.60114 11.7257 13.6648 0 17.5733L5.71143 19.8105Z',
                          transform: 'translate(30.2886 155.69)',
                          fill: '#FCF7DE',
                        })
                      )
                    )
                  )
                );
              },
            },
          ]),
          ContributorsBadge
        );
      })(react_default.a.Component);
    },
    342: function(module, exports, __webpack_require__) {
      __webpack_require__(343),
        __webpack_require__(431),
        (module.exports = __webpack_require__(432));
    },
    432: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          __webpack_require__(35),
            __webpack_require__(36),
            __webpack_require__(234),
            __webpack_require__(50);
          var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_4___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_4__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
              7
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
              4
            ),
            _storybook_addon_viewport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
              309
            ),
            _storybook_addon_a11y__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
              310
            ),
            styled_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
              1
            ),
            _src_theme_ts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
              3
            ),
            _theme__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(313);
          __webpack_require__(613);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.addParameters)({
            options: { theme: _theme__WEBPACK_IMPORTED_MODULE_11__.a },
          }),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.addParameters)(
              {
                viewport:
                  _storybook_addon_viewport__WEBPACK_IMPORTED_MODULE_7__.INITIAL_VIEWPORTS,
              }
            );
          var req = __webpack_require__(616);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.addDecorator)(
            function(story) {
              return react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(
                styled_components__WEBPACK_IMPORTED_MODULE_9__.a,
                { theme: _src_theme_ts__WEBPACK_IMPORTED_MODULE_10__.b },
                story()
              );
            }
          ),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.configure)(
              function loadStories() {
                req.keys().forEach(function(filename) {
                  return req(filename);
                });
              },
              module
            ),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.addDecorator)(
              _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_6__.withKnobs
            ),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_5__.addDecorator)(
              _storybook_addon_a11y__WEBPACK_IMPORTED_MODULE_8__.withA11y
            );
        }.call(this, __webpack_require__(19)(module));
    },
    56: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var objectWithoutProperties = __webpack_require__(34),
        react = __webpack_require__(0),
        react_default = __webpack_require__.n(react),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1),
        Link = __webpack_require__(322),
        Link_default = __webpack_require__.n(Link),
        theme = __webpack_require__(3);
      function _templateObject6() {
        var data = Object(taggedTemplateLiteral.a)(['\n  ', ';\n']);
        return (
          (_templateObject6 = function _templateObject6() {
            return data;
          }),
          data
        );
      }
      function _templateObject5() {
        var data = Object(taggedTemplateLiteral.a)(['\n  ', ';\n']);
        return (
          (_templateObject5 = function _templateObject5() {
            return data;
          }),
          data
        );
      }
      function _templateObject4() {
        var data = Object(taggedTemplateLiteral.a)(['\n  ', ';\n']);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n          padding: 0.65em 2.25em;\n        ',
        ]);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n          padding: 0.5em 0.7em;\n          font-size: 0.875em;\n        ',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  transition: 0.3s ease all;\n  font-family: Poppins, Roboto, sans-serif;\n\n  border: none;\n  outline: none;\n  ',
          ';\n  background-size: 720%;\n\n  border: ',
          ';\n  border-radius: 4px;\n\n  box-sizing: border-box;\n  font-size: 1.125em;\n  text-align: center;\n  color: ',
          ';\n  font-weight: 600;\n  width: ',
          ';\n\n  user-select: none;\n  text-decoration: none;\n\n  ',
          ';\n\n  /* svg {\n     font-size: 1.125em;\n  } */\n\n  ',
          ';\n\n  &:hover {\n    ',
          ';\n    ',
          ';\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var styles = Object(styled_components_browser_esm.c)(
          _templateObject(),
          function(props) {
            return (function getBackgroundColor(_ref) {
              var internalTheme = _ref.theme,
                disabled = _ref.disabled,
                red = _ref.red,
                secondary = _ref.secondary,
                danger = _ref.danger;
              return disabled
                ? 'background-color: '.concat(
                    internalTheme.light
                      ? 'rgba(0, 0, 0, 0.4)'
                      : theme.b.background2.darken(0.3)()
                  )
                : danger
                  ? 'background-color: '.concat(theme.b.dangerBackground())
                  : secondary
                    ? 'background-color: transparent'
                    : red
                      ? 'background-color: '.concat(theme.b.red.darken(0.2)())
                      : internalTheme && internalTheme['button.background']
                        ? 'background-color: '.concat(
                            internalTheme['button.background']
                          )
                        : 'background-color: #40A9F3;';
            })(props);
          },
          function(props) {
            return (function getBorder(_ref5) {
              var internalTheme = _ref5.theme,
                secondary = _ref5.secondary,
                danger = _ref5.danger,
                red = _ref5.red;
              return _ref5.disabled
                ? internalTheme.light
                  ? '2px solid rgba(0, 0, 0, 0.3)'
                  : '2px solid #161A1C'
                : secondary
                  ? '2px solid #66B9F4'
                  : red
                    ? '2px solid #F27777'
                    : danger
                      ? '2px solid #E25D6A'
                      : internalTheme && internalTheme['button.hoverBackground']
                        ? '2px solid '.concat(
                            internalTheme['button.hoverBackground']
                          )
                        : '2px solid #66B9F4';
            })(props);
          },
          function(props) {
            return (function getColor(_ref3) {
              var disabled = _ref3.disabled,
                secondary = _ref3.secondary,
                internalTheme = _ref3.theme;
              return disabled
                ? theme.b.background2.lighten(1.5)()
                : secondary
                  ? internalTheme.light
                    ? 'rgba(0, 0, 0, 0.75)'
                    : 'rgba(255, 255, 255, 0.75)'
                  : 'white';
            })(props);
          },
          function(props) {
            return props.block ? '100%' : 'inherit';
          },
          function(props) {
            return props.small
              ? Object(styled_components_browser_esm.c)(_templateObject2())
              : Object(styled_components_browser_esm.c)(_templateObject3());
          },
          function(props) {
            return !props.disabled && '\n  cursor: pointer;\n  ';
          },
          function(props) {
            return (function getBackgroundHoverColor(_ref2) {
              var internalTheme = _ref2.theme,
                disabled = _ref2.disabled,
                red = _ref2.red,
                secondary = _ref2.secondary,
                danger = _ref2.danger;
              return disabled
                ? 'background-color: '.concat(
                    internalTheme.light
                      ? 'rgba(0, 0, 0, 0.4)'
                      : theme.b.background2.darken(0.3)()
                  )
                : danger
                  ? 'background-color: #E25D6A'
                  : secondary
                    ? 'background-color: #66b9f4'
                    : red
                      ? 'background-color: #F27777'
                      : internalTheme && internalTheme['button.hoverBackground']
                        ? 'background-color: '.concat(
                            internalTheme['button.hoverBackground']
                          )
                        : 'background-color: #66b9f4;';
            })(props);
          },
          function(props) {
            return (function getHoverColor(_ref4) {
              return _ref4.secondary ? 'color: white' : '';
            })(props);
          }
        ),
        LinkButton = Object(styled_components_browser_esm.d)(Link_default.a)(
          _templateObject4(),
          styles
        ),
        AButton = styled_components_browser_esm.d.a(_templateObject5(), styles),
        Button = styled_components_browser_esm.d.button(
          _templateObject6(),
          styles
        );
      function ButtonComponent(_ref) {
        var _ref$style = _ref.style,
          style = void 0 === _ref$style ? {} : _ref$style,
          props = Object(objectWithoutProperties.a)(_ref, ['style']);
        return props.to
          ? react_default.a.createElement(
              LinkButton,
              Object.assign({ style: style }, props)
            )
          : props.href
            ? react_default.a.createElement(
                AButton,
                Object.assign({ style: style }, props)
              )
            : react_default.a.createElement(
                Button,
                Object.assign({ style: style }, props)
              );
      }
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return ButtonComponent;
      });
    },
    613: function(module, exports, __webpack_require__) {
      var content = __webpack_require__(614);
      'string' == typeof content && (content = [[module.i, content, '']]);
      var options = { hmr: !0, transform: void 0, insertInto: void 0 };
      __webpack_require__(296)(content, options);
      content.locals && (module.exports = content.locals);
    },
    614: function(module, exports, __webpack_require__) {
      (module.exports = __webpack_require__(295)(!1)).push([
        module.i,
        "html,\nbody {\n  font-family: 'Roboto', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  min-height: 100%;\n  -webkit-text-size-adjust: 100%;\n  height: 100%;\n  background: #1c2022;\n  color: #cccccc;\n\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n}\n\ninput {\n  font-family: 'Roboto', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\ninput:focus {\n  outline: -webkit-focus-ring-color auto 0px;\n  outline-offset: 0;\n}\n\n#root {\n}\n\na {\n  color: #40a9f3;\n}\n\n::-webkit-scrollbar {\n  width: 0.5rem;\n  height: 0.5rem;\n}\n\n::-webkit-scrollbar-thumb {\n  transition: 0.3s ease all;\n  border-color: transparent;\n  background-color: rgba(255, 255, 255, 0.1);\n  z-index: 40;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  transition: 0.3s ease all;\n  background-color: rgba(255, 255, 255, 0.15);\n}\n\n.react-console::-webkit-scrollbar-thumb {\n  background-color: rgba(0, 0, 0, 0.3);\n}\n\n.react-console::-webkit-scrollbar-thumb:hover {\n  background-color: rgba(0, 0, 0, 0.4);\n}\n",
        '',
      ]);
    },
    616: function(module, exports, __webpack_require__) {
      var map = {
        './AutosizeInput/index.stories.js': 617,
        './AutosizeTextArea/index.stories.js': 621,
        './Button/index.stories.js': 622,
        './CommunityBadges/index.stories.js': 698,
        './ContributorsBadge/index.stories.js': 702,
        './Footer.stories.js': 704,
        './GithubBadge/index.stories.js': 705,
        './Input/index.stories.js': 706,
        './Logo.stories.js': 707,
        './Navigation/index.stories.js': 708,
        './Preference/index.stories.js': 709,
        './RunOnClick/index.stories.js': 710,
        './Select/index.stories.js': 711,
        './Stats/index.stories.js': 712,
        './Switch/index.stories.js': 713,
        './Tags/index.stories.js': 714,
      };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw ((e.code = 'MODULE_NOT_FOUND'), e);
        }
        return map[req];
      }
      (webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 616);
    },
    617: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(316);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'AutosizeInput',
            module
          ).add('Primary', function() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              {
                value: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('value', 'hello'),
              }
            );
          });
        }.call(this, __webpack_require__(19)(module));
    },
    621: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'AutosizeTextarea',
            module
          ).add('Primary', function() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              {
                value: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('value', 'hello'),
              }
            );
          });
        }.call(this, __webpack_require__(19)(module));
    },
    622: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
              55
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(56);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Button',
            module
          )
            .add('Primary', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Small', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  small: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('small', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Block (Full width)', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  block: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('block', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Secondary', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  secondary: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('secondary', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Disabled', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  disabled: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('disabled', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Danger', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  danger: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('danger', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            })
            .add('Red', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                {
                  red: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('red', !0),
                  onClick: Object(
                    _storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.action
                  )('clicked'),
                },
                Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('Label', 'CodeSandbox')
              );
            });
        }.call(this, __webpack_require__(19)(module));
    },
    698: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          __webpack_require__(79);
          var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_1__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(336),
            templates = [
              'create-react-app',
              'vue-cli',
              'preact-cli',
              'svelte',
              'create-react-app-typescript',
              'angular-cli',
              'parcel',
              'cxjs',
              '@dojo/cli-create-app',
              'gatsby',
              'nuxt',
              'next',
              'reason',
              'apollo',
              'sapper',
              'nest',
              'static',
              'styleguidist',
            ],
            FrameworkBadge = function(_ref) {
              var template = _ref.template,
                _ref$sandboxNumber = _ref.sandboxNumber,
                sandboxNumber =
                  void 0 === _ref$sandboxNumber ? 100 : _ref$sandboxNumber;
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                'div',
                { style: { width: 64, height: 50 } },
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  _index_tsx__WEBPACK_IMPORTED_MODULE_4__.a,
                  {
                    sandboxesNumber: sandboxNumber,
                    style: { width: 64, height: 50 },
                    template: Object(
                      _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_2__.select
                    )('template', templates, template),
                  }
                )
              );
            };
          (FrameworkBadge.displayName = 'FrameworkBadge'),
            templates.map(function(t) {
              var _ref2 = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                FrameworkBadge,
                { template: t }
              );
              return Object(
                _storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf
              )('Community Badge/Gold', module).add(t, function() {
                return _ref2;
              });
            }),
            templates.map(function(t) {
              var _ref3 = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                FrameworkBadge,
                { sandboxNumber: 51, template: t }
              );
              return Object(
                _storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf
              )('Community Badge/Silver', module).add(t, function() {
                return _ref3;
              });
            });
        }.call(this, __webpack_require__(19)(module));
    },
    702: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(340);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'ContributorsBadge',
            module
          ).add('Default', function() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              {
                username: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('username', 'SaraVieira'),
              }
            );
          });
        }.call(this, __webpack_require__(19)(module));
    },
    704: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              7
            ),
            _Footer_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(328),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Footer_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              null
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_1__.storiesOf)(
            'Footer',
            module
          ).add('Default', function() {
            return _ref;
          });
        }.call(this, __webpack_require__(19)(module));
    },
    705: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(339);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'GithubBadge',
            module
          ).add('Default', function() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              {
                username: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('username', 'CompuIves'),
                repo: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('repo', 'codesandbox-client'),
                branch: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                )('branch', 'storybook'),
              }
            );
          });
        }.call(this, __webpack_require__(19)(module));
    },
    706: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Input',
            module
          )
            .add('Primary', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.b,
                {
                  value: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                  )('value', 'hello'),
                }
              );
            })
            .add('Error', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.b,
                {
                  error: !0,
                  value: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                  )('value', 'hello'),
                }
              );
            })
            .add('FullWidth', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.b,
                {
                  fullWidth: !0,
                  value: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                  )('value', 'hello'),
                }
              );
            });
        }.call(this, __webpack_require__(19)(module));
    },
    707: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              7
            ),
            _Logo_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(146),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _Logo_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              null
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_1__.storiesOf)(
            'Logo',
            module
          ).add('Default', function() {
            return _ref;
          });
        }.call(this, __webpack_require__(19)(module));
    },
    708: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(330),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              null
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_1__.storiesOf)(
            'Navigation',
            module
          ).add('Default', function() {
            return _ref;
          });
        }.call(this, __webpack_require__(19)(module));
    },
    709: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(107),
            templates = [
              'create-react-app',
              'vue-cli',
              'preact-cli',
              'svelte',
              'create-react-app-typescript',
              'angular-cli',
              'parcel',
              'cxjs',
              '@dojo/cli-create-app',
              'gatsby',
              'nuxt',
              'next',
              'reason',
              'apollo',
              'sapper',
              'nest',
              'static',
              'styleguidist',
            ];
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Preferences',
            module
          )
            .add('Text', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { style: { width: 300 } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                  {
                    title: 'Template',
                    type: 'string',
                    value: Object(
                      _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.text
                    )('default', 'Create React App'),
                  }
                )
              );
            })
            .add('Boolean', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { style: { width: 300 } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                  {
                    title: 'Open',
                    type: 'boolean',
                    value: Object(
                      _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                    )('default', !0),
                  }
                )
              );
            })
            .add('Dropdown', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { style: { width: 300 } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                  {
                    title: 'Template',
                    type: 'dropdown',
                    options: Object(
                      _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.select
                    )('options', 'vue-cli', templates),
                  }
                )
              );
            })
            .add('Keybinding', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { style: { width: 500 } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                  { title: 'Open in A new Tab', type: 'keybinding', value: [] }
                )
              );
            });
        }.call(this, __webpack_require__(19)(module));
    },
    710: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(338),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              null
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_1__.storiesOf)(
            'RunOnClick',
            module
          ).add('Default', function() {
            return _ref;
          });
        }.call(this, __webpack_require__(19)(module));
    },
    711: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(106),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              null,
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Deployments'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Now'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Netlify'
              )
            ),
            _ref2 = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_2__.a,
              { error: !0 },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Deployments'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Now'
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'option',
                null,
                'Netlify'
              )
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_1__.storiesOf)(
            'Select',
            module
          )
            .add('Default', function() {
              return _ref;
            })
            .add('Error', function() {
              return _ref2;
            });
        }.call(this, __webpack_require__(19)(module));
    },
    712: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(206);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Stats',
            module
          )
            .add('Default', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                {
                  viewCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('viewCount', 123),
                  likeCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('likeCount', 123),
                  forkCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('forkCount', 123),
                }
              );
            })
            .add('Verical', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                {
                  vertical: !0,
                  viewCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('viewCount', 123),
                  likeCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('likeCount', 123),
                  forkCount: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.number
                  )('forkCount', 123),
                }
              );
            });
        }.call(this, __webpack_require__(19)(module));
    },
    713: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(76),
            _ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              null
            );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Switch',
            module
          )
            .add('Default', function() {
              return _ref;
            })
            .add('Secondary', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                {
                  secondary: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('secondary', !0),
                }
              );
            })
            .add('Small', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                {
                  small: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('small', !0),
                }
              );
            })
            .add('offMode', function() {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
                {
                  offMode: Object(
                    _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.boolean
                  )('offMode', !0),
                }
              );
            });
        }.call(this, __webpack_require__(19)(module));
    },
    714: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
            react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_0__
            ),
            _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              4
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              7
            ),
            _index_tsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(337);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_2__.storiesOf)(
            'Tags',
            module
          ).add('Default', function() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              _index_tsx__WEBPACK_IMPORTED_MODULE_3__.a,
              {
                tags: Object(
                  _storybook_addon_knobs__WEBPACK_IMPORTED_MODULE_1__.array
                )('tags', ['test', 'react-app'], ','),
              }
            );
          });
        }.call(this, __webpack_require__(19)(module));
    },
    76: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var react = __webpack_require__(0),
        taggedTemplateLiteral = __webpack_require__(2),
        styled_components_browser_esm = __webpack_require__(1);
      __webpack_require__(3);
      function _templateObject2() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  transition: inherit;\n  position: absolute;\n  height: ',
          'px;\n  width: 1rem;\n  left: 0.1rem;\n  border-radius: 4px;\n  transform: translateX(',
          ');\n  top: 0.1rem;\n  background-color: white;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);\n',
        ]);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(taggedTemplateLiteral.a)([
          '\n  transition: 0.3s ease all;\n  position: relative;\n  background-color: ',
          ';\n  width: ',
          'rem;\n  color: rgba(0, 0, 0, 0.5);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  padding: 0.5rem;\n  height: ',
          'px;\n  box-sizing: border-box;\n  cursor: pointer;\n  border-radius: 4px;\n\n  &:before,\n  &:after {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5em;\n    line-height: 1;\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var Container = styled_components_browser_esm.d.div(
          _templateObject(),
          function getColor(_ref) {
            var right = _ref.right,
              offMode = _ref.offMode,
              secondary = _ref.secondary,
              theme = _ref.theme;
            return right
              ? secondary
                ? theme.templateColor || theme.secondary
                : theme.primary
              : offMode
                ? 'rgba(0, 0, 0, 0.3)'
                : secondary
                  ? theme.primary
                  : theme.templateColor || theme.secondary;
          },
          function(_ref2) {
            return _ref2.small ? 3 : 3.5;
          },
          function(props) {
            return props.small ? 20 : 26;
          }
        ),
        Dot = styled_components_browser_esm.d.div(
          _templateObject2(),
          function(props) {
            return props.small ? 14 : 20;
          },
          function(props) {
            return props.right
              ? (function getSize(_ref3) {
                  return _ref3.small
                    ? 'calc(1.5rem + 2px)'
                    : 'calc(2rem + 2px)';
                })(props)
              : '0';
          }
        );
      __webpack_exports__.a = function Switch(_ref) {
        var right = _ref.right,
          onClick = _ref.onClick,
          _ref$secondary = _ref.secondary,
          secondary = void 0 !== _ref$secondary && _ref$secondary,
          _ref$offMode = _ref.offMode,
          offMode = void 0 !== _ref$offMode && _ref$offMode,
          _ref$small = _ref.small,
          small = void 0 !== _ref$small && _ref$small,
          className = _ref.className,
          style = _ref.style;
        return react.createElement(
          Container,
          {
            style: style,
            small: small,
            secondary: secondary,
            offMode: offMode,
            onClick: onClick,
            right: right,
            className: className,
          },
          react.createElement(Dot, { small: small, right: right })
        );
      };
    },
    89: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
        styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1),
        react_tippy__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_require__(699),
        __webpack_require__(202)),
        _theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )([
          '\n  .tippy-popper {\n    position: absolute;\n  }\n\n  .tippy-popper,\n  .tippy-popper * {\n    pointer-events: none;\n  }\n\n  .tippy-tooltip [x-circle] {\n    background-color: rgb(21, 24, 25) !important;\n  }\n\n  .tippy-tooltip.update-theme {\n    .arrow-regular {\n      border-bottom: 7px solid ',
          ' !important;\n    }\n\n    background-color: ',
          ';\n    border-radius: 2px;\n    padding: 0 !important;\n  }\n',
        ]);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      var GlobalStyle = Object(
        styled_components__WEBPACK_IMPORTED_MODULE_2__.b
      )(
        _templateObject(),
        _theme__WEBPACK_IMPORTED_MODULE_5__.b.green(),
        _theme__WEBPACK_IMPORTED_MODULE_5__.b.green()
      );
      __webpack_exports__.a = function(props) {
        return react__WEBPACK_IMPORTED_MODULE_1__.createElement(
          react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
          null,
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(GlobalStyle, null),
          react__WEBPACK_IMPORTED_MODULE_1__.createElement(
            react_tippy__WEBPACK_IMPORTED_MODULE_4__.Tooltip,
            Object.assign({ delay: 1e3 }, props)
          )
        );
      };
    },
    90: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          2
        ),
        styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
      function _templateObject4() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n    @media (min-width: 1280px) {\n      ', ';\n    }\n  ']);
        return (
          (_templateObject4 = function _templateObject4() {
            return data;
          }),
          data
        );
      }
      function _templateObject3() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n    @media (min-width: 660px) {\n      ', ';\n    }\n  ']);
        return (
          (_templateObject3 = function _templateObject3() {
            return data;
          }),
          data
        );
      }
      function _templateObject2() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n    @media (max-width: 660px) {\n      ', ';\n    }\n  ']);
        return (
          (_templateObject2 = function _templateObject2() {
            return data;
          }),
          data
        );
      }
      function _templateObject() {
        var data = Object(
          _Users_saravieira_Projects_codesandbox_client_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__.a
        )(['\n    @media (max-width: 1279px) {\n      ', ';\n    }\n  ']);
        return (
          (_templateObject = function _templateObject() {
            return data;
          }),
          data
        );
      }
      __webpack_exports__.a = {
        tablet: function tablet() {
          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          )
            args[_key] = arguments[_key];
          return Object(styled_components__WEBPACK_IMPORTED_MODULE_1__.c)(
            _templateObject(),
            styled_components__WEBPACK_IMPORTED_MODULE_1__.c.call.apply(
              styled_components__WEBPACK_IMPORTED_MODULE_1__.c,
              [void 0].concat(args)
            )
          );
        },
        phone: function phone() {
          for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
          )
            args[_key2] = arguments[_key2];
          return Object(styled_components__WEBPACK_IMPORTED_MODULE_1__.c)(
            _templateObject2(),
            styled_components__WEBPACK_IMPORTED_MODULE_1__.c.call.apply(
              styled_components__WEBPACK_IMPORTED_MODULE_1__.c,
              [void 0].concat(args)
            )
          );
        },
        fromTablet: function fromTablet() {
          for (
            var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
            _key3 < _len3;
            _key3++
          )
            args[_key3] = arguments[_key3];
          return Object(styled_components__WEBPACK_IMPORTED_MODULE_1__.c)(
            _templateObject3(),
            styled_components__WEBPACK_IMPORTED_MODULE_1__.c.call.apply(
              styled_components__WEBPACK_IMPORTED_MODULE_1__.c,
              [void 0].concat(args)
            )
          );
        },
        fromDesktop: function fromDesktop() {
          for (
            var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
            _key4 < _len4;
            _key4++
          )
            args[_key4] = arguments[_key4];
          return Object(styled_components__WEBPACK_IMPORTED_MODULE_1__.c)(
            _templateObject4(),
            styled_components__WEBPACK_IMPORTED_MODULE_1__.c.call.apply(
              styled_components__WEBPACK_IMPORTED_MODULE_1__.c,
              [void 0].concat(args)
            )
          );
        },
      };
    },
  },
  [[342, 1, 2]],
]);
//# sourceMappingURL=main.66cebafa77ddf9629f78.bundle.js.map
