import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Element,
  Badge,
  Text,
  ListAction,
  IconButton,
  Tooltip,
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
  isViewOnly,
}: BranchProps) => {
  const { name: branchName, project, contribution } = branch;
  const { repository } = project;
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
            <Stack gap={4} align="center" marginLeft={2}>
              {contribution ? (
                <Icon
                  color="#EDFFA5"
                  name="contribution"
                  size={16}
                  width="32px"
                />
              ) : (
                <Icon name="branch" color="#999" size={16} width="32px" />
              )}

              <Element css={{ overflow: 'hidden' }}>
                <Tooltip label={branchName}>
                  <Text
                    size={3}
                    weight="medium"
                    maxWidth="100%"
                    css={{ color: isViewOnly ? '#999999' : '#E5E5E5' }}
                  >
                    {branchName}
                  </Text>
                </Tooltip>
              </Element>
            </Stack>
          </Column>
          <Column span={[0, 2, 2]}>
            {isViewOnly ? (
              <Stack align="center">
                <Badge variant="trial">View only</Badge>
              </Stack>
            ) : null}
          </Column>
          <Column span={[0, 5, 6]} as={Stack} align="center">
            <Text size={3} variant="muted" maxWidth="100%">
              {repository.owner}/{repository.name}
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
