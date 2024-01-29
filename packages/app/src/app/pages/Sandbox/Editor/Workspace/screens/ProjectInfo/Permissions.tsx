import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  Collapsible,
  Select,
  Stack,
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
    workspace: { sandboxPrivacyChanged },
    editor: { setPreventSandboxLeaving, setPreventSandboxExport },
  } = useActions();
  const {
    editor: { currentSandbox },
    activeTeam,
    activeTeamInfo,
    activeWorkspaceAuthorization,
  } = useAppState();

  const isPaidUser = activeTeamInfo?.subscription;

  // if this user is not part of this workspace,
  // they should not see permissions at all
  const isActiveTeam = currentSandbox.team?.id === activeTeam;
  const sandoxPermissionsVisible = isActiveTeam && activeTeamInfo?.subscription;

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
        </Stack>
        {sandoxPermissionsVisible ? (
          <Stack direction="vertical">
            <ListAction
              justify="space-between"
              disabled={activeWorkspaceAuthorization !== 'ADMIN'}
            >
              <Label
                htmlFor="preventLeaving"
                css={css({ flexGrow: 1, height: 8, lineHeight: '32px' })}
              >
                Prevent Leaving Workspace
              </Label>
              <Switch
                id="preventLeaving"
                on={currentSandbox.permissions.preventSandboxLeaving}
                onChange={togglePreventSandboxLeaving}
                disabled={activeWorkspaceAuthorization !== 'ADMIN'}
              />
            </ListAction>
            <ListAction
              justify="space-between"
              disabled={activeWorkspaceAuthorization !== 'ADMIN'}
            >
              <Label
                htmlFor="preventExport"
                css={css({ flexGrow: 1, height: 8, lineHeight: '32px' })}
              >
                Disable export
              </Label>
              <Switch
                id="preventExport"
                on={currentSandbox.permissions.preventSandboxExport}
                onChange={togglePreventSandboxExport}
                disabled={activeWorkspaceAuthorization !== 'ADMIN'}
              />
            </ListAction>
          </Stack>
        ) : null}
      </Stack>
    </Collapsible>
  );
};
