import {
  Button,
  FormField,
  Icon,
  Input,
  Menu,
  Stack,
  Text,
  Textarea,
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
    if (!isAllModulesSynced) {
      return 'Save all files first...';
    }

    return buttonTitle;
  };

  const hasChanges = Boolean(
    gitChanges.added.length ||
      gitChanges.deleted.length ||
      gitChanges.modified.length
  );
  const canUpdate =
    hasChanges && isAllModulesSynced && !isCommitting && !isCreatingPr;
  const showSelector = permission !== 'read' && !(isCommitting || isCreatingPr);

  if (currentSandbox.prNumber) {
    return (
      <Stack
        as="form"
        direction="vertical"
        gap={1}
        onSubmit={event => event.preventDefault()}
      >
        <FormField direction="vertical" label="Title" hideLabel>
          <Input
            placeholder="Title"
            onChange={changeTitle}
            value={title}
            disabled={!hasChanges || isCommitting || isCreatingPr}
          />
        </FormField>
        <FormField direction="vertical" label="Description" hideLabel>
          <Textarea
            maxLength={280}
            placeholder="Optional description..."
            onChange={changeDescription}
            value={description}
            disabled={!hasChanges || isCommitting || isCreatingPr}
          />
        </FormField>
        <Stack marginX={2}>
          <Button
            loading={isCommitting}
            variant="primary"
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
      <FormField direction="vertical" label="Title" hideLabel>
        <Input
          placeholder="Title"
          onChange={changeTitle}
          value={title}
          disabled={!hasChanges || isCommitting || isCreatingPr}
        />
      </FormField>
      <FormField direction="vertical" label="Description" hideLabel>
        <Textarea
          maxLength={280}
          placeholder="Optional description..."
          onChange={changeDescription}
          value={description}
          disabled={!hasChanges || isCommitting || isCreatingPr}
        />
      </FormField>
      <Stack marginX={2}>
        <Stack css={{ width: '100%' }}>
          <Button
            loading={isCommitting || isCreatingPr}
            css={
              showSelector
                ? {
                    width: 'calc(100% - 26px)',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                : {
                    width: '100%',
                  }
            }
            disabled={!title || !canUpdate}
            onClick={() => actions[currentAction].action()}
          >
            {actions[currentAction].text}
          </Button>
          {showSelector ? (
            <>
              <Menu>
                <Menu.Button
                  variant="primary"
                  css={{
                    width: '26px',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <Icon size={8} name="caret" />
                </Menu.Button>
                <Menu.List
                  css={{
                    marginLeft: '-228px',
                    marginTop: '-2px',
                    width: '252px',
                  }}
                >
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
        <Text paddingX={8} paddingTop={2} size={3}>
          <Text variant="muted">Caution, committing to </Text> master
        </Text>
      ) : null}
    </Stack>
  );
};
