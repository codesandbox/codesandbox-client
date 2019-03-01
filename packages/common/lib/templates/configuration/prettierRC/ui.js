'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const React = require('react');
const elements_1 = require('../elements');
class ConfigWizard extends React.Component {
  constructor() {
    super(...arguments);
    this.bindValue = (file, property) => ({
      value: file[property],
      setValue: value => {
        this.props.updateFile(
          JSON.stringify(
            Object.assign({}, file, { [property]: value }),
            null,
            2
          )
        );
      },
    });
  }
  render() {
    const { file } = this.props;
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
        'Problem parsing .prettierrc: ',
        error.message
      );
    }
    if (!parsedFile) {
      return React.createElement('div', null, 'Could not parse .prettierrc');
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
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Print Width', type: 'number' },
              this.bindValue(parsedFile, 'printWidth')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Specify the line length that the printer will wrap on.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Tab Width', type: 'number' },
              this.bindValue(parsedFile, 'tabWidth')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Specify the number of spaces per indentation-level.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Use Tabs', type: 'boolean' },
              this.bindValue(parsedFile, 'useTabs')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Indent lines with tabs instead of spaces.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Semicolons', type: 'boolean' },
              this.bindValue(parsedFile, 'semi')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Print semicolons at the ends of statements.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Use Single Quotes', type: 'boolean' },
              this.bindValue(parsedFile, 'singleQuote')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Use ',
          "'",
          'single',
          "'",
          ' quotes instead of ',
          '"',
          'double',
          '"',
          ' quotes.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              {
                title: 'Trailing Commas',
                type: 'dropdown',
                options: ['none', 'es5', 'all'],
              },
              this.bindValue(parsedFile, 'trailingComma')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Print trailing commas wherever possible.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'Bracket Spacing', type: 'boolean' },
              this.bindValue(parsedFile, 'bracketSpacing')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Print spaces between brackets in object literals.'
        )
      ),
      React.createElement(
        elements_1.PaddedConfig,
        null,
        React.createElement(
          elements_1.ConfigItem,
          null,
          React.createElement(
            elements_1.PaddedPreference,
            Object.assign(
              { title: 'JSX Brackets', type: 'boolean' },
              this.bindValue(parsedFile, 'jsxBracketSameLine')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Put the `',
          '>',
          '` of a multi-line JSX element at the end of the last line instead of being alone on the next line.'
        )
      )
    );
  }
}
exports.ConfigWizard = ConfigWizard;
exports.default = {
  ConfigWizard,
};
