'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const React = require('react');
const lodash_es_1 = require('lodash-es');
const templates = require('../../../templates');
const elements_1 = require('../elements');
class ConfigWizard extends React.Component {
  constructor() {
    super(...arguments);
    this.bindValue = (file, property) => ({
      value: file[property],
      setValue: value => {
        const code = JSON.stringify(
          Object.assign({}, file, { [property]: value }),
          null,
          2
        );
        this.props.updateFile(code);
      },
    });
  }
  render() {
    const { file, sandbox } = this.props;
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
        'Problem parsing sandbox.config.json: ',
        error.message
      );
    }
    if (!parsedFile) {
      return React.createElement(
        'div',
        null,
        'Could not parse sandbox.config.json'
      );
    }
    const currentTemplate = templates.default(sandbox.template);
    // $FlowIssue: Can't detect difference between filter/no-filter
    const possibleTemplates = Object.keys(templates)
      .filter(t => t !== 'default')
      .map(n => templates[n]);
    const templateOptions = lodash_es_1
      .sortBy(
        possibleTemplates.filter(
          template =>
            template.isServer === currentTemplate.isServer &&
            template.showOnHomePage
        ),
        template => template.niceName
      )
      .map(template => template.name);
    const templateNameMap = {};
    possibleTemplates.forEach(template => {
      templateNameMap[template.name] = template.niceName;
    });
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
              { title: 'Infinite Loop Protection', type: 'boolean' },
              this.bindValue(parsedFile, 'infiniteLoopProtection')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Whether we should stop execution of the code when we detect an infinite loop.'
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
              { title: 'Hard Reload on Change', type: 'boolean' },
              this.bindValue(parsedFile, 'hardReloadOnChange')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Force refresh the sandbox for a change. This is helpful for sandboxes with global state, like intervals.'
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
                title: 'Default View',
                type: 'dropdown',
                options: ['browser', 'console', 'tests'],
              },
              this.bindValue(parsedFile, 'view')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Which view to show in the preview by default.'
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
                title: 'Template',
                type: 'dropdown',
                options: templateOptions,
                mapName: name => templateNameMap[name],
              },
              this.bindValue(parsedFile, 'template')
            )
          )
        ),
        React.createElement(
          elements_1.ConfigDescription,
          null,
          'Which template to use for this sandbox.'
        )
      )
    );
  }
}
exports.ConfigWizard = ConfigWizard;
exports.default = {
  ConfigWizard,
};
