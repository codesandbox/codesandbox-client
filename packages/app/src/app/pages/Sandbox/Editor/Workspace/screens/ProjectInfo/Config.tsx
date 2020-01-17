import React, { MouseEvent } from 'react';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';
import { css } from '@styled-system/css';
import { Button, Element, Stack } from '@codesandbox/components';

import { TemplateConfig } from './TemplateConfig';

export const Config = () => {
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
          <Button
            // @ts-ignore
            onClick={onCreateTemplate}
            variant="secondary"
          >
            Save as template
          </Button>
        </Element>
      )}

      <Stack
        justify="center"
        css={css({
          bottom: 3,
          position: 'absolute',
          width: '100%',
        })}
      >
        <Button
          // @ts-ignore
          onClick={onDelete}
          variant="link"
          css={css({
            ':hover,:focus': { color: 'dangerButton.background' },
          })}
        >
          {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
        </Button>
      </Stack>
    </>
  );
};
