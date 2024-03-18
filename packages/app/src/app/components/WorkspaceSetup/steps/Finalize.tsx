import React, { useEffect } from 'react';
import { Switch, Stack, Text, Button, Icon } from '@codesandbox/components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { InputText } from 'app/components/dashboard/InputText';

import { PlanType } from 'app/overmind/namespaces/checkout/types';
import { StepProps } from '../types';
import { Payment } from './Payment';
import { ChangePlan } from './ChangePlan';
import { AnimatedStep } from '../elements';
import { StepHeader } from '../StepHeader';

const spreadsheet_id = 'pMNURh6s7G4XFnlVcK7sD';
const table_id = '1b2ad50e-d828-4f20-acfd-9135f70bfd45';
const range = 'A:G:append';
const ROWS_REQUEST_URL = `https://api.rows.com/v1/spreadsheets/${spreadsheet_id}/tables/${table_id}/values/${range}`;
const ROWS_API_KEY = '1WcvujvzSSQ1GtbnoYvrGb8liPJFWud915ELpjwnVfV5';

const AnnualForm = ({
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
  refreshParentSelectedPlan,
}: StepProps & { refreshParentSelectedPlan: () => void }) => {
  const { checkout } = useAppState();
  const {
    selectedPlan,
    totalPrice,
    totalCredits,
    spendingLimit,
    availableBasePlans,
  } = checkout;
  const [country, setCountry] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');

  const actions = useActions();
  const effects = useEffects();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');

  const basePlan = availableBasePlans[selectedPlan];
  const isAnnual = selectedPlan === 'flex-annual';
  const disabled = !country || !zipCode;

  useEffect(() => {
    actions.checkout.recomputeTotals();
  }, []);

  if (!basePlan) {
    return null;
  }

  const annualSendRequest = async () => {
    const addons = checkout.creditAddons
      .map(item => `${item.addon.credits} x ${item.quantity}`)
      .join(', ');

    await effects.http.post(
      ROWS_REQUEST_URL,
      {
        values: [
          [
            '',
            workspaceId,
            checkout.selectedPlan,
            addons === '' ? 'N/A' : addons,
            checkout.spendingLimit,
            country,
            zipCode,
          ],
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + ROWS_API_KEY,
        },
      }
    );
  };

  const handleSubmit = () => {
    if (isAnnual) {
      annualSendRequest();

      return;
    }

    refreshParentSelectedPlan();
  };

  return (
    <AnimatedStep css={{ width: '100%', maxWidth: 600 }}>
      <Stack gap={6} direction="vertical">
        <Stack
          direction="horizontal"
          css={{
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingBottom: 24 * 2,
          }}
        >
          <StepHeader
            onPrevStep={onPrevStep}
            onDismiss={onDismiss}
            currentStep={currentStep}
            numberOfSteps={numberOfSteps}
            title="Review plan"
          />

          <Stack css={{ gap: '8px' }}>
            <Switch
              id="recurring"
              on={isAnnual}
              onChange={() =>
                actions.checkout.selectPlan(isAnnual ? 'flex' : 'flex-annual')
              }
            />
            <Stack direction="vertical" css={{ marginTop: -3 }}>
              <Text color="#fff" as="label" htmlFor="recurring">
                Annual (30% off)
              </Text>
            </Stack>
          </Stack>
        </Stack>

        <Stack css={{ width: '100%', justifyContent: 'space-between' }}>
          <Text size={6} color="#fff">
            Total cost
          </Text>

          <Text size={6} color="#fff">
            ${totalPrice} {isAnnual ? ' / year' : '/ month'}
          </Text>
        </Stack>

        <Text color="#CCCCCC" size={4}>
          {totalCredits} VM credits/month
        </Text>

        <Text color="#CCCCCC" size={4}>
          Additional VM credits are available on-demand for $0.018/credit.
          <br />
          Spending limit: ${spendingLimit}
        </Text>

        {isAnnual ? (
          <Stack
            direction="vertical"
            gap={4}
            css={{ paddingBottom: 24 * 2, paddingTop: 24 * 2 }}
          >
            <Text color="#fff" size={4}>
              Billing details:
            </Text>

            <InputText
              label="Country *"
              placeholder="Introduce your country or region"
              id="country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              name="country"
            />
            <InputText
              label="ZIP code *"
              placeholder="99999"
              id="zipCode"
              value={zipCode}
              name="zipCode"
              onChange={e => setZipCode(e.target.value)}
            />
          </Stack>
        ) : (
          <Stack />
        )}

        <Button
          disabled={isAnnual && disabled}
          autoWidth
          size="large"
          type="submit"
          onClick={handleSubmit}
        >
          {isAnnual ? 'Send request' : 'Proceed to checkout'}
        </Button>

        <Stack gap={1} css={{ color: '#A8BFFA' }}>
          <Icon name="circleBang" />
          <Text size={3}>
            {isAnnual
              ? 'We will review your request in 24 hours and get back to you.'
              : 'Process immediately.'}
          </Text>
        </Stack>
      </Stack>
    </AnimatedStep>
  );
};

export const Finalize: React.FC<StepProps> = props => {
  const { checkout } = useAppState();
  const { isPro } = useWorkspaceSubscription();

  // This internal state is used to avoid unnecessary rerenders
  // and show the wrong step while the user is recurring plan
  const [_stepSelectedPlan, setStepSelectedPlan] = React.useState<PlanType>(
    checkout.selectedPlan
  );

  if (_stepSelectedPlan === 'flex-annual') {
    return (
      <AnnualForm
        refreshParentSelectedPlan={() =>
          setStepSelectedPlan(checkout.selectedPlan)
        }
        {...props}
      />
    );
  }

  if (isPro) {
    return <ChangePlan {...props} />;
  }

  return <Payment {...props} />;
};
