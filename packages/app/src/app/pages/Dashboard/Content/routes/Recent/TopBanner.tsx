import React from 'react';
import { useDismissible } from 'app/hooks';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { useAppState } from 'app/overmind';
import { FreeUpgradeBanner } from './Banners/FreeUpgradeBanner';
import { LegacyProConvertBanner } from './Banners/LegacyProConvertBanner';

export const TopBanner = () => {
  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { activeTeam, activeTeamInfo } = useAppState();
  const { isPro, isFree } = useWorkspaceSubscription();
  const { hasVisited } = useDashboardVisit();
  const workspaceCreatedBeforeUBBRelease =
    activeTeamInfo?.insertedAt &&
    new Date(activeTeamInfo.insertedAt) < new Date('2024-02-01');

  const [legacyProBannerDismissed, dismissLegacyProBanner] = useDismissible(
    `${activeTeam}_LEGACY_PRO_CONVERT_BANNER`
  );

  const [upsellProBannerDismissed, dismissUpsellProBanner] = useDismissible(
    `${activeTeam}_UPSELL_PRO_BANNER`
  );

  if (!ubbBeta) {
    // Legacy case for seat-based Pro accounts
    if (isPro && !legacyProBannerDismissed) {
      return <LegacyProConvertBanner onDismiss={dismissLegacyProBanner} />;
    }

    return null;
  }

  // Free workspaces created after the ubb release see the upsell to pro
  // banner after the first visit
  if (
    !workspaceCreatedBeforeUBBRelease &&
    isFree &&
    !upsellProBannerDismissed &&
    hasVisited
  ) {
    return <FreeUpgradeBanner onDismiss={dismissUpsellProBanner} />;
  }

  return null;
};
