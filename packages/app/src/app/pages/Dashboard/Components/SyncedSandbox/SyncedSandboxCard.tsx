import React from 'react';
import {
  Stack,
  Text,
  Icon,
  InteractiveOverlay,
  Badge,
} from '@codesandbox/components';
import { noop } from 'overmind';
import { Link } from 'react-router-dom';
import { StyledCard } from '../shared/StyledCard';

export const SyncedSandboxCard = ({ name, path, url, ...props }) => {
  return (
    <InteractiveOverlay>
      <StyledCard>
        <Stack
          direction="vertical"
          justify="space-between"
          css={{ height: '100%' }}
        >
          <Stack direction="vertical" gap={1}>
            <Text
              css={{
                color: '#808080',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              size={12}
            >
              {props.owner}
            </Text>
            <Stack gap={2}>
              <Icon name="github" size={16} title="Synced sandbox" />
              <InteractiveOverlay.Item as={Link} to={url} onContextMenu={noop}>
                <Text
                  weight="medium"
                  size={13}
                  css={{
                    color: '#E5E5E5',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {name}
                </Text>
              </InteractiveOverlay.Item>
            </Stack>
          </Stack>
          <Stack justify="flex-end">
            <Badge>Synced</Badge>
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
