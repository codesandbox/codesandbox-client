import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { Button, Element } from '@codesandbox/components';
import React, { FunctionComponent, MouseEvent } from 'react';

import { useAppState, useActions } from 'app/overmind';

export const Config: FunctionComponent = () => {
  const {
    modalOpened,
    workspace: { addedTemplate },
  } = useActions();
  const {
    editor: {
      currentSandbox: { customTemplate, template },
    },
    user,
    workspace: {
      project: { description, title },
    },
  } = useAppState();

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
