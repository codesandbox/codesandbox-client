import React from 'react';
import {
  Stack,
  ListAction,
  Text,
  Input,
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
              })}
            >
              <svg width={32} height={24} fill="none" viewBox="0 0 56 49">
                <path
                  fill="#6CC7F6"
                  d="M20.721 0H1.591A1.59 1.59 0 000 1.59v45.82C0 48.287.712 49 1.59 49h52.82A1.59 1.59 0 0056 47.41V7.607a1.59 1.59 0 00-1.59-1.59H28L21.788.41A1.59 1.59 0 0020.72 0z"
                />
              </svg>
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
        <Column span={[0, 4, 4]} as={Stack} align="center">
          {!isNewFolder ? (
            <Text size={3} block variant={selected ? 'body' : 'muted'}>
              {numberOfSandboxes || 0}{' '}
              {numberOfSandboxes === 1 ? 'sandbox' : 'sandboxes'}
            </Text>
          ) : null}
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
      {!isNewFolder ? (
        <IconButton
          name="more"
          size={9}
          title="Sandbox actions"
          onClick={onContextMenu}
        />
      ) : null}
    </ListAction>
  );
};
