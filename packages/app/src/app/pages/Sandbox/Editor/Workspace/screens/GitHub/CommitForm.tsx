import React, { ChangeEvent } from 'react';
import { Text, Stack, Input, Textarea, Button } from '@codesandbox/components';
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
      <Text size={3} block marginBottom={2} marginX={2}>
        Commit Message
      </Text>
      <Stack as="form" direction="vertical" gap={1} marginX={2}>
        <Input placeholder="Subject" onChange={changeSubject} value={subject} />
        <Textarea
          maxLength={280}
          placeholder="Description"
          onChange={changeDescription}
          value={description}
        />
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
