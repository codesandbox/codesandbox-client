import React from 'react';
import {
  Stack,
  Text,
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
                border: '1px solid',
                borderColor: 'grays.500',
                backgroundColor: 'grays.700',
                borderRadius: 'small',
              })}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 64 64">
                <path
                  d="M59.707 16.337C56.846 11.311 52.964 7.332 48.062 4.4 43.159 1.466 37.806 0 32 0c-5.806 0-11.16 1.467-16.063 4.4-4.902 2.932-8.784 6.911-11.645 11.937C1.43 21.363 0 26.851 0 32.801c0 7.148 2.034 13.575 6.104 19.284 4.07 5.71 9.326 9.66 15.77 11.852.75.143 1.306.042 1.667-.298a1.69 1.69 0 00.541-1.281l-.02-2.307a391.01 391.01 0 01-.021-3.8l-.959.17c-.61.114-1.382.163-2.312.15a17.2 17.2 0 01-2.896-.3c-1-.184-1.93-.611-2.792-1.28-.86-.67-1.472-1.545-1.833-2.627l-.417-.982c-.277-.655-.714-1.382-1.312-2.178-.597-.798-1.201-1.339-1.812-1.623l-.292-.214a3.092 3.092 0 01-.541-.513 2.352 2.352 0 01-.375-.598c-.084-.2-.015-.364.208-.492.223-.129.625-.191 1.208-.191l.833.128c.556.114 1.243.455 2.063 1.024.82.57 1.493 1.31 2.02 2.22.64 1.169 1.41 2.058 2.313 2.67.903.613 1.813.918 2.729.918.916 0 1.708-.07 2.375-.212a8.149 8.149 0 001.875-.641c.25-1.909.93-3.375 2.041-4.4-1.583-.17-3.006-.427-4.27-.769-1.264-.342-2.57-.897-3.917-1.666-1.348-.769-2.466-1.723-3.354-2.862-.889-1.139-1.618-2.634-2.187-4.484-.57-1.851-.854-3.987-.854-6.407 0-3.446 1.097-6.378 3.292-8.799-1.028-2.59-.931-5.495.291-8.712.806-.257 2-.064 3.583.576 1.584.64 2.743 1.19 3.48 1.645.736.455 1.326.84 1.77 1.153a28.91 28.91 0 018-1.11c2.75 0 5.417.37 8.001 1.11l1.583-1.025c1.083-.683 2.362-1.31 3.833-1.88 1.472-.569 2.598-.725 3.376-.469 1.25 3.218 1.36 6.122.333 8.713 2.194 2.42 3.292 5.353 3.292 8.799 0 2.42-.286 4.562-.854 6.427-.57 1.866-1.305 3.36-2.208 4.485-.903 1.125-2.028 2.072-3.375 2.84-1.348.769-2.654 1.324-3.917 1.666-1.264.342-2.688.599-4.27.77 1.443 1.28 2.165 3.302 2.165 6.064v9.011c0 .512.174.94.522 1.281.347.341.895.442 1.645.299 6.445-2.192 11.702-6.143 15.771-11.852C61.965 46.375 64 39.948 64 32.8c-.002-5.95-1.433-11.437-4.293-16.463z"
                  fill="#fff"
                />
              </svg>
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
        backgroundColor: 'grays.700',
        borderRadius: 'medium',
        transition: 'background ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        ':hover, :focus, :focus-within': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
        },
      })}
    >
      <Stack
        justify="center"
        align="center"
        css={css({
          height: 120,
          backgroundColor: 'rgba(255, 255,255,0.05)',
        })}
      >
        <svg width={64} height={64} fill="none">
          <path
            d="M59.707 16.337C56.846 11.311 52.964 7.332 48.062 4.4 43.159 1.466 37.806 0 32 0c-5.806 0-11.16 1.467-16.063 4.4-4.902 2.932-8.784 6.911-11.645 11.937C1.43 21.363 0 26.851 0 32.801c0 7.148 2.034 13.575 6.104 19.284 4.07 5.71 9.326 9.66 15.77 11.852.75.143 1.306.042 1.667-.298a1.69 1.69 0 00.541-1.281l-.02-2.307a391.01 391.01 0 01-.021-3.8l-.959.17c-.61.114-1.382.163-2.312.15a17.2 17.2 0 01-2.896-.3c-1-.184-1.93-.611-2.792-1.28-.86-.67-1.472-1.545-1.833-2.627l-.417-.982c-.277-.655-.714-1.382-1.312-2.178-.597-.798-1.201-1.339-1.812-1.623l-.292-.214a3.092 3.092 0 01-.541-.513 2.352 2.352 0 01-.375-.598c-.084-.2-.015-.364.208-.492.223-.129.625-.191 1.208-.191l.833.128c.556.114 1.243.455 2.063 1.024.82.57 1.493 1.31 2.02 2.22.64 1.169 1.41 2.058 2.313 2.67.903.613 1.813.918 2.729.918.916 0 1.708-.07 2.375-.212a8.149 8.149 0 001.875-.641c.25-1.909.93-3.375 2.041-4.4-1.583-.17-3.006-.427-4.27-.769-1.264-.342-2.57-.897-3.917-1.666-1.348-.769-2.466-1.723-3.354-2.862-.889-1.139-1.618-2.634-2.187-4.484-.57-1.851-.854-3.987-.854-6.407 0-3.446 1.097-6.378 3.292-8.799-1.028-2.59-.931-5.495.291-8.712.806-.257 2-.064 3.583.576 1.584.64 2.743 1.19 3.48 1.645.736.455 1.326.84 1.77 1.153a28.91 28.91 0 018-1.11c2.75 0 5.417.37 8.001 1.11l1.583-1.025c1.083-.683 2.362-1.31 3.833-1.88 1.472-.569 2.598-.725 3.376-.469 1.25 3.218 1.36 6.122.333 8.713 2.194 2.42 3.292 5.353 3.292 8.799 0 2.42-.286 4.562-.854 6.427-.57 1.866-1.305 3.36-2.208 4.485-.903 1.125-2.028 2.072-3.375 2.84-1.348.769-2.654 1.324-3.917 1.666-1.264.342-2.688.599-4.27.77 1.443 1.28 2.165 3.302 2.165 6.064v9.011c0 .512.174.94.522 1.281.347.341.895.442 1.645.299 6.445-2.192 11.702-6.143 15.771-11.852C61.965 46.375 64 39.948 64 32.8c-.002-5.95-1.433-11.437-4.293-16.463z"
            fill="#fff"
          />
        </svg>
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
