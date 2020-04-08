import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Collapsible,
  Element,
  FormField,
  Input,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

export const CreateRepo: FunctionComponent = () => {
  const {
    actions: {
      git: { createRepoClicked, repoTitleChanged },
    },
    state: {
      editor: {
        currentSandbox: { originalGit },
        isAllModulesSynced,
      },
      git: { error, repoTitle },
    },
  } = useOvermind();

  const updateRepoTitle = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => repoTitleChanged(value);

  const createRepo = event => {
    event.preventDefault();
    track('Export to GitHub Clicked');
    createRepoClicked();
  };

  return (
    <Collapsible
      defaultOpen={!originalGit}
      title={originalGit ? 'Export to GitHub' : 'GitHub'}
    >
      <Element paddingX={2}>
        <Text block marginBottom={4} variant="muted">
          Create a GitHub repository to host your sandbox code and keep it in
          sync with CodeSandbox.
        </Text>

        {!isAllModulesSynced && (
          <Text block marginBottom={2} variant="danger">
            Save your files first before exporting.
          </Text>
        )}

        {error && (
          <Text block marginBottom={2} variant="danger">
            {error}
          </Text>
        )}

        <Stack
          as="form"
          direction="vertical"
          gap={2}
          marginX={0}
          onSubmit={createRepo}
        >
          <FormField hideLabel label="Repository name">
            <Input
              onChange={updateRepoTitle}
              placeholder="Enter repository name"
              type="text"
              value={repoTitle}
            />
          </FormField>

          <Element paddingX={2}>
            <Button
              disabled={Boolean(error) || !repoTitle || !isAllModulesSynced}
              type="submit"
              variant="secondary"
            >
              Create Repository
            </Button>
          </Element>
        </Stack>
      </Element>
    </Collapsible>
  );
};
