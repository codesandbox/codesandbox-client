import React, { useState } from 'react';
import { Element, Stack, Text, Input, Icon } from '@codesandbox/components';

import { useGithubRepo } from '../../hooks/useGithubRepo';
import { getOwnerAndNameFromInput } from '../utils';
import { RepoListItem } from '../components/RepoListItem';
import { GithubRepoToImport } from '../../utils/types';

let timeoutHook: NodeJS.Timeout | null = null;

export type ExploreGithubProps = {
  onSelected: (repo: GithubRepoToImport) => void;
};

export const ExploreGithub = ({ onSelected }) => {
  const [parsedInput, setParsedInput] = useState<{
    owner: string;
    name: string;
  } | null>(null);
  const [shouldValidateRepo, setShouldValidateRepo] = useState(false);

  const githubRepo = useGithubRepo({
    owner: parsedInput?.owner,
    name: parsedInput?.name,
    shouldFetch: !!parsedInput && shouldValidateRepo,
    onCompleted: () => {},
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

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={4}>Open public URL</Text>
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
          autoComplete="off"
          onChange={handleInputChange}
          css={{ height: '32px' }}
        />
        <Element css={{ position: 'absolute', right: 8, top: 6 }}>
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
          onClicked={() => {
            onSelected(githubRepo.data);
          }}
        />
      )}
    </Stack>
  );
};
