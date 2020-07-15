import React, { useEffect, useState } from 'react';
import { Element, Text, Stack, Input, Button } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { css } from '@styled-system/css';

export const UserNameSelection = () => {
  const {
    state: { pendingUser },
    actions: { validateUsername, finalizeSignUp },
  } = useOvermind();

  const [newUsername, setNewUsername] = useState('');
  const [loadingUsername, setLoadingUserName] = useState(false);

  useEffect(() => {
    setNewUsername(pendingUser?.username);
  }, [pendingUser]);

  return (
    <Stack justify="center" align="center">
      <Element>
        <Element style={{ maxWidth: 400 }}>
          <Stack direction="vertical" align="center" gap={4}>
            <Element>
              <img
                alt={pendingUser.username}
                css={css({
                  width: 100,
                  height: 100,
                  border: '1px solid',
                  borderColor: 'grays.500',
                  borderRadius: 'medium',
                })}
                src={pendingUser.avatarUrl}
              />
            </Element>
            <Text weight="bold" size={6}>
              Please select your username
            </Text>

            <Input
              onBlur={async e => {
                setLoadingUserName(true);
                await validateUsername(e.target.value);
                setLoadingUserName(false);
              }}
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
            {!pendingUser.valid ? (
              <Text size={3} variant="danger">
                Sorry, that username is already taken.
              </Text>
            ) : null}
            <Button
              onClick={e => finalizeSignUp(newUsername)}
              disabled={loadingUsername || !pendingUser.valid}
            >
              {loadingUsername ? 'Checking username...' : 'Finish Sign Up'}
            </Button>
          </Stack>
        </Element>
      </Element>
    </Stack>
  );
};
