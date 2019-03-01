'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const elements_1 = require('../elements');
exports.ConfigWizard = ({ file }) => {
  let parsedFile;
  let error;
  try {
    parsedFile = JSON.parse(file);
  } catch (e) {
    error = e;
  }
  if (error) {
    return React.createElement(
      'div',
      null,
      'Problem parsing file: ',
      error.message
    );
  }
  return React.createElement(
    'div',
    null,
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'name'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      )
    ),
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'version'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      ),
      React.createElement(
        elements_1.ConfigDescription,
        null,
        'The version of the project, this is required together with the name. For non-libraries this is 1.0.0 most of the time.'
      )
    ),
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'description'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      )
    ),
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'keywords'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      ),
      React.createElement(
        elements_1.ConfigDescription,
        null,
        'Used to make the project more easily searchable. This helps people discover your package as it',
        "'",
        's listed in npm search.'
      )
    ),
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'homepage'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      ),
      React.createElement(
        elements_1.ConfigDescription,
        null,
        'The url to the project homepage.'
      )
    ),
    React.createElement(
      elements_1.PaddedConfig,
      null,
      React.createElement(
        elements_1.ConfigItem,
        null,
        React.createElement(elements_1.ConfigName, null, 'license'),
        React.createElement(elements_1.ConfigValue, null, 'World')
      ),
      React.createElement(
        elements_1.ConfigDescription,
        null,
        'The license describes guidelines on the use and distribution of your project.',
        ' ',
        React.createElement(
          'a',
          {
            href: 'https://choosealicense.com/',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Choose a license'
        ),
        ' ',
        'is a helpful resource for choosing a license.'
      )
    )
  );
};
exports.default = {
  ConfigWizard: exports.ConfigWizard,
};
