import React from 'react';
import css from '@styled-system/css';
import { Button, Stack, Text, Menu, Icon } from '@codesandbox/components';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { useActions, useEffects } from 'app/overmind';
import {
  CurrentTeamInfoFragmentFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

const INVITE_ROLES_MAP = {
  [TeamMemberAuthorization.Admin]: [
    TeamMemberAuthorization.Write,
    TeamMemberAuthorization.Read,
  ],
  [TeamMemberAuthorization.Write]: [TeamMemberAuthorization.Read],

  [TeamMemberAuthorization.Read]: [],
};

const ROLES_TEXT_MAP = {
  [TeamMemberAuthorization.Write]: 'Editor',
  [TeamMemberAuthorization.Read]: 'Viewer',
};

type InviteMemberProps = {
  isPro: boolean;
  numberOfUnusedSeats: number;
  team: CurrentTeamInfoFragmentFragment;
};
export const InviteMember: React.FC<InviteMemberProps> = ({
  isPro,
  numberOfUnusedSeats,
  team,
}) => {
  const effects = useEffects();
  const actions = useActions();
  const { userRole } = useWorkspaceAuthorization();

  const [inviteValue, setInviteValue] = React.useState('');
  const [inviteLoading, setInviteLoading] = React.useState(false);

  // We use `role` as the common term when referring to: `admin`, `editor` or `viewer`
  // But away from the team settings page and on the BE, the term `authorization` is used
  const rolesThatUserCanInvite = INVITE_ROLES_MAP[userRole];

  const defaultRoleToInvite = rolesThatUserCanInvite.includes(
    team?.settings.defaultAuthorization
  )
    ? team?.settings.defaultAuthorization
    : TeamMemberAuthorization.Read;

  const [newMemberRole, setNewMemberRole] = React.useState<
    TeamMemberAuthorization
  >(defaultRoleToInvite);

  // if the user is going to be charged for adding a member
  // throw them a confirmation modal
  const confirmNewMemberAddition =
    isPro &&
    numberOfUnusedSeats === 0 &&
    newMemberRole !== TeamMemberAuthorization.Read;

  const onInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteLoading(true);

    const inviteLink = teamInviteLink(team.inviteToken);

    await actions.dashboard.inviteToTeam({
      value: inviteValue,
      authorization: newMemberRole,
      confirm: confirmNewMemberAddition,
      triggerPlace: 'settings',
      inviteLink,
    });
    setInviteLoading(false);
    setInviteValue('');
  };

  const onCopyInviteUrl = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (confirmNewMemberAddition) {
      const confirmed = await actions.modals.alertModal.open({
        title: 'Invite New Member',
        customComponent: 'MemberPaymentConfirmation',
      });
      if (!confirmed) return;
    }

    const inviteLink = teamInviteLink(team.inviteToken);

    actions.track({
      name: 'Dashboard - Copied Team Invite URL',
      data: { place: 'settings', inviteLink },
    });
    effects.browser.copyToClipboard(inviteLink);
    effects.notificationToast.success('Copied Team Invite URL!');
  };

  return (
    <Stack as="form" onSubmit={inviteLoading ? undefined : onInviteSubmit}>
      <div style={{ position: 'relative', width: '100%' }}>
        <UserSearchInput
          inputValue={inviteValue}
          allowSelf={false}
          onInputValueChange={val => setInviteValue(val)}
          style={{ paddingRight: 80 }}
        />

        <Menu>
          <Menu.Button
            css={css({
              fontSize: 3,
              fontWeight: 'normal',
              paddingX: 0,
              position: 'absolute',
              top: 0,
              right: 2,
            })}
          >
            <Text variant="muted">{ROLES_TEXT_MAP[newMemberRole]}</Text>
            <Icon name="caret" size={8} marginLeft={1} />
          </Menu.Button>
          <Menu.List>
            {rolesThatUserCanInvite.map(role => (
              <Menu.Item
                key={role}
                onSelect={() => setNewMemberRole(role)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Text style={{ width: '100%' }}>{ROLES_TEXT_MAP[role]}</Text>
                {newMemberRole === role && (
                  <Icon name="simpleCheck" size={12} marginLeft={1} />
                )}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu>
      </div>

      <Button
        type="submit"
        loading={inviteLoading}
        style={{ width: 'auto', marginLeft: 8 }}
      >
        Add Member
      </Button>

      <Button
        variant="secondary"
        onClick={onCopyInviteUrl}
        style={{ width: 'auto', marginLeft: 8 }}
      >
        Copy Invite URL
      </Button>
    </Stack>
  );
};
