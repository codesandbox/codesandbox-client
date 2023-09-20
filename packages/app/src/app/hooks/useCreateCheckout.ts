import { useEffect, useState } from 'react';
import { useActions, useAppState, useEffects } from 'app/overmind';
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
  createTeam?: boolean;
  trackingLocation:
    | 'settings_upgrade'
    | 'dashboard_upgrade_banner'
    | 'dashboard_import_limits'
    | 'dashboard_private_repo_upgrade'
    | 'v1_live_session_upgrade'
    | 'editor_seats_upgrade'
    | 'pro_page'
    | 'user_settings'
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
  const { activeTeam, isProcessingPayment, user } = useAppState();
  const actions = useActions();
  const { isFree } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();
  const [status, setStatus] = useState<CheckoutStatus>({ status: 'idle' });
  const { api } = useEffects();
  const { pathname, search } = useLocation();

  const canCheckout = !!isFree && isBillingManager;

  useEffect(() => {
    if (isProcessingPayment) {
      setStatus({ status: 'loading' });
    } else {
      setStatus({ status: 'idle' });
    }
  }, [isProcessingPayment]);

  async function createCheckout({
    interval = 'month',
    cancelPath = pathname + search,
    createTeam,
    trackingLocation,
  }: CheckoutOptions): Promise<void> {
    try {
      setStatus({ status: 'loading' });

      if (!activeTeam || !user) {
        // Should not happen but it's done for typing reasons
        setStatus({ status: 'error', error: 'Invalid activeTeam or user' });
      }

      let teamId = activeTeam;

      if (createTeam) {
        const newTeam = await actions.dashboard.createTeam({
          teamName: `${user.username}'s pro`,
        });

        teamId = newTeam.id;
      }

      const successPath = createTeam
        ? dashboardURLs.recent(teamId, {
            new_workspace: 'true',
          })
        : dashboardURLs.settings(teamId);

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
