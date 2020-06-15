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
  const [currentAction, setCurrentAction] = useState('branch');
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
    branch: {
      action: createCommitClicked,
      text: getButtonTitle(
        `Commit to branch (${currentSandbox.originalGit.branch})`
      ),
    },
    pr: {
      action: createPrClicked,
      text: getButtonTitle(`Create PR branch (csb-${currentSandbox.id})`),
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
          placeholder="Summary (required)"
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
                  disabled={!title || !canUpdate}
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
                    {getButtonTitle(
                      `Create PR branch (csb-${currentSandbox.id})`
                    )}
                  </Menu.Item>
                  <Menu.Item onSelect={() => setCurrentAction('branch')}>
                    {getButtonTitle(
                      `Commit to branch (${currentSandbox.originalGit.branch})`
                    )}
                  </Menu.Item>
                </Menu.List>
              </Menu>
            </>
          ) : null}
        </Stack>
      </Stack>
      {currentSandbox.originalGit.branch === 'master' ? (
        <Text paddingX={8} paddingTop={2} size={3}>
          <Text variant="muted">Caution, committing to </Text> master
        </Text>
      ) : null}
    </Stack>
  );
};
