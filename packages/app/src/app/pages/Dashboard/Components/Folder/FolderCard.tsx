import React from 'react';
import { Stack, Text, Input, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { FolderItemComponentProps } from './types';

export const FolderCard: React.FC<FolderItemComponentProps> = ({
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
  thumbnailRef,
  opacity,
  ...props
}) => (
  <Stack
    direction="vertical"
    gap={2}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      width: '100%',
      height: 240,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderRadius: 'medium',
      overflow: 'hidden',
      // drop ssarget
      borderColor: getBorderColor(selected, showDropStyles),
      transition: 'box-shadow ease-in-out',
      transitionDuration: theme => theme.speeds[4],
      boxShadow: theme =>
        showDropStyles ? '0 4px 16px 0 ' + theme.colors.grays[900] : null,

      // drag state,
      opacity,

      ':hover, :focus, :focus-within': {
        boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
      },
    })}
  >
    <Stack
      as="div"
      justify="center"
      align="center"
      ref={thumbnailRef}
      css={css({
        height: 160,
        borderStyle: 'solid',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'grays.500',
        backgroundColor: 'grays.600',
      })}
    >
      <svg width={56} height={49} fill="none" viewBox="0 0 56 49">
        <path
          fill="#6CC7F6"
          d="M20.721 0H1.591A1.59 1.59 0 000 1.59v45.82C0 48.287.712 49 1.59 49h52.82A1.59 1.59 0 0056 47.41V7.607a1.59 1.59 0 00-1.59-1.59H28L21.788.41A1.59 1.59 0 0020.72 0z"
        />
      </svg>
    </Stack>
    <Stack
      justify="space-between"
      align="center"
      marginLeft={4}
      css={{ minHeight: 26 }}
    >
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
      {!isNewFolder ? (
        <IconButton
          name="more"
          size={9}
          title="Folder actions"
          onClick={onContextMenu}
        />
      ) : null}
    </Stack>
    {!isNewFolder ? (
      <Stack marginLeft={4}>
        <Text size={3} block variant="muted">
          {numberOfSandboxes || 0}{' '}
          {numberOfSandboxes === 1 ? 'sandbox' : 'sandboxes'}
        </Text>
      </Stack>
    ) : null}
  </Stack>
);

const getBorderColor = (selected: boolean, showDropStyles: boolean) => {
  if (selected) return 'blues.600';
  if (showDropStyles) return 'grays.400';
  return 'grays.500';
};
