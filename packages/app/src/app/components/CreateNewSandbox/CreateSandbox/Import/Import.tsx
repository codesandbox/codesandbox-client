import track from '@codesandbox/common/lib/utils/analytics';
import {
  gitHubRepoPattern,
  gitHubToSandboxUrl,
  protocolAndHost,
} from '@codesandbox/common/lib/utils/url-generator';
import { Button, Icon, Input, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions, useEffects } from 'app/overmind';
import React, { useCallback, useEffect, useState } from 'react';

import { Header } from '../elements';
import { GitHubIcon, StackbitIcon } from '../Icons';
import { DownloadIcon } from '../Icons/DownloadIcon';
import { TerminalIcon } from '../Icons/TerminalIcon';
import {
  ButtonContainer,
  Column,
  FeatureName,
  FeatureText,
  Features,
  IconLink,
  ImportChoices,
  PlaceHolderLink,
  StyledInfoIcon,
  VerticalSeparator,
} from './elements';
import { StackbitButton } from './Stackbit';

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
      <Input
        value={url}
        onChange={updateUrl}
        type="text"
        css={css({
          backgroundColor: 'white',
          color: 'grays.900',
        })}
        placeholder="GitHub Repository URL..."
      />

      <Stack
        align="center"
        justify="stretch"
        css={{ height: 40, width: '100%' }}
      >
        {transformedUrl ? (
          <Stack
            css={css({
              width: '100%',
              borderWidth: '1px',
              borderColor: 'grays.500',
              borderRadius: 2,
            })}
          >
            <Input
              css={{
                border: 0,
                borderRadius: 0,
              }}
              value={transformedUrl.replace(/^https?:\/\//, '')}
              readOnly
              type="text"
            />
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
          </Stack>
        ) : (
          <PlaceHolderLink error={error}>
            {error || 'Enter a GitHub URL and generate a sandbox link'}
          </PlaceHolderLink>
        )}
      </Stack>

      <ButtonContainer>
        <Button
          autoWidth
          style={{ fontSize: 11 }}
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
      </ButtonContainer>
    </form>
  );
};

export const Import = () => {
  const state = useAppState();
  const actions = useActions();

  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'import' });
  }, []);
  return (
    <>
      <Header>
        <span>Import Project</span>
      </Header>
      <Features>
        <Column>
          <FeatureName>
            <GitHubIcon style={{ marginRight: '1rem' }} />
            Import from GitHub{' '}
            <IconLink href="/docs/importing#import-from-github">
              <StyledInfoIcon />
            </IconLink>
          </FeatureName>
          <FeatureText>
            Enter the URL to your GitHub repository to import it as a repository
            sandbox.
            <small>
              Tip: you can also link to specific directories, commits and
              branches here.
            </small>
          </FeatureText>
          <ImportFromGithub />
        </Column>

        <>
          <VerticalSeparator />
          <Column>
            <FeatureName>
              <StackbitIcon style={{ marginRight: '1rem' }} />
              Import from Stackbit
            </FeatureName>
            <FeatureText>
              Create a project using{' '}
              <a
                href="https://www.stackbit.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Stackbit
              </a>
              . This generates a project for you that{"'"}s automatically set up
              with any Theme, Site Generator and CMS.
            </FeatureText>
            {!state.user ||
            (state.user.provider === 'google' &&
              !state.user.integrations.github) ? (
              <Button
                autoWidth
                onClick={() =>
                  actions.signInButtonClicked({ provider: 'github' })
                }
              >
                <Icon name="github" marginRight={2} />
                Sign in with GitHub
              </Button>
            ) : (
              <StackbitButton
                style={{ fontSize: 11 }}
                username={state.user.username}
                closeModal={() => actions.modalClosed()}
              />
            )}
          </Column>
        </>
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
