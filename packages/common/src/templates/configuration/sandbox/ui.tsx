import React from 'react';
import sortBy from 'lodash/sortBy';
import * as templates from '../../../templates';
import Template from '../../../templates/template';

import {
  PaddedPreference,
  ConfigItem,
  ConfigDescription,
  PaddedConfig,
} from '../elements';
import { ConfigurationUIProps } from '../types';

export const ConfigWizard = (props: ConfigurationUIProps) => {
  const bindValue = (
    file: Object,
    property: string,
    defaultValue?: any
  ): {
    value: any;
    setValue: (p: any) => void;
  } => ({
    value: file[property] || defaultValue,
    setValue: (value: any) => {
      let code = JSON.stringify(
        {
          ...file,
          [property]: value,
        },
        null,
        2
      );
      if (property.includes('.')) {
        const children = property.split('.');
        code = JSON.stringify(
          {
            ...file,
            [children[0]]: {
              [children[1]]: value,
            },
          },
          null,
          2
        );
      }

      return props.updateFile(code);
    },
  });

  const { file, sandbox } = props;

  let parsedFile;
  let error;
  try {
    parsedFile = JSON.parse(file);
  } catch (e) {
    error = e;
  }

  if (error) {
    return <div>Problem parsing sandbox.config.json: {error.message}</div>;
  }

  if (!parsedFile) {
    return <div>Could not parse sandbox.config.json</div>;
  }

  const currentTemplate = templates.default(sandbox.template);

  const possibleTemplates: Array<Template> = Object.keys(templates)
    .filter(t => t !== 'default')
    .map(n => templates[n]);

  const templateOptions = sortBy(
    possibleTemplates.filter(
      template =>
        template.isServer === currentTemplate.isServer &&
        template.showOnHomePage
    ),
    template => template.niceName
  ).map(template => template.name);

  const templateNameMap = {};
  possibleTemplates.forEach(template => {
    templateNameMap[template.name] = template.niceName;
  });

  return (
    <div>
      <PaddedConfig>
        <ConfigItem>
          <PaddedPreference
            title="Infinite Loop Protection"
            type="boolean"
            {...bindValue(parsedFile, 'infiniteLoopProtection')}
          />
        </ConfigItem>
        <ConfigDescription>
          Whether we should stop execution of the code when we detect an
          infinite loop.
        </ConfigDescription>
      </PaddedConfig>

      <PaddedConfig>
        <ConfigItem>
          <PaddedPreference
            title="Hard Reload on Change"
            type="boolean"
            {...bindValue(parsedFile, 'hardReloadOnChange')}
          />
        </ConfigItem>
        <ConfigDescription>
          Force refresh the sandbox for a change. This is helpful for sandboxes
          with global state, like intervals.
        </ConfigDescription>
      </PaddedConfig>

      {/* <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Default View"
              type="dropdown"
              options={['browser', 'console', 'tests']}
              {...bindValue(parsedFile, 'view')}
            />
          </ConfigItem>
          <ConfigDescription>
            Which view to show in the preview by default.
          </ConfigDescription>
        </PaddedConfig> */}

      <PaddedConfig>
        <ConfigItem>
          <PaddedPreference
            title="Template"
            type="dropdown"
            options={templateOptions}
            mapName={name => templateNameMap[name]}
            {...bindValue(parsedFile, 'template', currentTemplate.name)}
          />
        </ConfigItem>
        <ConfigDescription>
          Which template to use for this sandbox.
        </ConfigDescription>
      </PaddedConfig>
      {currentTemplate.isServer ? (
        <PaddedConfig>
          <PaddedPreference
            title="Port"
            type="number"
            {...bindValue(parsedFile, 'container.port')}
          />
          <ConfigDescription>
            What is the main port of your application. Values from 1024 to 65535
          </ConfigDescription>
        </PaddedConfig>
      ) : null}
    </div>
  );
};

export default {
  ConfigWizard,
};
