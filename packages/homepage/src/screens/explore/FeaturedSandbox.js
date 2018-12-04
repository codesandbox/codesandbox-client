import React from 'react';
import styled from 'styled-components';
import Preview from 'app/src/app/components/Preview';
import { camelizeKeys } from 'humps';
import UserWithAvatar from 'app/src/app/components/UserWithAvatar';
import { profileUrl } from 'common/utils/url-generator';

import Stats from 'common/components/Stats';
import getIcon from 'common/templates/icons';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.new.bg};
  border-radius: 8px;
  color: ${props => props.theme.new.title};
  height: 500px;
  display: flex;
  box-shadow: 0 9px 14px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const SandboxContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SandboxInfo = styled.div`
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-family: 'Poppins';
  font-weight: 600;
`;

const Description = styled.p`
  color: ${props => props.theme.new.description};
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 1rem;
`;

const Author = styled(UserWithAvatar)`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  color: ${props => props.theme.new.description};
  font-weight: 600;
`;

const IconContainer = styled.div`
  display: flex;
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
`;

const SandboxIcon = ({ template }) => {
  const Icon = getIcon(template);

  return (
    <IconContainer>
      <Icon />
    </IconContainer>
  );
};

const StyledStats = styled(Stats)`
  color: ${props => props.theme.new.description};
  font-weight: 600;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
