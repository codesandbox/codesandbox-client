import React from 'react';
import { motion } from 'framer-motion';
import { Stack, Text } from '@codesandbox/components';
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
  subtext?: string;
  avatarUrl?: string;
  avatarComponent?: JSX.Element | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  fillAvatar?: boolean;
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
}: ICollaboratorItemProps) => (
  <motion.div
    animate={{ opacity: 1, height: 'auto' }}
    initial={{ opacity: 0, height: 0 }}
    exit={{ opacity: 0, height: 0 }}
    positionTransition
    style={{ width: '100%', overflow: 'hidden' }}
  >
    <Stack css={css({ width: '100%', marginBottom: 4 })}>
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
        additionalOptions={[{ label: 'Remove', value: 'remove' }]}
      />
    </Stack>
  </motion.div>
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
        authorization: event.target.value,
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
        authorization: event.target.value,
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
  const { state } = useOvermind();
  const { privacy } = state.editor.currentSandbox;

  const Icon = privacyToIcon[privacy];

  return (
    <Stack direction="vertical">
      <CollaboratorItem
        avatarComponent={<Icon />}
        name={
          <GhostSelect value={privacy} css={css({ paddingLeft: 0 })}>
            <option value="0">Anyone with link</option>
            <option value="2">Only people invited</option>
          </GhostSelect>
        }
        authorization="CAN_VIEW"
        fillAvatar={false}
      />
      {privacy !== 2 && (
        <>
          <Text size={3} variant="muted">
            Hello World
          </Text>
        </>
      )}
    </Stack>
  );
};
