import React, { useEffect, useState } from 'react';
import css from '@styled-system/css';
import { Stack, Text, Link, Icon } from '@codesandbox/components';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { Card } from '.';

export const ProcessingPayment = () => {
  const {
    getActiveTeamInfo,
    dashboard: { getTeams },
  } = useActions();
  const effects = useEffects();
  const { activeTeam, hasLoadedApp } = useAppState();
  const [loading, setLoading] = useState('...');

  useEffect(() => {
    if (!hasLoadedApp) return;

    try {
      effects.gql.subscriptions.onSubscriptionChanged(
        { teamId: activeTeam },
        data => {
          if (data.teamEvents.subscription.active) {
            getActiveTeamInfo();
            getTeams();
          }
        }
      );
    } catch {
      effects.notificationToast.error(
        'Something went wrong, please try again later or email us at support@codesandbox.io'
      );
    }

    return () => {
      effects.gql.subscriptions.onSubscriptionChanged.dispose();
    };
  }, [getActiveTeamInfo, getTeams, hasLoadedApp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(prev => {
        if (prev.length === 3) {
          return '';
        }

        return prev + '.';
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Card>
      <Stack direction="vertical" gap={2}>
        <Text size={4} weight="bold" maxWidth="100%">
          Processing payment{loading}
        </Text>

        <Text size={3} variant="muted">
          Your payment is being processed and as soon as it&apos;s approved,
          your subscription will be activated.
        </Text>

        <Stack direction="vertical" gap={2} marginTop={4}>
          <Link
            size={3}
            variant="active"
            css={css({ fontWeight: 'medium' })}
            onClick={() => window.location.reload()}
          >
            <Stack align="center">
              <Icon name="reload" style={{ marginRight: '.5em' }} />
              Refresh page
            </Stack>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
};
