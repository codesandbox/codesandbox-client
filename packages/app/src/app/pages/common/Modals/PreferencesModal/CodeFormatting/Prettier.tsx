import React, { FunctionComponent } from 'react';
import { Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';

import {
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  Rule,
} from '../elements';

export const Prettier: FunctionComponent = () => {
  const {
    settings: {
      prettierConfig,
      prettierConfig: { fluid },
    },
  } = useAppState().preferences;

  const { settingChanged } = useActions().preferences;

  const bindValue = (name: string) => ({
    setValue: value =>
      settingChanged({ name: `prettierConfig.${name}`, value }),
    value: prettierConfig[name],
  });

  return (
    <SubContainer>
      <PreferenceContainer>
        <Text size={3} variant="muted">
          This configuration can be overridden by a{' '}
          <a
            href="https://prettier.io/docs/en/configuration.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            .prettierrc
          </a>{' '}
          JSON file at the root of the sandbox.
        </Text>

        <Rule />

        <PaddedPreference
          title="Fluid print width"
          type="boolean"
          {...bindValue('fluid')}
        />

        <Text size={2} variant="muted">
          Wrap the code based on the editor width.
        </Text>

        <Rule />

        <Element css={css({ pointerEvents: fluid ? 'none' : 'all' })}>
          <PaddedPreference
            style={{ opacity: fluid ? 0.5 : 1 }}
            title="Print width"
            type="number"
            {...bindValue('printWidth')}
          />

          <Text size={2} variant="muted" style={{ opacity: fluid ? 0.5 : 1 }}>
            Specify the line length that the printer will wrap on.
          </Text>
        </Element>
        <Rule />

        <PaddedPreference
          title="Tab width"
          type="number"
          {...bindValue('tabWidth')}
        />

        <Text size={2} variant="muted">
          Specify the number of spaces per indentation-level.
        </Text>

        <Rule />

        <PaddedPreference
          title="Use tabs"
          type="boolean"
          {...bindValue('useTabs')}
        />

        <Text size={2} variant="muted">
          Indent lines with tabs instead of spaces.
        </Text>

        <Rule />

        <PaddedPreference
          title="Semicolons"
          type="boolean"
          {...bindValue('semi')}
        />

        <Text size={2} variant="muted">
          Print semicolons at the ends of statements.
        </Text>

        <Rule />

        <PaddedPreference
          title="Use single quotes"
          type="boolean"
          {...bindValue('singleQuote')}
        />

        <Text size={2} variant="muted">
          Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
        </Text>

        <Rule />

        <PaddedPreference
          title="Trailing commas"
          type="dropdown"
          options={['none', 'es5', 'all']}
          {...bindValue('trailingComma')}
        />

        <Text size={2} variant="muted">
          Print trailing commas wherever possible.
        </Text>

        <Rule />

        <PaddedPreference
          title="Bracket spacing"
          type="boolean"
          {...bindValue('bracketSpacing')}
        />

        <Text size={2} variant="muted">
          Print spaces between brackets in object literals.
        </Text>

        <Rule />

        <PaddedPreference
          title="JSX Brackets"
          type="boolean"
          {...bindValue('jsxBracketSameLine')}
        />

        <Text size={2} variant="muted">
          Put the `{'>'}` of a multi-line JSX element at the end of the last
          line instead of being alone on the next line.
        </Text>

        <Rule />

        <PaddedPreference
          options={['avoid', 'always']}
          title="Arrow Function Parentheses"
          type="dropdown"
          {...bindValue('arrowParens')}
        />

        <Text size={2} variant="muted">
          Include parentheses around a sole arrow function parameter.
        </Text>
      </PreferenceContainer>
    </SubContainer>
  );
};
