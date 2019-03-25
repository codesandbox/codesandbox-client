import React from 'react';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import { Details, Info } from './elements';

function DetailInfo({ info, deploy, bgColor }) {
  return (
    <Details bgColor={bgColor}>
      <Margin right={2}>
        <Info>{info}</Info>
      </Margin>
      <Button small onClick={deploy}>
        Deploy
      </Button>
    </Details>
  );
}

export default DetailInfo;
