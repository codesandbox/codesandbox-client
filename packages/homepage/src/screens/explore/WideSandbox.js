import React from 'react';

import getIcon from 'common/lib/templates/icons';
import getTemplate from 'common/lib/templates';
import { profileUrl } from 'common/lib/utils/url-generator';
import { ENTER } from 'common/lib/utils/keycodes';

import {
  Container,
  SandboxTitle,
  SandboxDescription,
  SandboxImage,
  SandboxInfo,
  TemplateIcon,
  Author,
} from './_WideSandbox.elements';

const getScreenshot = id =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;

export default class WideSandbox extends React.PureComponent {
  state = {
    imageLoaded: false,
  };

  getTitle = () => {
    if ((this.props.sandbox.picks || []).length !== 0) {
      return this.props.sandbox.picks[0].title;
    }

    return this.props.sandbox.title;
  };

  getDescription = () => {
    if ((this.props.sandbox.picks || []).length !== 0) {
      return this.props.sandbox.picks[0].description;
    }

    return this.props.sandbox.description;
  };

  toggleOpen = () => {
    this.props.pickSandbox({
      id: this.props.sandbox.id,
      title: this.getTitle(),
      description: this.getDescription(),
      screenshotUrl: this.props.sandbox.screenshot_url,
    });
  };

  handleKeyUp = e => {
    if (e.keyCode === ENTER) {
      this.toggleOpen();
    }
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
        onKeyUp={this.handleKeyUp}
      >
        <SandboxImage
          alt={this.getTitle()}
          src={sandbox.screenshot_url || getScreenshot(sandbox.id)}
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
