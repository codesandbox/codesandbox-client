import React, { FunctionComponent } from 'react';
import { Element } from '@codesandbox/components';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Overlay } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';

import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { LinkPermissions } from './Collaborator';
import { ButtonActions } from './ButtonActions';
import { CollaboratorList } from './CollaboratorList';

const CollaboratorContent = () => {
  const { state } = useOvermind();

  const isOwner = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );

  return (
    <Container direction="vertical" style={{ borderRadius: 4 }}>
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
        <ButtonActions />
      </Element>
    </Container>
  );
};

export const Collaborators: FunctionComponent<{
  renderButton: (any) => JSX.Element;
}> = ({ renderButton }) => (
  <Overlay event="Collaborators" content={CollaboratorContent}>
    {open => renderButton({ onClick: () => open() })}
  </Overlay>
);
