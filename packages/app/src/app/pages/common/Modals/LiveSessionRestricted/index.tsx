import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useAppState } from 'app/overmind';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Alert } from '../Common/Alert';

export const LiveSessionRestricted: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();

  return (
    <Alert title="Upgrade to Pro to start a Live Session">
      {isAdmin ? (
        <Stack gap={2} align="center">
          <Button
            variant="primary"
            as="a"
            href={upgradeUrl({
              workspaceId: activeTeam,
              source: 'v1_editor_live_session_restricted',
            })}
            autoWidth
          >
            <Text>Upgrade to Pro</Text>
          </Button>
        </Stack>
      ) : (
        <Stack direction="vertical" gap={6}>
          <Text as="p" variant="muted" css={{ marginTop: 0 }}>
            Live sessions are only available for Pro workspaces. Contact your
            team admin to upgrade.
          </Text>
        </Stack>
      )}
    </Alert>
  );
};
