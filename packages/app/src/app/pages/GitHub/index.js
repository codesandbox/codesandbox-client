import * as React from 'react';

import Navigation from 'app/pages/common/Navigation';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';
import {
  gitHubToSandboxUrl,
  protocolAndHost,
  gitHubRepoPattern,
} from 'common/utils/url-generator';

import {
  Container,
  Content,
  Label,
  Description,
  StyledInput,
  ErrorMessage,
} from './elements';

const getFullGitHubUrl = url =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

export default class GitHub extends React.PureComponent {
  state = {
    url: '',
    transformedUrl: '',
    error: null,
  };

  updateUrl = e => {
    const url = e.target.value;

    if (!url) {
      this.setState({
        url,
        error: null,
        transformedUrl: '',
      });
    } else if (!gitHubRepoPattern.test(url)) {
      this.setState({
        url,
        error: 'The URL provided is not valid.',
        transformedUrl: '',
      });
    } else {
      this.setState({
        url: e.target.value,
        transformedUrl: getFullGitHubUrl(url.trim()),
        error: null,
      });
    }
  };

  render() {
    const { url, transformedUrl, error } = this.state;
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
                </SubTitle>
              </Description>

              <Label htmlFor="githuburl">
                URL to GitHub Repository (supports branches and paths too)
              </Label>
              <StyledInput
                name="githuburl"
                value={url}
                onChange={this.updateUrl}
                placeholder="Insert GitHub URL..."
              />

              {error !== null && <ErrorMessage>{error}</ErrorMessage>}

              <Label htmlFor="sandboxurl">Converted Sandbox URL</Label>
              <StyledInput
                name="sandboxurl"
                value={transformedUrl}
                placeholder="The Sandbox URL"
              />

              <Button disabled={!transformedUrl} to={gitHubToSandboxUrl(url)}>
                Open Sandbox
              </Button>
            </Content>
          </Container>
        </Margin>
      </MaxWidth>
    );
  }
}
