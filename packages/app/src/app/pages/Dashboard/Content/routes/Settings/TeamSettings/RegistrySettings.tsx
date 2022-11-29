import React, { useEffect } from 'react';
import { Text, Button, MessageStripe, Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { CreateRegistryParams, RegistryForm } from './RegistryForm';
import { Alert } from '../components/Alert';

export const RegistrySettings = () => {
  const actions = useActions();
  const { activeTeam, dashboard } = useAppState();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const { isFree, isPro } = useWorkspaceSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  React.useEffect(() => {
    if (resetting) {
      setResetting(false);
    }
  }, [resetting, setResetting]);

  const resetForm = () => {
    setResetting(true);
  };

  const loadCurrentNpmRegistry = React.useCallback(async () => {
    setLoading(true);

    try {
      await actions.dashboard.fetchCurrentNpmRegistry();
    } finally {
      setLoading(false);
    }
    // We need to add "activeTeam"
    // eslint-disable-next-line
  }, [setLoading, actions.dashboard, activeTeam]);

  useEffect(() => {
    loadCurrentNpmRegistry();
  }, [loadCurrentNpmRegistry]);

  const onSubmit = async (params: CreateRegistryParams) => {
    setSubmitting(true);
    try {
      await actions.dashboard.createOrUpdateCurrentNpmRegistry(params);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <Stack direction="vertical" gap={6}>
      {isFree ? (
        <MessageStripe justify="space-between">
          <span>
            You need a <Text weight="bold">Team Pro</Text> subscription to set a
            custom npm Registry.
          </span>
          {isTeamAdmin ? (
            <MessageStripe.Action as="a" href="/pro">
              Upgrade now
            </MessageStripe.Action>
          ) : (
            <MessageStripe.Action
              as="a"
              href="https://codesandbox.io/docs/learn/plan-billing/trials"
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </MessageStripe.Action>
          )}
        </MessageStripe>
      ) : null}

      {isPro && !isTeamAdmin ? (
        <Alert message="Please contact your admin to set a custom npm registry." />
      ) : null}

      <Stack
        css={css({
          padding: 6,
          border: '1px solid',
          backgroundColor: 'card.background',
          borderColor: 'transparent',
          borderRadius: 'medium',
          position: 'relative',
          opacity: isFree || !isTeamAdmin ? 0.4 : 1,
          pointerEvents: isFree || !isTeamAdmin ? 'none' : 'all',
        })}
      >
        {!resetting && (
          <RegistryForm
            onCancel={() => {
              resetForm();
            }}
            onSubmit={onSubmit}
            isSubmitting={submitting}
            registry={dashboard.workspaceSettings.npmRegistry}
            disabled={isFree || !isTeamAdmin}
          />
        )}
      </Stack>

      {isPro && isTeamAdmin ? (
        <Stack justify="center" align="center">
          <Button
            variant="link"
            onClick={() =>
              actions.dashboard.deleteCurrentNpmRegistry({}).then(() => {
                resetForm();
              })
            }
            css={css({
              maxWidth: 150,
              ':hover:not(:disabled)': {
                color: 'reds.200',
              },
            })}
          >
            Reset Registry
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
};
