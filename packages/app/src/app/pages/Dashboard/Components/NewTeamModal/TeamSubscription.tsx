import React from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';

import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { Button, Stack, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  Feature,
  TEAM_FREE_FEATURES,
  TEAM_PRO_FEATURES_WITH_PILLS,
} from 'app/constants';

const StyledTitle = styled(Text)`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.019em;
  margin: 0;
  color: #c2c2c2;
`;

export const TeamSubscription: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { activeTeamInfo } = useAppState();
  const {
    pro: { pageMounted },
  } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  React.useEffect(() => {
    track('New Team - View Team Pro Trial CTA', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const isCheckoutDisabled =
    !isEligibleForTrial || !isTeamAdmin || checkout.status === 'loading';

  if (!activeTeamInfo) {
    return null;
  }

  return (
    <Stack
      css={css({
        width: '100%',
        flex: 1,
      })}
      align="center"
      direction="vertical"
    >
      <Stack
        css={css({
          width: '510px',
          flex: 1,
          paddingBottom: 24,
        })}
        align="center"
        direction="vertical"
        gap={6}
      >
        <Stack direction="vertical" gap={3}>
          <Text
            as="h2"
            css={{
              fontFamily: 'Everett, sans-serif',
              fontWeight: 500,
              fontSize: '32px',
              lineHeight: '42px',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
            size={8}
          >
            {isEligibleForTrial
              ? 'Try Team Pro for free'
              : 'Upgrade to Team Pro'}
          </Text>
        </Stack>
        {isEligibleForTrial && (
          <StyledTitle block>
            14 days free trial. No credit card required.
          </StyledTitle>
        )}
      </Stack>

      <Stack
        css={css({
          width: '510px',
          flex: 1,
        })}
        gap={2}
      >
        <FeatureList
          title="Free Plan"
          features={TEAM_FREE_FEATURES}
          background="#1c1c1c"
          textColor="#c2c2c2"
        />
        <FeatureList
          title="Team Pro"
          features={TEAM_PRO_FEATURES_WITH_PILLS}
          background="white"
          textColor="#0E0E0E"
        />
      </Stack>

      <Stack css={{ width: '100%', padding: 24 }} direction="vertical" gap={4}>
        <Stack direction="vertical" align="center" gap={1}>
          <Button
            css={css({
              height: '32px',
              maxWidth: '370px',
            })}
            onClick={() => {
              if (isCheckoutDisabled) {
                return;
              }

              track('New Team - Start Trial', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createCheckout({
                team_id: activeTeamInfo.id,
                success_path: dashboard.recent(activeTeamInfo.id),
                cancel_path: dashboard.recent(activeTeamInfo.id),
              });
            }}
            loading={checkout.status === 'loading'}
            disabled={isCheckoutDisabled}
            type="button"
          >
            {isEligibleForTrial
              ? 'Start 14 day free trial'
              : 'Proceed to checkout'}
          </Button>
          {checkout.status === 'error' && (
            <Text variant="danger" size={2}>
              {checkout.error}. Please try again.
            </Text>
          )}
        </Stack>
        <Button
          onClick={() => {
            track('New Team - Skip trial', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            onComplete();
          }}
          variant="link"
        >
          Continue with free plan
        </Button>
      </Stack>
    </Stack>
  );
};

const FeatureList = ({
  features,
  background,
  textColor,
  title,
}: {
  features: Feature[];
  background: string;
  textColor: string;
  title: string;
}) => (
  <Stack
    css={css({
      color: textColor,
      width: '100%',
      background,
      borderRadius: '4px',
    })}
    direction="vertical"
    gap={2}
  >
    <Text css={css({ paddingX: 6, paddingTop: 6, fontWeight: 'medium' })}>
      {title}
    </Text>
    <Stack
      as="ul"
      css={css({
        margin: 0,
        padding: 2,
        width: '100%',
        listStyle: 'none',
      })}
      direction="vertical"
      gap={1}
    >
      {features.map(feature => (
        <Stack
          key={feature.key}
          as="li"
          css={css({
            paddingX: 4,
            paddingY: 2,
            width: '100%',
          })}
          align="center"
          justify="space-between"
          gap={3}
        >
          <Text size={3}>{feature.label}</Text>

          {feature.pill && (
            <Text
              css={css({
                color: 'black',
                background: '#EDFFA5',
                padding: '1px 6px 0px',
                borderRadius: 100,
                fontWeight: 'medium',
              })}
              size={2}
            >
              {feature.pill}
            </Text>
          )}
        </Stack>
      ))}
    </Stack>
  </Stack>
);
