import React, { useState } from 'react';
import {
  Button,
  ComboButton,
  Element,
  Stack,
  Text,
  Input,
  Icon,
} from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useGithubRepo } from '../../hooks/useGithubRepo';
import { getOwnerAndNameFromInput } from '../utils';

let timeoutHook: NodeJS.Timeout | null = null;

export const AuthorizeGitHubPermissions = () => {
  const { signInGithubClicked } = useActions();
  const { isLoadingGithub } = useAppState();

  const [parsedInput, setParsedInput] = useState<{
    owner: string;
    name: string;
  } | null>(null);
  const [shouldValidateRepo, setShouldValidateRepo] = useState(false);

  const githubRepo = useGithubRepo({
    owner: parsedInput?.owner,
    name: parsedInput?.name,
    shouldFetch: !!parsedInput && shouldValidateRepo,
    onCompleted: async repo => {},
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
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={4}>
        <Text size={3}>
          To create commits and branches on your GitHub repositories, <br />
          you must grant CodeSandbox permissions to access those repositories.
        </Text>
        <ComboButton
          variant="primary"
          disabled={isLoadingGithub}
          onClick={() => signInGithubClicked('private_repos')}
          options={
            <>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('private_repos')}
              >
                Authorize access to all repositories{' '}
              </ComboButton.Item>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('public_repos')}
              >
                Authorize access only to public repositories{' '}
              </ComboButton.Item>
            </>
          }
        >
          Authorize access to all repositories{' '}
        </ComboButton>
      </Stack>
      <Stack direction="vertical" gap={4} css={{ width: '50%' }}>
        <Text size={4}>Open public URL</Text>
        <Text size={3}>Paste a link to open a public GitHub repository.</Text>

        <Stack gap={2}>
          <Element css={{ flex: 1, position: 'relative' }}>
            <Input
              name="repo-url"
              id="repo-url"
              placeholder="GitHub Repository URL"
              type="text"
              autoComplete="off"
              onChange={handleInputChange}
            />
            <Element css={{ position: 'absolute', right: 8, top: 6 }}>
              {githubRepo.state === 'loading' && (
                <Icon size={16} name="spinner" />
              )}
              {githubRepo.state === 'ready' && (
                <Icon size={16} color="#A3EC98" name="simpleCheck" />
              )}
              {githubRepo.state === 'error' && (
                <Icon size={16} color="#F5A8A8" name="cross" />
              )}
            </Element>
          </Element>
          <Button
            disabled={githubRepo.state !== 'ready'}
            autoWidth
            variant="secondary"
          >
            Open
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
