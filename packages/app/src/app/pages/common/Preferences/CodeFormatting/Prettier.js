import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Container,
  PreferenceContainer,
  PaddedPreference,
  Description,
  Rule,
} from '../styles';

export default inject('store', 'signals')(
  observer(({ store, signals }) => {
    const bindValue = name => ({
      value: store.editor.preferences.settings.prettierConfig[name],
      setValue: value =>
        signals.editor.preferences.settingChanged({
          name: `prettierConfig.${name}`,
          value,
        }),
    });
    return (
      <Container>
        <PreferenceContainer>
          <Description>
            This configuration can be overridden by a{' '}
            <a
              href="https://prettier.io/docs/en/configuration.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              .prettierrc
            </a>{' '}
            JSON file at the root of the sandbox.
          </Description>
          <Rule />

          <PaddedPreference
            title="Print width"
            type="number"
            {...bindValue('printWidth')}
          />
          <Description>
            Specify the line length that the printer will wrap on.
          </Description>
          <Rule />

          <PaddedPreference
            title="Tab width"
            type="number"
            {...bindValue('tabWidth')}
          />
          <Description>
            Specify the number of spaces per indentation-level.
          </Description>
          <Rule />

          <PaddedPreference
            title="Use tabs"
            type="boolean"
            {...bindValue('useTabs')}
          />
          <Description>Indent lines with tabs instead of spaces.</Description>
          <Rule />

          <PaddedPreference
            title="Semicolons"
            type="boolean"
            {...bindValue('semi')}
          />
          <Description>Print semicolons at the ends of statements.</Description>
          <Rule />

          <PaddedPreference
            title="Use single quotes"
            type="boolean"
            {...bindValue('singleQuote')}
          />
          <Description>
            Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
          </Description>
          <Rule />

          <PaddedPreference
            title="Trailing commas"
            type="dropdown"
            options={['none', 'es5', 'all']}
            {...bindValue('traillingComma')}
          />
          <Description>Print trailing commas wherever possible.</Description>
          <Rule />

          <PaddedPreference
            title="Bracket spacing"
            type="boolean"
            {...bindValue('bracketSpacing')}
          />
          <Description>
            Print spaces between brackets in object literals.
          </Description>
          <Rule />

          <PaddedPreference
            title="JSX Brackets"
            type="boolean"
            {...bindValue('jsxBracketSameLine')}
          />
          <Description>
            Put the `{'>'}` of a multi-line JSX element at the end of the last
            line instead of being alone on the next line.
          </Description>
        </PreferenceContainer>
      </Container>
    );
  })
);
