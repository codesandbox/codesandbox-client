import { Button, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { useAppState } from 'app/overmind';

import { RoomNotFoundError } from './RoomNotFoundError';

export const Error: FunctionComponent = () => {
  const { error } = useAppState().live;

  if (error === 'room not found') {
    return <RoomNotFoundError />;
  }

  return (
    <>
      <Text size={6} weight="bold">
        An error occurred while connecting to the live session:
      </Text>

      <Text block marginTop={4} size={4}>
        {error}
      </Text>

      <Link css={css({ textDecoration: 'none' })} to="/s">
        <Button marginTop={5}>Create Sandbox</Button>
      </Link>
    </>
  );
};
