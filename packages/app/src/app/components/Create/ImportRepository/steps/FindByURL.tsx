import React, { useState } from 'react';
import { Element, Stack, Text, Input, Icon } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useAppState } from 'app/overmind';
import { useGithubRepo } from '../../hooks/useGithubRepo';
import { getOwnerAndNameFromInput } from '../utils';
import { RepoListItem } from '../components/RepoListItem';
import { GithubRepoToImport } from '../../utils/types';

let timeoutHook: NodeJS.Timeout | null = null;

export type FindByURLProps = {
  onSelected: (repo: GithubRepoToImport) => void;
};

export const FindByURL: React.FC<FindByURLProps> = ({ onSelected }) => {
  const [parsedInput, setParsedInput] = useState<{
    owner: string;
    name: string;
  } | null>(null);
  const [shouldValidateRepo, setShouldValidateRepo] = useState(false);
  const { sidebar, activeTeam } = useAppState();

  const workspaceRepos = sidebar[activeTeam]?.repositories || [];

  const githubRepo = useGithubRepo({
    owner: parsedInput?.owner,
    name: parsedInput?.name,
    shouldFetch: !!parsedInput && shouldValidateRepo,
  });

  const handleInputChange = ev => {
    clearTimeout(timeoutHook);
    setShouldValidateRepo(false);
    const newParsedValue = getOwnerAndNameFromInput(ev.target.value);
    setParsedInput(newParsedValue);

    if (newParsedValue) {
      timeoutHook = setTimeout(() => {
        setShouldValidateRepo(true);
      }, 200);
    }
  };

  const isImported =
    githubRepo.state === 'ready' &&
    workspaceRepos.find(
      r =>
        r.owner === githubRepo.data.owner.login &&
        r.name === githubRepo.data.name
    );

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={3}>
        Paste a link or type an owner/name combination to find a public GitHub
        repository.
      </Text>

      <Element css={{ flex: 1, position: 'relative' }}>
        <Input
          name="repo-url"
          id="repo-url"
          placeholder="GitHub URL or owner/name"
          type="text"
          autoFocus
          autoComplete="off"
          onChange={handleInputChange}
          css={{ height: '32px' }}
        />
        <Element css={{ position: 'absolute', right: 8, top: 8 }}>
          {githubRepo.state === 'loading' && <Icon size={16} name="spinner" />}
          {githubRepo.state === 'ready' && (
            <Icon size={16} color="#A3EC98" name="simpleCheck" />
          )}
          {githubRepo.state === 'error' && (
            <Icon size={16} color="#F5A8A8" name="cross" />
          )}
        </Element>
      </Element>
      {githubRepo.state === 'ready' && (
        <RepoListItem
          repo={githubRepo.data}
          isImported={isImported}
          onClicked={() => {
            if (isImported) {
              window.location.href = v2DefaultBranchUrl({
                owner: githubRepo.data.owner.login,
                repoName: githubRepo.data.name,
                workspaceId: activeTeam,
              });
            } else {
              track('Import repository - Find by URL - Import clicked');
              onSelected(githubRepo.data);
            }
          }}
        />
      )}
    </Stack>
  );
};
