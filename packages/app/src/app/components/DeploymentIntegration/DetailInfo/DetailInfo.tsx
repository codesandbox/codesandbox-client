import React from 'react';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';
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
