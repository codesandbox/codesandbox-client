import React from 'react';
import { useDrag } from 'react-dnd';
import { useOvermind } from 'app/overmind';
import { Stack, Text, Stats, Link, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

export const SandboxCard = ({
  sandbox,
  menuControls: { onKeyDown, onContextMenu },
}) => {
  const {
    state: {
      user: loggedInUser,
      profile: { current: user },
    },
    actions: {
      profile: { addFeaturedSandboxes },
    },
  } = useOvermind();

  const [, drag] = useDrag({
    item: { id: sandbox.id, type: 'sandbox' },
    end: (item: { id: string }, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult.name === 'PINNED_SANDBOXES') {
        const { id } = item;
        addFeaturedSandboxes({ sandboxId: id });
      }
    },
  });

  const myProfile = loggedInUser?.username === user.username;

  return (
    <div ref={myProfile ? drag : null}>
      <Stack
        as={Link}
        href={sandboxUrl({ id: sandbox.id })}
        direction="vertical"
        gap={4}
        onContextMenu={event => onContextMenu(event, sandbox.id)}
        onKeyDown={event => onKeyDown(event, sandbox.id)}
        css={css({
          backgroundColor: 'grays.700',
          border: '1px solid',
          borderColor: 'grays.600',
          borderRadius: 'medium',
          overflow: 'hidden',
          ':hover, :focus, :focus-within': {
            boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
          },
          ':focus, :focus-within': {
            outline: 'none',
            borderColor: 'blues.600',
          },
        })}
      >
        <div
          css={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160 + 1,
            borderBottom: '1px solid',
            backgroundColor: 'grays.600',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            borderColor: 'grays.600',
          })}
          style={{
            backgroundImage: `url(${sandbox.screenshotUrl ||
              `/api/v1/sandboxes/${sandbox.id}/screenshot.png`})`,
          }}
        />
        <Stack justify="space-between">
          <Stack direction="vertical" gap={2} marginX={4} marginBottom={4}>
            <Text>{sandbox.title || sandbox.alias || sandbox.id}</Text>
            <Stats sandbox={sandbox} />
          </Stack>
          <IconButton
            name="more"
            size={9}
            title="Sandbox actions"
            onClick={event => onContextMenu(event, sandbox.id)}
          />
        </Stack>
      </Stack>
    </div>
  );
};
