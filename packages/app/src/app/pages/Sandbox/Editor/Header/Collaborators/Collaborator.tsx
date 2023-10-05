import { GlobeIcon } from '@codesandbox/common/lib/components/icons/Globe';
import { LinkIcon } from '@codesandbox/common/lib/components/icons/Link';
import { LockIcon } from '@codesandbox/common/lib/components/icons/Lock';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { Stack, Text, Menu, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { Authorization } from 'app/graphql/types';
import { useAppState, useActions } from 'app/overmind';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';

import { Mail, WarningIcon } from './icons';
import { PermissionSelect } from './PermissionSelect';

interface ICollaboratorItemProps {
  authorization: Authorization;
  name: string | JSX.Element;

  warning?: string;
  permissions?: Authorization[];
  subtext?: string;
  avatarUrl?: string;
  avatarComponent?: JSX.Element | null;
  onChange?: (value: string) => void;
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
  warning,
  ...props
}: ICollaboratorItemProps) => (
  <Stack {...props} align="center">
    <Stack gap={2} css={css({ width: '100%', flex: 3 })}>
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

    {warning && (
      <Tooltip content={warning}>
        <WarningIcon />
      </Tooltip>
    )}
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
  username: string;
  lastSeenAt: string | null;
  avatarUrl: string;
  isViewingNow: boolean;
  readOnly?: boolean;
  warning?: string;
}

export const Collaborator = ({
  username,
  avatarUrl,
  authorization,
  lastSeenAt,
  readOnly,
  isViewingNow,
  warning,
}: ICollaboratorProps) => {
  const state = useAppState();
  const actions = useActions();

  const updateAuthorization = (value: string) => {
    if (value === 'remove') {
      actions.editor.removeCollaborator({
        username,
        sandboxId: state.editor.currentSandbox.id,
      });
    } else {
      actions.editor.changeCollaboratorAuthorization({
        username,
        sandboxId: state.editor.currentSandbox.id,
        authorization: value as Authorization,
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
      warning={warning}
    />
  );
};

interface IInvitationProps {
  id: string;
  email: string;
  authorization: Authorization;
}

export const Invitation = ({ id, email, authorization }: IInvitationProps) => {
  const state = useAppState();
  const actions = useActions();

  const updateAuthorization = (value: string) => {
    // We have to do something here
    if (value === 'remove') {
      actions.editor.revokeSandboxInvitation({
        invitationId: id,
        sandboxId: state.editor.currentSandbox.id,
      });
    } else {
      actions.editor.changeInvitationAuthorization({
        invitationId: id,
        sandboxId: state.editor.currentSandbox.id,
        authorization: value as Authorization,
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

const privacyToName = {
  0: 'Public',
  1: 'Unlisted',
  2: 'Private',
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
  const state = useAppState();
  const actions = useActions();
  const { privacy } = state.editor.currentSandbox;
  const isPro = Boolean(state.activeTeamInfo?.subscription);

  const PrivacyIcon = privacyToIcon[privacy];

  const isReadOnly = readOnly || !isPro;

  const onChange = value => {
    actions.workspace.sandboxPrivacyChanged({
      privacy: Number(value) as 0 | 1 | 2,
      source: 'collaboratorss',
    });
  };

  return (
    <Stack gap={4} align="center" direction="vertical">
      <CollaboratorItem
        avatarComponent={<PrivacyIcon />}
        name={
          <Menu>
            <Menu.Button disabled={isReadOnly}>
              {privacyToName[privacy]}{' '}
              <Icon name="caret" size={8} marginLeft={1} />
            </Menu.Button>
            <Menu.List>
              {Object.keys(privacyToName).map(p => (
                <Menu.Item key={p} onSelect={() => onChange(p)}>
                  {privacyToName[p]}
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        }
        authorization={Authorization.Read}
        permissions={[]}
        permissionText={privacyToDescription[privacy]}
        readOnly={isReadOnly}
        style={{ width: '100%' }}
      />

      {!isPro && (
        <Text size={3} variant="muted" align="center">
          Changing sandbox access is available with{' '}
          <a
            href={proUrl({ source: 'v1_share' })}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => track('Editor - Share sandbox Pricing link')}
            style={{ textDecoration: 'none' }}
          >
            CodeSandbox Pro
          </a>
        </Text>
      )}
    </Stack>
  );
};
