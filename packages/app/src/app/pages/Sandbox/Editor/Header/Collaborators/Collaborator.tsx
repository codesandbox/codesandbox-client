import React from 'react';
import { motion } from 'framer-motion';
import {
  Stack,
  Text,
  FormField,
  Switch,
  Element,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Authorization } from 'app/graphql/types';
import { formatDistanceToNow } from 'date-fns';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { LockIcon } from '@codesandbox/common/lib/components/icons/Lock';
import { GlobeIcon } from '@codesandbox/common/lib/components/icons/Globe';
import { LinkIcon } from '@codesandbox/common/lib/components/icons/Link';
import { PermissionSelect, GhostSelect } from './PermissionSelect';
import { Mail } from './icons';

interface ICollaboratorItemProps {
  authorization: Authorization;
  name: string | JSX.Element;
  permissions?: Authorization[];
  subtext?: string;
  avatarUrl?: string;
  avatarComponent?: JSX.Element | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  fillAvatar?: boolean;
  permissionPretext?: string;
  readOnly?: boolean;
}

export const CollaboratorItem = ({
  name,
  subtext,
  avatarUrl,
  avatarComponent = null,
  fillAvatar = true,
  authorization,
  onChange,
  readOnly,
  permissionPretext,
  permissions,
}: ICollaboratorItemProps) => (
  <Stack css={css({ width: '100%' })} align="center">
    <Stack gap={2} css={css({ width: '100%' })}>
      {avatarUrl ? (
        <img
          css={css({
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'dialog.border',
          })}
          alt={typeof name === 'string' ? name : ''}
          src={avatarUrl}
          width={32}
          height={32}
        />
      ) : (
        <div
          css={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: fillAvatar ? 'grays.500' : 'transparent',
            backgroundColor: fillAvatar ? 'grays.500' : 'transparent',
            width: 32,
            height: 32,
          })}
        >
          {avatarComponent}
        </div>
      )}
      <Stack justify="center" direction="vertical">
        {typeof name === 'string' ? (
          <Text size={3} color="white">
            {name}
          </Text>
        ) : (
          name
        )}
        {subtext && (
          <Text size={2} variant="muted">
            {subtext}
          </Text>
        )}
      </Stack>
    </Stack>

    <PermissionSelect
      onChange={onChange}
      value={authorization}
      disabled={readOnly}
      pretext={permissionPretext}
      additionalOptions={[{ label: 'Remove', value: 'remove' }]}
    />
  </Stack>
);

interface ICollaboratorProps {
  authorization: Authorization;
  userId: string;
  username: string;
  lastSeenAt: string | null;
  avatarUrl: string;

  readOnly?: boolean;
}

function getLiveUser(currentUserId: string, roomInfo: RoomInfo) {
  return roomInfo?.users?.find(u => u.userId === currentUserId);
}

export const Collaborator = ({
  username,
  userId,
  avatarUrl,
  authorization,
  lastSeenAt,
  readOnly,
}: ICollaboratorProps) => {
  const { actions, state } = useOvermind();

  const updateAuthorization = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'remove') {
      actions.editor.removeCollaborator({
        username,
        sandboxId: state.editor.currentId,
      });
    } else {
      actions.editor.changeCollaboratorAuthorization({
        username,
        sandboxId: state.editor.currentId,
        authorization: event.target.value as Authorization,
      });
    }
  };

  const currentLiveUser = getLiveUser(userId, state.live?.roomInfo);
  const subtext = currentLiveUser
    ? 'Viewing now'
    : lastSeenAt
    ? formatDistanceToNow(new Date(lastSeenAt), { addSuffix: true })
    : 'Not viewed yet';

  return (
    <CollaboratorItem
      name={username}
      subtext={subtext}
      avatarUrl={avatarUrl}
      onChange={updateAuthorization}
      authorization={authorization}
      readOnly={readOnly}
    />
  );
};

interface IInvitationProps {
  id: string;
  email: string;
  authorization: Authorization;
}

export const Invitation = ({ id, email, authorization }: IInvitationProps) => {
  const { actions, state } = useOvermind();

  const updateAuthorization = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // We have to do something here
    if (event.target.value === 'remove') {
      actions.editor.revokeSandboxInvitation({
        invitationId: id,
        sandboxId: state.editor.currentId,
      });
    } else {
      actions.editor.changeInvitationAuthorization({
        invitationId: id,
        sandboxId: state.editor.currentId,
        authorization: event.target.value as Authorization,
      });
    }
  };

  return (
    <CollaboratorItem
      name={email}
      subtext="Not viewed yet"
      avatarComponent={<Mail width={24} height={24} />}
      onChange={updateAuthorization}
      authorization={authorization}
    />
  );
};

const privacyToIcon = {
  0: GlobeIcon,
  1: LinkIcon,
  2: LockIcon,
};

export const LinkPermissions = () => {
  const { state, actions } = useOvermind();
  const { privacy } = state.editor.currentSandbox;

  const Icon = privacyToIcon[privacy];

  return (
    <Stack direction="vertical" css={css({ marginBottom: 4 })}>
      <CollaboratorItem
        avatarComponent={<Icon />}
        name={
          <GhostSelect
            onChange={e => {
              actions.workspace.sandboxPrivacyChanged({
                privacy: Number(e.target.value) as 0 | 2,
              });
            }}
            value={privacy}
            css={css({ paddingLeft: 0 })}
          >
            <option value="0">Public</option>
            <option value="1">Unlisted</option>
            <option value="2">Private</option>
          </GhostSelect>
        }
        authorization={Authorization.Read}
        permissions={privacy === 2 ? [] : [Authorization.Read]}
        permissionPretext="Everyone"
        fillAvatar={false}
      />
    </Stack>
  );
};
