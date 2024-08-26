import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  InteractiveOverlay,
} from '@codesandbox/components';
import { RepositoryProps } from './types';
import { StyledCard } from '../shared/StyledCard';

export const RepositoryCard: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  isBeingRemoved,
  ...props
}) => {
  return (
    <InteractiveOverlay>
      <StyledCard dimmed={isBeingRemoved}>
        <Stack direction="vertical" gap={1}>
          <Stack
            css={{ height: '16px' }}
            justify="space-between"
            align="center"
          >
            <Text color="#999" size={12}>
              {repository.owner}
            </Text>
            <IconButton
              css={{ marginRight: '-4px' }} /* Align icon to top-right corner */
              variant="square"
              name="more"
              size={16}
              title="Repository actions"
              onClick={evt => {
                evt.stopPropagation();
                onContextMenu(evt);
              }}
            />
          </Stack>
          <InteractiveOverlay.Item radius={4}>
            <Link
              to={isBeingRemoved ? undefined : repository.url}
              onContextMenu={onContextMenu}
              style={{ textDecoration: 'none' }}
              {...props}
            >
              <Text color="#e5e5e5" size={13} weight="500">
                {repository.name}
              </Text>
            </Link>
          </InteractiveOverlay.Item>
        </Stack>

        <Stack justify="space-between" gap={4}>
          <Stack align="center" gap={2}>
            {repository.private ? (
              <Icon color="#999" name="lock" size={12} />
            ) : null}

            <Stack align="center" gap={1}>
              <Icon color="#999" name="branch" />
              <Text color="#999" size={12}>
                {labels.branches}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
