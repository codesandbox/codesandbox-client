import { useState } from 'react';
import { useAppState, useEffects } from 'app/overmind';
import { useLocation } from 'react-router';
import { dashboard as dashboardURLs } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

export type CheckoutOptions = {
  interval?: 'month' | 'year';
  cancelPath?: string;
  trackingLocation:
    | 'settings_upgrade'
    | 'dashboard_upgrade_banner'
    | 'dashboard_import_limits'
    | 'dashboard_private_repo_upgrade'
    | 'v1_live_session_upgrade'
    | 'editor_seats_upgrade'
    | 'pro_page'
    | 'user_settings'
    | 'user_menu'
    | 'dashboard_workspace_settings'
    | 'restrictions_banner'
    | 'max_public_repos';
};

/**
 * @param {string} pathNameAndSearch The pathname and search params you want to add the stripe
 * success param to, for example  `/dashboard?workspace=xxxx`. Exclude the url base.
 */
const addStripeSuccessParam = (
  pathNameAndSearch: string,
  utm_source: string
): string => {
  try {
    const newUrl = new URL(pathNameAndSearch, window.location.origin);
    newUrl.searchParams.append('payment_pending', 'true');
    newUrl.searchParams.append('utm_source', utm_source);

    // Return only pathname and search
    return `${newUrl.pathname}${newUrl.search}`;
  } catch {
    return pathNameAndSearch;
  }
};

const addStripeCancelParam = (pathName: string): string => {
  try {
    const newUrl = new URL(pathName, window.location.origin);
    newUrl.searchParams.append('payment_canceled', 'true');

    // Return only pathname and search
    return `${newUrl.pathname}${newUrl.search}`;
  } catch {
    return pathName;
  }
};

export const useCreateCheckout = (): [
  CheckoutStatus,
  (args: CheckoutOptions) => Promise<void>,
  boolean
] => {
  const { activeTeam, user } = useAppState();
  const { isFree } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();
  const [status, setStatus] = useState<CheckoutStatus>({ status: 'idle' });
  const { api } = useEffects();
  const { pathname, search } = useLocation();

  const canCheckout = !!isFree && !!isBillingManager;

  async function createCheckout({
    interval = 'month',
    cancelPath = pathname + search,
    trackingLocation,
  }: CheckoutOptions): Promise<void> {
    try {
      setStatus({ status: 'loading' });

      if (!activeTeam || !user) {
        // Should not happen but it's done for typing reasons
        throw new Error('Invalid activeTeam or user');
      }

      const teamId = activeTeam;
      const successPath = dashboardURLs.portalRelativePath(teamId);

      const payload = await api.stripeCreateCheckout({
        success_path: addStripeSuccessParam(successPath, trackingLocation),
        cancel_path: addStripeCancelParam(cancelPath),
        team_id: teamId,
        recurring_interval: interval,
      });

      if (payload.stripeCheckoutUrl) {
        track('Subscription - Checkout successfully created', {
          source: trackingLocation,
        });
        window.location.href = payload.stripeCheckoutUrl;
      } else {
        track('Subscription - Failed to create checkout', {
          source: trackingLocation,
        });
      }
    } catch (err) {
      setStatus({
        status: 'error',
        error: err?.message ?? 'Failed to create checkout link',
      });
    }
  }

  return [status, createCheckout, canCheckout];
};
