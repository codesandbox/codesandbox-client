import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';
import React from 'react';

import { Details, Info } from './elements';

export const DetailInfo = ({ info, deploy, bgColor, light, loading }) => (
  <Details bgColor={bgColor}>
    <Margin right={2}>
      <Info light={light}>{info}</Info>
    </Margin>

    <Button small disabled={loading} onClick={() => deploy()}>
      Deploy
    </Button>
  </Details>
);
