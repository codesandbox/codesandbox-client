import React from 'react';
import { Stack, Text, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { useActions } from 'app/overmind';
import { NewSandbox } from '../Sandbox/NewSandbox';
import { PageTypes } from '../../types';
import { ImportRepo } from '../Repo/ImportRepo';

interface EmptyScreenProps {
  collectionId?: string;
  page: PageTypes;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({
  collectionId,
  page,
}) => {
  const { openCreateSandboxModal, modalOpened } = useActions();

  const onClick = () => openCreateSandboxModal({ collectionId });

  if (page === 'search') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no sandboxes that match your query
        </Text>
      </Stack>
    );
  }

  if (page === 'deleted') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no deleted sandboxes yet! Drag sandboxes or templates to
          this page to delete them.
        </Text>
      </Stack>
    );
  }

  if (page === 'legacy-repos') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Stack
          direction="vertical"
          align="center"
          gap={8}
          css={{ width: 500, height: '100vh', userSelect: 'none' }}
        >
          <Stack align="center" css={{ width: 220 }}>
            <ImportRepo />
          </Stack>

          <Stack direction="vertical" align="center" gap={1}>
            <Text variant="muted" align="center">
              Uh oh, you haven’t imported any repositories.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (page === 'open-source-repos') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Stack
          direction="vertical"
          align="center"
          gap={8}
          css={{ width: 500, height: '100vh', userSelect: 'none' }}
        >
          <Stack align="center" css={{ width: 220 }}>
            <ImportRepo />
          </Stack>

          <Stack direction="vertical" align="center" gap={1}>
            <Text variant="muted" align="center">
              Uh oh, you don’t have any open source contributions.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (page === 'always-on') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Stack
          direction="vertical"
          justify="space-between"
          align="center"
          css={{
            width: 500,
            height: 'calc(100vh - 280px)',
            userSelect: 'none',
          }}
        >
          <Stack direction="vertical" align="center" gap={9}>
            <Icon name="server" size={60} />
            <Stack direction="vertical" align="center" gap={4}>
              <Text size={9} weight="bold">
                Always-On
              </Text>
              <Text variant="muted" align="center">
                Server sandboxes sleep after inactivity, but Always-On sandboxes
                don&apos;t — they are constantly running and ready to go.
                Perfect for APIs and scheduled tasks.
              </Text>
              <Text variant="muted" align="center">
                Right-click on any server sandbox and enable “Always-On”
              </Text>
            </Stack>
          </Stack>
          <Text variant="muted">
            You can make up to 3 server sandboxes Always-On. <br />
            <Button
              as={Text}
              variant="link"
              onClick={() =>
                modalOpened({
                  modal: 'feedback',
                  message: "I'd like more Always-On sandboxes",
                })
              }
            >
              Contact us
            </Button>
            if you need more Always on Sandboxes
          </Text>
        </Stack>
      </Stack>
    );
  }

  if (page === 'shared') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Stack
          direction="vertical"
          align="center"
          gap={8}
          css={{ width: 500, height: '100vh', userSelect: 'none' }}
        >
          <Stack direction="vertical" align="center" gap={1}>
            <Text variant="muted" align="center">
              Uh oh, you have not had any sandboxes shared with you yet.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (page === 'liked') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Stack
          direction="vertical"
          align="center"
          gap={8}
          css={{ width: 500, height: '100vh', userSelect: 'none' }}
        >
          <Stack direction="vertical" align="center" gap={1}>
            <Text variant="muted" align="center">
              Uh oh, you haven’t liked any sandboxes yet!
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack justify="center" align="center" marginTop={120}>
      <Stack
        direction="vertical"
        align="center"
        gap={8}
        css={{ width: 500, height: '100vh', userSelect: 'none' }}
      >
        <Stack align="center" css={{ width: 220 }}>
          <NewSandbox collectionId={collectionId} />
        </Stack>

        <Stack direction="vertical" align="center" gap={1}>
          <Text variant="muted" align="center">
            Uh oh, you haven’t created any sandboxes in this folder yet!
          </Text>
          <Stack align="center" gap={1}>
            <Text variant="muted">Start with a</Text>
            <Button
              variant="link"
              onClick={onClick}
              css={css({
                color: 'blues.600',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                width: 'fit-content',
                padding: 0,
              })}
            >
              template
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
