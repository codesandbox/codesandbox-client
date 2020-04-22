import React from 'react';
import {
  ConfigDescription,
  PaddedConfig,
  ConfigItem,
  PaddedPreference,
} from '../elements';
import { ConfigurationUIProps } from '../types';

export class ConfigWizard extends React.Component<ConfigurationUIProps> {
  bindValue = (file: Object, property: string) => ({
    value: file[property],
    setValue: (value: any) => {
      this.props.updateFile(
        JSON.stringify(
          {
            ...file,
            [property]: value,
          },
          null,
          2
        )
      );
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
      return <div>Problem parsing .prettierrc: {error.message}</div>;
    }

    if (!parsedFile) {
      return <div>Could not parse .prettierrc</div>;
    }
    return (
      <div>
        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Print Width"
              type="number"
              {...this.bindValue(parsedFile, 'printWidth')}
            />
          </ConfigItem>
          <ConfigDescription>
            Specify the line length that the printer will wrap on.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Tab Width"
              type="number"
              {...this.bindValue(parsedFile, 'tabWidth')}
            />
          </ConfigItem>
          <ConfigDescription>
            Specify the number of spaces per indentation-level.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Use Tabs"
              type="boolean"
              {...this.bindValue(parsedFile, 'useTabs')}
            />
          </ConfigItem>
          <ConfigDescription>
            Indent lines with tabs instead of spaces.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Semicolons"
              type="boolean"
              {...this.bindValue(parsedFile, 'semi')}
            />
          </ConfigItem>
          <ConfigDescription>
            Print semicolons at the ends of statements.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Use Single Quotes"
              type="boolean"
              {...this.bindValue(parsedFile, 'singleQuote')}
            />
          </ConfigItem>
          <ConfigDescription>
            Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Trailing Commas"
              type="dropdown"
              options={['none', 'es5', 'all']}
              {...this.bindValue(parsedFile, 'trailingComma')}
            />
          </ConfigItem>
          <ConfigDescription>
            Print trailing commas wherever possible.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Bracket Spacing"
              type="boolean"
              {...this.bindValue(parsedFile, 'bracketSpacing')}
            />
          </ConfigItem>
          <ConfigDescription>
            Print spaces between brackets in object literals.
          </ConfigDescription>
        </PaddedConfig>

        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="JSX Brackets"
              type="boolean"
              {...this.bindValue(parsedFile, 'jsxBracketSameLine')}
            />
          </ConfigItem>
          <ConfigDescription>
            Put the `{'>'}` of a multi-line JSX element at the end of the last
            line instead of being alone on the next line.
          </ConfigDescription>
        </PaddedConfig>
        <PaddedConfig>
          <ConfigItem>
            <PaddedPreference
              title="Arrow Function Parentheses"
              type="dropdown"
              options={['avoid', 'always']}
              {...this.bindValue(parsedFile, 'arrowParens')}
            />
          </ConfigItem>
          <ConfigDescription>
            Include parentheses around a sole arrow function parameter.
          </ConfigDescription>
        </PaddedConfig>
      </div>
    );
  }
}

export default {
  ConfigWizard,
};
