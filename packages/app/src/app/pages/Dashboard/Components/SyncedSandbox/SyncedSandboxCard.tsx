import React from 'react';
import { Stack, Text, Icon, InteractiveOverlay } from '@codesandbox/components';
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
            <Text color="#999" size={12} truncate css={{ height: '16px' }}>
              {props.owner}
            </Text>
            <Stack gap={2}>
              <Icon name="github" size={16} title="Synced sandbox" />
              <InteractiveOverlay.Item>
                <Link
                  to={url}
                  style={{
                    display: 'flex',
                    overflow: 'hidden',
                    textDecoration: 'none',
                  }}
                >
                  <Text weight="medium" size={13} truncate color="#E5E5E5">
                    {name}
                  </Text>
                </Link>
              </InteractiveOverlay.Item>
            </Stack>
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
