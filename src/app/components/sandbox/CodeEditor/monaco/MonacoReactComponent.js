/* eslint-disable */
var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

function noop() {}

var MonacoEditor = (function(_React$Component) {
  _inherits(MonacoEditor, _React$Component);

  function MonacoEditor(props) {
    _classCallCheck(this, MonacoEditor);

    var _this = _possibleConstructorReturn(
      this,
      (MonacoEditor.__proto__ || Object.getPrototypeOf(MonacoEditor))
        .call(this, props)
    );

    _this.__current_value = props.value;
    return _this;
  }

  _createClass(MonacoEditor, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.afterViewInit();
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.destroyMonaco();
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        var context = this.props.context || window;
        if (this.props.value !== this.__current_value) {
          // Always refer to the latest value
          this.__current_value = this.props.value;
          // Consider the situation of rendering 1+ times before the editor mounted
          if (this.editor) {
            this.__prevent_trigger_change_event = true;
            this.editor.setValue(this.__current_value);
            this.__prevent_trigger_change_event = false;
          }
        }
        if (prevProps.language !== this.props.language) {
          context.monaco.editor.setModelLanguage(
            this.editor.getModel(),
            this.props.language
          );
        }
      },
    },
    {
      key: 'editorWillMount',
      value: function editorWillMount(monaco) {
        var editorWillMount = this.props.editorWillMount;

        editorWillMount(monaco);
      },
    },
    {
      key: 'editorDidMount',
      value: function editorDidMount(editor, monaco) {
        var _this2 = this;

        var _props = this.props,
          editorDidMount = _props.editorDidMount,
          onChange = _props.onChange;

        editorDidMount(editor, monaco);
        editor.onDidChangeModelContent(function(event) {
          var value = editor.getValue();

          // Always refer to the latest value
          _this2.__current_value = value;

          // Only invoking when user input changed
          if (!_this2.__prevent_trigger_change_event) {
            onChange(value, event);
          }
        });
      },
    },
    {
      key: 'afterViewInit',
      value: function afterViewInit() {
        var _this3 = this;

        var requireConfig = this.props.requireConfig;

        var loaderUrl = requireConfig.url || 'vs/loader.js';
        var context = this.props.context || window;
        var onGotAmdLoader = function onGotAmdLoader() {
          if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
            // Do not use webpack
            if (requireConfig.paths && requireConfig.paths.vs) {
              context.require.config(requireConfig);
            }
          }

          // Load monaco
          context.require(['vs/editor/editor.main'], function() {
            _this3.initMonaco();
          });

          // Call the delayed callbacks when AMD loader has been loaded
          if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
            context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
            var loaderCallbacks =
              context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
            if (loaderCallbacks && loaderCallbacks.length) {
              var currentCallback = loaderCallbacks.shift();
              while (currentCallback) {
                currentCallback.fn.call(currentCallback.context);
                currentCallback = loaderCallbacks.shift();
              }
            }
          }
        };

        // Load AMD loader if necessary
        if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
          // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
          //  delay to call callbacks except the first one
          context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ =
            context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
          context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
            context: this,
            fn: onGotAmdLoader,
          });
        } else {
          if (typeof context.require === 'undefined') {
            var loaderScript = context.document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = loaderUrl;
            loaderScript.addEventListener('load', onGotAmdLoader);
            context.document.body.appendChild(loaderScript);
            context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
          } else {
            onGotAmdLoader();
          }
        }
      },
    },
    {
      key: 'initMonaco',
      value: function initMonaco() {
        var value =
          this.props.value !== null
            ? this.props.value
            : this.props.defaultValue;
        var _props2 = this.props,
          language = _props2.language,
          theme = _props2.theme,
          options = _props2.options;

        var containerElement = this.refs.container;
        var context = this.props.context || window;
        if (typeof context.monaco !== 'undefined') {
          // Before initializing monaco editor
          this.editorWillMount(context.monaco);

          var editorService = {
            openEditor: model => {
              return this.props.openReference(model);
            },
          };
          this.editor = context.monaco.editor.create(
            containerElement,
            _extends(
              {
                value: value,
                language: language,
                theme: theme,
              },
              options
            ),
            { editorService }
          );
          // After initializing monaco editor
          this.editorDidMount(this.editor, context.monaco);
        }
      },
    },
    {
      key: 'destroyMonaco',
      value: function destroyMonaco() {
        if (typeof this.editor !== 'undefined') {
          this.editor.dispose();
        }
      },
    },
    {
      key: 'render',
      value: function render() {
        var _props3 = this.props,
          width = _props3.width,
          height = _props3.height;

        var fixedWidth =
          width.toString().indexOf('%') !== -1 ? width : width + 'px';
        var fixedHeight =
          height.toString().indexOf('%') !== -1 ? height : height + 'px';
        var style = {
          width: fixedWidth,
          height: fixedHeight,
        };
        return _react2.default.createElement('div', {
          ref: 'container',
          style: style,
          className: 'react-monaco-editor-container',
        });
      },
    },
  ]);

  return MonacoEditor;
})(_react2.default.Component);

MonacoEditor.propTypes = {
  width: _react.PropTypes.oneOfType([
    _react2.default.PropTypes.string,
    _react2.default.PropTypes.number,
  ]),
  height: _react.PropTypes.oneOfType([
    _react2.default.PropTypes.string,
    _react2.default.PropTypes.number,
  ]),
  value: _react.PropTypes.string,
  defaultValue: _react.PropTypes.string,
  language: _react.PropTypes.string,
  theme: _react.PropTypes.string,
  options: _react.PropTypes.object,
  editorDidMount: _react.PropTypes.func,
  editorWillMount: _react.PropTypes.func,
  onChange: _react.PropTypes.func,
  requireConfig: _react.PropTypes.object,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: 'vs',
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: {},
};

export default MonacoEditor;
