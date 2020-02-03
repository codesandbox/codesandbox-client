import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { Description } from '../../../elements';

import { SubTitle } from '../elements';

import { EnvironmentVariables } from './EnvironmentVariables';

export const SecretKeys: FunctionComponent = () => (
  <Margin top={1}>
    <SubTitle>Secret Keys</SubTitle>

    <Description>
      Secrets are available as environment variables. They are kept private and
      will not be transferred between forks.
    </Description>

    <Margin top={0.5}>
      <EnvironmentVariables />
    </Margin>
  </Margin>
);
