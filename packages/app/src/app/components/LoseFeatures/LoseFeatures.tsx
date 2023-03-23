import React from 'react';

import { Stack, Badge, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';

const LOSE_DEFAULT = [
  {
    key: 'editors',
    pro: 'Up to 20 editors',
    free: 'Limited to 5 editors',
  },
  {
    key: 'sandboxes',
    pro: 'Unlimited private sandboxes',
    free: 'Limited to 20 public sandboxes',
  },
  {
    key: 'repos',
    pro: 'Unlimited private repositories',
    free: 'Limited to 3 public repositories',
  },
  {
    key: 'npm',
    pro: 'Private NPM packages',
    free: 'Limited to public NPM packages',
  },
  {
    key: 'live',
    pro: 'Live sessions',
    free: 'No ability to go live',
  },
  {
    key: 'ram',
    pro: '6GB RAM',
    free: '2GB RAM',
    pill: '-66% capacity',
  },
  {
    key: 'cpu',
    pro: '4 vCPUs',
    free: '2 vCPUs',
    pill: '-2 vCPUs',
  },
  {
    key: 'disk',
    pro: '12GB Disk',
    free: '6GB Disk',
    pill: '-50% storage',
  },
];

export const LoseFeatures = () => {
  const { activeTeamInfo } = useAppState();
  const usage = activeTeamInfo?.usage;

  return (
    <Stack direction="vertical" gap={4}>
      {LOSE_DEFAULT.map(feature => {
        let lostFeature = feature.pro;
        let pillValue = feature.pill;

        if (feature.key === 'editors' && usage?.editorsQuantity > 5) {
          const lostAmount = usage?.editorsQuantity - 5;

          lostFeature = `${usage?.editorsQuantity} editors`;
          pillValue = `-${lostAmount} editor seat${lostAmount > 1 ? 's' : ''}`;
        }

        if (
          feature.key === 'sandboxes' &&
          usage?.privateSandboxesQuantity > 0
        ) {
          pillValue = `${usage?.privateSandboxesQuantity} restricted`;
        }

        if (feature.key === 'repos' && usage?.privateProjectsQuantity > 3) {
          pillValue = `${usage?.privateProjectsQuantity} restricted`;
        }

        return (
          <div key={feature.key}>
            <Text
              size={16}
              color="#999999"
              lineHeight="24px"
              css={{ textDecoration: 'line-through' }}
            >
              {lostFeature}
            </Text>
            <Stack align="center" gap={3} justify="center">
              <Text size={16} color="#FFFFFF" lineHeight="24px">
                {feature.free}
              </Text>
              {pillValue ? <Badge variant="warning">{pillValue}</Badge> : null}
            </Stack>
          </div>
        );
      })}
    </Stack>
  );
};
