import React, { ChangeEvent } from 'react';
import {
  FormField,
  Stack,
  Input,
  Textarea,
  Button,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const CommitForm = () => {
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
      git: { description, originalGitChanges: gitChanges, subject },
    },
  } = useOvermind();
  const hasWriteAccess = (rights: string) =>
    ['admin', 'write'].includes(rights);

  const modulesNotSaved = !isAllModulesSynced;

  const changeSubject = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => subjectChanged({ subject: value });

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) =>
    descriptionChanged({ description: value });

  return (
    <>
      <Stack as="form" direction="vertical" gap={1} marginX={2}>
        <FormField direction="vertical" label="Commit message">
          <Input
            placeholder="Subject"
            onChange={changeSubject}
            value={subject}
          />
        </FormField>
        <FormField direction="vertical" label="Commit description" hideLabel>
          <Textarea
            maxLength={280}
            placeholder="Description"
            onChange={changeDescription}
            value={description}
          />
        </FormField>
        <Stack gap={2}>
          {hasWriteAccess(gitChanges.rights) && (
            <Button
              variant="secondary"
              disabled={!subject || modulesNotSaved}
              onClick={() => createCommitClicked()}
            >
              Commit
            </Button>
          )}

          <Button
            variant="secondary"
            disabled={!subject || modulesNotSaved}
            onClick={() => createPrClicked()}
          >
            Open PR
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
