import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Icon,
  IconButton,
  Stack,
  Text,
  Badge,
  InteractiveOverlay,
} from '@codesandbox/components';
import { RepositoryProps } from './types';

export const RepositoryCard: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  isBeingRemoved,
  restricted,
  ...props
}) => {
  return (
    <InteractiveOverlay>
      <Card
        css={{
          opacity: isBeingRemoved ? 0.5 : 1,
          pointerEvents: isBeingRemoved ? 'none' : 'all',
          transition: 'background ease-in-out, opacity ease-in-out',
          transitionDuration: '75ms',
          ':hover': {
            backgroundColor: '#252525',
          },
          ':has(button:hover)': {
            backgroundColor: '#1D1D1D',
          },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
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
              css={{
                marginRight: '-4px',
                zIndex: 1,
              }} /* Align icon to top-right corner */
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
          <InteractiveOverlay.Item
            as={Link}
            to={isBeingRemoved ? undefined : repository.url}
            onContextMenu={onContextMenu}
            {...props}
          >
            <Text
              color={restricted ? '#999' : '#e5e5e5'}
              size={13}
              weight="500"
            >
              {repository.name}
            </Text>
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

          {restricted ? <Badge variant="trial">Restricted</Badge> : null}
        </Stack>
      </Card>
    </InteractiveOverlay>
  );
};
