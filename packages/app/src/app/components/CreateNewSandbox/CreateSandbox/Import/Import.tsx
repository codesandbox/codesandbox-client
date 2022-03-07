import track from '@codesandbox/common/lib/utils/analytics';
import {
  gitHubRepoPattern,
  gitHubToSandboxUrl,
  protocolAndHost,
} from '@codesandbox/common/lib/utils/url-generator';
import { Button, Icon, Input, Stack } from '@codesandbox/components';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import css from '@styled-system/css';
import { useActions, useEffects } from 'app/overmind';
import React, { useCallback, useEffect, useState } from 'react';

import { Header } from '../elements';
import { GitHubIcon } from '../Icons';
import { DownloadIcon } from '../Icons/DownloadIcon';
import { TerminalIcon } from '../Icons/TerminalIcon';
import {
  FeatureText,
  Features,
  IconLink,
  ImportChoices,
  PlaceHolderLink,
  StyledInfoIcon,
} from './elements';

const getFullGitHubUrl = (url: string) =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

export const ImportFromGithub = () => {
  const actions = useActions();
  const effects = useEffects();
  const [error, setError] = useState(null);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [url, setUrl] = useState('');

  const updateUrl = useCallback(({ target: { value: newUrl } }) => {
    if (!newUrl) {
      setError(null);
      setTransformedUrl('');
      setUrl(newUrl);
    } else if (!gitHubRepoPattern.test(newUrl)) {
      setError('The URL provided is not valid.');
      setTransformedUrl('');
      setUrl(newUrl);
    } else {
      setError(null);
      setTransformedUrl(getFullGitHubUrl(newUrl.trim()));
      setUrl(newUrl);
    }
  }, []);

  return (
    <form>
      <Stack>
        <Input
          value={url}
          onChange={updateUrl}
          type="text"
          placeholder="GitHub Repository URL..."
        />

        {transformedUrl && (
          <Stack
            css={css({
              borderWidth: '1px',
              borderColor: 'grays.500',
              borderRadius: 2,
              marginLeft: '.5em',
            })}
          >
            <Tooltip content={transformedUrl.replace(/^https?:\/\//, '')}>
              <Button
                autoWidth
                css={css({
                  border: 0,
                  borderRadius: 0,
                  backgroundColor: 'grays.500',
                })}
                onClick={() => effects.browser.copyToClipboard(transformedUrl)}
              >
                <Icon name="link" size={10} />
              </Button>
            </Tooltip>
          </Stack>
        )}

        <Button
          autoWidth
          css={{ fontSize: 11, marginLeft: '.5em' }}
          disabled={!transformedUrl}
          onClick={async () => {
            try {
              await actions.git.importFromGithub(gitHubToSandboxUrl(url));
              actions.modals.newSandboxModal.close();
            } catch {
              // Were not able to import, probably private repo
            }
          }}
        >
          Import and Fork
        </Button>
      </Stack>

      <FeatureText>
        <small>
          {error ? (
            <PlaceHolderLink>{error}</PlaceHolderLink>
          ) : (
            'Tip: you can also link to specific directories, commits and branches here.'
          )}
        </small>
      </FeatureText>
    </form>
  );
};

export const Import = () => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'import' });
  }, []);

  return (
    <>
      <Header>
        <span>Import from GitHub</span>
      </Header>

      <Features>
        <GitHubIcon css={{ width: 69, height: 69 }} />

        <FeatureText css={{ marginTop: '25px' }}>
          Enter the URL to your GitHub repository to import it as a repository
          sandbox.
          <IconLink
            style={{ display: 'inline' }}
            href="/docs/importing#import-from-github"
          >
            <StyledInfoIcon />
          </IconLink>
        </FeatureText>

        <ImportFromGithub />
      </Features>

      <ImportChoices>
        <a href="/docs/importing#export-with-cli">
          <TerminalIcon />
          CLI Documentation
        </a>
        <a href="/docs/importing#define-api">
          <DownloadIcon />
          API Documentation
        </a>
      </ImportChoices>
    </>
  );
};
