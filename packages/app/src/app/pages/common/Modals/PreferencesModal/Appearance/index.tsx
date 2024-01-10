import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { PreferenceContainer, SubContainer } from '../elements';
import { VSCodePlaceholder } from '../VSCodePlaceholder';

import { EditorTheme } from './EditorTheme';

export const Appearance: FunctionComponent = () => (
  <div>
    <Text block marginBottom={6} size={4} weight="regular">
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
