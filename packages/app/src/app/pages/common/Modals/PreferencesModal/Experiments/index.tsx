import { Text, Stack } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { SubContainer } from '../elements';

import { BetaSandboxEditor } from './BetaSandboxEditor';
import { OpenDevboxesInVSCode } from './OpenDevboxesInVSCode';

export const Experiments: FunctionComponent = () => (
  <>
    <Text block marginBottom={6} size={4} weight="regular">
      Experiments
    </Text>

    <SubContainer>
      <Stack direction="vertical" paddingTop={2} gap={6}>
        <BetaSandboxEditor />
        <OpenDevboxesInVSCode />
      </Stack>
    </SubContainer>
  </>
);
