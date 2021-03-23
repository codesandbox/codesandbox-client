import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useActions } from 'app/overmind';
import { Element, Stack, Text, Input, Button } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import history from 'app/utils/history';

export const NewTeam: React.FC<{ redirectTo?: string }> = ({ redirectTo }) => {
  const { createTeam } = useActions().dashboard;
  const [loading, setLoading] = useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value;
    if (teamName && teamName.trim()) {
      event.target.name.setCustomValidity('');
      setLoading(true);
      try {
        await createTeam({
          teamName,
          pilot: location.search.includes('pilot'),
        });
        setLoading(false);
        history.push(redirectTo || dashboardUrls.teamInvite());
      } catch {
        setLoading(false);
      }
    }
  };

  const handleInput = e => {
    const { value } = e.target;
    if (value && value.trim()) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Workspace name is required.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Workspace - CodeSandbox</title>
      </Helmet>
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
        })}
      >
        <Stack justify="center" align="center" css={css({ height: '100%' })}>
          <Element
            css={css({
              minHeight: 200,
              maxWidth: 528,
              backgroundColor: 'grays.800',
              border: '1px solid',
              borderColor: 'grays.600',
              borderRadius: 'medium',
              paddingX: [6, '96px', '96px'],
              paddingTop: 10,
              paddingBottom: '68px',
            })}
          >
            <Stack direction="vertical" gap={7}>
              <Stack direction="vertical" gap={4}>
                <Text size={6} weight="bold" align="center">
                  Create a workspace
                </Text>
                <Text size={3} variant="muted" align="center">
                  Collaborate on code with friends or co-workers. Manage and
                  work on sandboxes together.
                </Text>
              </Stack>

              <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={2}>
                <Input
                  name="name"
                  type="text"
                  placeholder="Workspace name"
                  autoFocus
                  required
                  onChange={handleInput}
                  css={css({ height: 8 })}
                />
                <Button
                  loading={loading}
                  disabled={loading}
                  type="submit"
                  css={css({ height: 8, fontSize: 3 })}
                >
                  Create Workspace
                </Button>
              </Stack>
            </Stack>
          </Element>
        </Stack>
      </Element>
    </>
  );
};
