import React from 'react';
import {
  Stack,
  Text,
  Input,
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
  ...props
}) => (
  <InteractiveOverlay>
    <StyledCard css={{ height: 154 }} dimmed={isDragging} selected={selected}>
      <Stack justify="space-between">
        <svg width={16} height={16} fill="none" viewBox="0 0 32 32">
          <path
            d="M11.1537 5.63921L11.4196 5.21576L11.1537 5.63921ZM15.5117 8.37552L15.2458 8.79897L15.5117 8.37552ZM6.66602 27.1663H25.3327V26.1663H6.66602V27.1663ZM29.8327 22.6663V12.6817H28.8327V22.6663H29.8327ZM25.3327 8.18173H16.5752V9.18173H25.3327V8.18173ZM15.7776 7.95207L11.4196 5.21576L10.8878 6.06266L15.2458 8.79897L15.7776 7.95207ZM10.0902 4.83301H4.66602V5.83301H10.0902V4.83301ZM2.16602 7.33301V22.6663H3.16602V7.33301H2.16602ZM4.66602 4.83301C3.2853 4.83301 2.16602 5.9523 2.16602 7.33301H3.16602C3.16602 6.50458 3.83759 5.83301 4.66602 5.83301V4.83301ZM11.4196 5.21576C11.0213 4.96567 10.5605 4.83301 10.0902 4.83301V5.83301C10.3724 5.83301 10.6488 5.91261 10.8878 6.06266L11.4196 5.21576ZM16.5752 8.18173C16.293 8.18173 16.0165 8.10213 15.7776 7.95207L15.2458 8.79897C15.6441 9.04906 16.1049 9.18173 16.5752 9.18173V8.18173ZM29.8327 12.6817C29.8327 10.1964 27.818 8.18173 25.3327 8.18173V9.18173C27.2657 9.18173 28.8327 10.7487 28.8327 12.6817H29.8327ZM25.3327 27.1663C27.818 27.1663 29.8327 25.1516 29.8327 22.6663H28.8327C28.8327 24.5993 27.2657 26.1663 25.3327 26.1663V27.1663ZM6.66602 26.1663C4.73302 26.1663 3.16602 24.5993 3.16602 22.6663H2.16602C2.16602 25.1516 4.18073 27.1663 6.66602 27.1663V26.1663Z"
            fill="#E3FF73"
          />
        </svg>
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
            {numberOfSandboxes === 1 ? 'sandbox' : 'sandboxes'}
          </Text>
        ) : null}
      </Stack>
    </StyledCard>
  </InteractiveOverlay>
);
