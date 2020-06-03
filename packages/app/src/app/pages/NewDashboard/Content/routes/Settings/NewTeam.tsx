import React from 'react';
import { useOvermind } from 'app/overmind';
import { Element, Stack, Text, Input, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { Card } from './components';

export const NewTeam = () => {
  const {
    state: { user },
  } = useOvermind();

  const onSubmit = event => {
    event.preventDefault();
    const teamName = event.target.name.value;
    console.warn(teamName, 'created by', user.username);

    // after success:
    // 1. set activeTeam to newTeam
    // 2. redirect to /settings/invite
  };

  return (
    <>
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
        })}
      >
        <Stack justify="center" align="center" css={css({ height: '100%' })}>
          <Card
            css={css({
              maxWidth: 528,
              height: 'auto',
              paddingTop: 10,
              paddingBottom: '68px',
              paddingX: [6, '96px', '96px'],
            })}
          >
            <Stack direction="vertical" gap={7}>
              <Stack direction="vertical" gap={4}>
                <Text size={6} weight="bold" align="center">
                  Create a workspace
                </Text>
                <Text size={3} variant="muted" align="center">
                  You are one step away from seamlessly collaborating, managing
                  team projects and much more...
                </Text>
              </Stack>

              <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={2}>
                <Input
                  name="name"
                  type="text"
                  placeholder="Team name"
                  autoFocus
                  css={css({ height: 8 })}
                />
                <Button type="submit" css={css({ height: 8, fontSize: 3 })}>
                  Create team
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Element>
    </>
  );
};
