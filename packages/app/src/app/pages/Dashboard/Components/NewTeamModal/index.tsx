import React from 'react';
import {
  IconButton,
  Stack,
  Element,
  Text,
  ThemeProvider,
} from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useActions, useAppState } from 'app/overmind';

import track from '@codesandbox/common/lib/utils/analytics';
import { TeamName } from './TeamName';
import { TeamMembers } from './TeamMembers';
import { TeamImport } from './TeamImport';
import { TeamCreate } from './TeamCreate';

export type TeamStep = 'name' | 'members' | 'import' | 'create';

type NewTeamProps = {
  step?: TeamStep;
  hasNextStep?: boolean;
  onClose: () => void;
};
const NewTeam: React.FC<NewTeamProps> = ({ step, hasNextStep, onClose }) => {
  const { activeTeamInfo, environment } = useAppState();
  const [currentStep, setCurrentStep] = React.useState<TeamStep>(
    step ?? 'name'
  );

  const NEXT_STEP: Record<TeamStep, TeamStep | null> = {
    create: 'members',
    name: 'members',
    members: environment.isOnPrem ? null : 'import',
    import: null,
  };

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
    <>
      <Element padding={6}>
        <Stack align="center" justify="space-between">
          <Text color="#999" size={3}>
            {activeTeamInfo &&
            currentStep !== 'name' &&
            currentStep !== 'create'
              ? activeTeamInfo.name
              : ''}
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
        css={{ flex: 1 }}
        align="center"
        direction="vertical"
        justify="center"
      >
        {
          {
            create: <TeamCreate onComplete={handleStepCompletion} />,
            name: <TeamName onComplete={handleStepCompletion} />,
            members: (
              <TeamMembers
                hideSkip={!nextStep}
                onComplete={handleStepCompletion}
              />
            ),
            import: <TeamImport onComplete={handleStepCompletion} />,
          }[currentStep]
        }
      </Stack>
    </>
  );
};

export const NewTeamModal: React.FC = () => {
  const actions = useActions();
  const { modals } = useAppState();

  const handleModalClose = () => {
    actions.modals.newTeamModal.close();
  };

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
        width={724}
        top={15}
        fullWidth={window.screen.availWidth < 800}
      >
        <NewTeam
          step={modals.newTeamModal.step}
          hasNextStep={modals.newTeamModal.hasNextStep}
          onClose={handleModalClose}
        />
      </Modal>
    </ThemeProvider>
  );
};
