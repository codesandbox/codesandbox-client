import * as React from 'react';
import { css } from '@styled-system/css';
import {
  Button,
  Menu,
  Icon,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { CurrentUser } from '@codesandbox/common/lib/types';
import { MemberAuthorization } from 'app/graphql/types';
import { ForkIcon } from '../icons';

interface TeamItemProps {
  name: string;
  avatar: string | null;
  onSelect: () => void;
}

const TeamItem = (props: TeamItemProps) => (
  <Menu.Item
    style={{
      paddingTop: 8,
      paddingBottom: 8,
      fontWeight: 500,
      opacity: 1,
      cursor: 'pointer',
    }}
    onSelect={props.onSelect}
  >
    <Stack gap={2} align="center">
      <TeamAvatar size="small" avatar={props.avatar} name={props.name} />{' '}
      <Text>{props.name}</Text>
    </Stack>
  </Menu.Item>
);

const DisabledTeamItem = (props: TeamItemProps) => (
  <Menu.Item
    style={{
      paddingTop: 8,
      paddingBottom: 8,
      fontWeight: 500,
      opacity: 0.4,
      cursor: 'not-allowed',
    }}
    onSelect={props.onSelect}
  >
    <Tooltip label="You don't have access to fork this sandbox">
      <Stack gap={2} align="center">
        <TeamAvatar size="small" avatar={props.avatar} name={props.name} />
        <Text>{props.name}</Text>
      </Stack>
    </Tooltip>
  </Menu.Item>
);

interface ITeamItem {
  teamId: string;
  teamName: string;
  teamAvatar: string | null;
  userAuthorizations: MemberAuthorization[];
}

interface TeamOrUserItemProps {
  item: ITeamItem;
  forkClicked: (teamId: string) => void;
  disabled: boolean;
}
const TeamOrUserItem: React.FC<TeamOrUserItemProps> = props => {
  if (props.disabled) {
    return (
      <DisabledTeamItem
        name={props.item.teamName}
        avatar={props.item.teamAvatar}
        onSelect={() => {}}
      />
    );
  }

  return (
    <TeamItem
      onSelect={() => {
        const item = props.item as ITeamItem;
        props.forkClicked(item.teamId);
      }}
      name={props.item.teamName}
      avatar={props.item.teamAvatar}
    />
  );
};

interface ForkButtonProps {
  variant: 'primary' | 'secondary';
  forkClicked: (teamId?: string | null) => void;
  user: CurrentUser;
}

export const ForkButton: React.FC<ForkButtonProps> = props => {
  const state = useAppState();
  const { user } = props;
  let teams: ITeamItem[] = [];
  let currentSpace: ITeamItem | null = null;
  let otherWorkspaces: ITeamItem[] = [];

  const primarySpace = state.dashboard.teams.find(
    t => t.id === state.primaryWorkspaceId
  );

  const allTeams: {
    id: string;
    name: string;
    avatarUrl: string;
    userAuthorizations: MemberAuthorization[];
  }[] = [
    ...(primarySpace ? [primarySpace] : []),
    ...state.dashboard.teams.filter(t => state.primaryWorkspaceId),
  ].filter(Boolean);

  if (allTeams.length) {
    teams = allTeams.map(team => ({
      teamId: team.id,
      teamName: team.name,
      teamAvatar: team.avatarUrl,
      userAuthorizations: team.userAuthorizations,
    }));
    currentSpace = teams.find(t => t.teamId === state.activeTeam)!;
    otherWorkspaces = teams.filter(t => t !== currentSpace)!;
  }

  // if this user is not part of this workspace,
  // they should not be able to fork inside the workspace
  const inActiveWorkspace =
    !state.activeTeam ||
    state.editor.currentSandbox.team?.id === state.activeTeam;
  const preventForkInsideWorkspace =
    state.activeWorkspaceAuthorization === 'READ' || !inActiveWorkspace;

  const preventForksOutsideWorkspace =
    state.editor.currentSandbox.permissions?.preventSandboxLeaving;

  // If you can't fork at all, hide the button completely
  if (preventForkInsideWorkspace && preventForksOutsideWorkspace) return null;

  return (
    <Stack>
      {preventForkInsideWorkspace && otherWorkspaces.length !== 0 ? null : (
        <Button
          onClick={() => props.forkClicked()}
          loading={state.editor.isForkingSandbox}
          variant={props.variant}
          css={
            otherWorkspaces.length
              ? {
                  width: 'calc(100% - 26px)',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }
              : {}
          }
        >
          <ForkIcon css={css({ height: 3, marginRight: 1 })} /> Fork
        </Button>
      )}
      {otherWorkspaces.length ? (
        <Tooltip
          label={
            preventForksOutsideWorkspace
              ? 'You don not have permission to fork this sandbox outside of the workspace'
              : null
          }
        >
          <div>
            <Menu>
              <Menu.Button
                variant={props.variant}
                disabled={preventForksOutsideWorkspace}
                css={
                  preventForkInsideWorkspace
                    ? {}
                    : {
                        width: '26px',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }
                }
              >
                {preventForkInsideWorkspace ? (
                  <>
                    <ForkIcon css={css({ height: 3, marginRight: 1 })} />{' '}
                    <Text css={css({ marginRight: 2 })}>Fork</Text>
                  </>
                ) : null}

                <Icon size={8} name="caret" />
              </Menu.Button>

              <Menu.List
                css={css({
                  fontSize: 2,
                  lineHeight: 1,
                })}
                style={{
                  paddingTop: 4,
                  paddingBottom: 4,
                  marginLeft: '-4rem',
                  marginTop: -4,
                }}
              >
                {currentSpace && (
                  <TeamOrUserItem
                    forkClicked={props.forkClicked}
                    item={currentSpace}
                    disabled={state.activeWorkspaceAuthorization === 'READ'}
                  />
                )}

                <Menu.Divider />
                {otherWorkspaces.map((space, i) => (
                  <TeamOrUserItem
                    key={space.teamId}
                    forkClicked={props.forkClicked}
                    item={space}
                    disabled={
                      space.userAuthorizations.find(
                        authorization => authorization.userId === user.id
                      )?.authorization === 'READ'
                    }
                  />
                ))}
              </Menu.List>
            </Menu>
          </div>
        </Tooltip>
      ) : null}
    </Stack>
  );
};
