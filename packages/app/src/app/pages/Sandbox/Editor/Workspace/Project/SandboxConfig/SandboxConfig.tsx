import getTemplateDefinition from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, MouseEvent } from 'react';
import TrashIcon from 'react-icons/lib/fa/trash';

import { useOvermind } from 'app/overmind';

import { Group } from '../elements';

import { Container, CenteredText, Action } from './elements';
import { TemplateConfig } from './TemplateConfig';

export const SandboxConfig: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      workspace: { addedTemplate, deleteTemplate },
    },
    state: {
      user,
      editor: {
        currentSandbox: { customTemplate, template },
      },
      workspace: {
        project: { description, title },
      },
    },
  } = useOvermind();

  const onCreateTemplate = ({
    preventDefault,
  }: MouseEvent<HTMLButtonElement>) => {
    preventDefault();

    if (!user) {
      modalOpened({ modal: 'signInForTemplates' });
    }

    addedTemplate({
      color:
        (customTemplate && customTemplate.color) ||
        getTemplateDefinition(template).color(),
      description,
      title,
    });
  };

  const onDelete = ({ preventDefault }: MouseEvent<HTMLButtonElement>) => {
    preventDefault();

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
