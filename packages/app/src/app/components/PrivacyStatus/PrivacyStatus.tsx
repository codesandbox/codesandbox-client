import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { StyledUnlisted, StyledPrivate, Icon } from './elements';

interface IPrivacyStatusProps {
  privacy: number;
  asIcon?: boolean;
  style?: React.CSSProperties;
}

export const PrivacyStatus: React.FC<IPrivacyStatusProps> = ({
  privacy,
  asIcon = false,
  style = {},
}) => {
  const PRIVACY_MESSAGES = [
    {
      title: 'Public',
      tooltip: 'Everyone can see the sandbox',
      icon: null,
    },
    {
      title: 'Unlisted',
      tooltip: 'Only users with the url can see the sandbox',
      icon: <StyledUnlisted style={style} />,
    },
    {
      title: 'Private',
      tooltip: 'Only you can see the sandbox',
      icon: <StyledPrivate style={style} />,
    },
  ];

  if (asIcon) {
    return PRIVACY_MESSAGES[privacy].icon ? (
      <Tooltip content={PRIVACY_MESSAGES[privacy].tooltip}>
        {PRIVACY_MESSAGES[privacy].icon}
      </Tooltip>
    ) : null;
  }

  return (
    <Tooltip content={PRIVACY_MESSAGES[privacy].tooltip}>
      {PRIVACY_MESSAGES[privacy].title}
      <Icon style={style} />
    </Tooltip>
  );
};
