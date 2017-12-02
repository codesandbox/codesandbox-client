// @flow
import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ConfirmLink from 'app/components/ConfirmLink';
import GithubBadge from 'app/components/sandbox/GithubBadge';
import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from 'common/utils/url-generator';
import UserWithAvatar from 'app/components/user/UserWithAvatar';
import Stats from 'app/components/sandbox/Stats';
import PrivacyStatus from 'app/components/sandbox/PrivacyStatus';
import getTemplateDefinition from 'common/templates';

import type { User, GitInfo } from 'common/types';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

const Item = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: 0.875rem;
`;

const GitContainer = styled.div`
  display: inline-block;
  margin: 0 1rem;
  margin-bottom: 0.25rem;
`;

const UserLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
`;

const StatsContainer = styled.div`
  height: 2rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
`;

const PrivacyContainer = styled.div`
  margin: 0 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
`;

type Props = {
  id: string,
  title: ?string,
  description: string,
  viewCount: number,
  likeCount: number,
  forkCount: number,
  forkedSandbox: ?{ title: string, id: string },
  updateSandboxInfo: (id: string, title: string, description: string) => any,
  preventTransition: boolean,
  author: ?User,
  git: ?GitInfo,
  privacy: number,
  template: string,
};

export default class Project extends React.PureComponent<
  Props,
  {
    title: ?string,
    description: ?string,
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: props.title,
      description: props.description,
    };
  }

  setValue = (field: string) => (e: Event) => {
    // $FlowIssue
    this.setState({ [field]: e.target.value });
  };

  updateSandboxInfo = () => {
    const { id, title: oldTitle, description: oldDescription } = this.props;
    const { title, description } = this.state;

    if (title !== oldTitle || description !== oldDescription) {
      this.props.updateSandboxInfo(id, title || '', description || '');
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter or escape
      this.updateSandboxInfo();
    }
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
    if (nextProps.description !== this.props.description) {
      this.setState({ description: nextProps.description });
    }
  };

  render() {
    const {
      id,
      forkedSandbox,
      viewCount,
      likeCount,
      forkCount,
      author,
      git,
      template,
      preventTransition,
      privacy,
    } = this.props;
    const { title, description } = this.state;
    return (
      <div>
        <WorkspaceInputContainer>
          <input
            value={title || ''}
            onChange={this.setValue('title')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
            placeholder="Title"
          />
        </WorkspaceInputContainer>

        <WorkspaceInputContainer>
          <textarea
            value={description || ''}
            onChange={this.setValue('description')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
            rows="2"
            placeholder="Description"
          />
        </WorkspaceInputContainer>
        {!!author && (
          <div>
            <WorkspaceSubtitle>Author</WorkspaceSubtitle>
            <Item>
              <UserLink to={profileUrl(author.username)}>
                <UserWithAvatar
                  username={author.username}
                  avatarUrl={author.avatarUrl}
                  subscriptionSince={author.subscriptionSince}
                />
              </UserLink>
            </Item>
          </div>
        )}

        {!!git && (
          <div>
            <WorkspaceSubtitle>GitHub Repository</WorkspaceSubtitle>
            <GitContainer>
              <GithubBadge
                url={githubRepoUrl(git)}
                username={git.username}
                repo={git.repo}
                branch={git.branch}
              />
            </GitContainer>
          </div>
        )}

        {forkedSandbox && (
          <div>
            <WorkspaceSubtitle>Forked from</WorkspaceSubtitle>

            <Item>
              <ConfirmLink
                enabled={preventTransition}
                message="You have unsaved changes. Are you sure you want to navigate away?"
                to={sandboxUrl(forkedSandbox)}
              >
                {forkedSandbox.title || forkedSandbox.id}
              </ConfirmLink>
            </Item>
          </div>
        )}

        {privacy > 0 && (
          <div>
            <WorkspaceSubtitle>Privacy Status</WorkspaceSubtitle>
            <PrivacyContainer>
              <PrivacyStatus privacy={privacy} />
            </PrivacyContainer>
          </div>
        )}

        <div>
          <WorkspaceSubtitle>Template</WorkspaceSubtitle>
          <Item>
            <a
              href={getTemplateDefinition(template).url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: getTemplateDefinition(template).color() }}
            >
              {template}
            </a>
          </Item>
        </div>
        <StatsContainer>
          <Stats
            sandboxId={id}
            viewCount={viewCount}
            likeCount={likeCount}
            forkCount={forkCount}
          />
        </StatsContainer>
      </div>
    );
  }
}
