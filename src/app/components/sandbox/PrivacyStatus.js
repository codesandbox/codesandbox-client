import React from 'react';
import styled, { css } from 'styled-components';
import Question from 'react-icons/lib/go/question';

import Unlisted from 'react-icons/lib/go/link';
import Private from 'react-icons/lib/go/lock';

import Tooltip from '../Tooltip';

const iconStyles = css`
  opacity: 0.5;
  margin-left: 0.5em;
  margin-bottom: 0.2rem;
`;

const StyledUnlisted = styled(Unlisted)(iconStyles);
const StyledPrivate = styled(Private)(iconStyles);

const PRIVACY_MESSAGES = {
  0: {
    title: 'Public',
    tooltip: 'Everyone can see the sandbox',
    icon: null,
  },
  1: {
    title: 'Unlisted',
    tooltip: 'Only users with the url can see the sandbox',
    icon: <StyledUnlisted />,
  },
  2: {
    title: 'Private',
    tooltip: 'Only you can see the sandbox',
    icon: <StyledPrivate />,
  },
};

const Icon = styled(Question)(iconStyles);

export default ({ privacy, asIcon }: { privacy: number, asIcon: boolean }) => {
  if (asIcon) {
    return (
      <Tooltip title={PRIVACY_MESSAGES[privacy].tooltip}>
        {PRIVACY_MESSAGES[privacy].icon}
      </Tooltip>
    );
  }

  return (
    <Tooltip title={PRIVACY_MESSAGES[privacy].tooltip}>
      {PRIVACY_MESSAGES[privacy].title}
      <Icon />
    </Tooltip>
  );
};
