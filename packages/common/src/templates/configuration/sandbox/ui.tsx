// @flow
import * as React from 'react';
import { sortBy } from 'lodash-es';

import { Sandbox } from '../../../types';

import * as templates from '../../../templates';
import { default as Template } from '../../../templates/template';

import {
  PaddedPreference,
  ConfigItem,
  ConfigDescription,
  PaddedConfig,
} from '../elements';

type Props = {
  file: string;
  updateFile: (code: string) => void;
  sandbox: Sandbox;
};

export class ConfigWizard extends React.Component<Props> {
  bindValue = (
    file: Object,
    property: string
  ): { value: any; setValue: (p: any) => void } => ({
    value: file[property],
    setValue: (value: any) => {
      const code = JSON.stringify(
        {
          ...file,
          [property]: value,
        },
        null,
        2
      );
      this.props.updateFile(code);
    },
  });

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
      return <div>Problem parsing sandbox.config.json: {error.message}</div>;
    }

    if (!parsedFile) {
      return <div>Could not parse sandbox.config.json</div>;
    }

    const currentTemplate = templates.default(sandbox.template);

    // $FlowIssue: Can't detect difference between filter/no-filter
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
              {...this.bindValue(parsedFile, 'infiniteLoopProtection')}
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
              {...this.bindValue(parsedFile, 'hardReloadOnChange')}
            />
          </ConfigItem>
          <ConfigDescription>
            Force refresh the sandbox for a change. This is helpful for
            sandboxes with global state, like intervals.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Default View"
              type="dropdown"
              options={['browser', 'console', 'tests']}
              {...this.bindValue(parsedFile, 'view')}
            />
          </ConfigItem>
          <ConfigDescription>
            Which view to show in the preview by default.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Template"
              type="dropdown"
              options={templateOptions}
              mapName={name => templateNameMap[name]}
              {...this.bindValue(parsedFile, 'template')}
            />
          </ConfigItem>
          <ConfigDescription>
            Which template to use for this sandbox.
          </ConfigDescription>
        </PaddedConfig>
      </div>
    );
  }
}

export default {
  ConfigWizard,
};
