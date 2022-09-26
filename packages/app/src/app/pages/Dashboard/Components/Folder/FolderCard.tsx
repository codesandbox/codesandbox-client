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
      transition: 'background ease-in-out',
      transitionDuration: theme => theme.speeds[4],
      boxShadow: theme =>
        showDropStyles ? '0 4px 16px 0 ' + theme.colors.grays[900] : null,

      // drag state,
      opacity,

      ':hover, :focus, :focus-within': {
        backgroundColor: 'card.backgroundHover',
      },
      ':focus-visible': {
        boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
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
        <svg width={32} height={32} fill="none" viewBox="0 0 32 32">
          <path
            d="M11.1537 5.63921L11.4196 5.21576L11.1537 5.63921ZM15.5117 8.37552L15.2458 8.79897L15.5117 8.37552ZM6.66602 27.1663H25.3327V26.1663H6.66602V27.1663ZM29.8327 22.6663V12.6817H28.8327V22.6663H29.8327ZM25.3327 8.18173H16.5752V9.18173H25.3327V8.18173ZM15.7776 7.95207L11.4196 5.21576L10.8878 6.06266L15.2458 8.79897L15.7776 7.95207ZM10.0902 4.83301H4.66602V5.83301H10.0902V4.83301ZM2.16602 7.33301V22.6663H3.16602V7.33301H2.16602ZM4.66602 4.83301C3.2853 4.83301 2.16602 5.9523 2.16602 7.33301H3.16602C3.16602 6.50458 3.83759 5.83301 4.66602 5.83301V4.83301ZM11.4196 5.21576C11.0213 4.96567 10.5605 4.83301 10.0902 4.83301V5.83301C10.3724 5.83301 10.6488 5.91261 10.8878 6.06266L11.4196 5.21576ZM16.5752 8.18173C16.293 8.18173 16.0165 8.10213 15.7776 7.95207L15.2458 8.79897C15.6441 9.04906 16.1049 9.18173 16.5752 9.18173V8.18173ZM29.8327 12.6817C29.8327 10.1964 27.818 8.18173 25.3327 8.18173V9.18173C27.2657 9.18173 28.8327 10.7487 28.8327 12.6817H29.8327ZM25.3327 27.1663C27.818 27.1663 29.8327 25.1516 29.8327 22.6663H28.8327C28.8327 24.5993 27.2657 26.1663 25.3327 26.1663V27.1663ZM6.66602 26.1663C4.73302 26.1663 3.16602 24.5993 3.16602 22.6663H2.16602C2.16602 25.1516 4.18073 27.1663 6.66602 27.1663V26.1663Z"
            fill="#E3FF73"
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
  if (selected) return 'purple';
  if (showDropStyles) return 'grays.400';
  return 'grays.500';
};
