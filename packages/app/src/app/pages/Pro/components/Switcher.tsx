import React from 'react';

import { TeamAvatar } from 'app/components/TeamAvatar';
import styled from 'styled-components';
import {
  Badge,
  Stack,
  Avatar,
  Menu,
  Icon,
  Element,
  Text,
  Tooltip,
} from '@codesandbox/components';
import {
  CurrentTeamInfoFragmentFragment,
  SubscriptionType,
  TeamFragmentDashboardFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { Caption } from './elements';

const StyledMenuButton = styled(Menu.Button)`
  height: auto;
  padding: 8px 12px;
  color: #ebebeb;

  // Turned off the transition as it was causing a weird
  // flicker when focussing the button
  transition: none;

  &:hover,
  &:focus {
    color: #ffffff;
    background-color: #252525;
  }

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

const MenuTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack gap={2} as={StyledMenuButton}>
      {children}
      <Icon css={{ color: '#fff' }} name="chevronDown" size={8} />
    </Stack>
  );
};

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
  // move this check up, shouldn't happen
  if (!workspaces || workspaces.length === 0) return null;

  // 🚮
  const members = activeTeamInfo.users.length;
  const memberLabel = `${members} member${members > 1 ? 's' : ''}`;
  const isPersonalWorkspace = workspaceType === 'pro';
  const isFreeWorkspace = ![
    SubscriptionType.TeamPro,
    SubscriptionType.PersonalPro,
  ].includes(activeTeamInfo.subscription?.type);

  return (
    <Menu>
      <MenuTrigger>
        <Text>{activeTeamInfo.name}</Text>
        {isFreeWorkspace ? <Badge variant="trial">Free</Badge> : null}
      </MenuTrigger>

      <MenuList>
        <Element css={{ minWidth: 290, maxHeight: 600, overflow: 'auto' }}>
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
              workspace.userAuthorizations.find(team => team.userId === userId)
                .authorization === TeamMemberAuthorization.Admin;
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
                style={{ opacity: disabled ? 0.5 : 1, padding: 0 }}
              >
                <Stack css={{ padding: '12px 24px' }} align="center">
                  <TeamAvatar
                    size="small"
                    avatar={workspace.avatarUrl}
                    name={workspace.name}
                  />

                  <Stack direction="vertical" css={{ flex: 1, marginLeft: 19 }}>
                    <Stack gap={1}>
                      <Text size={4}>
                        {workspace.id === personalWorkspaceId
                          ? 'Personal'
                          : workspace.name}
                      </Text>
                    </Stack>

                    <Text size={3}>
                      {workspace.id !== personalWorkspaceId ? seatsLabel : null}
                    </Text>
                  </Stack>

                  {!isPro && <Badge variant="trial">Free</Badge>}
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
                  width: 24,
                  height: 24,
                  backgroundColor: '#252525',
                }}
              >
                <Icon name="plus" size={16} />
              </Stack>

              <Text size={4} css={{ marginLeft: 19 }}>
                Create a new team
              </Text>
            </Stack>
          </MenuItem>
        </Element>
      </MenuList>
    </Menu>
  );
};

const Dialog = styled.div`
  position: absolute;
  top: 40px;
  height: 148px;

  background: #373737;

  border: 1px solid #2a2a2a;
  box-sizing: border-box;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.15);

  display: none;

  &:before {
    content: '';
    height: 10px;
    width: 100%;
    position: absolute;
    top: -10px;
    display: block;
  }
`;

const WorkspaceName = styled.p`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 28px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: -0.01em;

  margin: 0;
  text-align: left;
  color: #e5e5e5;

  & span::-moz-selection {
    -webkit-text-stroke: 1px #e5e5e5;
    color: transparent;
    background: transparent;
  }

  & span::selection {
    -webkit-text-stroke: 1px #e5e5e5;
    color: transparent;
    background: transparent;
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
  position: relative;

  &:hover ${Dialog} {
    display: block;
  }

  span {
    margin: auto;
    font-size: 12px;
  }
`;

const MenuList = styled(Menu.List)`
  &[data-reach-menu-list][data-component='MenuList'] {
    background-color: #373737;
    margin-top: 10px;
    margin-left: -2px;
    border: 0;
    border-radius: 0;
    overflow: visible;
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
