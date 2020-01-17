import React, { MouseEvent } from 'react';
import styled, { withTheme } from 'styled-components';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';
import { Button, Element, Stack } from '@codesandbox/components';

import { TemplateConfig } from './TemplateConfig';

const DeleteButton = styled(Button)`
  &:hover,
  &:focus {
    color: ${props => props.theme.colors.dangerButton.background};
  }
`;

const ConfigComponent = ({ theme }) => {
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

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  const onCreateTemplate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

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

  return (
    <>
      {customTemplate && <TemplateConfig />}
      {!customTemplate && (
        <Element marginX={2} marginY={4}>
          <Button onClick={onCreateTemplate} variant="secondary">
            Save as template
          </Button>
        </Element>
      )}

      <Stack
        justify="center"
        style={{ position: 'absolute', width: '100%', bottom: theme.space[3] }}
      >
        <DeleteButton
          // @ts-ignore
          onClick={onDelete}
          variant="link"
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </DeleteButton>
      </Stack>
    </>
  );
};

export const Config = withTheme(ConfigComponent);
