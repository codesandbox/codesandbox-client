import track from '@codesandbox/common/lib/utils/analytics';
import {
  gitHubRepoPattern,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';

import {
  Button,
  Element,
  Input,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { useSubscription } from 'app/hooks/useSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { GithubRepoToImport } from './types';
import { useGithubRepo } from './useGithubRepo';
import { useImportAndRedirect } from './useImportAndRedirect';
import { getOwnerAndNameFromInput } from './utils';

const UnauthenticatedImport: React.FC = () => {
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={4}>
      <Text
        as="h2"
        css={{ margin: 0, lineHeight: '24px' }}
        size={4}
        weight="medium"
      >
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
  const { hasLogIn, activeTeam } = useAppState();
  const importAndRedirect = useImportAndRedirect();
  const {
    hasActiveSubscription,
    hasPastOrActiveSubscription,
  } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: dashboard.recent(activeTeam),
    cancel_path: dashboard.recent(activeTeam),
  });

  const checkoutURL = React.useMemo(() => {
    if (isTeamAdmin || isPersonalSpace) {
      if (checkout.state === 'READY') {
        return checkout.url;
      }
      return '/pro';
    }

    return hasPastOrActiveSubscription
      ? '/docs/learn/introduction/workspace#managing-teams-and-subscriptions'
      : '/docs/learn/plan-billing/trials';
  }, [checkout, hasPastOrActiveSubscription, isTeamAdmin, isPersonalSpace]);
  const [isImporting, setIsImporting] = React.useState(false);
  const [shouldFetch, setShouldFetch] = React.useState(false);
  const [
    privateRepoFreeAccountError,
    setPrivateRepoFreeAccountError,
  ] = React.useState<string | undefined>(undefined);
  const [url, setUrl] = React.useState<UrlState>({
    raw: '',
    parsed: null,
    error: null,
  });

  const githubRepo = useGithubRepo({
    owner: url.parsed?.owner,
    name: url.parsed?.name,
    shouldFetch,
    onCompleted: async repo => {
      setShouldFetch(false);

      if (repo.private && !hasActiveSubscription) {
        setPrivateRepoFreeAccountError(url.raw);
        return;
      }

      if (repo.authorization === GithubRepoAuthorization.Write) {
        setIsImporting(true);
        await importAndRedirect(repo.owner.login, repo.name, activeTeam);
        setIsImporting(false);
      } else {
        onRepoSelect(repo);
      }
    },
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
    track('Create New - Import Repo', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
    setShouldFetch(true);
  };

  if (!hasLogIn) {
    return <UnauthenticatedImport />;
  }

  const isLoading = githubRepo.state === 'loading' || isImporting;
  const limitImportBasedOnSubscription =
    privateRepoFreeAccountError === url.raw;

  return (
    <Stack direction="vertical" gap={6}>
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
            css={{ height: '32px' }}
          />
          <Button
            disabled={Boolean(url.error) || isLoading}
            type="submit"
            autoWidth
            css={{ height: '32px', paddingRight: 24, paddingLeft: 24 }}
          >
            {isLoading ? 'Importing...' : 'Import'}
          </Button>
        </Stack>
        <Element aria-atomic="true" id="form-error" role="alert">
          {url.error ||
          githubRepo.state === 'error' ||
          limitImportBasedOnSubscription ? (
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
              {limitImportBasedOnSubscription && (
                <>
                  The free plan only allows public repos. For private
                  repositories,{' '}
                  <Link
                    css={{
                      padding: 0,
                    }}
                    color="#FFFFFF"
                    href={checkoutURL}
                  >
                    upgrade to{' '}
                    <Element as="span" css={{ textTransform: 'uppercase' }}>
                      pro
                    </Element>
                    .
                  </Link>
                </>
              )}
            </Text>
          ) : null}
        </Element>
      </form>
    </Stack>
  );
};
