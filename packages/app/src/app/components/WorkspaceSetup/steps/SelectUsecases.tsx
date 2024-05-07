import React, { useState } from 'react';
import { Button, Element, Stack, Text } from '@codesandbox/components';
import { useAppState, useEffects } from 'app/overmind';
import styled from 'styled-components';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';
import { StepProps } from '../types';

const USE_CASES = [
  'Conduct interviews',
  'Build design systems',
  'Teach',
  'Work on repositories',
  'Make prototypes',
  'Conduct QA',
  'Live collaboration',
  'Showcase work',
  'Code with AI',
];

export const SelectUsecases: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { activeTeam } = useAppState();
  const effects = useEffects();
  const [usecases, setUsecases] = useState<Record<string, boolean>>(
    USE_CASES.reduce((res, usecase) => {
      res[usecase] = false;
      return res;
    }, {})
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const selectedUseCases = Object.keys(usecases).filter(k => usecases[k]);
    if (selectedUseCases.length > 0) {
      effects.gql.mutations.setTeamMetadata({
        teamId: activeTeam,
        useCases: selectedUseCases,
      });
    }
    onNextStep();
  };

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={6}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="How would you like to use CodeSandox?"
        />
        <Stack
          as="form"
          onSubmit={handleSubmit}
          direction="vertical"
          gap={6}
          css={{ width: '100%' }}
          align="flex-start"
        >
          <Text color="#e5e5e5">
            Select all that apply. We will customize your dashboard experience
            based on this.
          </Text>
          <Element
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}
          >
            {USE_CASES.map(useCase => (
              <ToggleButton
                key={useCase}
                type="button"
                variant="secondary"
                data-selected={usecases[useCase]}
                onClick={() =>
                  setUsecases({ ...usecases, [useCase]: !usecases[useCase] })
                }
              >
                {useCase}
              </ToggleButton>
            ))}
          </Element>
          <Button type="submit" size="large" autoWidth>
            Next
          </Button>
        </Stack>
      </Stack>
    </AnimatedStep>
  );
};

const ToggleButton = styled(Button)`
  width: 220px;
  height: 80px;
  border-radius: 16px;
  font-size: 16px;

  &[data-selected='true'] {
    background-color: #644ed7;
    color: #fff;

    &:focus {
      background-color: #644ed7;
    }

    &:hover {
      background-color: #644ed7;
    }
  }
`;
