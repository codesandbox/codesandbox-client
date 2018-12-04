import React from 'react';
import Preview from 'app/src/app/components/Preview';
import { camelizeKeys } from 'humps';
import { profileUrl } from 'common/utils/url-generator';

import getIcon from 'common/templates/icons';
import {
  Container,
  SandboxContainer,
  SandboxInfo,
  Title,
  Description,
  Author,
  IconContainer,
  StyledStats,
} from './_FeaturedSandbox.elements';

const SandboxIcon = ({ template }) => {
  const Icon = getIcon(template);

  return (
    <IconContainer>
      <Icon />
    </IconContainer>
  );
};

export default class FeaturedSandbox extends React.PureComponent {
  state = {
    sandbox: undefined,
  };

  componentDidMount() {
    fetch(`http://localhost:3000/api/v1/sandboxes/${this.props.sandboxId}`)
      .then(x => x.json())
      .then(x => {
        this.setState({ sandbox: x.data });
      });
  }

  render() {
    const { sandbox } = this.state;
    const { title, description } = this.props;
    return (
      <Container>
        <SandboxContainer>
          <SandboxInfo>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {sandbox && (
              <StyledStats
                viewCount={sandbox.view_count}
                likeCount={sandbox.like_count}
                forkCount={sandbox.fork_count}
              />
            )}
          </SandboxInfo>

          {sandbox && (
            <React.Fragment>
              {sandbox.author && (
                <a href={profileUrl(sandbox.author.username)}>
                  <Author
                    username={sandbox.author.username}
                    avatarUrl={sandbox.author.avatar_url}
                  />
                </a>
              )}
              <SandboxIcon template={sandbox.template} />
            </React.Fragment>
          )}
        </SandboxContainer>
        {this.state.sandbox ? (
          <Preview
            sandbox={camelizeKeys(sandbox)}
            settings={{}}
            template={sandbox.template}
            isInProjectView
            noDelay
          />
        ) : (
          <div style={{ flex: 1, backgroundColor: 'white' }} />
        )}
      </Container>
    );
  }
}
