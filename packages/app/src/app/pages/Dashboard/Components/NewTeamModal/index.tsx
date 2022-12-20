import React from 'react';
import { useHistory } from 'react-router-dom';
import css from '@styled-system/css';
import {
  IconButton,
  Stack,
  Element,
  Text,
  ThemeProvider,
} from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import Modal from 'app/components/Modal';
import { useActions, useAppState } from 'app/overmind';

import track from '@codesandbox/common/lib/utils/analytics';
import { TeamInfo } from './TeamInfo';
import { TeamMembers } from './TeamMembers';
import { TeamSubscription } from './TeamSubscription';

export type TeamStep = 'info' | 'members' | 'subscription';

const NEXT_STEP: Record<TeamStep, TeamStep | null> = {
  info: 'members',
  members: 'subscription',
  subscription: null,
};

type NewTeamProps = {
  step?: TeamStep;
  hasNextStep?: boolean;
  onClose: () => void;
};
const NewTeam: React.FC<NewTeamProps> = ({ step, hasNextStep, onClose }) => {
  const [currentStep, setCurrentStep] = React.useState<TeamStep>(
    step ?? 'info'
  );

  const nextStep =
    typeof hasNextStep === 'undefined' || hasNextStep === true
      ? NEXT_STEP[currentStep]
      : null;

  const handleStepCompletion = () => {
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      onClose();
    }
  };

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
            onClick={onClose}
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
            info: <TeamInfo onComplete={handleStepCompletion} />,
            members: (
              <TeamMembers
                hideSkip={!nextStep}
                onComplete={handleStepCompletion}
              />
            ),
            subscription: <TeamSubscription />,
          }[currentStep]
        }
      </Stack>
    </Stack>
  );
};

export const NewTeamModal: React.FC = () => {
  const actions = useActions();
  const { activeTeam, modals } = useAppState();
  const previousTeam = React.useRef(null);
  const history = useHistory();

  const handleModalClose = () => {
    //     If the user is still at the first step, no Team
    // has been created and closing the modal should
    // not perform any further actions. Else, the user
    // must be redirected to the  recent page where the
    // UI to create/import sandboxes or repositories
    // will be displayed.
    if (activeTeam !== previousTeam.current) {
      history.push(dashboard.recent(activeTeam));
    }

    actions.modals.newTeamModal.close();
  };

  React.useEffect(() => {
    previousTeam.current = activeTeam;
  }, [activeTeam]);

  React.useEffect(() => {
    track('New Team - View Modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  return (
    <ThemeProvider>
      <Modal
        isOpen={modals.newTeamModal.isCurrent}
        onClose={handleModalClose}
        maxWidth={724}
        top={15}
        fullWidth={window.screen.availWidth < 800}
      >
        <NewTeam
          step={modals.newTeamModal.step}
          hasNextStep={modals.newTeamModal.hasNextStep}
          onClose={actions.modals.newTeamModal.close}
        />
      </Modal>
    </ThemeProvider>
  );
};
