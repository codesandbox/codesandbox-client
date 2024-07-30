import { Element, Link, Stack, Text, Tooltip } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import React, { useEffect, useState } from 'react';
import { useEffects } from 'app/overmind';
import { VMTier } from 'app/overmind/effects/api/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

export const UsageProgress: React.FC<{
  maxCredits: number;
  usedCredits: number;
  workspaceId: string;
}> = ({ maxCredits, usedCredits, workspaceId }) => {
  const [allVmTiers, setAllVmTiers] = useState<VMTier[]>([]);
  const effects = useEffects();
  const { isFree } = useWorkspaceSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();

  useEffect(() => {
    effects.api.getVMSpecs().then(res => {
      setAllVmTiers(res.vmTiers);
    });
  }, []);

  const creditsLeft = maxCredits - usedCredits;
  const lowestTier = allVmTiers.find(tier => tier.tier === 1);
  const hoursLeft = lowestTier
    ? Math.ceil(creditsLeft / lowestTier.creditBasis)
    : 0;

  return (
    <Stack direction="vertical" gap={2} paddingX={7}>
      <Text
        variant="muted"
        size={2}
        css={css({ color: 'sideBarSectionHeader.foreground' })}
      >
        {Math.min(usedCredits, maxCredits)} / {maxCredits} credits
      </Text>

      <Stack direction="vertical" gap={4}>
        <Tooltip
          label={
            <div>
              {creditsLeft} credits left{' '}
              {hoursLeft &&
                `(${hoursLeft} hours of ${lowestTier.name} VM runtime)`}
              .
            </div>
          }
        >
          <Element
            css={css({
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            })}
          >
            <Element
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: (usedCredits / maxCredits) * 100 + '%',
                borderRadius: 4,
                transition: 'width 0.3s ease-in-out',
              }}
              css={css({
                backgroundColor: '#E4FC82',
              })}
            />
          </Element>
        </Tooltip>

        <Stack
          gap={2}
          css={css({
            fontSize: 2,
          })}
          justify="space-between"
        >
          {isTeamAdmin &&
            (isFree ? (
              <Link
                href={dashboardUrls.upgradeUrl({
                  workspaceId,
                  source: 'sidebar',
                })}
                css={{ color: '#BDB1F6' }}
              >
                Upgrade
              </Link>
            ) : (
              <Link
                href={dashboardUrls.portalVMUsage(workspaceId)}
                css={{ color: '#BDB1F6' }}
              >
                Manage
              </Link>
            ))}
          <Link href={dashboardUrls.portalVMUsage(workspaceId)}>
            View usage
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
