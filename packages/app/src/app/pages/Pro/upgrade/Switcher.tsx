import React from 'react';

import { TeamAvatar } from 'app/components/TeamAvatar';
import styled from 'styled-components';
import {
  Stack,
  Avatar,
  Menu,
  Icon,
  Element,
  Text,
} from '@codesandbox/components';
import {
  CurrentTeamInfoFragmentFragment,
  SubscriptionType,
  TeamFragmentDashboardFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { Caption } from './elements';

export const Switcher: React.FC<{
  workspaces: TeamFragmentDashboardFragment[];
  setActiveTeam: (payload?: { id: string }) => Promise<void>;
  workspaceType: 'pro' | 'teamPro';
  activeTeamInfo: CurrentTeamInfoFragmentFragment;
  personalWorkspaceId: string;
  userId: string;
  openCreateTeamModal: () => void;
}> = ({
  workspaces,
  workspaceType,
  setActiveTeam,
  personalWorkspaceId,
  activeTeamInfo,
  userId,
  openCreateTeamModal,
}) => {
  if (!workspaces || workspaces.length === 0) return null;

  const members = activeTeamInfo.users.length;
  const memberLabel = `${members} member${members > 1 ? 's' : ''}`;
  const isPersonalWorkspace = workspaceType === 'pro';

  return (
    <Stack justify="space-between" align="center">
      <Menu>
        <Stack as={Menu.Button} css={{ padding: 0, height: 'auto' }}>
          <TeamAvatar
            size="bigger"
            avatar={activeTeamInfo?.avatarUrl}
            name={activeTeamInfo.name}
          />

          <Stack css={{ marginLeft: 24, marginTop: -6 }} direction="vertical">
            <WorkspaceName>{activeTeamInfo.name}</WorkspaceName>
            <WorkspaceType>
              {isPersonalWorkspace ? 'personal team' : memberLabel}
            </WorkspaceType>
          </Stack>
        </Stack>

        <MenuList>
          <Element css={{ minWidth: 290 }}>
            <Caption
              css={{
                margin: 0,
                height: 40,
                lineHeight: '40px',
                paddingTop: 8,
                paddingLeft: 24,
                color: '#999999',
              }}
            >
              Select team to upgrade
            </Caption>

            {workspaces.map(workspace => {
              if (!workspace) return null;

              const seats = workspace.users.length;
              const seatsLabel = `${seats} member${seats > 1 ? 's' : ''}`;

              const isAdmin =
                workspace.userAuthorizations.find(
                  team => team.userId === userId
                ).authorization === TeamMemberAuthorization.Admin;
              const isPro = [
                SubscriptionType.TeamPro,
                SubscriptionType.PersonalPro,
              ].includes(workspace.subscription?.type);
              const disabled = !isAdmin || isPro;

              return (
                <MenuItem
                  onSelect={() => setActiveTeam(workspace)}
                  key={workspace.id}
                  disabled={disabled}
                  style={{ opacity: disabled ? 0.5 : 1 }}
                >
                  <Stack css={{ padding: '12px 24px' }} align="center">
                    <TeamAvatar
                      size="small"
                      avatar={workspace.avatarUrl}
                      name={workspace.name}
                    />

                    <Stack
                      direction="vertical"
                      css={{ flex: 1, marginLeft: 19 }}
                    >
                      <Stack>
                        <Text size={4}>{workspace.name}</Text>
                        {isPro && <ProBadge>Pro</ProBadge>}
                      </Stack>

                      <Text size={3}>
                        {workspace.id === personalWorkspaceId
                          ? 'personal team'
                          : seatsLabel}
                      </Text>
                    </Stack>

                    {workspace.id === activeTeamInfo.id && (
                      <Icon css={{ marginLeft: 16 }} name="simpleCheck" />
                    )}
                  </Stack>
                </MenuItem>
              );
            })}

            <MenuItem onSelect={openCreateTeamModal}>
              <Stack
                css={{
                  marginTop: 12,
                  padding: 24,
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                align="center"
              >
                <Stack
                  justify="center"
                  align="center"
                  css={{
                    border: '1px solid #C5C5C5',
                    width: 24,
                    height: 24,
                  }}
                >
                  <Icon name="plus" size={14} />
                </Stack>

                <Text size={4} css={{ marginLeft: 19 }}>
                  Create a new team
                </Text>
              </Stack>
            </MenuItem>
          </Element>
        </MenuList>
      </Menu>

      <Stack>
        {!isPersonalWorkspace && (
          <>
            {activeTeamInfo.users.map((user, index) => {
              if (index > (activeTeamInfo.users.length > 4 ? 2 : 3)) {
                return null;
              }

              return (
                <Avatar css={{ marginLeft: 4 }} user={user} key={user.id} />
              );
            })}

            {members - 3 > 1 && (
              <WorkspaceSeats>
                <span>{members - 3}</span>
              </WorkspaceSeats>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

const WorkspaceName = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 42px;
  margin: 0;
  position: relative;
  text-align: left;
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

const WorkspaceType = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin: 0;
  text-align: left;

  color: #808080;
`;

const WorkspaceSeats = styled.div`
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

const MenuList = styled(Menu.List)`
  &[data-reach-menu-list][data-component='MenuList'] {
    background-color: #373737;
    margin-top: 36px;
    margin-left: -4px;
    border: 0;
    border-radius: 0;
    overflow: visible;

    &:before {
      content: '';
      border: 15px solid transparent;
      border-bottom: 15px solid #373737;
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
    }
  }
`;

const MenuItem = styled(Menu.Item)`
  &[data-reach-menu-item][data-component='MenuItem'] {
    padding: 0;

    &[data-selected] {
      background-color: #484848;
    }
  }
`;

const ProBadge = styled.p`
  border-radius: 2px;
  background-color: rgba(229, 229, 229, 0.1);
  color: #c5c5c5;

  width: 35px;
  height: 18px;

  text-align: center;
  line-height: 18px;
  font-size: 13px;

  margin: 0 0 0 8px;
`;
