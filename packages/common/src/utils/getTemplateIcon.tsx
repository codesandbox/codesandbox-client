import React from 'react';
import { ColorIcons as Icons } from '@codesandbox/template-icons';
import getColorIcons from '../templates/icons';

function getUserIcon(
  templateName: string,
  iconUrl: string | undefined
): React.FunctionComponent<{ width?: string; height?: string }> | undefined {
  if (!iconUrl) {
    return undefined;
  }

  if (iconUrl.startsWith('https://')) {
    return ({ width, height }) => (
      <img
        width={width || 24}
        height={height || 24}
        src={iconUrl}
        alt={templateName}
      />
    );
  }

  return Icons[iconUrl];
}

export const getTemplateIcon = (
  templateName: string,
  iconUrl: string | undefined,
  environment
) => {
  const UserIcon: React.FunctionComponent<{ width?: string; height?: string }> =
    getUserIcon(templateName, iconUrl) || getColorIcons(environment);
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
