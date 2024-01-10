import track from '@codesandbox/common/lib/utils/analytics';
import {
  Button,
  Collapsible,
  Element,
  FormField,
  Input,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import React, { ChangeEvent } from 'react';

type CreateRepoProps = {
  /**
   * The prop overrides internals and disabled the whole section.
   * Useful when there are no GitHub permissions but we still
   * want to show the UI.
   */
  disabled?: boolean;
};
export const CreateRepo: React.FC<CreateRepoProps> = ({ disabled }) => {
  const {
    git: { createRepoClicked, repoTitleChanged },
    modalOpened,
  } = useActions();
  const {
    editor: { isAllModulesSynced, currentSandbox },
    git: { error, repoTitle },
  } = useAppState();

  const updateRepoTitle = ({
    target: { value: title },
  }: ChangeEvent<HTMLInputElement>) => repoTitleChanged({ title });

  const createRepo = e => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    track('Export to GitHub Clicked');
    createRepoClicked();
  };

  const disableImport =
    Boolean(error) || !repoTitle || !isAllModulesSynced || disabled;

  return (
    <Collapsible
      title="Copy Sandbox as a Repository"
      defaultOpen={!currentSandbox.originalGit && !disabled}
    >
      <Element
        css={{
          opacity: disabled ? 0.6 : 1,
        }}
        paddingX={2}
      >
        <Text variant="muted" marginBottom={2} block>
          Export the content of this sandbox to a new GitHub repository,
          allowing you to commit changes made on CodeSandbox to GitHub. If you
          want to rather import an existing repository,{' '}
          <Link
            css={{ color: 'white' }}
            onClick={() => modalOpened({ modal: 'importRepository' })}
          >
            open the GitHub import
          </Link>
          .
        </Text>
        <Text variant="muted" marginBottom={4} block>
          This will open the GitHub repo in the new{' '}
          <a
            href="https://projects.codesandbox.io?utm_source=editor"
            rel="noreferrer"
            target="_blank"
          >
            CodeSandbox (Projects) editor
          </a>{' '}
          which is built for GitHub repos.
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
          <FormField label="Repository name" hideLabel>
            <Input
              type="text"
              onChange={updateRepoTitle}
              value={repoTitle}
              placeholder="Repository name..."
            />
          </FormField>
          <Element paddingX={2}>
            <Button type="submit" disabled={disableImport} variant="secondary">
              Create repository
            </Button>
          </Element>
        </Stack>
      </Element>
    </Collapsible>
  );
};
