import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../elements';
import VSCodePlaceholder from '../VSCodePlaceholder';

import { EditorTheme } from './EditorTheme';
import { PreferenceText } from './elements';

export const Appearance: FunctionComponent = () => {
  const {
    actions: {
      preferences: { settingChanged },
    },
    state: {
      preferences: { settings },
    },
  } = useOvermind();

  const bindValue = (name: string) => ({
    setValue: value => settingChanged({ name, value }),
    value: settings[name],
  });
  const fontOptions = ['Menlo', 'Dank Mono', 'Source Code Pro'];

  return (
    <div>
      <Title>Appearance</Title>

      <SubContainer>
        <PreferenceContainer>
          <VSCodePlaceholder>
            <PaddedPreference
              title="Font Size"
              type="number"
              {...bindValue('fontSize')}
            />

            <Rule />

            <PaddedPreference
              options={['Custom'].concat(fontOptions)}
              placeholder="Source Code Pro"
              title="Font Family"
              type="dropdown"
              {...bindValue('fontFamily')}
            />

            <SubDescription>
              We use{' '}
              <a
                href="https://dank.sh/affiliate?n=cjgw9wi2q7sf20a86q0k176oj"
                rel="noreferrer noopener"
                target="_blank"
              >
                Dank Mono
              </a>{' '}
              as default font, you can also use locally installed fonts
            </SubDescription>

            {!fontOptions.includes(settings.fontFamily) && (
              <PreferenceText
                block
                placeholder="Enter your custom font"
                {...bindValue('fontFamily')}
              />
            )}

            <Rule />

            <PaddedPreference
              title="Font Ligatures"
              type="boolean"
              {...bindValue('enableLigatures')}
            />

            <SubDescription>
              Whether we should enable{' '}
              <a
                href="https://en.wikipedia.org/wiki/Typographic_ligature"
                target="_blank"
                rel="noopener noreferrer"
              >
                font ligatures
              </a>
              .
            </SubDescription>

            <Rule />

            <PaddedPreference
              placeholder="1.15"
              step="0.05"
              title="Line Height"
              type="number"
              {...bindValue('lineHeight')}
            />

            <Rule />

            <PaddedPreference
              title="Zen Mode"
              type="boolean"
              {...bindValue('zenMode')}
            />

            <SubDescription>
              Hide all distracting elements, perfect for lessons and
              presentations.
            </SubDescription>
          </VSCodePlaceholder>

          <EditorTheme />
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
};
