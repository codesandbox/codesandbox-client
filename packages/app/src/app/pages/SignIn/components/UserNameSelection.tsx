import React, { useEffect, useState } from 'react';
import { Element, Text, Stack, Input, Button } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { css } from '@styled-system/css';

export const UserNameSelection = () => {
  const { pendingUser } = useAppState();
  const { validateUsername, finalizeSignUp } = useActions();
  const [newUsername, setNewUsername] = useState('');
  const [loadingUsername, setLoadingUserName] = useState(false);

  useEffect(() => {
    setNewUsername(pendingUser?.username);
  }, [pendingUser]);

  return (
    <Stack justify="center" align="center">
      <Element>
        <Element>
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
            <Stack
              css={css({
                width: 300,
              })}
              as="form"
              direction="vertical"
              align="center"
              gap={4}
              onSubmit={e => {
                e.preventDefault();
                finalizeSignUp(newUsername);
              }}
            >
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
                type="submit"
                disabled={loadingUsername || !pendingUser.valid}
              >
                {loadingUsername ? 'Checking username...' : 'Finish Sign Up'}
              </Button>
            </Stack>
          </Stack>
        </Element>
      </Element>
    </Stack>
  );
};
