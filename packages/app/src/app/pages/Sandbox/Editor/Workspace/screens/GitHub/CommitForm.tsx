import {
  Button,
  FormField,
  Input,
  Stack,
  Menu,
  Textarea,
  Text,
  Icon,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { ChangeEvent, useState } from 'react';

export const CommitForm = () => {
  const [currentAction, setCurrentAction] = useState('pr');
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

  const actions = {
    master: {
      action: createCommitClicked,
      text: getButtonTitle(`Commit to ${currentSandbox.baseGit.branch}`),
    },
    pr: {
      action: createPrClicked,
      text: getButtonTitle('Create PR'),
    },
  };

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
        <Stack css={{ width: '100%' }}>
          <Button
            css={{
              width: 'calc(100% - 26px)',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            disabled={!title || !canUpdate || isCreatingPr}
            onClick={() => actions[currentAction].action()}
          >
            {actions[currentAction].text}
          </Button>
          {permission !== 'read' ? (
            <>
              <Menu>
                <Menu.Button
                  disabled={!title || !canUpdate || isCreatingPr}
                  variant="primary"
                  css={{
                    width: '26px',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <Icon size={8} name="caret" />
                </Menu.Button>
                <Menu.List>
                  <Menu.Item onSelect={() => setCurrentAction('pr')}>
                    {getButtonTitle('Create PR')}
                  </Menu.Item>
                  <Menu.Item onSelect={() => setCurrentAction('master')}>
                    {getButtonTitle(
                      `Commit to ${currentSandbox.baseGit.branch}`
                    )}
                  </Menu.Item>
                </Menu.List>
              </Menu>
            </>
          ) : null}
        </Stack>
      </Stack>
      {currentAction === 'master' ? (
        <Text paddingX={8} paddingTop={2} size={3} variant="muted">
          Caution, committing to Master
        </Text>
      ) : null}
    </Stack>
  );
};
