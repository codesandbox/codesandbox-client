import React from 'react';
import {
  Stack,
  ListAction,
  Text,
  IconButton,
  Grid,
  Column,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { ListIcon } from './Icons';

export const RepoListItem = ({
  name,
  path,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  ...props
}) => (
  <ListAction
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      paddingX: 0,
      backgroundColor: selected ? 'blues.600' : 'inherit',
      color: selected ? 'white' : 'inherit',
      width: '100%',
      height: 64,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
      ':hover, :focus, :focus-within': {
        cursor: 'default',
        backgroundColor: selected ? 'blues.600' : 'list.hoverBackground',
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
              {name}
              {props.branch !== 'master' ? `:${props.branch}` : ''}
            </Text>
          </Stack>
        </Stack>
      </Column>
      <Column span={[0, 4, 4]} as={Stack} align="center">
        <Text size={3} weight="medium" variant="muted">
          {props.owner}
        </Text>
      </Column>
      <Column span={[0, 3, 3]} as={Stack} align="center">
        {/* empty column to align with sandbox list items */}
      </Column>
    </Grid>
    <IconButton
      name="more"
      size={9}
      title="Repository actions"
      onClick={onContextMenu}
    />
  </ListAction>
);
