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
    onDoubleClick={editing ? undefined : onDoubleClick}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      width: '100%',
      height: 240,
      backgroundColor: 'grays.700',
      border: 'transparent',
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
      justify="right"
      paddingTop={5}
      paddingX={5}
      css={{ position: 'absolute', width: '100%' }}
    >
      {!isNewFolder ? (
        <IconButton
          name="more"
          size={9}
          title="Folder actions"
          onClick={onContextMenu}
        />
      ) : null}
    </Stack>

    <Stack
      justify="center"
      align="center"
      direction="vertical"
      gap={1}
      css={{ flexGrow: 1, textAlign: 'center' }}
    >
      <Stack paddingBottom={4} aria-hidden="true">
        <svg width={28} height={25} fill="none" viewBox="0 0 28 25">
          <path
            d="M10.4905 0.827509V1.26154V1.26187V1.5C10.4903 1.5 10.4902 1.5 10.49 1.5L10.4905 0.827509ZM10.4905 0.827509V0.5M10.4905 0.827509V0.5M10.4905 0.5C10.6805 0.499842 10.8639 0.571406 11.0049 0.700817L10.4905 0.5ZM13.3242 4.18416L13.6109 4.4471H14H26.5V23.5H1.5V1.5H10.3969L13.3242 4.18416ZM1.26645 1.5H1.26709C1.26688 1.5 1.26666 1.5 1.26645 1.5ZM10.3293 1.43802C10.3291 1.4379 10.329 1.43779 10.3289 1.43768L10.3291 1.43787L10.3293 1.43802Z"
            stroke="#00B2FF"
            strokeWidth="2"
          />
        </svg>
      </Stack>

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
        <Text size={4} css={{ minHeight: 26 }}>
          {name}
        </Text>
      )}
      {!isNewFolder ? (
        <Stack>
          <Text size={3} block variant="muted">
            {numberOfSandboxes || 0}{' '}
            {numberOfSandboxes === 1 ? 'sandbox' : 'sandboxes'}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  </Stack>
);

const getBorderColor = (selected: boolean, showDropStyles: boolean) => {
  if (selected) return 'blues.600';
  if (showDropStyles) return 'grays.400';
  return 'grays.500';
};
