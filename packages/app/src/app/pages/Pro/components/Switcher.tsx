import React from 'react';

import { TeamAvatar } from 'app/components/TeamAvatar';
import styled from 'styled-components';
import {
  Badge,
  Stack,
  Menu,
  Icon,
  Element,
  Text,
} from '@codesandbox/components';
import {
  CurrentTeamInfoFragmentFragment,
  TeamType,
  TeamFragmentDashboardFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { determineSpecialBadges } from 'app/utils/teams';

export const Switcher: React.FC<{
  workspaces: TeamFragmentDashboardFragment[];
  setActiveTeam: (payload?: { id: string }) => Promise<void>;
  activeTeamInfo: CurrentTeamInfoFragmentFragment;
}> = ({ workspaces, setActiveTeam, activeTeamInfo }) => {
  const {
    isLegacyFreeTeam,
    isLegacyPersonalPro,
    isInactiveTeam,
  } = useWorkspaceSubscription();
  const { openCreateTeamModal } = useActions();
  const { user } = useAppState();

  return (
    <Menu>
      <MenuTrigger>
        <Text>{activeTeamInfo.name}</Text>
        {isLegacyFreeTeam ? <Badge variant="trial">Free</Badge> : null}
        {isLegacyPersonalPro ? <Badge variant="pro">Pro</Badge> : null}
        {isInactiveTeam ? <Badge variant="neutral">Inactive</Badge> : null}
      </MenuTrigger>

      <MenuList>
        <Element css={{ minWidth: 290, maxHeight: 600, overflow: 'auto' }}>
          <Text
            size={12}
            lineHeight="16px"
            css={{ display: 'block', padding: '8px 24px' }}
          >
            Select team to upgrade
          </Text>

          {workspaces.map(workspace => {
            if (!workspace) return null;

            const userAuthorization = workspace.userAuthorizations.find(
              ({ userId }) => userId === user?.id
            );

            const {
              isPersonalProLegacy,
              isTeamFreeLegacy,
              isInactive,
            } = determineSpecialBadges(workspace);

            const isBillingManager =
              userAuthorization?.authorization ===
                TeamMemberAuthorization.Admin || userAuthorization?.teamManager;

            const isTrialEligible =
              workspace.type === TeamType.Team &&
              workspace.subscription === null;

            const disabled = !(isBillingManager || isTrialEligible);

            return (
              <MenuItem
                onSelect={() => setActiveTeam(workspace)}
                key={workspace.id}
                disabled={disabled}
                style={{ opacity: disabled ? 0.5 : 1, padding: 0 }}
              >
                <Stack css={{ padding: '12px 24px' }} align="center" gap={4}>
                  <TeamAvatar
                    size="small"
                    avatar={workspace.avatarUrl}
                    name={workspace.name}
                    css={{ border: '1px solid #5f5f5d', borderRadius: '2px' }}
                  />

                  <Stack
                    align="center"
                    justify="space-between"
                    gap={3}
                    css={{ flex: 1 }}
                  >
                    <Text
                      size={4}
                      css={{
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {workspace.name}
                    </Text>
                    {isTeamFreeLegacy && <Badge variant="trial">Free</Badge>}
                    {isPersonalProLegacy && <Badge variant="pro">Pro</Badge>}
                    {isInactive && <Badge variant="neutral">Inactive</Badge>}
                  </Stack>
                </Stack>
              </MenuItem>
            );
          })}

          <Element marginY={2} css={{ borderTop: '1px solid #5f5f5d' }} />

          <MenuItem onSelect={openCreateTeamModal}>
            <Stack
              gap={4}
              align="center"
              as={Element}
              marginY={2}
              paddingY={3}
              paddingX={6}
            >
              <Stack
                justify="center"
                align="center"
                css={{
                  width: '24px', // To match Avatar
                  height: '24px', // To match Avatar
                  border: '1px solid #5f5f5d',
                  borderRadius: '2px',
                }}
              >
                <Icon name="plus" size={16} css={{ display: 'block' }} />
              </Stack>

              <Text size={4}>Create a new team</Text>
            </Stack>
          </MenuItem>
        </Element>
      </MenuList>
    </Menu>
  );
};

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
