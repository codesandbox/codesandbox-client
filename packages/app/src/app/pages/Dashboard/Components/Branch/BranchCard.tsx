import React from 'react';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  InteractiveOverlay,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { BranchProps } from './types';
import { StyledCard } from '../shared/StyledCard';

export const BranchCard: React.FC<BranchProps> = ({
  branch,
  branchUrl,
  isBeingRemoved,
  selected,
  onContextMenu,
  showRepo,
  lastAccessed,
  ...props
}) => {
  const { name: branchName, project, contribution } = branch;
  const { repository } = project;
  const ariaLabel = `Open branch ${branchName} from ${repository.name} by ${repository.owner} in the editor`;

  return (
    <InteractiveOverlay>
      <StyledCard dimmed={isBeingRemoved}>
        <Stack
          css={{ height: '100%' }}
          direction="vertical"
          justify="space-between"
        >
          <Stack justify="space-between">
            <Stack direction="vertical" gap={1} css={{ overflow: 'hidden' }}>
              {showRepo && (
                <Text color="#999" size={12} truncate css={{ height: '16px' }}>
                  {repository.owner}/{repository.name}
                </Text>
              )}

              <Stack gap={2}>
                {contribution ? (
                  <Icon color="#EDFFA5" name="contribution" size={16} />
                ) : (
                  <Icon color="#999999" name="branch" size={16} />
                )}
                <InteractiveOverlay.Anchor
                  href={isBeingRemoved ? undefined : branchUrl}
                  aria-label={ariaLabel}
                  onContextMenu={onContextMenu}
                  css={{ overflow: 'hidden' }}
                  radius={4}
                  {...props}
                >
                  <Text color="#E5E5E5" weight="medium" size={13} truncate>
                    {branchName}
                  </Text>
                </InteractiveOverlay.Anchor>
              </Stack>
            </Stack>
            <Stack css={{ height: '16px' }} align="center">
              <IconButton
                css={{
                  marginRight: '-4px',
                }} /* Align icon to top-right corner */
                variant="square"
                name="more"
                size={16}
                title="Branch actions"
                onClick={evt => {
                  evt.stopPropagation();
                  onContextMenu(evt);
                }}
              />
            </Stack>
          </Stack>
          {lastAccessed && (
            <Text size={12} variant="muted">
              {shortDistance(lastAccessed)}
            </Text>
          )}
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
