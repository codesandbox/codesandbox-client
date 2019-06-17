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

const DetailInfo = ({
  bgColor,
  light = false,
  children,
  loading = false,
  onDeploy,
}: IDetailInfoProps) => (
  <Details bgColor={bgColor}>
    <Margin right={2}>
      <Info light={light}>{children}</Info>
    </Margin>
    <Button small disabled={loading} onClick={onDeploy}>
      Deploy
    </Button>
  </Details>
);

export default DetailInfo;
