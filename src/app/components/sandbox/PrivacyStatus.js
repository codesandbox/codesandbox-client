import React from 'react';
import styled, { css } from 'styled-components';
import Question from 'react-icons/lib/go/question';
import i18n from 'common/i18n';

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
    title: i18n.t('workspace:actions.privacyLevel.public'),
    tooltip: i18n.t('workspace:actions.privacyTooltip.public'),
    icon: null,
  },
  1: {
    title: i18n.t('workspace:actions.privacyLevel.unlisted'),
    tooltip: i18n.t('workspace:actions.privacyTooltip.unlisted'),
    icon: <StyledUnlisted />,
  },
  2: {
    title: i18n.t('workspace:actions.privacyLevel.private'),
    tooltip: i18n.t('workspace:actions.privacyTooltip.private'),
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
