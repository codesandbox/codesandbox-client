import { Button, FormField, Stack, Textarea } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { ChangeEvent } from 'react';

export const CommitForm = () => {
  const {
    actions: {
      git: { createPrClicked, descriptionChanged },
    },
    state: {
      editor: { isAllModulesSynced },
      git: { description },
    },
  } = useOvermind();

  const modulesNotSaved = !isAllModulesSynced;

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) =>
    descriptionChanged({ description: value });

  return (
    <>
      <Stack
        as="form"
        direction="vertical"
        gap={1}
        onSubmit={event => event.preventDefault()}
      >
        <FormField direction="vertical" label="Commit description" hideLabel>
          <Textarea
            maxLength={280}
            placeholder="Description"
            onChange={changeDescription}
            value={description}
          />
        </FormField>
        <Stack
          justify="space-between"
          marginX={2}
          css={{
            button: { width: '40%' },
          }}
        >
          <Button
            variant="secondary"
            disabled={!description || modulesNotSaved}
            onClick={() => createPrClicked()}
          >
            Update PR
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
