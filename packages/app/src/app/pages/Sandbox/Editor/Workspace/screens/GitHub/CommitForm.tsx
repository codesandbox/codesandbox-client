import {
  Button,
  FormField,
  Input,
  Stack,
  Textarea,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { ChangeEvent } from 'react';

export const CommitForm = () => {
  const {
    actions: {
      git: {
        createPrClicked,
        createCommitClicked,
        titleChanged,
        descriptionChanged,
        updatePrClicked,
      },
    },
    state: {
      editor: { currentSandbox },
      git: { description, title, permission, gitChanges },
    },
  } = useOvermind();

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => descriptionChanged(value);

  const changeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    titleChanged(value);

  const canUpdate =
    Boolean(
      gitChanges.added.length ||
        gitChanges.deleted.length ||
        gitChanges.modified.length
    ) && description;

  if (currentSandbox.prNumber) {
    return (
      <Stack
        as="form"
        direction="vertical"
        gap={1}
        onSubmit={event => event.preventDefault()}
      >
        <FormField direction="vertical" label="message" hideLabel>
          <Textarea
            maxLength={280}
            placeholder="Message"
            onChange={changeDescription}
            value={description}
          />
        </FormField>
        <Stack marginX={2}>
          <Button
            variant="secondary"
            disabled={!canUpdate}
            onClick={() => updatePrClicked()}
          >
            Update PR
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (permission === 'read') {
    return (
      <Stack
        as="form"
        direction="vertical"
        gap={1}
        onSubmit={event => event.preventDefault()}
      >
        <FormField direction="vertical" label="PR title" hideLabel>
          <Input placeholder="Title" onChange={changeTitle} value={title} />
        </FormField>
        <FormField direction="vertical" label="PR description" hideLabel>
          <Textarea
            maxLength={280}
            placeholder="Description"
            onChange={changeDescription}
            value={description}
          />
        </FormField>
        <Stack marginX={2}>
          <Button
            variant="secondary"
            disabled={!title || !canUpdate}
            onClick={() => createPrClicked()}
          >
            Create PR
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      as="form"
      direction="vertical"
      gap={1}
      onSubmit={event => event.preventDefault()}
    >
      <FormField direction="vertical" label="message" hideLabel>
        <Textarea
          maxLength={280}
          placeholder="Message"
          onChange={changeDescription}
          value={description}
        />
      </FormField>
      <Stack marginX={2}>
        <Button
          variant="secondary"
          disabled={!canUpdate}
          onClick={() => createCommitClicked()}
        >
          Commit to {currentSandbox.baseGit.branch}
        </Button>
      </Stack>
    </Stack>
  );
};
