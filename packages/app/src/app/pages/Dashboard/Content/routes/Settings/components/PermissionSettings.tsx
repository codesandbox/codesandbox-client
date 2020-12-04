import React from 'react';
import { useOvermind } from 'app/overmind';
import {
  Button,
  Grid,
  Column,
  Stack,
  Text,
  Icon,
  Select,
  Switch,
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { TeamMemberAuthorization } from 'app/graphql/types';

export const PermissionSettings = () => {
  const {
    state: {
      activeTeamInfo: { joinedPilotAt },
    },
  } = useOvermind();

  return (
    <Grid columnGap={12}>
      <Column span={[12, 12, 6]}>
        <MinimumPrivacy />
      </Column>
      {joinedPilotAt && (
        <Column span={[12, 12, 6]}>
          <SandboxSecurity />
        </Column>
      )}
    </Grid>
  );
};

const privacyOptions = {
  0: {
    description: 'All your sandboxes are public by default.',
    icon: () => <Icon size={10} name="globe" />,
  },
  1: {
    description: 'Only people with a private link are able to see a Sandbox.',
    icon: () => <Icon size={10} name="link" />,
  },
  2: {
    description: 'Only people you share a Sandbox with, can see it.',
    icon: () => <Icon size={10} name="lock" />,
  },
};

const MinimumPrivacy = () => {
  const {
    state: { activeTeamInfo, user, personalWorkspaceId },
    actions: {
      dashboard: { setTeamMinimumPrivacy },
    },
  } = useOvermind();

  const isTeamPro = activeTeamInfo.joinedPilotAt;
  const isPersonalPro =
    activeTeamInfo.id === personalWorkspaceId &&
    user &&
    Boolean(user.subscription);

  const hasFeature = isTeamPro || isPersonalPro;

  const [minimumPrivacy, setMinimumPrivacy] = React.useState(
    activeTeamInfo.settings.minimumPrivacy
  );

  const [updateDrafts, setUpdateDrafts] = React.useState(false);

  React.useEffect(
    function resetOnWorkspaceChange() {
      setMinimumPrivacy(activeTeamInfo.settings.minimumPrivacy);
      setUpdateDrafts(false);
    },
    [activeTeamInfo.id, activeTeamInfo.settings.minimumPrivacy]
  );

  return (
    <Stack
      direction="vertical"
      justify="space-between"
      gap={114}
      css={css({
        backgroundColor: 'grays.800',
        paddingY: 8,
        paddingX: 6,
        border: '1px solid',
        borderColor: 'grays.500',
        borderRadius: 'medium',
      })}
    >
      <Stack
        direction="vertical"
        gap={8}
        css={{ opacity: hasFeature ? 1 : 0.4 }}
      >
        <Stack direction="vertical" gap={8}>
          <Stack justify="space-between">
            <Text size={4} weight="bold">
              Default Privacy
            </Text>
            {!hasFeature && (
              <Tooltip
                label={`Upgrade to ${
                  activeTeamInfo.id === personalWorkspaceId
                    ? 'Pro'
                    : 'Pro Workspaces'
                } to change default privacy settings to hide your drafts.`}
              >
                <Stack gap={1} align="center">
                  <Text
                    size={3}
                    weight="bold"
                    css={css({
                      color:
                        activeTeamInfo.id === personalWorkspaceId
                          ? 'white'
                          : 'purple',
                    })}
                  >
                    Pro
                  </Text>
                  <Text size={3} weight="bold">
                    {activeTeamInfo.id !== personalWorkspaceId && 'Workspace'}
                  </Text>
                  <Icon name="info" size={12} />
                </Stack>
              </Tooltip>
            )}
          </Stack>

          <Stack direction="vertical" gap={3}>
            <Select
              disabled={!hasFeature}
              icon={privacyOptions[minimumPrivacy].icon}
              value={minimumPrivacy}
              onChange={({ target: { value } }) =>
                setMinimumPrivacy(parseInt(value, 10))
              }
            >
              <option value={0}>Public</option>
              <option value={1}>Unlisted</option>
              <option value={2}>Private</option>
            </Select>
            <Text variant="muted" size={2}>
              {privacyOptions[minimumPrivacy].description}
            </Text>
          </Stack>
          <Stack justify="space-between" as="label">
            <Text size={3}>
              Apply this privacy to all my Drafts - old and new
            </Text>
            <Switch
              on={updateDrafts}
              disabled={!hasFeature}
              onChange={() => setUpdateDrafts(!updateDrafts)}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end">
        <Button
          autoWidth
          disabled={!hasFeature}
          onClick={async () => {
            await setTeamMinimumPrivacy({
              teamId: activeTeamInfo.id,
              minimumPrivacy,
              updateDrafts,
              source: 'Dashboard',
            });
          }}
        >
          Change Privacy
        </Button>
      </Stack>
    </Stack>
  );
};

const SandboxSecurity = () => {
  const {
    state: {
      activeTeamInfo: { settings },
    },
    actions: {
      dashboard: {
        setWorkspaceSandboxSettings,
        setDefaultTeamMemberAuthorization,
      },
    },
  } = useOvermind();

  const [preventSandboxExport, setPreventSandboxExport] = React.useState(
    settings.preventSandboxExport
  );
  const [preventSandboxLeaving, setPreventSandboxLeaving] = React.useState(
    settings.preventSandboxLeaving
  );

  const [defaultAuthorization, setDefaultAuthorization] = React.useState(
    settings.defaultAuthorization
  );

  React.useEffect(
    function resetOnWorkspaceChange() {
      setPreventSandboxLeaving(settings.preventSandboxLeaving);
      setPreventSandboxExport(settings.preventSandboxExport);
      setDefaultAuthorization(settings.defaultAuthorization);
    },
    [
      settings.preventSandboxLeaving,
      settings.preventSandboxExport,
      settings.defaultAuthorization,
    ]
  );

  const permissionMap = { ADMIN: 'Admin', WRITE: 'Editor', READ: 'Viewer' };

  const onSubmit = () => {
    setWorkspaceSandboxSettings({
      preventSandboxLeaving,
      preventSandboxExport,
    });
    setDefaultTeamMemberAuthorization({ defaultAuthorization });
  };

  return (
    <Stack
      direction="vertical"
      justify="space-between"
      gap={114}
      css={css({
        backgroundColor: 'grays.800',
        paddingY: 8,
        paddingX: 6,
        border: '1px solid',
        borderColor: 'grays.500',
        borderRadius: 'medium',
      })}
    >
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={8}>
          <Stack justify="space-between">
            <Text size={4} weight="bold">
              Sandbox Security
            </Text>
          </Stack>

          <Stack as="label" justify="space-between" align="center">
            <Text size={3}>
              Disable forking and moving sandboxes outside of the workspace
            </Text>
            <Switch
              on={preventSandboxLeaving}
              onChange={() => setPreventSandboxLeaving(!preventSandboxLeaving)}
            />
          </Stack>
          <Stack as="label" justify="space-between" align="center">
            <Text size={3}>Disable exporting sandboxes as .zip</Text>
            <Switch
              on={preventSandboxExport}
              onChange={() => setPreventSandboxExport(!preventSandboxExport)}
            />
          </Stack>
          <Stack justify="space-between" align="center">
            <Text size={3}>Default new member role</Text>
            <Select
              css={{ width: 120 }}
              value={defaultAuthorization}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setDefaultAuthorization(
                  event.target.value as TeamMemberAuthorization
                )
              }
            >
              <option value="WRITE">{permissionMap.WRITE}</option>
              <option value="READ">{permissionMap.READ}</option>
              <option value="ADMIN">{permissionMap.ADMIN}</option>
            </Select>
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end">
        <Button autoWidth onClick={onSubmit}>
          Change Settings
        </Button>
      </Stack>
    </Stack>
  );
};
