import React, { FunctionComponent } from 'react';
import { Button, Element } from '@codesandbox/components';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Overlay } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';

import { AddPeople } from './icons';
import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { LinkPermissions } from './Collaborator';
import { ChangeLinkPermissionForm } from './ChangeLinkPermissionForm';
import { CollaboratorList } from './CollaboratorList';

const CollaboratorContent = () => {
  const { state } = useOvermind();

  const isOwner = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );

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

      <CollaboratorList />

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
