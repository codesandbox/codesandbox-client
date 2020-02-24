import React from 'react';
import { Stack, Text, Select } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Authorization } from 'app/graphql/types';
import { formatDistanceToNow } from 'date-fns';
import { LockIcon } from '@codesandbox/common/lib/components/icons/Lock';
import { GlobeIcon } from '@codesandbox/common/lib/components/icons/Globe';
import { LinkIcon } from '@codesandbox/common/lib/components/icons/Link';
import { PermissionSelect } from './PermissionSelect';
import { Mail } from './icons';

interface ICollaboratorItemProps {
  authorization: Authorization;
  name: string | JSX.Element;
  permissions?: Authorization[];
  subtext?: string;
  avatarUrl?: string;
  avatarComponent?: JSX.Element | null;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  fillAvatar?: boolean;
  permissionText?: string;
  readOnly?: boolean;
  style?: React.CSSProperties;
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
  permissionText,
  permissions = [Authorization.WriteCode, Authorization.Read],
  ...props
}: ICollaboratorItemProps) => (
  <Stack {...props} align="center">
    <Stack gap={2} css={css({ width: '100%', flex: 2 })}>
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
            borderColor: fillAvatar ? 'dialog.border' : 'transparent',
            backgroundColor: fillAvatar ? 'dialog.border' : 'transparent',
            width: 32,
            height: 32,
          })}
        >
          {avatarComponent}
        </div>
      )}
      <Stack gap={1} justify="center" direction="vertical">
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

    {permissions.length > 0 ? (
      <PermissionSelect
        onChange={onChange}
        value={authorization}
        disabled={readOnly}
        permissions={permissions}
        additionalOptions={[{ label: 'Remove', value: 'remove' }]}
      />
    ) : (
      <Text css={css({ flex: 3, textAlign: 'right' })} size={3} variant="muted">
        {permissionText}
      </Text>
    )}
  </Stack>
);

interface ICollaboratorProps {
  authorization: Authorization;
  userId: string;
  username: string;
  lastSeenAt: string | null;
  avatarUrl: string;
  isViewingNow: boolean;

  readOnly?: boolean;
}

export const Collaborator = ({
  username,
  avatarUrl,
  authorization,
  lastSeenAt,
  readOnly,
  isViewingNow,
}: ICollaboratorProps) => {
  const { actions, state } = useOvermind();

  const updateAuthorization = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'remove') {
      actions.editor.removeCollaborator({
        username,
        sandboxId: state.editor.currentSandbox.id,
      });
    } else {
      actions.editor.changeCollaboratorAuthorization({
        username,
        sandboxId: state.editor.currentSandbox.id,
        authorization: event.target.value as Authorization,
      });
    }
  };

  let subtext: string;
  if (isViewingNow) {
    subtext = 'Viewing now';
  } else if (lastSeenAt === null) {
    subtext = 'Not viewed yet';
  } else {
    subtext = formatDistanceToNow(new Date(lastSeenAt), { addSuffix: true });
  }

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
        sandboxId: state.editor.currentSandbox.id,
      });
    } else {
      actions.editor.changeInvitationAuthorization({
        invitationId: id,
        sandboxId: state.editor.currentSandbox.id,
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

const privacyToDescription = {
  0: 'Everyone can view',
  1: 'Everyone with link can view',
  2: 'Only collaborators can access',
};

interface ILinkPermissionProps {
  readOnly: boolean;
}

export const LinkPermissions = ({ readOnly }: ILinkPermissionProps) => {
  const { state, actions } = useOvermind();
  const { privacy } = state.editor.currentSandbox;
  const isPatron = state.isPatron;

  const Icon = privacyToIcon[privacy];

  const isReadOnly = readOnly || !isPatron;

  return (
    <Stack gap={4} align="center" direction="vertical">
      <CollaboratorItem
        avatarComponent={<Icon />}
        name={
          <Select
            variant="link"
            onChange={e => {
              actions.workspace.sandboxPrivacyChanged({
                privacy: Number(e.target.value) as 0 | 2,
                source: 'collaboratorss',
              });
            }}
            value={privacy}
            css={css({ paddingLeft: 0 })}
            disabled={isReadOnly}
          >
            <option value="0">Public</option>
            <option value="1">Unlisted</option>
            <option value="2">Private</option>
          </Select>
        }
        authorization={Authorization.Read}
        permissions={[]}
        permissionText={privacyToDescription[privacy]}
        readOnly={isReadOnly}
        style={{ width: '100%' }}
      />

      {!isPatron && (
        <Text size={3} variant="muted" align="center">
          Changing sandbox access is available with{' '}
          <a href="/pricing" target="_blank" rel="noreferrer noopener">
            CodeSandbox Pro
          </a>
        </Text>
      )}
    </Stack>
  );
};
