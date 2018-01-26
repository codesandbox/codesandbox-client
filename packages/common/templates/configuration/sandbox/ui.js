// @flow
import React from 'react';

import {
  PaddedPreference,
  ConfigItem,
  ConfigDescription,
  PaddedConfig,
} from '../elements';

type Props = {
  file: string,
  updateFile: (code: string) => void,
};

class ConfigWizard extends React.Component<Props> {
  bindValue = (file: Object, property: string) => ({
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
    const { file } = this.props;

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
      </div>
    );
  }
}

export default {
  ConfigWizard,
};
