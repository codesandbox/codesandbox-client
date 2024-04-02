import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Element,
  Text,
  ListAction,
  IconButton,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { BranchProps } from './types';

export const BranchListItem = ({
  branch,
  branchUrl,
  selected,
  isBeingRemoved,
  onContextMenu,
  lastAccessed,
}: BranchProps) => {
  const { name: branchName, project } = branch;
  const { repository } = project;

  const pullRequest =
    branchName !== repository.defaultBranch &&
    'pullRequests' in branch &&
    branch.pullRequests.length > 0
      ? branch.pullRequests[0]
      : null;

  return (
    <ListAction
      align="center"
      css={css({
        paddingX: 0,
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        overflow: 'hidden',
        backgroundColor:
          selected && !isBeingRemoved ? 'purpleOpaque' : 'transparent',
        color: selected && !isBeingRemoved ? 'white' : 'inherit',
        transition: 'background ease-in-out, opacity ease-in-out',
        opacity: isBeingRemoved ? 0.5 : 1,
        pointerEvents: isBeingRemoved ? 'none' : 'all',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor:
            selected && !isBeingRemoved
              ? 'purpleOpaque'
              : 'list.hoverBackground',
        },
        ':has(button:hover)': {
          backgroundColor: 'transparent',
        },
      })}
    >
      <Element
        as="a"
        css={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
        }}
        href={isBeingRemoved ? undefined : branchUrl}
        onContextMenu={onContextMenu}
      >
        <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
          <Column
            span={[10, 5, 4]}
            css={{
              display: 'block',
              overflow: 'hidden',
              paddingBottom: 4,
              paddingTop: 4,
            }}
          >
            <Stack gap={2} align="center" paddingLeft={4}>
              {pullRequest ? (
                <Icon color="#E5E5E5" name="github" size={16} />
              ) : (
                <Icon name="branch" color="#E5E5E5" size={16} />
              )}

              <Element css={{ overflow: 'hidden' }}>
                <Text
                  size={3}
                  weight="medium"
                  maxWidth="100%"
                  css={{ color: '#E5E5E5' }}
                >
                  {branchName}
                </Text>
              </Element>
            </Stack>
          </Column>
          <Column span={[0, 5, 5]} as={Stack} align="center">
            {pullRequest && (
              <Text size={13} color="#E5E5E5" truncate>
                #{pullRequest.number} - {pullRequest.title}
              </Text>
            )}
          </Column>
          <Column span={[0, 2, 3]} as={Stack} align="center">
            <Text size={3} variant="muted" maxWidth="100%">
              {lastAccessed}
            </Text>
          </Column>
        </Grid>
        <IconButton
          variant="square"
          name="more"
          size={14}
          title="Branch actions"
          onClick={evt => {
            evt.stopPropagation();
            onContextMenu(evt);
          }}
        />
      </Element>
    </ListAction>
  );
};
