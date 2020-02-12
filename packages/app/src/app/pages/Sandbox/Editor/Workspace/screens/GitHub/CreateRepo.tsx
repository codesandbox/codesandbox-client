import { css } from '@styled-system/css';
import track from '@codesandbox/common/lib/utils/analytics';
import React, { ChangeEvent } from 'react';
import {
  Collapsible,
  Input,
  Element,
  Stack,
  Button,
  Text,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const CreateRepo = () => {
  const {
    actions: {
      git: { createRepoClicked, repoTitleChanged },
    },
    state: {
      editor: {
        isAllModulesSynced,
        currentSandbox: { originalGit },
      },
      git: { error, repoTitle },
    },
  } = useOvermind();

  const updateRepoTitle = ({
    target: { value: title },
  }: ChangeEvent<HTMLInputElement>) => repoTitleChanged({ title });

  const createRepo = e => {
    e.preventDefault();
    track('Export to GitHub Clicked');
    createRepoClicked();
  };

  const disabled = Boolean(error) || !repoTitle || !isAllModulesSynced;

  return (
    <Collapsible
      title={originalGit ? 'Export to GitHub' : 'Github'}
      defaultOpen={!originalGit}
    >
      <Element css={css({ paddingX: 2 })}>
        <Text variant="muted" marginBottom={4} block>
          Create a GitHub repository to host your sandbox code and keep it in
          sync with CodeSandbox.
        </Text>
        {!isAllModulesSynced && (
          <Text marginBottom={2} block variant="danger">
            Save your files first before exporting.
          </Text>
        )}

        {error && (
          <Text marginBottom={2} block variant="danger">
            {error}
          </Text>
        )}

        <Stack
          marginX={0}
          as="form"
          direction="vertical"
          gap={2}
          onSubmit={createRepo}
        >
          <Input
            type="text"
            onChange={updateRepoTitle}
            value={repoTitle}
            placeholder="Enter repository name"
          />
          <Element css={css({ paddingX: 2 })}>
            <Button disabled={disabled} variant="secondary">
              Create Repository
            </Button>
          </Element>
        </Stack>
      </Element>
    </Collapsible>
  );
};
