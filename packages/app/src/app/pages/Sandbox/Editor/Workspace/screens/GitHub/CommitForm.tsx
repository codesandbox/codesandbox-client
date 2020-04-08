import {
  Button,
  FormField,
  Input,
  Stack,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';

import React, { ChangeEvent, FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

export const CommitForm: FunctionComponent = () => {
  const {
    actions: {
      git: {
        createCommitClicked,
        createPrClicked,
        descriptionChanged,
        subjectChanged,
      },
    },
    state: {
      editor: { isAllModulesSynced },
      git: { description, originalGitChanges, subject },
    },
  } = useOvermind();

  const hasWriteAccess = (rights: string = '') =>
    ['admin', 'write'].includes(rights);

  const changeSubject = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => subjectChanged(value);

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => descriptionChanged(value);

  return (
    <>
      <Stack
        as="form"
        direction="vertical"
        gap={1}
        onSubmit={event => event.preventDefault()}
      >
        <FormField direction="vertical" label="Commit message">
          <Input
            css={css({ marginTop: 2 })}
            placeholder="Subject"
            onChange={changeSubject}
            value={subject}
          />
        </FormField>

        <FormField direction="vertical" hideLabel label="Commit description">
          <Textarea
            maxLength={280}
            onChange={changeDescription}
            placeholder="Description"
            value={description}
          />
        </FormField>

        <Stack
          css={{ button: { width: '40%' } }}
          justify="space-between"
          marginX={2}
        >
          {hasWriteAccess(originalGitChanges?.rights) ? (
            <Button
              disabled={!subject || !isAllModulesSynced}
              onClick={createCommitClicked}
              variant="secondary"
            >
              Commit
            </Button>
          ) : null}

          <Button
            disabled={!subject || !isAllModulesSynced}
            onClick={createPrClicked}
            variant="secondary"
          >
            Open PR
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
