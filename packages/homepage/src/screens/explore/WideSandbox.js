import React from 'react';
import styled from 'styled-components';

import Vibrant from 'node-vibrant';
import getIcon from 'common/templates/icons';

import getTemplate from 'common/templates';
import { profileUrl } from 'common/utils/url-generator';

const BG_COLOR = '#26282a';

const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  flex: 1;
  min-width: 400px;
  width: 100%;
  /* padding: 1.5rem 1rem; */
  /* box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3); */
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  margin-bottom: 2rem;
  margin-right: 1rem;

  background-color: ${props => props.color || BG_COLOR};
`;

const SandboxTitle = styled.h2`
  color: ${props => props.color};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 0;
`;

const SandboxDescription = styled.p`
  font-size: 0.75rem;
  color: #b9bbbe;
  line-height: 1.3;
  margin-top: 8px;
`;

const SandboxImage = styled.img`
  display: block;
  margin-bottom: 0;
  z-index: 0;
  border-bottom: 3.2px solid ${props => props.color};

  /* box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3); */

  /* mask: linear-gradient(#000 30%, transparent); */
`;

const SandboxInfo = styled.div`
  /* position: absolute; */
  left: -1px;
  right: -1px;
  /* background: linear-gradient(
    -180deg,
    transparent 0%,
    ${props => props.color || BG_COLOR} 75%
  ); */

  padding: .75rem;


  height: 130px;



  z-index: 1;
  /* bottom: calc(${CHIN_HEIGHT - 6}rem - 1px); */
`;

const TemplateIcon = styled.div`
  display: flex;

  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
`;

const Author = styled.a`
  display: flex;
  align-items: center;

  font-size: 0.75rem;
  font-weight: 500;

  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  color: white;
  text-decoration: none;

  img {
    border-radius: 100%;
    width: 24px;
    height: 24px;
    margin-right: 0.4rem;
    margin-bottom: 0;
  }
`;

const getScreenshot = id =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;

// eslint-disable-next-line
export default class WideSandbox extends React.PureComponent {
  state = {
    color: null,
  };

  render() {
    const sandbox = this.props.sandbox;

    const template = getTemplate(sandbox.template);
    const Icon = getIcon(sandbox.template);

    return (
      <Container color={this.state.color} role="button" tabIndex={0}>
        <SandboxImage
          alt={sandbox.img}
          src={getScreenshot(sandbox.id)}
          color={template.color}
        />
        <SandboxInfo color={this.state.color}>
          <SandboxTitle color={template.color}>
            {sandbox.picks[0].title || sandbox.title}
          </SandboxTitle>
          <SandboxDescription>
            {sandbox.picks[0].description || sandbox.description}
          </SandboxDescription>

          {sandbox.author && (
            <Author href={profileUrl(sandbox.author.username)}>
              <img
                src={sandbox.author.avatar_url}
                alt={sandbox.author.username}
              />
              {sandbox.author.username}
            </Author>
          )}
          <TemplateIcon>
            <Icon width={24} height={24} />
          </TemplateIcon>
        </SandboxInfo>
      </Container>
    );
  }
}
