import React, { useState, useCallback } from 'react';
import {
  gitHubToSandboxUrl,
  protocolAndHost,
  gitHubRepoPattern,
} from '@codesandbox/common/lib/utils/url-generator';
import { Button } from '@codesandbox/common/lib/components/Button';
import track from '@codesandbox/common/lib/utils/analytics';

import {
  ImportHeader,
  ImportDescription,
  Section,
  GitHubInput,
  GitHubLink,
  Buttons,
  PlaceHolderLink,
  DocsLink,
} from './elements';

const getFullGitHubUrl = url =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

const copyToClipboard = str => {
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

export const GitHubImport = () => {
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
    <Section style={{ flex: 6 }}>
      <ImportHeader>
        Import from GitHub{' '}
        <DocsLink target="_blank" href="/docs/importing#import-from-github">
          docs
        </DocsLink>
      </ImportHeader>
      <ImportDescription>
        Enter the URL to your GitHub repository to generate a URL to your
        sandbox. The sandbox will stay in sync with your repository.
      </ImportDescription>

      <ImportDescription>
        Tip: you can also link to specific directories, commits and branches
        here.
      </ImportDescription>

      <GitHubInput
        placeholder="GitHub Repository URL..."
        onChange={updateUrl}
        value={url}
      />

      {transformedUrl ? (
        <GitHubLink
          href={transformedUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          {transformedUrl.replace(/^https?:\/\//, '')}
        </GitHubLink>
      ) : (
        <PlaceHolderLink error={error}>
          {error || 'Enter a URL to see the generated URL'}
        </PlaceHolderLink>
      )}

      <Buttons>
        <Button
          onClick={() => {
            copyToClipboard(transformedUrl);
          }}
          disabled={!transformedUrl}
          secondary
          small
        >
          Copy Link
        </Button>
        <Button
          onClick={() => {
            track('GitHub Import Wizard - Open Sandbox Clicked');
          }}
          disabled={!transformedUrl}
          to={gitHubToSandboxUrl(url)}
          small
        >
          Open Sandbox
        </Button>
      </Buttons>
    </Section>
  );
};
