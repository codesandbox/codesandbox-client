import { Button, Element, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import { useActions } from 'app/overmind';

export const NotAuthenticated: FunctionComponent = () => {
  const { signInToRoom } = useActions().live;
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <>
      <Text weight="bold" size={6}>
        Sign in required
      </Text>

      <Text block marginTop={4} size={4}>
        You need to sign in to join this session
      </Text>

      <Element marginTop={4}>
        <Button onClick={() => signInToRoom(roomId)} autoWidth>
          <Stack align="center" gap={2}>
            <Text style={{ lineHeight: 1 }}>Sign in</Text>
          </Stack>
        </Button>
      </Element>
    </>
  );
};
