import React from 'react';
import {
  Button,
  Element,
  Icon,
  Select,
  Stack,
  Text,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useCreateCheckout } from 'app/hooks';
import { useActions, useAppState } from 'app/overmind';
import { getUpgradeableTeams } from 'app/utils/teams';
import { Alert } from '../Common/Alert';

export const SelectWorkspaceToUpgrade: React.FC = () => {
  const { dashboard, personalWorkspaceId, user } = useAppState();
  const { openCreateTeamModal, modalClosed } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();

  const upgradeableTeams = getUpgradeableTeams({
    teams: dashboard.teams,
    personalWorkspaceId,
    userId: user?.id,
  });

  const [selectedTeam, setSelectedTeam] = React.useState(
    upgradeableTeams[0]?.id
  );

  return (
    <Alert title="Choose a team to upgrade">
      <Stack
        css={{
          marginBottom: '52px',
        }}
        direction="vertical"
        gap={4}
      >
        <Text
          css={{
            color: '#808080',
            fontSize: '13px',
            lineHeight: '19px',
          }}
        >
          Team Pro plan is only available for teams.
        </Text>
        {upgradeableTeams.length > 0 ? (
          /**
           * This should always render because if there are no
           * upgradeable teams, the CTA will directly open the modal.
           */
          <Select onChange={e => setSelectedTeam(e.target.value)}>
            {upgradeableTeams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
        ) : (
          <Text
            css={{
              color: '#808080',
              fontSize: '13px',
              lineHeight: '19px',
            }}
          >
            You don&apos;t have any teams to upgrade to Team Pro.
            <Button
              css={{
                display: 'inline',
                height: 'auto',
                padding: 0,
              }}
              onClick={() => {
                track('upsell team pro - create team clicked', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                openCreateTeamModal();
              }}
              variant="link"
              autoWidth
            >
              Create one and start a free trial.
            </Button>
          </Text>
        )}
      </Stack>
      <Stack direction="vertical" gap={2}>
        {checkout.status === 'error' && (
          <Text
            css={{
              display: 'block',
              marginTop: '2px',
            }}
            variant="danger"
            size={12}
          >
            An error ocurred while trying to load the checkout.
            <br /> Please try again.
          </Text>
        )}

        <Stack gap={2} align="center" justify="flex-end">
          <Button
            onClick={() => {
              track('upsell team pro - modal closed', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              modalClosed();
            }}
            autoWidth
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            css={{
              gap: '4px',
              padding: '4px 24px',
            }}
            disabled={!selectedTeam}
            loading={checkout.status === 'loading'}
            variant="primary"
            onClick={() => {
              track('upsell team pro - checkout clicked', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createCheckout({
                utm_source: 'dashboard_workspace_settings',
                cancel_path: '/pro',
              });
            }}
            autoWidth
          >
            Checkout
            <Element
              css={{
                transform: 'rotate(270deg)',
              }}
            >
              <Icon name="arrowDown" size={12} />
            </Element>
          </Button>
        </Stack>
      </Stack>
    </Alert>
  );
};
