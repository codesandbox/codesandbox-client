import React from 'react';

import getIcon from '../../templates/icons';
import getTemplate, { TemplateType } from '../../templates';
import { profileUrl } from '../../utils/url-generator';
import { ENTER } from '../../utils/keycodes';

import {
  Container,
  SandboxTitle,
  SandboxDescription,
  SandboxImage,
  SandboxInfo,
  TemplateIcon,
  Author,
} from './elements';

const getScreenshot = id =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;

/* eslint-disable camelcase */
export type Props = {
  sandbox: {
    picks?: Array<{ title: string; description: string }>;
    title: string;
    description: string;
    id: string;
    screenshot_url: string;
    template: TemplateType;
    author: {
      username: string;
      avatar_url: string;
    };
  };
  small?: boolean;
  noHeight?: boolean;
  defaultHeight?: number;
  noMargin?: boolean;
  selectSandbox: (params: {
    id: string;
    title: string;
    description: string;
    screenshotUrl: string;
  }) => void;
};
/* eslint-enable camelcase */

export default class WideSandbox extends React.PureComponent<Props> {
  state = {
    imageLoaded: false,
  };

  getTitle = () => {
    if ((this.props.sandbox.picks || []).length !== 0) {
      return this.props.sandbox.picks[0].title;
    }

    return this.props.sandbox.title || this.props.sandbox.id;
  };

  getDescription = () => {
    if ((this.props.sandbox.picks || []).length !== 0) {
      return this.props.sandbox.picks[0].description;
    }

    return this.props.sandbox.description;
  };

  toggleOpen = () => {
    this.props.selectSandbox({
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
    const {
      sandbox,
      small,
      noMargin,
      noHeight,
      defaultHeight = 245,
    } = this.props;

    if (!sandbox) {
      return (
        <Container style={{}}>
          <SandboxImage as="div" style={{ border: 0, height: 150 }} />
          <SandboxInfo />
        </Container>
      );
    }
    const template = getTemplate(sandbox.template);
    const Icon = getIcon(sandbox.template);

    return (
      <Container
        noMargin={noMargin}
        small={small}
        style={{}}
        onClick={this.toggleOpen}
        role="button"
        tabIndex={0}
        onKeyUp={this.handleKeyUp}
      >
        <SandboxImage
          alt={this.getTitle()}
          src={sandbox.screenshot_url || getScreenshot(sandbox.id)}
          color={template.color()}
          style={{ height: this.state.imageLoaded ? 'auto' : defaultHeight }}
          ref={img => {
            if (img && img.complete) {
              this.setState({ imageLoaded: true });
            }
          }}
          onLoad={() => {
            this.setState({ imageLoaded: true });
          }}
        />
        <SandboxInfo noHeight={noHeight}>
          <SandboxTitle color={template.color()}>
            {this.getTitle()}
          </SandboxTitle>
          {this.getDescription() ? (
            <SandboxDescription>{this.getDescription()}</SandboxDescription>
          ) : null}

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
