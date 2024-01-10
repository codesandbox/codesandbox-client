import { Button, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const RoomNotFoundError: FunctionComponent = () => (
  <>
    <Text size={6} weight="bold">
      Something went wrong
    </Text>

    <Text block marginTop={4} size={4}>
      {`It seems like this session doesn't exist or has been closed`}
    </Text>

    <Link css={css({ textDecoration: 'none' })} to="/s">
      <Button marginTop={5}>Create Sandbox</Button>
    </Link>
  </>
);
