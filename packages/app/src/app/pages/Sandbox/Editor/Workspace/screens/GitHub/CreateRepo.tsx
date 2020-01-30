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

  const createRepo = () => {
    track('Export to GitHub Clicked');
    createRepoClicked();
  };

  return (
    <Collapsible
      title={originalGit ? 'Export to GitHub' : 'Github'}
      defaultOpen={!originalGit}
    >
      <Element css={css({ paddingX: 2 })}>
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

        <Stack as="form" direction="vertical" gap={2}>
          <Input
            type="text"
            onChange={updateRepoTitle}
            value={repoTitle}
            placeholder="Enter repository name"
          />
          <Button
            disabled={Boolean(error) || !repoTitle || !isAllModulesSynced}
            onClick={createRepo}
            variant="secondary"
          >
            Create Repository
          </Button>
        </Stack>
      </Element>
    </Collapsible>
  );
};
