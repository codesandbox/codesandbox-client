import { hasPermission } from '@codesandbox/common/es/utils/permission';
import { Element } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { AddCollaboratorForm } from './AddCollaboratorForm';
import { ButtonActions } from './ButtonActions';
import { LinkPermissions } from './Collaborator';
import { CollaboratorList } from './CollaboratorList';
import { Container, HorizontalSeparator } from './elements';

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
  <>
    <Overlay
      noHeightAnimation={false}
      event="Collaborators"
      content={CollaboratorContent}
    >
      {open => renderButton({ onClick: () => open() })}
    </Overlay>
  </>
);
