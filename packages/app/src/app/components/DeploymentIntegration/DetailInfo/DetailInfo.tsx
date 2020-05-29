import { Button } from '@codesandbox/common/es/components/Button';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import React from 'react';

import { Details, Info } from './elements';

interface IDetailInfoProps {
  bgColor: string;
  light?: boolean;
  children: React.ReactNode;
  loading?: boolean;
  onDeploy: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DetailInfo: React.FC<IDetailInfoProps> = ({
  bgColor,
  light = false,
  children,
  loading = false,
  onDeploy,
}) => (
  <Details bgColor={bgColor}>
    <Margin right={2}>
      <Info light={light}>{children}</Info>
    </Margin>
    <Button small disabled={loading} onClick={onDeploy}>
      Deploy
    </Button>
  </Details>
);
