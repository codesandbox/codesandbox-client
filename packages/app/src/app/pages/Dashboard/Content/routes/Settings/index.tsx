import React from 'react';

import { useAppState } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';

export const Settings = () => {
  const { activeTeam, personalWorkspaceId } = useAppState();

  const Component =
    activeTeam === personalWorkspaceId ? UserSettings : TeamSettings;

  return (
    <Element css={css({ width: '100%', maxWidth: 1280 })} marginY={10}>
      <Component />
    </Element>
  );
};
