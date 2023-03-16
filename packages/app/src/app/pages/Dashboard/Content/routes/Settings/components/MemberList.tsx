// import React from 'react';
// import { css } from '@styled-system/css';
// import {
//   List,
//   ListAction,
//   Grid,
//   Column,
//   Stack,
//   Avatar,
//   Menu,
//   Text,
//   Icon,
//   Badge,
// } from '@codesandbox/components';
// import { TeamMemberAuthorization } from 'app/graphql/types';

// const permissionMap = {
//   ADMIN: 'Admin',
//   WRITE: 'Editor',
//   READ: 'Viewer',
//   PENDING: 'Pending...',
// };

// export type User = {
//   id: string;
//   avatarUrl: string;
//   username: string;
// };

// type ActionType = {
//   label: string;
//   onSelect: () => void;
// };

// type getActionsType = (user: User) => Array<ActionType>;

// interface MemberListProps {
//   getPermission: (user: User) => string;
//   getPermissionOptions: getActionsType;
//   getActions: getActionsType;
//   users: User[];
//   currentUserId?: string;
// }

// export const MemberList: React.FC<MemberListProps> = ({
//   getPermission,
//   getPermissionOptions,
//   getActions,
//   users,
//   currentUserId,
// }) => (
//   <List>
//     {users.map(user => {
//       const actions = getActions(user);
//       const userPermission = getPermission(user);
//       const permissionActions = getPermissionOptions(user);

//       return (
//         <ListAction
//           key={user.username}
//           align="center"
//           justify="space-between"
//           css={css({
//             height: 64,
//             borderBottom: '1px solid',
//             borderColor: 'grays.600',
//           })}
//         >
//           <Grid css={{ width: '100%' }}>
//             <Column span={6}>
//               <Stack
//                 gap={4}
//                 align="center"
//                 css={{ height: '100%', width: '100%' }}
//               >
//                 <Avatar user={user} />
//                 <Stack align="center" gap={2}>
//                   <Text size={3}>{user.username}</Text>
//                   {user.id === currentUserId ? (
//                     <Text size={3} variant="muted">
//                       (You)
//                     </Text>
//                   ) : null}
//                   {userPermission === TeamMemberAuthorization.Admin ? (
//                     <Badge>Admin</Badge>
//                   ) : null}
//                 </Stack>
//               </Stack>
//             </Column>
//             <Column span={6}>
//               <Stack
//                 justify="space-between"
//                 align="center"
//                 css={{ height: '100%' }}
//               >
//                 {permissionActions.length ? (
//                   <Menu>
//                     <Menu.Button
//                       style={{ paddingLeft: 0, paddingRight: 0 }}
//                       css={css({ fontSize: 3, fontWeight: 'normal' })}
//                     >
//                       <Text variant="muted">
//                         {permissionMap[userPermission]}
//                       </Text>
//                       <Icon name="caret" size={8} marginLeft={1} />
//                     </Menu.Button>
//                     <Menu.List>
//                       {permissionActions.map(action => (
//                         <Menu.Item
//                           key={action.label}
//                           onSelect={action.onSelect}
//                           style={{ display: 'flex', alignItems: 'center' }}
//                         >
//                           <Text style={{ width: '100%' }}>{action.label}</Text>
//                           {action.label === permissionMap[userPermission] && (
//                             <Icon
//                               style={{}}
//                               name="simpleCheck"
//                               size={12}
//                               marginLeft={1}
//                             />
//                           )}
//                         </Menu.Item>
//                       ))}
//                     </Menu.List>
//                   </Menu>
//                 ) : (
//                   <Text variant="muted" size={3} css={css({ width: '100%' })}>
//                     {permissionMap[getPermission(user)]}
//                   </Text>
//                 )}
//                 {actions.length > 0 ? (
//                   <Menu>
//                     <Menu.IconButton
//                       name="more"
//                       size={9}
//                       title="Member options"
//                     />
//                     <Menu.List>
//                       {actions.map(action => (
//                         <Menu.Item
//                           key={action.label}
//                           onSelect={action.onSelect}
//                         >
//                           {action.label}
//                         </Menu.Item>
//                       ))}
//                     </Menu.List>
//                   </Menu>
//                 ) : null}
//               </Stack>
//             </Column>
//           </Grid>
//         </ListAction>
//       );
//     })}
//   </List>
// );

import React from 'react';

import {
  Avatar,
  Badge,
  Column,
  Grid,
  // Icon,
  List,
  ListAction,
  // Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import {
  // useActions,
  useAppState,
} from 'app/overmind';
import {
  // CurrentTeamInfoFragmentFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { sortBy } from 'lodash-es';
// import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

// type User = CurrentTeamInfoFragmentFragment['users'][number];

// type Action = {
//   name: string;
//   disabled?: boolean;
//   onSelect: () => void;
// };

type Role = Exclude<TeamMemberAuthorization, TeamMemberAuthorization.Admin>;

const ROLE_MAP: Record<Role, string> = {
  WRITE: 'Editor',
  READ: 'Viewer',
};

type AuthorizationsMap = {
  [userId: string]: {
    userId: string;
    teamManager: boolean;
    teamAdmin: boolean;
    role: Role;
  };
};

// type MemberListProps = {
//   availableEditorSeats: number;
// };
export const MembersList: React.FC = () => {
  const { activeTeamInfo, user: currentUser } = useAppState();
  // const { isTeamAdmin } = useWorkspaceAuthorization();

  if (activeTeamInfo === null) {
    return null;
  }

  const currentUserId = currentUser?.id;
  const {
    // invitees,
    users,
    userAuthorizations,
  } = activeTeamInfo;

  const authorizationsMap = userAuthorizations.reduce((acc, auth) => {
    const { userId, authorization, teamManager } = auth;
    const isAdmin = authorization === TeamMemberAuthorization.Admin;

    acc[userId] = {
      userId,
      teamManager,
      teamAdmin: isAdmin,
      role: isAdmin ? TeamMemberAuthorization.Write : authorization,
    };

    return acc;
  }, {} as AuthorizationsMap);

  return (
    <List>
      {sortBy(users, u => u.id !== currentUserId).map(user => {
        const authorization = authorizationsMap[user.id];

        return (
          <ListAction
            key={user.id}
            align="center"
            justify="space-between"
            css={{
              height: 64,
              borderBottom: '1px solid #242424',
            }}
          >
            <Grid css={{ width: '100%', alignItems: 'center' }}>
              <Column span={6}>
                <Stack align="center" gap={6}>
                  <Avatar user={user} />
                  <Stack align="center" gap={2}>
                    <Text size={3}>{user.username}</Text>
                    {user.id === currentUserId ? (
                      <Text size={3} variant="muted">
                        (You)
                      </Text>
                    ) : null}
                    {authorization.teamAdmin ? <Badge>Admin</Badge> : null}
                    {authorization.teamManager ? <Badge>Billing</Badge> : null}
                  </Stack>
                </Stack>
              </Column>
              <Column span={5}>
                <Text size={3}>{ROLE_MAP[authorization.role]}</Text>
              </Column>
              <Column span={1} />
            </Grid>
          </ListAction>
        );
      })}
    </List>
  );
};
