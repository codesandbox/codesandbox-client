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
      },
    },
    state: {
      editor: { currentSandbox, isAllModulesSynced },
      git: {
        description,
        title,
        permission,
        gitChanges,
        isCommitting,
        isCreatingPr,
      },
    },
  } = useOvermind();
  const [directCommit, setDirectCommit] = React.useState(false);

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => descriptionChanged(value);

  const changeTitle = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    titleChanged(value);

  const getButtonTitle = (buttonTitle: string) => {
    if (isCommitting) {
      return 'Updating...';
    }

    if (!isAllModulesSynced) {
      return 'Save all files first...';
    }

    return buttonTitle;
  };

  const canUpdate =
    Boolean(
      gitChanges.added.length ||
        gitChanges.deleted.length ||
        gitChanges.modified.length
    ) &&
    description &&
    isAllModulesSynced &&
    !isCommitting;

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
            onClick={() => createCommitClicked()}
          >
            {getButtonTitle('Update PR')}
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
            disabled={!title || !canUpdate || isCreatingPr}
            onClick={() => createPrClicked()}
          >
            {getButtonTitle('Create PR')}
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (directCommit) {
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
            {getButtonTitle(`Commit to ${currentSandbox.baseGit.branch}`)}
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
      <button type="button" onClick={() => setDirectCommit(true)}>
        Do direct commit
      </button>
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
          disabled={!title || !canUpdate || isCreatingPr}
          onClick={() => createPrClicked()}
        >
          {getButtonTitle('Create PR')}
        </Button>
      </Stack>
    </Stack>
  );
};
