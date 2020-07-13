import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
  Button,
  Input,
  Text,
  Stack,
  Element,
} from '@codesandbox/components';
import { useParams } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import { Page, Avatar } from './elements';

export const UserNameSelection: React.FC = () => {
  const {
    state: { pendingUser },
    actions: { usernameSelectionMounted, validateUsername, finalizeSignUp },
  } = useOvermind();
  const params: { userId?: string } = useParams();
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    usernameSelectionMounted(params.userId);
  }, [params.userId, usernameSelectionMounted]);

  useEffect(() => {
    setNewUsername(pendingUser?.username);
  }, [pendingUser]);
  if (!pendingUser) {
    return (
      <ThemeProvider>
        <Page />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Page>
        <Navigation title="Select Username" />

        <Helmet>
          <title>Select Username - CodeSandbox</title>
        </Helmet>
        <Stack
          justify="center"
          align="center"
          marginTop={6}
          style={{ height: 'calc(100vh - 72px)' }}
        >
          <Element style={{ maxWidth: 1024 }}>
            <Element style={{ maxWidth: 400 }}>
              <Stack direction="vertical" align="center" gap={4}>
                <Element>
                  <Avatar src={pendingUser.avatarUrl} />
                </Element>
                <Text weight="bold" size={6}>
                  Please select your username
                </Text>

                <Input
                  onBlur={async e => {
                    setLoading(true);
                    await validateUsername(e.target.value);
                    setLoading(false);
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
                  onClick={finalizeSignUp}
                  disabled={loading || !pendingUser.valid}
                >
                  {loading ? 'Checking username...' : 'Finish Sign Up'}
                </Button>
              </Stack>
            </Element>
          </Element>
        </Stack>
      </Page>
    </ThemeProvider>
  );
};
