import React from 'react';
import { Button } from '@codesandbox/components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { StepProps } from '../types';
import { Payment } from './Payment';
import { ChangePlan } from './ChangePlan';

const spreadsheet_id = 'pMNURh6s7G4XFnlVcK7sD';
const table_id = '1b2ad50e-d828-4f20-acfd-9135f70bfd45';
const range = 'A:F:append';
const ROWS_REQUEST_URL = `https://api.rows.com/v1/spreadsheets/${spreadsheet_id}/tables/${table_id}/values/${range}`;
const ROWS_API_KEY = '1WcvujvzSSQ1GtbnoYvrGb8liPJFWud915ELpjwnVfV5';

const PipedriveSubmit = props => {
  const { checkout } = useAppState();
  const actions = useActions();
  const effects = useEffects();
  const { getQueryParam } = useURLSearchParams();

  const workspaceId = getQueryParam('workspace');

  const submit = async () => {
    await effects.http.post(
      ROWS_REQUEST_URL,
      {
        values: [
          [
            '',
            workspaceId,
            checkout.selectedPlan,
            checkout.creditAddons
              .map(item => `${item.addon.credits} x ${item.quantity}`)
              .join(', '),
            checkout.spendingLimit,
            'Fake address',
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

  return <Button onClick={submit}>Send</Button>;
};

export const Finalize: React.FC<StepProps> = props => {
  return <PipedriveSubmit {...props} />;

  // const { isPro } = useWorkspaceSubscription();
  // if (isPro) {
  //   return <ChangePlan {...props} />;
  // }
  // return <Payment {...props} />;
};
