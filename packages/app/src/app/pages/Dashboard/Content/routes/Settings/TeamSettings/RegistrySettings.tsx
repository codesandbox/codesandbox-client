import React, { useEffect } from 'react';
import { Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { useActions, useAppState } from 'app/overmind';
import { SubscriptionType } from 'app/graphql/types';
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

  let alert: {
    message: string;
    cta?: {
      label: string;
      href: string;
    };
  } | null = null;

  if (state.activeTeamInfo?.subscription?.type !== SubscriptionType.TeamPro) {
    alert = {
      message: 'You need a Team Pro subscription to set a custom npm registry.',
      cta: { label: 'Upgrade to Pro', href: '/pro' },
    };
  } else if (state.activeWorkspaceAuthorization !== 'ADMIN') {
    alert = {
      message: 'Please contact your admin to set a custom npm registry.',
    };
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack direction="vertical" gap={6}>
      {alert && <Alert message={alert.message} cta={alert.cta} />}
      <Stack
        css={css({
          backgroundColor: 'grays.900',
          paddingY: 8,
          paddingX: 11,
          border: '1px solid',
          borderColor: 'grays.500',
          borderRadius: 'medium',
          position: 'relative',
        })}
      >
        {alert && (
          <div
            id="disabled-overlay"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              pointerEvents: 'none',
            }}
          />
        )}
        {!resetting && (
          <RegistryForm
            onCancel={() => {
              resetForm();
            }}
            onSubmit={onSubmit}
            isSubmitting={submitting}
            registry={state.dashboard.workspaceSettings.npmRegistry}
            disabled={Boolean(alert)}
          />
        )}
      </Stack>

      {!alert && (
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
      )}
    </Stack>
  );
};
