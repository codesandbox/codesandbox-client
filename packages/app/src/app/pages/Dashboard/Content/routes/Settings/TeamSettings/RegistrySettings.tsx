import React, { useEffect } from 'react';
import { Button, Stack } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';

import { useActions, useAppState } from 'app/overmind';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';
import { CreateRegistryParams, RegistryForm } from './RegistryForm';
import { Alert } from '../components/Alert';

export const RegistrySettings = () => {
  const actions = useActions();
  const { activeTeam, dashboard } = useAppState();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const { hasActiveSubscription } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const checkout = useGetCheckoutURL({
    team_id:
      (isTeamAdmin || isPersonalSpace) && !hasActiveSubscription
        ? activeTeam
        : undefined,
    success_path: dashboardUrls.registrySettings(activeTeam),
    cancel_path: dashboardUrls.registrySettings(activeTeam),
  });

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

  let alert: {
    message: string;
    cta?: {
      label: string;
      href: string;
    };
  } | null = null;

  if (!hasActiveSubscription && isTeamAdmin) {
    alert = {
      message: 'You need a Team Pro subscription to set a custom npm registry.',
      cta: {
        label: 'Upgrade to Pro',
        href: checkout.state === 'READY' ? checkout.url : '/pro',
      },
    };
  } else if (!isTeamAdmin) {
    alert = {
      message: 'Please contact your admin to set a custom npm registry.',
    };
  }

  if (loading) return null;

  return (
    <Stack direction="vertical" gap={6}>
      {alert && (
        <Alert
          upgrade={!hasActiveSubscription}
          message={alert.message}
          cta={alert.cta}
        />
      )}
      <Stack
        css={css({
          padding: 6,
          border: '1px solid',
          backgroundColor: 'card.background',
          borderColor: 'transparent',
          borderRadius: 'medium',
          position: 'relative',
          opacity: alert ? 0.4 : 1,
          pointerEvents: alert ? 'none' : 'all',
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
