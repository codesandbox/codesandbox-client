import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import { Button, Element } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';
import { AnimatePresence, motion } from 'framer-motion';

import { useOvermind } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Authorization } from 'app/graphql/types';
import { AddPeople } from './icons';
import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import {
  CollaboratorItem,
  Collaborator,
  Invitation,
  LinkPermissions,
} from './Collaborator';
import { ChangeLinkPermissionForm } from './ChangeLinkPermissionForm';

const Animated = props => (
  <motion.div
    animate={{ opacity: 1, height: 'auto' }}
    initial={{ opacity: 0, height: 0 }}
    exit={{ opacity: 0, height: 0 }}
    style={{ width: '100%', overflow: 'hidden' }}
    positionTransition
  >
    <Element
      css={css({
        marginTop: 4,
      })}
      {...props}
    />
  </motion.div>
);

const CollaboratorContent = () => {
  const { state } = useOvermind();

  const isOwner = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );
  const author = state.editor.currentSandbox.author;

  return (
    <Container direction="vertical">
      <Element padding={4}>
        <LinkPermissions readOnly={!isOwner} />
        {isOwner && (
          <Element paddingTop={4}>
            <AddCollaboratorForm />
          </Element>
        )}
      </Element>

      <HorizontalSeparator />

      <Element
        paddingX={4}
        css={css({
          maxHeight: 250,
          minHeight: 100,
          overflowY: 'auto',
          paddingBottom: 4,
        })}
      >
        <Animated>
          <CollaboratorItem
            name={author.username}
            avatarUrl={author.avatarUrl}
            authorization={Authorization.Owner}
            permissions={[]}
            permissionText="Owner"
          />
        </Animated>

        <AnimatePresence>
          {state.editor.collaborators.map(collaborator => (
            <Animated key={collaborator.user.username}>
              <Collaborator
                userId={collaborator.user.id}
                username={collaborator.user.username}
                avatarUrl={collaborator.user.avatarUrl}
                authorization={collaborator.authorization}
                lastSeenAt={collaborator.lastSeenAt}
                readOnly={!isOwner}
              />
            </Animated>
          ))}

          {state.editor.invitations.map(invitation => (
            <Animated key={invitation.email}>
              <Invitation
                email={invitation.email}
                id={invitation.id}
                authorization={invitation.authorization}
              />
            </Animated>
          ))}
        </AnimatePresence>
      </Element>

      <HorizontalSeparator />

      <Element padding={4}>
        <ChangeLinkPermissionForm />
      </Element>
    </Container>
  );
};

export const Collaborators: FunctionComponent = () => (
  <>
    <Overlay
      noHeightAnimation={false}
      event="Collaborators"
      content={CollaboratorContent}
    >
      {open => (
        <Button onClick={() => open()} variant="link">
          <AddPeople width={24} height={24} />
        </Button>
      )}
    </Overlay>
  </>
);
