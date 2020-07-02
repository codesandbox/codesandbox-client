import React, { useEffect } from 'react';
import { css } from '@styled-system/css';
import { Button, Menu, Icon, Stack, Avatar } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { ForkIcon } from '../icons';

interface TeamItemProps {
  id: string;
  name: string;
  onSelect: () => void;
}

const TeamItem = (props: TeamItemProps) => (
  <Menu.Item onSelect={props.onSelect}>
    <Stack style={{ alignItems: 'center' }}>
      <TeamAvatar
        css={css({ marginRight: 2 })}
        size="small"
        name={props.name}
      />{' '}
      {props.name}
    </Stack>
  </Menu.Item>
);

interface UserItemProps {
  id: string;
  username: string;
  avatarUrl: string;
  onSelect: () => void;
}

const UserItem = (props: UserItemProps) => (
  <Menu.Item onSelect={props.onSelect}>
    <Stack style={{ alignItems: 'center' }}>
      <Avatar
        css={css({ marginRight: 2, size: 6 })}
        user={{
          avatarUrl: props.avatarUrl,
          username: props.username,
        }}
      />{' '}
      {props.username} (Personal)
    </Stack>
  </Menu.Item>
);

type TeamItem = {
  type: 'team';
  teamId: string;
  teamName: string;
};

type UserItem = {
  type: 'user';
  userId: string;
  username: string;
  avatarUrl: string;
};

type TeamOrUser = TeamItem | UserItem;

interface TeamOrUserItemProps {
  item: TeamOrUser;
  forkClicked: (teamId?: string | null) => void;
}
const TeamOrUserItem: React.FC<TeamOrUserItemProps> = props => {
  if (props.item.type === 'team') {
    return (
      <TeamItem
        id={props.item.teamId}
        onSelect={() => {
          const item = props.item as TeamItem;
          props.forkClicked(item.teamId);
        }}
        name={props.item.teamName}
      />
    );
  }

  return (
    <UserItem
      id={props.item.userId}
      username={props.item.username}
      avatarUrl={props.item.avatarUrl}
      onSelect={() => {
        props.forkClicked(null);
      }}
    />
  );
};

interface ForkButtonProps {
  variant: 'primary' | 'secondary';
  forkClicked: (teamId?: string | null) => void;
}

export const ForkButton: React.FC<ForkButtonProps> = props => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    if (state.dashboard.teams.length === 0 && state.user) {
      actions.dashboard.getTeams();
    }
  }, [state.user, state.dashboard.teams, actions.dashboard]);

  const userSpace = {
    type: 'user' as 'user',
    userId: state.user.id,
    avatarUrl: state.user.avatarUrl,
    username: state.user.username,
  };

  const allTeams: TeamOrUser[] = [
    userSpace,
    ...state.dashboard.teams.map(team => ({
      type: 'team' as 'team',
      teamId: team.id,
      teamName: team.name,
    })),
  ];

  const currentSpace: TeamOrUser =
    allTeams.find(t =>
      state.activeTeam == null
        ? t.type === 'user'
        : t.type === 'team' && t.teamId === state.activeTeam
    ) || userSpace;
  const otherWorkspaces: TeamOrUser[] = allTeams.filter(
    t => t !== currentSpace
  );

  return (
    <Stack>
      <Button
        onClick={() => props.forkClicked()}
        variant={props.variant}
        css={{
          width: 'calc(100% - 26px)',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <ForkIcon css={css({ height: 3, marginRight: 1 })} /> Fork
      </Button>
      <Menu>
        <Menu.Button
          variant={props.variant}
          css={{
            width: '26px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <Icon size={8} name="caret" />
        </Menu.Button>
        <Menu.List>
          <TeamOrUserItem forkClicked={props.forkClicked} item={currentSpace} />
          <Menu.Divider />
          {otherWorkspaces.map((space, i) => (
            <TeamOrUserItem
              key={space.type === 'user' ? 'personal' : space.teamId}
              forkClicked={props.forkClicked}
              item={space}
            />
          ))}
        </Menu.List>
      </Menu>
    </Stack>
  );
};
