import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { Button, Stack } from '@codesandbox/components';
import { Details, Heading, Info, Action } from './elements';

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
    <Stack direction="vertical">
      <Heading>{heading}</Heading>
      <Info>{info}</Info>
    </Stack>
    {onSignOut ? (
      <Tooltip content="Sign out">
        <Action onClick={onSignOut} red>
          <CrossIcon />
        </Action>
      </Tooltip>
    ) : (
      <Button autoWidth onClick={onSignIn}>
        Sign in
      </Button>
    )}
  </Details>
);
