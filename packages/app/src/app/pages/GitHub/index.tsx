import { Button } from '@codesandbox/common/lib/components/Button';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  gitHubToSandboxUrl,
  gitHubRepoPattern,
  protocolAndHost,
} from '@codesandbox/common/lib/utils/url-generator';
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import {
  Container,
  Content,
  Description,
  ErrorMessage,
  Input,
  Label,
} from './elements';

const getFullGitHubUrl = (url: string) =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

export const GitHub: FunctionComponent = () => {
  const {
    actions: { githubPageMounted },
  } = useOvermind();
  const [error, setError] = useState(null);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    githubPageMounted();
  }, [githubPageMounted]);

  const updateUrl = ({
    target: { value: newUrl },
  }: ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <MaxWidth>
      <div style={{ minHeight: '100vh' }}>
        <Margin vertical={1.5} horizontal={1.5}>
          <Container>
            <Navigation title="GitHub Import" />

            <Content horizontal vertical>
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

              <Input
                name="githuburl"
                onChange={updateUrl}
                placeholder="Insert GitHub URL..."
                value={url}
              />

              {error !== null && <ErrorMessage>{error}</ErrorMessage>}

              <Label htmlFor="sandboxurl">Converted Sandbox URL</Label>

              <Input
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
      </div>
    </MaxWidth>
  );
};
