import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { Button, Element } from '@codesandbox/components';
import React, { FunctionComponent, MouseEvent } from 'react';

import { useOvermind } from 'app/overmind';

export const Config: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      workspace: { addedTemplate },
    },
    state: {
      editor: {
        currentSandbox: { customTemplate, template },
      },
      user,
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

  return !customTemplate ? (
    <Element marginX={2} marginY={4}>
      <Button
        // @ts-ignore
        onClick={onCreateTemplate}
        variant="secondary"
      >
        Save as template
      </Button>
    </Element>
  ) : null;
};
