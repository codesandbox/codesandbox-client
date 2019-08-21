import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { StyledUnlisted, StyledPrivate, Icon } from './elements';

interface IPrivacyStatusProps {
  privacy: number;
  asIcon?: boolean;
}

export const PrivacyStatus: React.FC<IPrivacyStatusProps> = ({
  privacy,
  asIcon = false,
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
      icon: <StyledUnlisted />,
    },
    {
      title: 'Private',
      tooltip: 'Only you can see the sandbox',
      icon: <StyledPrivate />,
    },
  ];

  if (asIcon) {
    return (
      <Tooltip content={PRIVACY_MESSAGES[privacy].tooltip}>
        {PRIVACY_MESSAGES[privacy].icon}
      </Tooltip>
    );
  }

  return (
    <Tooltip content={PRIVACY_MESSAGES[privacy].tooltip}>
      {PRIVACY_MESSAGES[privacy].title}
      <Icon />
    </Tooltip>
  );
};
