import React from 'react';
import {
  Stack,
  ListAction,
  Text,
  Input,
  Icon,
  IconButton,
  Grid,
  Column,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { FolderItemComponentProps } from './types';

export const FolderListItem = ({
  name,
  path,
  numberOfSandboxes,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  // editing
  editing,
  isNewFolder,
  newName,
  onChange,
  onInputKeyDown,
  onSubmit,
  onInputBlur,
  // drop target
  showDropStyles,
  // drag preview
  // opacity,
  ...props
}: FolderItemComponentProps) => {
  let backgroundColor = 'inherit';
  if (selected) {
    backgroundColor = 'purpleOpaque';
  } else if (showDropStyles) {
    backgroundColor = 'list.hoverBackground';
  }

  return (
    <ListAction
      as="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      {...props}
      css={css({
        paddingX: 0,
        backgroundColor,
        color: selected ? 'white' : 'inherit',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: selected ? 'purpleOpaque' : 'list.hoverBackground',
        },
        ':has(button:hover), :has(button:focus-visible)': {
          backgroundColor: 'transparent',
        },
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
      })}
    >
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
        <Column span={[12, 7, 6]}>
          <Stack gap={4} align="center" marginLeft={2}>
            <Stack
              as="div"
              justify="center"
              align="center"
              css={css({
                height: 32,
              })}
            >
              <Icon
                name="folder"
                size={24}
                width={32}
                title="folder"
                color="#E3FF73"
              />
            </Stack>
            <Stack justify="space-between" align="center">
              {editing ? (
                <form onSubmit={onSubmit}>
                  <Input
                    autoFocus
                    required
                    value={newName}
                    onChange={onChange}
                    onKeyDown={onInputKeyDown}
                    onBlur={onInputBlur}
                  />
                </form>
              ) : (
                <Text size={3} weight="medium">
                  {name}
                </Text>
              )}
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 2, 3]} as={Stack} align="center">
          {!isNewFolder ? (
            <Text size={3} block variant={selected ? 'body' : 'muted'}>
              {numberOfSandboxes || 0}{' '}
              {numberOfSandboxes === 1 ? 'item' : 'items'}
            </Text>
          ) : null}
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
      {!isNewFolder ? (
        <IconButton
          variant="square"
          name="more"
          size={14}
          title="Sandbox actions"
          onClick={onContextMenu}
        />
      ) : null}
    </ListAction>
  );
};
