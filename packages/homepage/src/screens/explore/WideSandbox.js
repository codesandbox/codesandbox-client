import React from 'react';
import styled from 'styled-components';
import Card from 'card-vibes';

import getIcon from 'common/templates/icons';

import getTemplate from 'common/templates';
import { profileUrl } from 'common/utils/url-generator';

import UserWithAvatar from 'app/src/app/components/UserWithAvatar';

const BG_COLOR = '#1C2022';
const BG_HOVER = '#212629';

const Container = styled(Card)`
  transition: 0.3s ease background-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  flex: 1;
  min-width: 400px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  margin-bottom: 2rem;
  margin-right: 1rem;

  background-color: ${BG_COLOR};

  &:hover {
    background-color: ${BG_HOVER};
  }
`;

const SandboxTitle = styled.h2`
  color: ${props => props.color};
  font-family: 'Poppins';
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;
`;

const SandboxDescription = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.new.description};
  font-weight: 500;
  line-height: 1.3;
  margin-top: 8px;
`;

const SandboxImage = styled.img`
  display: block;
  margin-bottom: 0;
  z-index: 0;
  border-bottom: 3.2px solid ${props => props.color};
  height: auto;
  width: 100%;
  background-color: ${BG_HOVER};
  border-image-width: 0;
`;

const SandboxInfo = styled.div`
  left: -1px;
  right: -1px;
  padding: 0.75rem;
  height: 130px;
  z-index: 1;
`;

const TemplateIcon = styled.div`
  display: flex;

  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
`;

const Author = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 600;

  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  text-decoration: none;
  color: ${props => props.theme.new.description};
`;

const getScreenshot = id =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;

export default class WideSandbox extends React.PureComponent {
  state = {
    imageLoaded: false,
  };

  getTitle = () =>
    this.props.sandbox.picks[0].title || this.props.sandbox.title;

  getDescription = () =>
    this.props.sandbox.picks[0].description || this.props.sandbox.description;

  toggleOpen = () => {
    this.props.pickSandbox({
      id: this.props.sandbox.id,
      title: this.getTitle(),
      description: this.getDescription(),
    });
  };

  render() {
    const { sandbox } = this.props;

    if (!sandbox) {
      return (
        <Container style={{}}>
          <SandboxImage as="div" style={{ border: 0, height: 245 }} />
          <SandboxInfo />
        </Container>
      );
    }

    const template = getTemplate(sandbox.template);
    const Icon = getIcon(sandbox.template);

    return (
      <Container
        style={{}}
        onClick={this.toggleOpen}
        role="button"
        tabIndex={0}
      >
        <SandboxImage
          alt={this.getTitle()}
          src={getScreenshot(sandbox.id)}
          color={template.color}
          style={{ height: this.state.imageLoaded ? 'auto' : 245 }}
          onLoad={() => {
            this.setState({ imageLoaded: true });
          }}
        />
        <SandboxInfo>
          <SandboxTitle color={template.color}>{this.getTitle()}</SandboxTitle>
          <SandboxDescription>{this.getDescription()}</SandboxDescription>

          {sandbox.author && (
            <a href={profileUrl(sandbox.author.username)}>
              <Author
                username={sandbox.author.username}
                avatarUrl={sandbox.author.avatar_url}
              />
            </a>
          )}
          <TemplateIcon>
            <Icon width={24} height={24} />
          </TemplateIcon>
        </SandboxInfo>
      </Container>
    );
  }
}
