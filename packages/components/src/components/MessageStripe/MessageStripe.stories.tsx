import React from 'react';
import { MessageStripe } from './MessageStripe';

export default {
  title: 'components/facelift/MessageStripe',
  component: MessageStripe,
};

export const TrialVariant = () => (
  <MessageStripe variant="trial">
    You are no longer in a Pro team. This private repo is in view mode only.
    Make it public or upgrade.
    <MessageStripe.Action>Upgrade now</MessageStripe.Action>
  </MessageStripe>
);

export const WarningVariant = () => (
  <MessageStripe variant="warning">
    There are some issues with your payment. Please update your payment details.
    <MessageStripe.Action>Update payment</MessageStripe.Action>
  </MessageStripe>
);

export const WithoutAction = () => (
  <MessageStripe variant="warning">
    You are no longer in a Pro team. This private repo is in view mode only,
    contact your team admin to upgrade.
  </MessageStripe>
);

export const SpaceBetween = () => (
  <MessageStripe variant="trial" justify="space-between">
    There are some issues with your payment. Please update your payment details.
    <MessageStripe.Action>Update payment</MessageStripe.Action>
  </MessageStripe>
);

export const TrialVariantWithOnDismiss = () => (
  <MessageStripe variant="trial" onDismiss={() => {}}>
    You are no longer in a Pro team. This private repo is in view mode only.
    Make it public or upgrade.
  </MessageStripe>
);

export const WarningVariantWithOnDismiss = () => (
  <MessageStripe variant="warning" onDismiss={() => {}}>
    There are some issues with your payment. Please update your payment details.
  </MessageStripe>
);

export const OnDismissWithAction = () => (
  <MessageStripe variant="trial" onDismiss={() => {}}>
    There are some issues with your payment. Please update your payment details.
    <MessageStripe.Action>Update payment</MessageStripe.Action>
  </MessageStripe>
);

export const OnDismissWithActionSpaceBetween = () => (
  <MessageStripe variant="trial" justify="space-between" onDismiss={() => {}}>
    There are some issues with your payment. Please update your payment details.
    <MessageStripe.Action>Update payment</MessageStripe.Action>
  </MessageStripe>
);
