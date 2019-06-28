import React from 'react';
import { observer } from 'mobx-react-lite';
import TrashIcon from 'react-icons/lib/fa/trash';
import * as templates from '@codesandbox/common/lib/templates';
import { useSignals, useStore } from 'app/store';
import { TemplateConfig } from './TemplateConfig';
import { Group } from '../elements';
import { Container, CenteredText, Action } from './elements';

export const SandboxConfig = observer(() => {
  const {
    editor: {
      currentSandbox: { template, customTemplate },
    },
    workspace: {
      project: { title, description },
    },
  } = useStore();
  const {
    modalOpened,
    workspace: { addedTemplate, deleteTemplate },
  } = useSignals();

  const onCreateTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addedTemplate({
      template: {
        color:
          (customTemplate && customTemplate.color) ||
          templates.default(template).color(),
        title,
        description,
        icon_url: template,
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
});
