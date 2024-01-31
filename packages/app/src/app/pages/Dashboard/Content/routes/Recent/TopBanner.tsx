import React from 'react';
import { useDismissible } from 'app/hooks';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { useAppState } from 'app/overmind';
import { FreeUpgradeBanner } from './Banners/FreeUpgradeBanner';
import { UBBWelcomeBanner } from './Banners/UBBWelcomeBanner';
import { LegacyProConvertBanner } from './Banners/LegacyProConvertBanner';

export const TopBanner = () => {
  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { activeTeam } = useAppState();
  const { isFree, isPro } = useWorkspaceSubscription();
  const { hasVisited } = useDashboardVisit();

  const [welcomeBannerDismissed, dismissWelcomeBanner] = useDismissible(
    `${activeTeam}_UBB_WELCOME`
  );
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

  if (!welcomeBannerDismissed) {
    return <UBBWelcomeBanner onDismiss={dismissWelcomeBanner} />;
  }

  if (isFree && !upsellProBannerDismissed && hasVisited) {
    return <FreeUpgradeBanner onDismiss={dismissUpsellProBanner} />;
  }

  return null;
};
