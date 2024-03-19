import React, { useEffect } from 'react';
import {
  Switch,
  Stack,
  Text,
  Button,
  Icon,
  Select,
} from '@codesandbox/components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { InputText } from 'app/components/dashboard/InputText';
import track from '@codesandbox/common/lib/utils/analytics';

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
  const [success, setSuccess] = React.useState(false);

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

    try {
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

      setSuccess(true);
    } catch {
      track('Checkout - Failed annual plan');
    }
  };

  const handleSubmit = () => {
    if (isAnnual) {
      track('Checkout - Submit annual plan');
      annualSendRequest();

      return;
    }

    track('Checkout - Drop annual plan to monthly');
    refreshParentSelectedPlan();
  };

  if (success) {
    return (
      <AnimatedStep css={{ width: '100%', maxWidth: 600 }}>
        <Stack direction="vertical" gap={4}>
          <Stack gap={3} css={{ alignItems: 'center', color: '#EAFF96' }}>
            <Icon size={26} name="simpleCheck" />
            <Text size={8} color="#fff" as="label" htmlFor="recurring">
              Success!
            </Text>
          </Stack>

          <Text color="#CCCCCC" css={{ paddingBottom: 24 }}>
            The next step is on us. Your request for an annual plan has been
            sent to our team. Someone from support will be in touch with you
            within 24 hours.
          </Text>

          <Button onClick={onDismiss} autoWidth>
            Continue to dashboard
          </Button>
        </Stack>
      </AnimatedStep>
    );
  }

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
              onChange={() => {
                track('Checkout - Toggle recurring type', {
                  from: 'finalize-step',
                  newValue: isAnnual ? 'annual' : 'monthly',
                });

                actions.checkout.selectPlan(isAnnual ? 'flex' : 'flex-annual');
              }}
            />
            <Stack direction="vertical" css={{ marginTop: -3 }}>
              <Text color="#fff" as="label" htmlFor="recurring">
                Annual (Save 30%)
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

            <Stack gap={2} direction="vertical">
              <Text as="label" color="#e5e5e5" htmlFor="country">
                Country *
              </Text>

              <Select
                css={{ height: 40 }}
                id="country"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option value="">Select your country or region</option>
                {COUNTRIES.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Stack>

            <InputText
              label="Postal code *"
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

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];
