import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { differenceInDays, startOfToday } from 'date-fns';

import {
  Text,
  Stack,
  Element,
  Badge,
  Button,
  IconButton,
  SkeletonText,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';

import { useDismissible, useGetCheckoutURL } from 'app/hooks';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { pluralize } from 'app/utils/pluralize';
import { LoseFeatures } from 'app/components/LoseFeatures/LoseFeatures';

export const MidTrialModal = () => {
  const { modalClosed } = useActions();
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const [
    experimentValue,
    setExperimentValue,
  ] = useState<ExperimentValues | null>(null);
  const experimentPromise = useExperimentResult('mid-trial-modal');
  const [, dismissMidTrialReminder] = useDismissible(
    `DASHBOARD_MID_TRIAL_REMINDER_${activeTeam}`
  );
  const { subscription } = useWorkspaceSubscription();

  const today = startOfToday();
  const trialEndDate = new Date(subscription?.trialEnd);
  const remainingTrialDays = differenceInDays(trialEndDate, today);

  useEffect(() => {
    experimentPromise.then(experiment => {
      setExperimentValue(experiment);
    });
  }, [experimentPromise]);

  const checkoutUrl = useGetCheckoutURL({
    success_path: pathname,
    cancel_path: pathname,
  });

  const handleClose = () => {
    track('Mid trial reminder: close modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    dismissMidTrialReminder();
    modalClosed();
  };

  const handleUpgrade = () => {
    track('Mid trial reminder: upgrade to pro', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    dismissMidTrialReminder();
  };

  return (
    <Stack css={{ padding: '24px' }} direction="vertical" gap={12}>
      <Stack direction="vertical" gap={6} css={{ textAlign: 'center' }}>
        <Stack direction="vertical" gap={4}>
          <Stack justify="flex-end">
            <IconButton name="cross" title="Close" onClick={handleClose} />
          </Stack>
          <Stack direction="vertical" gap={1}>
            <Text
              as="h2"
              size={32}
              color="#FFFFFF"
              align="center"
              css={{ marginTop: 0 }}
              fontFamily="everett"
            >
              {remainingTrialDays === 7
                ? 'One week'
                : `${remainingTrialDays} ${pluralize({
                    word: 'day',
                    count: remainingTrialDays,
                  })}`}{' '}
              left on your trial.
            </Text>
            <Text
              as="p"
              size={19}
              color="#C2C2C2"
              align="center"
              lineHeight="28px"
              css={{ margin: 0 }}
            >
              {!experimentValue ? <SkeletonText /> : null}

              {experimentValue === ExperimentValues.A
                ? 'You will lose access to all Pro features when your trial expires.'
                : null}
              {experimentValue === ExperimentValues.B
                ? 'You will need a Team Pro subscription to continue using Pro features.'
                : null}
            </Text>
          </Stack>
        </Stack>

        {!experimentValue ? (
          <Stack direction="vertical" gap={4}>
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
          </Stack>
        ) : null}

        {experimentValue === ExperimentValues.A ? <LoseFeatures /> : null}
        {experimentValue === ExperimentValues.B ? <KeepWithTrial /> : null}
      </Stack>
      <Stack gap={4} justify="space-between">
        <Element css={{ flexGrow: 1 }}>
          <Button onClick={handleClose} variant="secondary">
            Continue trial
          </Button>
        </Element>
        <Element css={{ flexGrow: 1 }}>
          <Button
            as="a"
            href={checkoutUrl}
            onClick={handleUpgrade}
            variant="primary"
          >
            Upgrade to pro
          </Button>
        </Element>
      </Stack>
    </Stack>
  );
};

const KEEP_DEFAULT = [
  {
    key: 'editors',
    pro: 'Up to 20 editors',
  },
  {
    key: 'sandboxes',
    pro: 'Unlimited private sandboxes',
  },
  {
    key: 'repos',
    pro: 'Unlimited private repositories',
  },
  {
    key: 'npm',
    pro: 'Private NPM packages',
  },
  {
    key: 'live',
    pro: 'Live sessions',
  },
  {
    key: 'ram',
    pro: '6GB RAM',
    pill: '3x capacity',
  },
  {
    key: 'cpu',
    pro: '4 vCPUs',
    pill: '2x faster',
  },
  {
    key: 'disk',
    pro: '12GB Disk',
    pill: '2x storage',
  },
];

const KeepWithTrial = () => {
  const { activeTeamInfo } = useAppState();
  const usage = activeTeamInfo?.usage;

  return (
    <Stack direction="vertical" gap={4}>
      {KEEP_DEFAULT.map(feature => {
        let keepFeature = feature.pro;

        if (feature.key === 'editors' && usage?.editorsQuantity > 5) {
          keepFeature = `${usage?.editorsQuantity} editors`;
        }

        return (
          <Stack key={feature.key} align="center" gap={3} justify="center">
            <Text size={16} color="#FFFFFF" lineHeight="24px">
              {keepFeature}
            </Text>
            {feature.pill ? (
              <Text color="#0E0E0E">
                <Badge variant="highlight">{feature.pill}</Badge>
              </Text>
            ) : null}
          </Stack>
        );
      })}
    </Stack>
  );
};
