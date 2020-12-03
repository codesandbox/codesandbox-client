import {
  Collapsible,
  Link,
  Select,
  Stack,
  Text,
  Label,
  Switch,
  ListAction,
} from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { GlobeIcon } from './icons';

export const Permissions: FunctionComponent = () => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
      editor: { setPreventSandboxLeaving, setPreventSandboxExport },
    },
    state: {
      editor: { currentSandbox },
      user,
      activeTeamInfo,
      activeWorkspaceAuthorization,
    },
  } = useOvermind();

  const isPaidUser = user?.subscription;
  const isTeamPro = activeTeamInfo.joinedPilotAt;

  const togglePreventSandboxLeaving = () => {
    setPreventSandboxLeaving(!currentSandbox.preventLeavingWorkspace);
  };
  const togglePreventExport = () => {
    setPreventSandboxExport(!currentSandbox.preventExport);
  };

  return (
    <Collapsible defaultOpen title="Permissions">
      <Stack direction="vertical" gap={3}>
        <Stack css={css({ paddingX: 2 })} direction="vertical" gap={4}>
          <Select
            disabled={!isPaidUser}
            icon={GlobeIcon}
            onChange={({ target: { value } }) =>
              sandboxPrivacyChanged({
                privacy: Number(value) as 0 | 1 | 2,
                source: 'sidebar',
              })
            }
            value={currentSandbox.privacy}
          >
            <option value={0}>Public</option>
            <option value={1}>Unlisted (only available by url)</option>
            <option value={2}>Private</option>
          </Select>

          {!isPaidUser ? (
            <Text variant="muted" size={2}>
              You can change privacy of a sandbox as a Pro.{' '}
              <Link
                href="/pro"
                css={{ textDecoration: 'underline !important' }}
              >
                Become a Pro
              </Link>
            </Text>
          ) : null}
        </Stack>
        {isTeamPro && activeWorkspaceAuthorization === 'ADMIN' && (
          <Stack direction="vertical">
            <ListAction
              justify="space-between"
              onClick={togglePreventSandboxLeaving}
            >
              <Label htmlFor="frozen">Disable forking</Label>
              <Switch
                on={currentSandbox.preventLeavingWorkspace}
                onChange={togglePreventSandboxLeaving}
              />
            </ListAction>
            <ListAction justify="space-between" onClick={togglePreventExport}>
              <Label htmlFor="frozen">Disable export</Label>
              <Switch
                on={currentSandbox.preventExport}
                onChange={togglePreventExport}
              />
            </ListAction>
          </Stack>
        )}
      </Stack>
    </Collapsible>
  );
};
