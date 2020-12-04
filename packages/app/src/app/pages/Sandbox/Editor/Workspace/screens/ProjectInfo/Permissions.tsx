import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import {
  Collapsible,
  Link,
  Select,
  Stack,
  Text,
  Label,
  Switch,
  ListAction,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';

const icons = {
  0: () => <Icon size={10} name="globe" />,
  1: () => <Icon size={10} name="link" />,
  2: () => <Icon size={10} name="lock" />,
};

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
    setPreventSandboxLeaving(!currentSandbox.permissions.preventSandboxLeaving);
  };
  const togglePreventSandboxExport = () => {
    setPreventSandboxExport(!currentSandbox.permissions.preventSandboxExport);
  };

  return (
    <Collapsible defaultOpen title="Permissions">
      <Stack direction="vertical" gap={3}>
        <Stack css={css({ paddingX: 2 })} direction="vertical" gap={4}>
          <Select
            disabled={!isPaidUser}
            icon={icons[currentSandbox.privacy]}
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
              <Label htmlFor="frozen">Prevent Leaving Workspace</Label>
              <Switch
                on={currentSandbox.permissions.preventSandboxLeaving}
                onChange={togglePreventSandboxLeaving}
              />
            </ListAction>
            <ListAction
              justify="space-between"
              onClick={togglePreventSandboxExport}
            >
              <Label htmlFor="frozen">Disable export</Label>
              <Switch
                on={currentSandbox.permissions.preventSandboxExport}
                onChange={togglePreventSandboxExport}
              />
            </ListAction>
          </Stack>
        )}
      </Stack>
    </Collapsible>
  );
};
