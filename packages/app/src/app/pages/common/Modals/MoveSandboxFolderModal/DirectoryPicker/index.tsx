import React, { ComponentProps, FunctionComponent } from 'react';

import { SandboxesItem } from './SandboxesItem';
import { TeamsPicker } from './TeamsPicker';

type Props = Pick<
  ComponentProps<typeof TeamsPicker>,
  'currentPath' | 'currentTeamId' | 'onSelect'
>;
export const DirectoryPicker: FunctionComponent<Props> = ({
  currentPath,
  currentTeamId,
  onSelect,
}) => (
  <SandboxesItem
    currentPath={currentPath}
    currentTeamId={currentTeamId}
    onSelect={onSelect}
    teamId={currentTeamId}
  />
);
