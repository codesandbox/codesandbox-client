import React from 'react';
import { useHistory } from 'react-router-dom';
import css from '@styled-system/css';
import { Stack, Element, ThemeProvider } from '@codesandbox/components';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import Modal from 'app/components/Modal';
import { useActions, useAppState } from 'app/overmind';

import track from '@codesandbox/common/lib/utils/analytics';
import { TeamInfo } from './TeamInfo';
import { TeamMembers } from './TeamMembers';
import { TeamSubscription } from './TeamSubscription';
import { TeamImport } from './TeamImport';

export type TeamStep = 'info' | 'members' | 'import' | 'subscription';

const NEXT_STEP: Record<TeamStep, TeamStep | null> = {
  info: 'members',
  members: 'import',
  import: 'subscription',
  subscription: null,
};

const Indicator = ({
  isActive,
  isCompleted,
}: {
  isActive: boolean;
  isCompleted: boolean;
}) => {
  return (
    <Element
      css={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        border: '1px solid #999999',
        background: isActive ? 'transparent' : '#999999',
        opacity: isActive || isCompleted ? 1 : 0.5,
      }}
    />
  );
};

const ProgressIndicator = ({ activeStep }: { activeStep: TeamStep }) => {
  const allSteps = Object.keys(NEXT_STEP);
  const activeStepNumber = allSteps.indexOf(activeStep);

  return (
    <>
      <Stack gap={3} justify="center" aria-hidden>
        {allSteps.map((step, index) => {
          const isActive = step === activeStep;
          const isCompleted = index < activeStepNumber;

          return (
            <Indicator
              key={step}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          );
        })}
      </Stack>
      <VisuallyHidden>
        Step {activeStepNumber + 1} of {allSteps.length}.
      </VisuallyHidden>
    </>
  );
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
    <Element padding={10} css={{ height: '660px' }}>
      <Stack direction="vertical" gap={10}>
        <ProgressIndicator activeStep={currentStep} />
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
              import: <TeamImport onComplete={handleStepCompletion} />,
              subscription: (
                <TeamSubscription onComplete={handleStepCompletion} />
              ),
            }[currentStep]
          }
        </Stack>
      </Stack>
    </Element>
  );
};

export const NewTeamModal: React.FC = () => {
  const actions = useActions();
  const { activeTeam, modals } = useAppState();
  const previousTeam = React.useRef<string | null>(null);
  const history = useHistory();

  const handleModalClose = () => {
    // If the user is still at the first step, no Team
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
