import React from 'react';
import { motion } from 'framer-motion';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Authorization } from 'app/graphql/types';
import { PermissionSelect } from './PermissionSelect';

interface ICollaboratorItemProps {
  authorization: Authorization;
  name: string;
  subtext: string;
  avatarUrl: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  readOnly?: boolean;
}

export const CollaboratorItem = ({
  name,
  subtext,
  avatarUrl,
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
              borderColor: 'grays.500',
            })}
            alt={name}
            src={avatarUrl}
            width={32}
            height={32}
          />
        ) : (
          <div
            css={css({
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grays.500',
              backgroundColor: 'grays.500',
              width: 32,
              height: 32,
            })}
          />
        )}
        <Stack justify="center" direction="vertical">
          <Text size={3} color="white">
            {name}
          </Text>
          <Text size={2} variant="muted">
            {subtext}
          </Text>
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
  username: string;
  lastSeenAt: string | null;
  avatarUrl: string;

  readOnly?: boolean;
}

export const Collaborator = ({
  username,
  avatarUrl,
  authorization,
  lastSeenAt,
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

  return (
    <CollaboratorItem
      name={username}
      subtext={lastSeenAt ? 'Now viewing' : 'Not viewed yet'}
      avatarUrl={avatarUrl}
      onChange={updateAuthorization}
      authorization={authorization}
    />
  );
};

interface IInvitationProps {
  id: string;
  email: string;
  avatarUrl: string;
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
      avatarUrl=""
      onChange={updateAuthorization}
      authorization={authorization}
    />
  );
};
