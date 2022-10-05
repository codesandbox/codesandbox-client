import React from 'react';
import Media from 'react-media';
import { Element, Stack, Text, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { useActions } from 'app/overmind';
import { NewSandbox } from '../Sandbox/NewSandbox';
import { PageTypes } from '../../types';
import { GRID_MAX_WIDTH, GUTTER } from '../VariableGrid';

interface EmptyScreenProps {
  collectionId?: string;
  page: PageTypes;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({
  collectionId,
  page,
}) => {
  const { modalOpened, openCreateSandboxModal } = useActions();

  if (page === 'search') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no sandboxes that match your query
        </Text>
      </Stack>
    );
  }

  if (page === 'archive') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no archived sandboxes yet! Drag sandboxes or templates to
          this page to archive them.
        </Text>
      </Stack>
    );
  }

  if (page === 'repositories') {
    return (
      <Media query="(max-width: 960px)">
        {match => {
          return (
            <Stack
              direction={'vertical'}
              gap={8}
              css={css({
                width: `calc(100% - ${2 * GUTTER}px)`,
                maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
                marginX: 'auto',
                marginTop: 8,
              })}
            >
              <Stack direction="vertical" gap={4} css={{ maxWidth: '831px' }}>
                <Text
                  as="h2"
                  size={32}
                  weight="500"
                  css={{ marginTop: 0, fontFamily: 'Everett, sans-serif' }}
                >
                  <Text css={css({ color: '#EDFFA5' })}>Repositories:</Text> an
                  improved git workflow powered by the cloud.
                </Text>

                <Text
                  as="p"
                  weight="400"
                  variant="muted"
                  size={16}
                  css={{ margin: 0, lineHeight: '24px' }}
                >
                  Open any open-source repository on CodeSandbox and just click
                  &apos;Branch&apos; to start contributing. Don&apos;t worry
                  about forking and setting up a new repository. We&apos;ll take
                  care of that.
                </Text>
              </Stack>
              <Stack direction={match ? 'vertical' : 'horizontal'} gap={3}>
                <Button
                  onClick={() => {
                    openCreateSandboxModal({ initialTab: 'import' });
                  }}
                  variant="secondary"
                  css={css({
                    height: 'auto',
                    padding: '16px 32px',
                  })}
                  autoWidth={!match}
                >
                  <Stack gap={5} align="center">
                    <Icon name="github" size={20} />
                    <Text size={16} css={css({ lineHeight: '24px' })}>
                      Import from GitHub
                    </Text>
                  </Stack>
                </Button>
                {/* ❗️ This button will be uncommented later */}
                {/* <Button
                  onClick={() => {
                    // TODO: start from template
                    openCreateSandboxModal({ initialTab: 'import' });
                  }}
                  variant="secondary"
                  css={css({
                    height: 'auto',
                    padding: '16px 32px',
                  })}
                  autoWidth={!match}
                >
                  <Text size={16} css={css({ lineHeight: '24px' })}>
                    Start from a template
                  </Text>
                </Button> */}
                {/* ❗️ TODO: Insert right link */}
                <Button
                  variant="link"
                  css={css({
                    height: 'auto',
                    padding: '16px 32px',
                    fontSize: '16px',
                  })}
                  autoWidth={!match}
                >
                  Learn more
                </Button>
              </Stack>
            </Stack>
          );
        }}
      </Media>
    );
  }

  if (page === 'my-contributions') {
    return (
      <Stack
        gap={12}
        direction="horizontal"
        align="stretch"
        css={css({
          width: `calc(100% - ${2 * GUTTER}px)`,
          maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
          marginX: 'auto',
          marginTop: 8,
        })}
      >
        <Element
          as="img"
          src="/static/img/contributions-branch.png"
          alt=""
          css={{
            display: 'block',
            width: 259,
            height: 221,
            '@media screen and (max-width: 1000px)': {
              display: 'none',
            },
          }}
        />
        <Stack gap={8} direction="vertical" justify="space-between">
          <Stack gap={4} direction="vertical" css={{ maxWidth: '674px' }}>
            <Text
              as="h2"
              size={32}
              weight="500"
              css={{ marginTop: 0, fontFamily: 'Everett, sans-serif' }}
            >
              Open-source development made easy
            </Text>
            <Text
              as="p"
              weight="400"
              variant="muted"
              size={16}
              css={{ margin: 0, lineHeight: '24px' }}
            >
              Open any open-source repository on CodeSandbox and just click
              &apos;Branch&apos; to start contributing. Don&apos;t worry about
              forking and setting up a new repository. We&apos;ll take care of
              that.
            </Text>
          </Stack>
          <Media query="(max-width: 960px)">
            {match => (
              <Stack direction={match ? 'vertical' : 'horizontal'} gap={1}>
                <Button
                  onClick={() => {
                    openCreateSandboxModal({ initialTab: 'import' });
                  }}
                  variant="secondary"
                  css={css({
                    height: 'auto',
                    padding: '16px 32px',
                  })}
                  autoWidth={!match}
                >
                  <Stack gap={5} align="center">
                    <Icon name="github" size={20} />
                    <Text size={16} css={css({ lineHeight: '24px' })}>
                      Import from GitHub
                    </Text>
                  </Stack>
                </Button>
                {/* ❗️ TODO: Insert right link */}
                <Button
                  variant="link"
                  css={css({
                    height: 'auto',
                    padding: '16px 32px',
                    fontSize: '16px',
                  })}
                  autoWidth={!match}
                >
                  Learn more
                </Button>
              </Stack>
            )}
          </Media>
        </Stack>
      </Stack>
    );
  }

  if (page === 'synced-sandboxes') {
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
              Uh oh, you haven’t created any synced sandboxes yet!
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
        </Stack>
      </Stack>
    </Stack>
  );
};
