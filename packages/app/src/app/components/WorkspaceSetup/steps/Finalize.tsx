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
  const { basePlan, totalPrice, totalCredits, spendingLimit } = checkout;
  const [country, setCountry] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const actions = useActions();
  const effects = useEffects();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');

  const isAnnual = basePlan.id === 'flex-annual';
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
              basePlan.id,
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
            workspaceId={workspaceId}
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
    checkout.basePlan.id
  );

  if (_stepSelectedPlan === 'flex-annual') {
    return (
      <AnnualForm
        refreshParentSelectedPlan={() =>
          setStepSelectedPlan(checkout.basePlan.id)
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
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas (the)',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia (Plurinational State of)',
  'Bonaire, Sint Eustatius and Saba',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory (the)',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman Islands (the)',
  'Central African Republic (the)',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands (the)',
  'Colombia',
  'Comoros (the)',
  'Congo (the Democratic Republic of the)',
  'Congo (the)',
  'Cook Islands (the)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  "Côte d'Ivoire",
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic (the)',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Falkland Islands (the) [Malvinas]',
  'Faroe Islands (the)',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories (the)',
  'Gabon',
  'Gambia (the)',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and McDonald Islands',
  'Holy See (the)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran (Islamic Republic of)',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  "Korea (the Democratic People's Republic of)",
  'Korea (the Republic of)',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  "Lao People's Democratic Republic (the)",
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands (the)',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia (Federated States of)',
  'Moldova (the Republic of)',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands (the)',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger (the)',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands (the)',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine, State of',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines (the)',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Republic of North Macedonia',
  'Romania',
  'Russian Federation (the)',
  'Rwanda',
  'Réunion',
  'Saint Barthélemy',
  'Saint Helena, Ascension and Tristan da Cunha',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Martin (French part)',
  'Saint Pierre and Miquelon',
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
  'Sint Maarten (Dutch part)',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan (the)',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands (the)',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates (the)',
  'United Kingdom of Great Britain and Northern Ireland (the)',
  'United States Minor Outlying Islands (the)',
  'United States of America (the)',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela (Bolivarian Republic of)',
  'Viet Nam',
  'Virgin Islands (British)',
  'Virgin Islands (U.S.)',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Åland Islands',
];
