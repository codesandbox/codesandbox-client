import { useQuery } from '@apollo/react-hooks';
import React, { FunctionComponent } from 'react';

import { TEAMS_QUERY } from 'app/pages/Dashboard/queries';
import { SandboxesItem, SandboxesItemComponentProps } from '../SandboxesItem';

import { TeamContainer, TeamName } from './elements';

type Props = Pick<
  SandboxesItemComponentProps,
  'currentPath' | 'currentTeamId' | 'onSelect'
>;
export const TeamsPicker: FunctionComponent<Props> = ({
  currentPath,
  currentTeamId,
  onSelect,
}) => {
  const { loading, error, data } = useQuery(TEAMS_QUERY);

  if (loading || error) {
    return null;
  }

  return data.me.teams.map(({ id, name }) => (
    <TeamContainer key={id}>
      <TeamName>{name}</TeamName>

      <SandboxesItem
        currentPath={currentPath}
        currentTeamId={currentTeamId}
        teamId={id}
        onSelect={onSelect}
      />
    </TeamContainer>
  ));
};
