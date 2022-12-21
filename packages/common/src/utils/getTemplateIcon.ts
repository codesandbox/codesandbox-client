import React from 'react';
import { ColorIcons as Icons } from 'template-icons';
import getColorIcons from '../templates/icons';

export const getTemplateIcon = (iconUrl: string | undefined, environment) => {
  const UserIcon: React.FunctionComponent<{ width?: string; height?: string }> =
    iconUrl && Icons[iconUrl] ? Icons[iconUrl] : getColorIcons(environment);
  const OfficialIcon: React.FunctionComponent<{
    width?: string;
    height?: string;
  }> = getColorIcons(environment);

  return {
    UserIcon,
    OfficialIcon,
  };
};

export const ColorIcons = Icons;
