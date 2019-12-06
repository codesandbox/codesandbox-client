import React, { FunctionComponent } from 'react';

import { PreferenceContainer, SubContainer, Title } from '../elements';
import { VSCodePlaceholder } from '../VSCodePlaceholder';

import { EditorTheme } from './EditorTheme';

export const Appearance: FunctionComponent = () => (
  <div>
    <Title>Appearance</Title>

    <SubContainer>
      <PreferenceContainer>
        <VSCodePlaceholder />

        <EditorTheme />
      </PreferenceContainer>
    </SubContainer>
  </div>
);
