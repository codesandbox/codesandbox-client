import { gitHubRepoPattern } from '@codesandbox/common/lib/utils/url-generator';
import { Button, Element, Input, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { getOwnerAndNameFromInput } from './utils';

const UnauthenticatedImport: React.FC = () => {
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={8}>
      <Text as="h2" css={{ margin: 0 }} size={4} weight="medium">
        Import from GitHub
      </Text>
      <Stack direction="vertical" gap={4}>
        <Text id="unauthenticated-label" css={{ color: '#999999' }} size={3}>
          You need to sign in to import repositories from GitHub.
        </Text>
        <Button
          aria-describedby="unauthenticated-label"
          css={{
            width: '132px',
          }}
          onClick={() => actions.signInClicked()}
          variant="primary"
        >
          Sign in
        </Button>
      </Stack>
    </Stack>
  );
};

type UrlState = {
  raw: string;
  parsed: { owner: string; name: string } | null;
  error: string | null;
};

type ImportProps = {
  onRepoSelect: (repo: GithubRepoToImport) => void;
};
export const Import: React.FC<ImportProps> = ({ onRepoSelect }) => {
  const { hasLogIn } = useAppState();

  const [url, setUrl] = React.useState<UrlState>({
    raw: '',
    parsed: null,
    error: null,
  });
  const [shouldFetch, setShouldFetch] = React.useState(false);
  const githubRepo = useGithubRepo({
    owner: url.parsed?.owner,
    name: url.parsed?.name,
    shouldFetch,
    onCompleted: onRepoSelect,
  });

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setUrl({ raw: value, parsed: null, error: null });
    } else if (!gitHubRepoPattern.test(value)) {
      setUrl({
        raw: value,
        parsed: null,
        error: 'The URL provided is not valid.',
      });
    } else {
      const { owner, name } = getOwnerAndNameFromInput(value.trim());
      setUrl({
        raw: value,
        parsed: {
          owner,
          name,
        },
        error: null,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  if (!hasLogIn) {
    return <UnauthenticatedImport />;
  }

  return (
    <Stack direction="vertical" gap={4}>
      <Text
        as="h2"
        id="form-title"
        css={{
          fontSize: '16px',
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Enter the GitHub repository URL to import
      </Text>
      <form onSubmit={handleFormSubmit}>
        <Stack gap={2}>
          <Input
            aria-describedby="form-title form-error"
            aria-invalid={Boolean(url.error)}
            onChange={handleUrlInputChange}
            placeholder="GitHub Repository URL"
            type="text"
            value={url.raw}
            required
          />
          <Button disabled={Boolean(url.error)} type="submit" autoWidth>
            {githubRepo.state === 'loading' ? 'Importing...' : 'Import'}
          </Button>
        </Stack>
        <Element aria-atomic="true" id="form-error" role="alert">
          {url.error || githubRepo.state === 'error' ? (
            <Text
              as="small"
              css={css({
                display: 'block',
                marginTop: 2,
                color: 'errorForeground',
                fontSize: 12,
              })}
            >
              {url.error}
              {githubRepo.state === 'error' && githubRepo.error}
            </Text>
          ) : null}
        </Element>
      </form>
    </Stack>
  );
};
