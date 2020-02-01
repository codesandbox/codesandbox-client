import { useQuery } from '@apollo/react-hooks';
import React, { ComponentProps, FunctionComponent } from 'react';

import { TEAMS_QUERY } from 'app/pages/Dashboard/queries';
import { SandboxesItem } from 'app/pages/Dashboard/Sidebar/SandboxesItem';

import { TeamContainer, TeamName } from './elements';

type Props = Pick<
  ComponentProps<typeof SandboxesItem>,
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

  return (
    <>
      {data.me.teams.map(({ id, name }) => (
        <TeamContainer key={id}>
          <TeamName>{name}</TeamName>

          <SandboxesItem
            currentPath={currentPath}
            currentTeamId={currentTeamId}
            openByDefault
            teamId={id}
            onSelect={onSelect}
          />
        </TeamContainer>
      ))}
    </>
  );
};
