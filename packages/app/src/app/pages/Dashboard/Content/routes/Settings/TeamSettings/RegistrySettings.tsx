import React, { useEffect } from 'react';
import { Text, Button, MessageStripe, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Link } from 'react-router-dom';

import { useActions, useAppState } from 'app/overmind';
import { useSubscription } from 'app/hooks/useSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { CreateRegistryParams, RegistryForm } from './RegistryForm';
import { Alert } from '../components/Alert';

export const RegistrySettings = () => {
  const actions = useActions();
  const state = useAppState();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

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
  }, [setLoading, actions.dashboard, state.activeTeam]);

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

  const { hasActiveSubscription } = useSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  if (loading) return null;

  return (
    <Stack direction="vertical" gap={6}>
      {hasActiveSubscription ? null : (
        <MessageStripe justify="space-between">
          <span>
            You need a <Text weight="bold">Team Pro subscription</Text> to set a
            custom npm Registry.
          </span>
          {isTeamAdmin ? (
            <MessageStripe.Action as={Link} to="/pro">
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
      )}

      {hasActiveSubscription && !isTeamAdmin ? (
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
          opacity: !hasActiveSubscription || !isTeamAdmin ? 0.4 : 1,
          pointerEvents:
            !hasActiveSubscription || !isTeamAdmin ? 'none' : 'all',
        })}
      >
        {!resetting && (
          <RegistryForm
            onCancel={() => {
              resetForm();
            }}
            onSubmit={onSubmit}
            isSubmitting={submitting}
            registry={state.dashboard.workspaceSettings.npmRegistry}
            disabled={!hasActiveSubscription || !isTeamAdmin}
          />
        )}
      </Stack>

      {hasActiveSubscription && isTeamAdmin ? (
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
