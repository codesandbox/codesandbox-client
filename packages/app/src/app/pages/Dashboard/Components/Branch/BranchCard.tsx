import React from 'react';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  Badge,
  InteractiveOverlay,
} from '@codesandbox/components';
import { BranchProps } from './types';
import { StyledCard } from '../shared/StyledCard';

export const BranchCard: React.FC<BranchProps> = ({
  branch,
  branchUrl,
  isBeingRemoved,
  selected,
  onContextMenu,
  restricted,
  showRepo,
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
                <Text
                  css={{
                    color: '#808080',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  size={12}
                >
                  {repository.owner}/{repository.name}
                </Text>
              )}

              <Stack gap={2}>
                {contribution ? (
                  <Icon color="#EDFFA5" name="contribution" size={16} />
                ) : (
                  <Icon color="#999999" name="branch" size={16} />
                )}
                <InteractiveOverlay.Item>
                  <Text
                    as="a"
                    aria-label={ariaLabel}
                    href={isBeingRemoved ? undefined : branchUrl}
                    css={{
                      color: restricted ? '#999999' : '#E5E5E5',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textDecoration: 'none',
                    }}
                    weight="medium"
                    size={13}
                    onContextMenu={onContextMenu}
                    {...props}
                  >
                    {branchName}
                  </Text>
                </InteractiveOverlay.Item>
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
          <Stack justify="space-between" align="center">
            {restricted ? <Badge variant="trial">Restricted</Badge> : null}
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
