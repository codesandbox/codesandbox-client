import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import styled from 'styled-components';
import { Stack, Avatar, Menu } from '@codesandbox/components';

export const Switcher = () => {
  const { setActiveTeam } = useActions();
  const { dashboard, activeTeamInfo, personalWorkspaceId } = useAppState();

  if (!dashboard.teams || !personalWorkspaceId) return null;

  const personalWorkspace = dashboard.teams.find(
    t => t.id === personalWorkspaceId
  )!;

  const workspaces = [
    personalWorkspace,
    ...sortBy(
      dashboard.teams.filter(t => t.id !== personalWorkspaceId),
      t => t.name.toLowerCase()
    ),
  ];

  const members = activeTeamInfo.users.length;
  const memberLabel = `${members} member${members > 1 ? 's' : ''}`;
  const isPersonalWorkspace = activeTeamInfo.id === personalWorkspaceId;

  return (
    <Stack justify="space-between" align="center">
      <Menu>
        <Stack as={Menu.Button}>
          <TeamAvatar
            size="bigger"
            avatar={activeTeamInfo?.avatarUrl}
            name={activeTeamInfo.name}
          />

          <Stack css={{ marginLeft: 24, marginTop: -6 }} direction="vertical">
            <Title>{activeTeamInfo.name}</Title>
            <Caption>
              {isPersonalWorkspace ? 'personal team' : memberLabel}
            </Caption>
          </Stack>
        </Stack>
        <Menu.List>
          {workspaces.map(workspace => (
            <Menu.Item
              onSelect={() => setActiveTeam(workspace)}
              key={workspace.id}
            >
              {workspace.name}
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>

      <Stack>
        {!isPersonalWorkspace && (
          <>
            {activeTeamInfo.users.map((user, index) => {
              if (index > 2) return null;

              return (
                <Avatar css={{ marginLeft: 4 }} user={user} key={user.id} />
              );
            })}

            {members - 3 > 0 && (
              <AvatarCounter>
                <span>{members - 3}</span>
              </AvatarCounter>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

const Title = styled.p`
  font-family: 'TWKEverett', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 42px;
  margin: 0;
  position: relative;

  color: #fff;

  &:after {
    content: '';
    position: absolute;
    right: -20px;
    top: calc(50% - 4px);
    border: 5px solid transparent;
    border-top: 7px solid white;
  }
`;

const Caption = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin: 0;
  text-align: left;

  color: #808080;
`;

const AvatarCounter = styled.div`
  background: #373737;
  border: 1 solid #2a2a2a;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  display: flex;
  margin-left: 4px;

  span {
    margin: auto;
    font-size: 12px;
  }
`;
