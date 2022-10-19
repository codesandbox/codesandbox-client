import React from 'react';
import css from '@styled-system/css';
import { IconButton, Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';

import { TeamInfo } from './TeamInfo';
import { TeamMembers } from './TeamMembers';
import { TeamSubscription } from './TeamSubscription';

type TeamStep = 'info' | 'members' | 'subscription';

export const NewTeamModal: React.FC = () => {
  const actions = useActions();
  const [currentStep, setCurrentStep] = React.useState<TeamStep>(
    'subscription'
  );

  return (
    <Stack
      css={css({
        height: '80vh',
        maxHeight: '640px',
        overflow: 'hidden',
      })}
      direction="vertical"
    >
      <Stack
        css={css({
          padding: 6,
        })}
        align="center"
        justify="space-between"
      >
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
          onClick={() => actions.modalClosed()}
        />
      </Stack>
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
