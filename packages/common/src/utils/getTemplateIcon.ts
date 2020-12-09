import React from 'react';
import { ColorIcons as Icons } from 'template-icons';
import getColorIcons from '../templates/icons';

export const getTemplateIcon = (iconUrl, environment) => {
  const UserIcon: React.FunctionComponent =
    iconUrl && Icons[iconUrl] ? Icons[iconUrl] : getColorIcons(environment);
  const OfficialIcon: React.FunctionComponent = getColorIcons(environment);

  return {
    UserIcon,
    OfficialIcon,
  };
};

export const ColorIcons = Icons;
