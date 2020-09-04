import React from 'react';
import { useOvermind } from 'app/overmind';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Grid, Column, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxCard } from './SandboxCard';
import { SandboxTypes } from './constants';

export const PinnedSandboxes = ({ menuControls }) => {
  const {
    state: {
      user: loggedInUser,
      profile: { current: user },
    },
  } = useOvermind();

  const myProfile = loggedInUser?.username === user.username;

  const [{ isOver }, drop] = useDrop({
    accept: [SandboxTypes.ALL_SANDBOX, SandboxTypes.PINNED_SANDBOX],
    drop: () => ({ name: 'PINNED_SANDBOXES' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Grid
      rowGap={6}
      columnGap={6}
      css={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}
    >
      {user.featuredSandboxes.map((sandbox, index) => (
        <Column key={sandbox.id}>
          <motion.div layoutTransition={{ duration: 0.15 }}>
            <SandboxCard
              type={SandboxTypes.PINNED_SANDBOX}
              sandbox={sandbox}
              index={index}
              menuControls={menuControls}
            />
          </motion.div>
        </Column>
      ))}
      {myProfile && (
        <div ref={drop}>
          <Stack
            justify="center"
            align="center"
            css={css({
              height: 240,
              padding: 4,
              backgroundColor: isOver ? 'grays.700' : 'transparent',
              transition: (theme) => `background-color ${theme.speeds[2]}`,
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23757575' stroke-width='1' stroke-dasharray='8%2c8' stroke-dashoffset='4' stroke-linecap='square'/%3e%3c/svg%3e");border-radius: 4px;`,
            })}
          >
            <Text variant="muted" size={4} weight="medium" align="center">
              Drag your Sandbox here to pin them to your profile
            </Text>
          </Stack>
        </div>
      )}
      {user.featuredSandboxes.length ? (
        <>
          <div />
          <div />
        </>
      ) : null}
    </Grid>
  );
};
