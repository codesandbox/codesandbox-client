import React, { useState, useCallback } from 'react';
import {
  gitHubToSandboxUrl,
  protocolAndHost,
  gitHubRepoPattern,
} from '@codesandbox/common/lib/utils/url-generator';
import { Button } from '@codesandbox/common/lib/components/Button';
import { useOvermind } from 'app/overmind';
import { TerminalIcon } from '../Icons/TerminalIcon';
import { DownloadIcon } from '../Icons/DownloadIcon';
import { GitHubIcon, StackbitIcon } from '../Icons';
import { Header } from '../elements';
import { StackbitButton } from './Stackbit';
import {
  Features,
  Column,
  FeatureName,
  FeatureText,
  Input,
  ButtonContainer,
  PlaceHolderLink,
  ImportChoices,
} from './elements';

const getFullGitHubUrl = (url: string) =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const Import = () => {
  const { state } = useOvermind();
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
    <>
      <Header>
        <span>Import Project</span>
      </Header>
      <Features>
        <Column fullWidth={!state.user}>
          <FeatureName>
            <GitHubIcon />
            Import from GitHub
          </FeatureName>
          <FeatureText>
            Enter the URL to your GitHub repository to generate a URL to your
            sandbox. The sandbox will stay in sync with your repository.
            <small>
              Tip: you can also link to specific directories, commits and
              branches here.
            </small>
          </FeatureText>
          <form>
            <Input
              value={url}
              onChange={updateUrl}
              type="text"
              placeholder="GitHub Repository URL..."
            />
            {error ? (
              <PlaceHolderLink error={error}>
                {error || 'Enter a URL to see the generated URL'}
              </PlaceHolderLink>
            ) : null}
            <ButtonContainer>
              <Button
                onClick={() => {
                  copyToClipboard(transformedUrl);
                }}
                disabled={!transformedUrl}
              >
                Copy Link
              </Button>
              <Button disabled={!transformedUrl} to={gitHubToSandboxUrl(url)}>
                Generate Sandbox
              </Button>
            </ButtonContainer>
          </form>
        </Column>
        {state.user && (
          <Column>
            {' '}
            <FeatureName>
              <StackbitIcon />
              Import from Stackbit
            </FeatureName>
            <FeatureText>
              Create a project using Stackbit. This generates a project for you
              that{"'"}s automatically set up with any Theme, Site Generator and
              CMS.
            </FeatureText>
            <StackbitButton username={state.user.username} />
          </Column>
        )}
      </Features>
      <ImportChoices>
        <a href="/docs/importing#export-with-cli">
          <TerminalIcon />
          CLI Documentation
        </a>
        <a href="/docs/importing#define-api">
          <DownloadIcon />
          CLI Documentation
        </a>
      </ImportChoices>
    </>
  );
};
