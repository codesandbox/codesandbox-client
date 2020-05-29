import getTemplateDefinition from '@codesandbox/common/es/templates';
import { Button, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { MouseEvent } from 'react';

export const Config = () => {
  const {
    actions: {
      modalOpened,
      workspace: { addedTemplate },
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
      {!customTemplate && (
        <Element marginX={2} marginY={4}>
          <Button
            // @ts-ignore
            onClick={onCreateTemplate}
            variant="secondary"
          >
            Save as template
          </Button>
        </Element>
      )}
    </>
  );
};
