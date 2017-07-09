// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ConfirmLink from 'app/components/ConfirmLink';
import LinkButton from 'app/components/buttons/LinkButton';
import GithubBadge from 'app/components/sandbox/GithubBadge';
import { sandboxUrl, githubRepoUrl, profileUrl } from 'app/utils/url-generator';
import UserWithAvatar from 'app/components/user/UserWithAvatar';
import type { User } from 'common/types';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

const Item = styled.div`
  margin: 1rem;
  margin-top: 0;
  font-size: .875rem;
`;

const GitContainer = styled.div`
  display: inline-block;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;

const UserLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: .875rem;
`;

// {owned &&
//   <WorkspaceInputContainer>
//     <LinkButton
//       style={{ marginTop: '0.5rem', marginLeft: '-2px' }}
//       onClick={this.handleDeleteSandbox}
//     >
//       Delete Sandbox
//     </LinkButton>
//   </WorkspaceInputContainer>}
type Props = {
  id: string,
  title: ?string,
  description: string,
  viewCount: number,
  likeCount: number,
  forkCount: number,
  forkedSandbox: ?{ title: string, id: string },
  updateSandboxInfo: (id: string, title: string, description: string) => any,
  deleteSandbox: (id: string) => any,
  preventTransition: boolean,
  author: ?User,
  githubUrl: ?string,
  repoName: ?string,
};

export default class Project extends React.PureComponent {
  props: Props;
  state: {
    title: ?string,
    description: ?string,
  };

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

  handleDeleteSandbox = () => {
    const really = confirm('Are you sure you want to delete this sandbox?');
    if (really) {
      this.props.deleteSandbox(this.props.id);
    }
  };

  render() {
    const {
      forkedSandbox,
      viewCount,
      likeCount,
      forkCount,
      author,
      git,
      preventTransition,
    } = this.props;
    const { title, description } = this.state;
    return (
      <div>
        <WorkspaceSubtitle>Title</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <input
            value={title || ''}
            onChange={this.setValue('title')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
          />
        </WorkspaceInputContainer>
        <WorkspaceSubtitle>Description</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <textarea
            value={description || ''}
            onChange={this.setValue('description')}
            type="text"
            onBlur={this.updateSandboxInfo}
            onKeyUp={this.handleKeyUp}
            rows="5"
          />
        </WorkspaceInputContainer>
        {forkedSandbox &&
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
          </div>}
        {author &&
          <Item>
            <UserLink to={profileUrl(author.username)}>
              <UserWithAvatar
                username={author.username}
                avatarUrl={author.avatarUrl}
              />
            </UserLink>
          </Item>}

        {!!git &&
          <GitContainer>
            <GithubBadge
              url={githubRepoUrl(git)}
              username={git.username}
              repo={git.repo}
            />
          </GitContainer>}
      </div>
    );
  }
}
