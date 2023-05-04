import { Text, Element } from '@codesandbox/components';
import React from 'react';

import { Rule } from '../elements';
import { VSCodePlaceholder } from '../VSCodePlaceholder';
import { LinterSettings } from './LinterSettings';
import { VimModeSettings } from './VimModeSettings';

export const Editor: React.FC = () => (
  <>
    <Text block marginBottom={6} size={4} weight="bold">
      Editor
    </Text>

    <Element>
      <VSCodePlaceholder />

      <Element marginTop={8}>
        <VimModeSettings />
        <Rule />
        <LinterSettings />
      </Element>
    </Element>
  </>
);
