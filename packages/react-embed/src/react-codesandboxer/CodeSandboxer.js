'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(
  _possibleConstructorReturn2
);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNodeResolver = require('react-node-resolver');

var _reactNodeResolver2 = _interopRequireDefault(_reactNodeResolver);

var _codesandboxer = require('codesandboxer');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var CodeSandboxDeployer = (function(_Component) {
  (0, _inherits3.default)(CodeSandboxDeployer, _Component);

  function CodeSandboxDeployer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CodeSandboxDeployer);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret =
        ((_temp =
          ((_this = (0, _possibleConstructorReturn3.default)(
            this,
            (_ref =
              CodeSandboxDeployer.__proto__ ||
              (0, _getPrototypeOf2.default)(CodeSandboxDeployer)).call.apply(
              _ref,
              [this].concat(args)
            )
          )),
          _this)),
        (_this.state = {
          parameters: '',
          isLoading: false,
          isDeploying: false,
        }),
        (_this.loadFiles = function() {
          var _this$props = _this.props,
            onLoadComplete = _this$props.onLoadComplete,
            providedFiles = _this$props.providedFiles,
            dependencies = _this$props.dependencies,
            name = _this$props.name;

          // by assembling a deploy promise, we can save it for later if loadFiles is
          // being called by `preload`, and preload can use it once it is ready.
          // We return deployPromise at the end so that non-preloaded calls can then be
          // resolved

          var deployPromise = (0, _codesandboxer.fetchFiles)(_this.props)
            .then(function(fetchedInfo) {
              var template = 'create-react-app';
              if (_this.props.template) {
                template = _this.props.template;
              } else if (_this.props.examplePath.match(/\.tsx?$/)) {
                template = 'create-react-app-typescript';
              }

              var _finaliseCSB = (0, _codesandboxer.finaliseCSB)(fetchedInfo, {
                  extraFiles: providedFiles,
                  extraDependencies: dependencies,
                  name: name,
                  template: template,
                }),
                parameters = _finaliseCSB.parameters;

              _this.setState(
                {
                  parameters: parameters,
                  isLoading: false,
                  files: fetchedInfo.files,
                },
                function() {
                  if (onLoadComplete) {
                    onLoadComplete({
                      parameters: parameters,
                      files: fetchedInfo.files,
                    });
                  }
                }
              );
            })
            .catch(function(error) {
              _this.setState({ error: error, isLoading: false });
              if (onLoadComplete) onLoadComplete({ error: error });
            });

          _this.setState({
            isLoading: true,
            deployPromise: deployPromise,
          });

          return deployPromise;
        }),
        (_this.deploy = function() {
          var _this$props2 = _this.props,
            afterDeploy = _this$props2.afterDeploy,
            skipRedirect = _this$props2.skipRedirect,
            afterDeployError = _this$props2.afterDeployError;
          var _this$state = _this.state,
            parameters = _this$state.parameters,
            error = _this$state.error;

          if (error) return;

          (0, _codesandboxer.sendFilesToCSB)(parameters)
            .then(function(_ref2) {
              var sandboxId = _ref2.sandboxId,
                sandboxUrl = _ref2.sandboxUrl;

              _this.setState({
                sandboxId: sandboxId,
                sandboxUrl: sandboxUrl,
                isDeploying: false,
                isLoading: false,
              });
              if (!skipRedirect) {
                window.open(sandboxUrl);
              }
              if (afterDeploy) {
                afterDeploy(
                  (0, _codesandboxer.getSandboxUrl)(sandboxId, 'embed'),
                  sandboxId
                );
              }
            })
            .catch(function(errors) {
              if (afterDeployError) {
                afterDeployError({
                  name: 'error deploying to codesandbox',
                  content: errors,
                });
              }
              _this.setState({
                error: {
                  name: 'error deploying to codesandbox',
                  content: errors,
                },
              });
            });
        }),
        (_this.deployToCSB = function(e) {
          var _this$state2 = _this.state,
            deployPromise = _this$state2.deployPromise,
            isDeploying = _this$state2.isDeploying;

          if (e) {
            e.preventDefault();
          }
          if (isDeploying) return null;
          _this.setState({ isDeploying: true });

          if (deployPromise) {
            deployPromise.then(_this.deploy);
          } else {
            _this.loadFiles().then(_this.deploy);
          }
        }),
        (_this.getButton = function(ref) {
          if (!ref) return;
          _this.button = ref;
        }),
        _temp)),
      (0, _possibleConstructorReturn3.default)(_this, _ret)
    );
  }

  (0, _createClass3.default)(CodeSandboxDeployer, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.autoDeploy) {
          this.deployToCSB();
          return;
        }

        if (this.button)
          this.button.addEventListener('click', this.deployToCSB);
        if (this.props.preload) this.loadFiles();
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.button)
          this.button.removeEventListener('click', this.deployToCSB);
      },
    },
    {
      key: 'render',
      value: function render() {
        var _state = this.state,
          isLoading = _state.isLoading,
          isDeploying = _state.isDeploying,
          error = _state.error,
          sandboxId = _state.sandboxId,
          sandboxUrl = _state.sandboxUrl;

        return _react2.default.createElement(
          _reactNodeResolver2.default,
          { innerRef: this.getButton },
          this.props.children({
            isLoading: isLoading,
            isDeploying: isDeploying,
            error: error,
            sandboxId: sandboxId,
            sandboxUrl: sandboxUrl,
          })
        );
      },
    },
  ]);
  return CodeSandboxDeployer;
})(_react.Component);

CodeSandboxDeployer.defaultProps = {
  children: function children() {
    return _react2.default.createElement(
      'button',
      { type: 'submit' },
      'Deploy to CodeSandbox'
    );
  },
  pkgJSON: {},
  dependencies: {},
  providedFiles: {},
  importReplacements: [],
  extensions: [],
  style: { display: 'inline-block' },
};
exports.default = CodeSandboxDeployer;
