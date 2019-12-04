import React from 'react';
import ForkIcon from 'react-icons/lib/go/repo-forked';
import EyeIcon from 'react-icons/lib/go/eye';
import LikeIcon from 'react-icons/lib/go/heart';

import getIcon from '../../templates/icons';
import getTemplate, { TemplateType } from '../../templates';
import { profileUrl } from '../../utils/url-generator';
import { ENTER } from '../../utils/keycodes';

import {
  Container,
  SandboxTitle,
  SandboxDescription,
  Image,
  Overlay,
  Avatar,
  Stats,
  SandboxStats,
  SandboxImage,
  SandboxInfo,
  TemplateIcon,
} from './elements';
import Tags from '../Tags';

const getScreenshot = (id: string) =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;

/* eslint-disable camelcase */
export interface Sandbox {
  title: string;
  description: string;
  tags: string[];
  id: string;
  screenshot_url: string;
  template: TemplateType;
  view_count: number;
  fork_count: number;
  like_count: number;
  author: {
    username: string;
    avatar_url: string;
  };
}
/* eslint-enable */
export interface Props {
  sandbox: Sandbox;
  small?: boolean;
  noHeight?: boolean;
  defaultHeight?: number;
  noMargin?: boolean;
  selectSandbox: (params: Sandbox) => void;
}

const kFormatter = (num: number): number | string => {
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'M';
  }

  if (num > 999) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num;
};

export default class SandboxCard extends React.PureComponent<Props> {
  toggleOpen = () => {
    this.props.selectSandbox({ ...this.props.sandbox });
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
      defaultHeight = 152,
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
        <Image>
          <SandboxImage
            alt={sandbox.title}
            src={sandbox.screenshot_url || getScreenshot(sandbox.id)}
            color={template.color()}
            style={{ height: defaultHeight }}
          />

          <Overlay>
            <SandboxDescription>{sandbox.description}</SandboxDescription>
            {sandbox.tags && <Tags tags={sandbox.tags} />}
          </Overlay>
        </Image>
        <SandboxInfo noHeight={noHeight}>
          <SandboxTitle color={template.color()}>{sandbox.title}</SandboxTitle>
          <TemplateIcon>
            <Icon width={16} height={16} />
          </TemplateIcon>
        </SandboxInfo>

        <SandboxStats>
          <Stats>
            <li>
              <EyeIcon />
              {kFormatter(sandbox.view_count)}
            </li>
            <li>
              <ForkIcon />
              {kFormatter(sandbox.fork_count)}
            </li>
            <li>
              <LikeIcon />
              {kFormatter(sandbox.like_count)}
            </li>
          </Stats>
          {sandbox.author && (
            <a href={profileUrl(sandbox.author.username)}>
              <Avatar src={sandbox.author.avatar_url} />
            </a>
          )}
        </SandboxStats>
      </Container>
    );
  }
}
