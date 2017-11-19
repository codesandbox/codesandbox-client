// @flow
import * as React from 'react';
import styled from 'styled-components';

import Navigation from 'app/containers/Navigation';
import Centered from 'common/components/flex/Centered';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import Input from 'app/components/Input';
import Button from 'app/components/buttons/Button';
import { gitHubToSandboxUrl, protocolAndHost } from 'common/utils/url-generator';

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

const Content = styled(Centered)`
  max-width: 50em;
  margin: auto;
  margin-top: 10%;
`;

const Label = styled.label`
  text-align: left;
  width: 100%;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.3);
`;

const Description = styled.div`margin-bottom: 1rem;`;

const StyledInput = styled(Input)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  margin-bottom: 2rem;
`;

type State = {
  url: string,
  error: ?string,
  transformedUrl: string,
};

const getFullGitHubUrl = url =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

export default class GitHub extends React.PureComponent<{}, State> {
  state: State = {
    url: '',
    transformedUrl: '',
    error: null,
  };

  updateUrl = e => {
    const url = e.target.value;

    if (!url.includes('github.com')) {
      this.setState({
        url,
        error: "The URL should contain from 'github.com'.",
      });
    } else {
      this.setState({
        url: e.target.value,
        transformedUrl: getFullGitHubUrl(url),
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
