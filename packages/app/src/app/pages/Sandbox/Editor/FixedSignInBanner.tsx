import React, { useState, useEffect } from 'react';

import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';
import styled from 'styled-components';
import { useActions, useAppState } from 'app/overmind';
import { Text } from '@codesandbox/components';
import css from '@styled-system/css';

const Wrapper = styled.button`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${({ theme }) => theme.colors.blues[600]};
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;

  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.05)
      ),
      ${({ theme }) => theme.colors.blues[600]};
  }

  * {
    flex: 1;
  }
`;

export const FixedSignInBanner: React.FC = () => {
  const { signInClicked } = useActions();
  const { sandboxesLimits } = useAppState();

  /**
   * A/B
   */
  const experimentPromise = useExperimentResult('signin-banner-new-value-prop');
  const [newValuePropInBanner, setNewValuePropInBanner] = useState(false);
  useEffect(() => {
    /* Wait for the API */
    experimentPromise.then(experiment => {
      if (experiment === ExperimentValues.A) {
        /**
         * A
         */
        setNewValuePropInBanner(false);
      } else if (experiment === ExperimentValues.B) {
        /**
         * B
         */
        setNewValuePropInBanner(true);
      }
    });
  }, [experimentPromise]);

  if (!sandboxesLimits) return null;

  return (
    <Wrapper onClick={() => signInClicked()}>
      <span />
      <Text size={3} css={{ textAlign: 'center' }}>
        {newValuePropInBanner
          ? 'Sign up for free to create unlimited sandboxes'
          : 'Sign up for free to save your work'}
      </Text>
      <Text size={2} css={css({ textAlign: 'right', paddingRight: 4 })}>
        {sandboxesLimits.sandboxCount}/{sandboxesLimits.sandboxLimit} Sandboxes
        used - <strong>Anonymous</strong>
      </Text>
    </Wrapper>
  );
};
