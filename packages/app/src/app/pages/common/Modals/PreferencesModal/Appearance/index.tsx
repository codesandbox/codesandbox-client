import React, { FunctionComponent } from 'react';
import { Text } from '@codesandbox/components';
import { PreferenceContainer, SubContainer } from '../elements';
import { VSCodePlaceholder } from '../VSCodePlaceholder';
import { EditorTheme } from './EditorTheme';

export const Appearance: FunctionComponent = () => (
  <div>
    <Text size={4} marginBottom={6} block variant="muted" weight="bold">
      Appearance
    </Text>

    <SubContainer>
      <PreferenceContainer>
        <VSCodePlaceholder />

        <EditorTheme />
      </PreferenceContainer>
    </SubContainer>
  </div>
);
