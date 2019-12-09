import React from 'react';
import history from 'app/utils/history';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import Template from '@codesandbox/common/lib/templates/template';
import { ButtonsContainer, Container, ContainerLink } from './elements';

interface ICreateNewSandboxProps {
  style: React.CSSProperties;
  collectionId?: string;
  mostUsedSandboxTemplate: Template;
}

export const CreateNewSandboxButton = ({
  style,
  collectionId,
  mostUsedSandboxTemplate,
}: ICreateNewSandboxProps) => {
  const { actions } = useOvermind();

  const createSandbox = (template: Template) => {
    if (!collectionId) {
      setTimeout(() => {
        history.push(sandboxUrl({ id: template.shortid, alias: null }));
      }, 300);
    } else {
      actions.dashboard.createSandboxClicked({
        sandboxId: template.shortid,
        body: {
          collectionId,
        },
      });
    }
  };

  const handleClick = () => {
    actions.modalOpened({ modal: 'newSandbox' });
  };

  let mostUsedSandboxComponent;

  if (mostUsedSandboxTemplate) {
    const buttonName = `Create ${mostUsedSandboxTemplate.niceName} Sandbox`;
    if (collectionId) {
      mostUsedSandboxComponent = (
        <Container
          onClick={() => createSandbox(mostUsedSandboxTemplate)}
          color={mostUsedSandboxTemplate.color}
          tabIndex={0}
          role="button"
        >
          {buttonName}
        </Container>
      );
    } else {
      mostUsedSandboxComponent = (
        <ContainerLink
          to={sandboxUrl({ id: mostUsedSandboxTemplate.shortid, alias: null })}
          color={mostUsedSandboxTemplate.color}
        >
          {buttonName}
        </ContainerLink>
      );
    }
  }

  return (
    <div style={style}>
      <ButtonsContainer>
        <Container
          onClick={handleClick}
          tabIndex={0}
          role="button"
          onKeyDown={e => {
            if (e.keyCode === ENTER) {
              handleClick();
            }
          }}
        >
          Create Sandbox
        </Container>
        {mostUsedSandboxComponent}
      </ButtonsContainer>
    </div>
  );
};
