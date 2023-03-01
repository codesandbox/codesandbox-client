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
import { SubscriptionType, TeamMemberAuthorization } from 'app/graphql/types';
import { Alert } from '../Common/Alert';

export const SelectWorkspaceToUpgrade: React.FC = () => {
  const { dashboard, personalWorkspaceId, user } = useAppState();
  const { modalClosed } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();
  const [selectedTeam, setSelectedTeam] = React.useState(undefined);

  const teamsToShow = dashboard.teams.filter(team => {
    if (
      team.id === personalWorkspaceId ||
      team.subscription?.type === SubscriptionType.TeamPro
    ) {
      return false;
    }

    const teamAdmins = team.userAuthorizations
      .filter(
        ({ authorization }) => authorization === TeamMemberAuthorization.Admin
      )
      .map(({ userId }) => userId);

    return teamAdmins.includes(user?.id);
  });

  React.useEffect(() => {
    if (!selectedTeam) {
      setSelectedTeam(teamsToShow[0].id);
    }
  }, [selectedTeam, teamsToShow]);

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
        <Select onChange={e => setSelectedTeam(e.target.value)}>
          {teamsToShow.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>
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
              track('Pro page - upsell team pro modal closed', {
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
              track('Pro page - upsell team pro checkout clicked', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createCheckout({
                team_id: selectedTeam,
                recurring_interval: 'month',
                success_path: '/pro',
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
