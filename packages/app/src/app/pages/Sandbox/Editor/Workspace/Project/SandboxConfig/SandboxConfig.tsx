import React from 'react';
import { useOvermind } from 'app/overmind';
import TrashIcon from 'react-icons/lib/fa/trash';
import * as templates from '@codesandbox/common/lib/templates';
import { TemplateConfig } from './TemplateConfig';
import { Group } from '../elements';
import { Container, CenteredText, Action } from './elements';

export const SandboxConfig: React.FC = () => {
  const { state, actions } = useOvermind();
  const {
    user,
    editor: {
      currentSandbox: { template, customTemplate },
    },
    workspace: {
      project: { title, description },
    },
  } = state;
  const {
    modalOpened,
    workspace: { addedTemplate, deleteTemplate },
  } = actions;

  const onCreateTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      modalOpened({ modal: 'signInForTemplates' });
    }

    addedTemplate({
      template: {
        color:
          (customTemplate && customTemplate.color) ||
          templates.default(template).color(),
        title,
        description,
      },
    });
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  return (
    <>
      {customTemplate && <TemplateConfig />}
      <Group>
        <Container>
          {!customTemplate && (
            <Action onClick={onCreateTemplate}>
              <CenteredText>
                <span>Create Template</span>
              </CenteredText>
            </Action>
          )}
          <Action danger onClick={onDelete}>
            <CenteredText>
              <TrashIcon />
              <span>{`Delete ${customTemplate ? `Template` : `Sandbox`}`}</span>
            </CenteredText>
          </Action>
        </Container>
      </Group>
    </>
  );
};
