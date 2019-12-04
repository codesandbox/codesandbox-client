import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';

export const Prettier: FunctionComponent = () => {
  const {
    actions: {
      preferences: { settingChanged },
    },
    state: {
      preferences: {
        settings: { prettierConfig },
      },
    },
  } = useOvermind();

  const bindValue = (name: string) => ({
    setValue: value =>
      settingChanged({ name: `prettierConfig.${name}`, value }),
    value: prettierConfig[name],
  });

  return (
    <SubContainer>
      <PreferenceContainer>
        <SubDescription>
          This configuration can be overridden by a{' '}
          <a
            href="https://prettier.io/docs/en/configuration.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            .prettierrc
          </a>{' '}
          JSON file at the root of the sandbox.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Fluid print width"
          type="boolean"
          {...bindValue('fluid')}
        />

        <SubDescription>
          Wrap the code based on the editor width.
        </SubDescription>

        <Rule />

        <PaddedPreference
          style={{ opacity: prettierConfig.fluid ? 0.5 : 1 }}
          title="Print width"
          type="number"
          {...bindValue('printWidth')}
        />

        <SubDescription style={{ opacity: prettierConfig.fluid ? 0.5 : 1 }}>
          Specify the line length that the printer will wrap on.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Tab width"
          type="number"
          {...bindValue('tabWidth')}
        />

        <SubDescription>
          Specify the number of spaces per indentation-level.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Use tabs"
          type="boolean"
          {...bindValue('useTabs')}
        />

        <SubDescription>
          Indent lines with tabs instead of spaces.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Semicolons"
          type="boolean"
          {...bindValue('semi')}
        />

        <SubDescription>
          Print semicolons at the ends of statements.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Use single quotes"
          type="boolean"
          {...bindValue('singleQuote')}
        />

        <SubDescription>
          Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Trailing commas"
          type="dropdown"
          options={['none', 'es5', 'all']}
          {...bindValue('trailingComma')}
        />

        <SubDescription>
          Print trailing commas wherever possible.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="Bracket spacing"
          type="boolean"
          {...bindValue('bracketSpacing')}
        />

        <SubDescription>
          Print spaces between brackets in object literals.
        </SubDescription>

        <Rule />

        <PaddedPreference
          title="JSX Brackets"
          type="boolean"
          {...bindValue('jsxBracketSameLine')}
        />

        <SubDescription>
          Put the `{'>'}` of a multi-line JSX element at the end of the last
          line instead of being alone on the next line.
        </SubDescription>

        <Rule />

        <PaddedPreference
          options={['avoid', 'always']}
          title="Arrow Function Parentheses"
          type="dropdown"
          {...bindValue('arrowParens')}
        />

        <SubDescription>
          Include parentheses around a sole arrow function parameter.
        </SubDescription>
      </PreferenceContainer>
    </SubContainer>
  );
};
