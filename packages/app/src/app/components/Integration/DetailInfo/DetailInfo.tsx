import Margin from '@codesandbox/common/es/components/spacing/Margin';
import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { Button } from '@codesandbox/components';
import React from 'react';
import { MdClear } from 'react-icons/md';

import { Action, Details, Heading, Info } from './elements';

interface IDetailInfoProps {
  heading: string;
  info: string;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export const DetailInfo: React.FC<IDetailInfoProps> = ({
  heading,
  info,
  onSignOut,
  onSignIn,
}) => (
  <Details>
    <Margin right={2}>
      <Heading>{heading}</Heading>
      <Info>{info}</Info>
    </Margin>

    {onSignOut ? (
      <Tooltip content="Sign out">
        <Action onClick={onSignOut} red>
          <MdClear />
        </Action>
      </Tooltip>
    ) : (
      <Button style={{ width: 'auto' }} onClick={onSignIn}>
        Sign in
      </Button>
    )}
  </Details>
);
