import React from 'react';
import {
  Stack,
  Text,
  Input,
  Icon,
  IconButton,
  InteractiveOverlay,
} from '@codesandbox/components';
import { FolderItemComponentProps } from './types';
import { StyledCard } from '../shared/StyledCard';

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
  isDragging,
  newName,
  onChange,
  onInputKeyDown,
  onSubmit,
  onInputBlur,
  // drop target
  showDropStyles,
  // drag preview
  thumbnailRef,

  'data-selection-id': dataSelectionId,
  ...props
}) => (
  <InteractiveOverlay>
    <StyledCard
      data-selection-id={dataSelectionId}
      dimmed={isDragging}
      selected={selected || showDropStyles}
    >
      <Stack justify="space-between">
        <Icon size={20} name="folder" color="#E3FF73" />
        {!isNewFolder ? (
          <IconButton
            css={{
              marginRight: '-4px',
              marginTop: '-4px',
            }} /* Align icon to top-right corner */
            variant="square"
            name="more"
            size={16}
            title="Repository actions"
            onClick={onContextMenu}
          />
        ) : null}
      </Stack>

      <Stack gap={1} direction="vertical">
        {editing ? (
          <form onSubmit={onSubmit}>
            <Input
              css={{
                marginLeft: '-9px',
                marginBottom: '-5px',
                fontWeight: 500,
                color: '#e5e5e5',
              }}
              autoFocus
              required
              value={newName}
              onChange={onChange}
              onKeyDown={onInputKeyDown}
              onBlur={onInputBlur}
            />
          </form>
        ) : (
          <InteractiveOverlay.Button
            radius={4}
            onClick={onClick}
            onDoubleClick={editing ? undefined : onDoubleClick}
            onContextMenu={onContextMenu}
            {...props}
          >
            <Text size={13} weight="medium" color="#e5e5e5">
              {name}
            </Text>
          </InteractiveOverlay.Button>
        )}
        {!isNewFolder ? (
          <Text size={12} variant="muted">
            {numberOfSandboxes || 0}{' '}
            {numberOfSandboxes === 1 ? 'item' : 'items'}
          </Text>
        ) : null}
      </Stack>
    </StyledCard>
  </InteractiveOverlay>
);
