import React from 'react';
import { Stack, ListAction, Text, Grid, Column } from '@codesandbox/components';
import { noop } from 'overmind';
import css from '@styled-system/css';
import { ListIcon } from '../Repo/Icons';
import { getFullGitHubUrl } from './util';

export const RepoBetaListItem = ({ sandbox, ...props }) => {
  const { owner, repo } = sandbox.gitv2;

  return (
    <ListAction
      onDoubleClick={() => {
        window.location.href = getFullGitHubUrl(owner, repo);
      }}
      onContextMenu={noop}
      {...props}
      css={css({
        paddingX: 0,
        backgroundColor: 'inherit',
        color: 'inherit',
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: 'list.hoverBackground',
        },
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
              })}
            >
              <ListIcon />
            </Stack>
            <Stack justify="space-between" align="center">
              <Text size={3} weight="medium">
                {owner}/{repo}
              </Text>
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 4, 4]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
    </ListAction>
  );
};
