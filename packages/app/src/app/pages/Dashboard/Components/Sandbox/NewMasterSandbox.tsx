import React from 'react';
import {
  Stack,
  Text,
  Icon,
  IconButton,
  Column,
  Grid,
  ListAction,
  InteractiveOverlay,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import css from '@styled-system/css';
import { useSelection } from '../Selection';
import { StyledCard } from '../shared/StyledCard';

interface NewMasterSandboxProps {
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

const NewMasterSandboxListItem = ({ repo }: NewMasterSandboxProps) => {
  const { onRightClick } = useSelection();
  return (
    <ListAction
      onDoubleClick={() => {
        window.location.href = `https://codesandbox.io/s/github/${repo.owner}/${repo.name}/tree/${repo.branch}`;
      }}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick(e, `/github/${repo.owner}/${repo.name}`);
      }}
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
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
        <Column span={[10, 5, 4]}>
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
              <Text size={3} weight="medium" color="#E5E5E5">
                {repo.name}
              </Text>
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 2, 2]} />
        <Column span={[0, 4, 4]} as={Stack} align="center">
          <Text size={3} block variant="muted">
            {repo.owner}
          </Text>
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

const NewMasterSandboxCard = ({ repo }: NewMasterSandboxProps) => {
  const { onRightClick } = useSelection();
  return (
    <InteractiveOverlay>
      <StyledCard>
        <Stack justify="space-between">
          <Stack gap={2} align="center">
            <Icon name="branch" size={16} />
            <InteractiveOverlay.Button
              onDoubleClick={() => {
                window.location.href = `https://codesandbox.io/s/github/${repo.owner}/${repo.name}/tree/${repo.branch}`;
              }}
              onContextMenu={e => {
                e.preventDefault();
                // @ts-ignore
                onRightClick(e, `/github/${repo.owner}/${repo.name}`);
              }}
            >
              <Text size={3} weight="medium" color="#E5E5E5">
                master
              </Text>
            </InteractiveOverlay.Button>
          </Stack>

          <IconButton
            name="more"
            variant="square"
            size={16}
            title="Sandbox actions"
            // @ts-ignore
            onClick={e => onRightClick(e, `/github/${repo.owner}/${repo.name}`)}
          />
        </Stack>

        <Stack align="center">
          <Text size={12} variant="muted">
            {repo.owner}/{repo.name}
          </Text>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
