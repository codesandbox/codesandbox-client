import React from 'react';
import css from '@styled-system/css';
import { IconButton, Stack, Element, Text } from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useActions, useAppState } from 'app/overmind';
import history from 'app/utils/history';

import track from '@codesandbox/common/lib/utils/analytics';
import { TeamInfo } from './TeamInfo';
import { TeamMembers } from './TeamMembers';
import { TeamSubscription } from './TeamSubscription';

type TeamStep = 'info' | 'members' | 'subscription';

export const NewTeamModal: React.FC = () => {
  const actions = useActions();
  const { activeTeam } = useAppState();
  const [currentStep, setCurrentStep] = React.useState<TeamStep>('info');

  const handleModalClose = () => {
    actions.modalClosed();

    // If the user is still at the first step, no Team
    // has been created and closing the modal should
    // not perform any further actions. Else, the user
    // must be redirected to the  recent page where the
    // UI to create/import sandboxes or repositories
    // will be displayed.
    if (currentStep !== 'info') {
      history.push(dashboard.recent(activeTeam));
    }
  };

  React.useEffect(() => {
    track('New Team - View Modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  return (
    <Stack
      css={css({
        maxHeight: '700px',
        overflow: 'hidden',
      })}
      direction="vertical"
    >
      <Element padding={6}>
        <Stack align="center" justify="space-between">
          <Text
            css={css({
              color: '#808080',
            })}
            size={3}
          >
            New team
          </Text>
          <IconButton
            name="cross"
            variant="square"
            size={16}
            title="Close modal"
            onClick={handleModalClose}
          />
        </Stack>
      </Element>
      <Stack
        css={css({
          flex: 1,
        })}
        align="center"
        direction="vertical"
        justify="center"
      >
        {
          {
            info: <TeamInfo onComplete={() => setCurrentStep('members')} />,
            members: (
              <TeamMembers onComplete={() => setCurrentStep('subscription')} />
            ),
            subscription: <TeamSubscription />,
          }[currentStep]
        }
      </Stack>
    </Stack>
  );
};
