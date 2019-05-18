import { Button } from '@codesandbox/common/lib/components/Button';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  gitHubToSandboxUrl,
  protocolAndHost,
  gitHubRepoPattern,
} from '@codesandbox/common/lib/utils/url-generator';
import React, { useCallback, useEffect, useState } from 'react';

import Navigation from 'app/pages/common/Navigation';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import { useSignals } from 'app/store';

import {
  Container,
  Content,
  Description,
  ErrorMessage,
  Label,
  StyledInput,
} from './elements';

const getFullGitHubUrl = url =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

const GitHub = () => {
  const { githubPageMounted } = useSignals();

  const [error, setError] = useState(null);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    githubPageMounted();
  }, [githubPageMounted]);

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
    <MaxWidth>
      <Margin vertical={1.5} horizontal={1.5}>
        <Container>
          <Navigation title="GitHub Import" />

          <Content vertical horizontal>
            <Description>
              <Title>Import from GitHub</Title>

              <SubTitle>
                Enter the URL to your GitHub repository to generate a URL to
                your sandbox. The sandbox will stay in sync with your
                repository.
                <br />
                <a
                  href="/docs/importing#import-from-github"
                  rel="noopener norefereer"
                  target="_blank"
                >
                  See the docs
                </a>
              </SubTitle>
            </Description>

            <Label htmlFor="githuburl">
              URL to GitHub Repository (supports branches and paths too)
            </Label>

            <StyledInput
              name="githuburl"
              onChange={updateUrl}
              placeholder="Insert GitHub URL..."
              value={url}
            />

            {error !== null && <ErrorMessage>{error}</ErrorMessage>}

            <Label htmlFor="sandboxurl">Converted Sandbox URL</Label>

            <StyledInput
              name="sandboxurl"
              placeholder="The Sandbox URL"
              value={transformedUrl}
            />

            <Button disabled={!transformedUrl} to={gitHubToSandboxUrl(url)}>
              Open Sandbox
            </Button>
          </Content>
        </Container>
      </Margin>
    </MaxWidth>
  );
};

export default GitHub;

