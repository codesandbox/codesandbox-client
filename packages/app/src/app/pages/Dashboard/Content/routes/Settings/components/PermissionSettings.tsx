import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  Button,
  Grid,
  Column,
  Stack,
  Text,
  Icon,
  Select,
  Switch,
  MessageStripe,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { TeamMemberAuthorization } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Alert } from './Alert';

export const PermissionSettings = () => {
  const proTracking = () =>
    track('Dashboard - Permissions panel - Clicked on Pro upgrade');

  const { isFree, isPro } = useWorkspaceSubscription();
  const {
    isTeamSpace,
    isTeamAdmin,
    isPersonalSpace,
  } = useWorkspaceAuthorization();

  return (
    <Stack direction="vertical" gap={6}>
      {isFree ? (
        <MessageStripe justify="space-between">
          <span>
            You need a{' '}
            <Text weight="bold">{isTeamSpace ? 'Team Pro' : 'Pro'}</Text>{' '}
            subscription to change sandbox permissions.
          </span>
          {isTeamAdmin || isPersonalSpace ? (
            <MessageStripe.Action
              as="a"
              href="/pro?utm_source=dashboard_permission_settings"
              onClick={proTracking}
            >
              Upgrade now
            </MessageStripe.Action>
          ) : (
            <MessageStripe.Action
              as="a"
              href="https://codesandbox.io/docs/learn/plan-billing/trials"
              target="_blank"
              rel="noreferrer"
              onClick={proTracking}
            >
              Learn more
            </MessageStripe.Action>
          )}
        </MessageStripe>
      ) : null}

      {isPro && isTeamSpace && !isTeamAdmin ? (
        <Alert message="Please contact your admin to change sandbox permissions." />
      ) : null}

      <Grid columnGap={12}>
        <Column span={[12, 12, 6]}>
          <MinimumPrivacy disabled={isFree || !isTeamAdmin} />
        </Column>
        {!isPersonalSpace && (
          <Column span={[12, 12, 6]}>
            <SandboxSecurity disabled={isFree || !isTeamAdmin} />
          </Column>
        )}
      </Grid>
    </Stack>
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

const MinimumPrivacy = ({ disabled }: { disabled: boolean }) => {
  const { activeTeamInfo } = useAppState();
  const { setTeamMinimumPrivacy } = useActions().dashboard;

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
        padding: 6,
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 'medium',
        opacity: disabled ? 0.4 : 1,
      })}
    >
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={8}>
          <Text size={4} weight="500">
            Default Privacy
          </Text>

          <Stack direction="vertical" gap={3}>
            <Select
              disabled={disabled}
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
              disabled={disabled}
              onChange={() => setUpdateDrafts(!updateDrafts)}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end">
        <Button
          autoWidth
          disabled={disabled}
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

const SandboxSecurity = ({ disabled }: { disabled: boolean }) => {
  const { settings } = useAppState().activeTeamInfo;
  const {
    setWorkspaceSandboxSettings,
    setDefaultTeamMemberAuthorization,
  } = useActions().dashboard;

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
        padding: 6,
        border: '1px solid',
        backgroundColor: '#191919' /* change to tokensV2.gray[600] */,
        borderColor: 'transparent',
        borderRadius: 'medium',
        opacity: disabled ? 0.4 : 1,
      })}
    >
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={8}>
          <Stack justify="space-between">
            <Text size={4} weight="500">
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
              disabled={disabled}
            />
          </Stack>
          <Stack as="label" justify="space-between" align="center">
            <Text size={3}>Disable exporting sandboxes as .zip</Text>
            <Switch
              on={preventSandboxExport}
              onChange={() => setPreventSandboxExport(!preventSandboxExport)}
              disabled={disabled}
            />
          </Stack>
          <Stack justify="space-between" align="center">
            <Text size={3}>Default new member role</Text>
            <Select
              css={{ width: 120 }}
              value={defaultAuthorization}
              onChange={({ target: { value } }) => {
                setDefaultAuthorization(value as TeamMemberAuthorization);
              }}
              disabled={disabled}
            >
              <option value={TeamMemberAuthorization.Write}>Editor</option>
              <option value={TeamMemberAuthorization.Read}>Viewer</option>
              <option value={TeamMemberAuthorization.Admin}>Admin</option>
            </Select>
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end">
        <Button autoWidth onClick={onSubmit} disabled={disabled}>
          Change Settings
        </Button>
      </Stack>
    </Stack>
  );
};
