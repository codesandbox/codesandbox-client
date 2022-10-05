import React from 'react';
import {
  Stack,
  Text,
  Icon,
  IconButton,
  Column,
  Grid,
  ListAction,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import css from '@styled-system/css';
import { useSelection } from '../Selection';

export interface NewMasterSandboxProps {
  repo: {
    owner: string;
    name: string;
    branch: string;
  };
}

export const NewMasterSandbox = (props: NewMasterSandboxProps) => {
  const {
    dashboard: { viewMode },
  } = useAppState();

  if (viewMode === 'grid') {
    return <NewMasterSandboxCard {...props} />;
  }

  return <NewMasterSandboxListItem {...props} />;
};

export const NewMasterSandboxListItem = ({ repo }: NewMasterSandboxProps) => {
  const { onRightClick } = useSelection();
  return (
    <ListAction
      onDoubleClick={() => {
        window.location.href = `https://codesandbox.io/s/github/${repo.owner}/${repo.name}/tree/${repo.branch}`;
      }}
      onContextMenu={e => onRightClick(e, `/github/${repo.owner}/${repo.name}`)}
      css={css({
        paddingX: 0,
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: 'list.hoverBackground',
        },
        ':focus-visible': {
          boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
        },
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
      })}
    >
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }}>
        <Column span={[12, 5, 5]}>
          <Stack gap={4} align="center" marginLeft={2}>
            <Stack
              as="div"
              justify="center"
              align="center"
              css={css({
                height: 32,
                width: 32,
                backgroundColor: 'transparent',
                borderRadius: 'small',
              })}
            >
              <Icon color="#999" name="github" size={24} />
            </Stack>
            <Stack justify="space-between" align="center">
              <Text size={3} weight="medium">
                {repo.name}
              </Text>
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 4, 4]} as={Stack} align="center">
          <Text size={3} block variant="muted">
            {repo.owner}
          </Text>
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
      <IconButton
        name="more"
        size={9}
        title="Master Branch actions"
        onClick={e =>
          // @ts-ignore
          onRightClick(e, `/github/${repo.owner}/${repo.name}`)
        }
      />
    </ListAction>
  );
};

export const NewMasterSandboxCard = ({ repo }: NewMasterSandboxProps) => {
  const { onRightClick } = useSelection();
  return (
    <Stack
      onDoubleClick={() => {
        window.location.href = `https://codesandbox.io/s/github/${repo.owner}/${repo.name}/tree/${repo.branch}`;
      }}
      onContextMenu={e => onRightClick(e, `/github/${repo.owner}/${repo.name}`)}
      direction="vertical"
      css={css({
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: 'card.background',
        borderRadius: 'medium',
        transition: 'background ease-in-out',
        transitionDuration: theme => theme.speeds[2],
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
    >
      <Stack
        justify="center"
        align="center"
        css={css({
          height: 120,
          paddingY: 11,
          backgroundColor: 'rgba(255, 255,255,0.05)',
        })}
      >
        <Icon color="#999" name="github" size={32} />
      </Stack>

      <Stack
        justify="space-between"
        direction="vertical"
        marginLeft={5}
        marginRight={2}
        css={css({
          flexGrow: 1,
          paddingBottom: 5,
          paddingTop: 4,
        })}
      >
        <Stack
          justify="space-between"
          align="center"
          css={css({
            minHeight: 26,
          })}
        >
          <Stack gap={1} align="center">
            <Text size={3} weight="medium">
              master
            </Text>
          </Stack>

          <IconButton
            name="more"
            size={9}
            title="Sandbox actions"
            // @ts-ignore
            onClick={e => onRightClick(e, `/github/${repo.owner}/${repo.name}`)}
          />
        </Stack>

        <Stack gap={1} align="center">
          <Text size={3} variant="muted">
            {repo.owner}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
