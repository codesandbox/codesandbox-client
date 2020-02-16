import React, { MouseEvent } from 'react';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';
import { Button, Element } from '@codesandbox/components';

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
