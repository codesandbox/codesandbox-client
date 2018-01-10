import * as React from 'react';
import { inject, observer } from 'mobx-react';

import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from 'common/utils/url-generator';

import UserWithAvatar from 'app/components/UserWithAvatar';
import Stats from 'app/pages/common/Stats';
import PrivacyStatus from 'app/components/PrivacyStatus';
import ConfirmLink from 'app/components/ConfirmLink';
import GithubBadge from 'app/components/GithubBadge';

import getTemplateDefinition from 'common/templates';
import { WorkspaceInputContainer, WorkspaceSubtitle } from '../elements';
import Tags from '../Tags';

import {
  Item,
  GitContainer,
  UserLink,
  StatsContainer,
  PrivacyContainer,
  Title,
  Description,
} from './elements';

class Project extends React.Component {
  state = {
    editing: false,
  };

  render() {
    const { store, signals } = this.props;
    const sandbox = store.editor.currentSandbox;
    const workspace = store.workspace;
    return (
      <div>
        {this.state.editing ? (
          <React.Fragment>
            <WorkspaceInputContainer>
              <input
                value={workspace.project.title}
                onChange={event => {
                  signals.workspace.valueChanged({
                    field: 'title',
                    value: event.target.value,
                  });
                }}
                type="text"
                onBlur={() => {
                  signals.workspace.sandboxInfoUpdated();
                }}
                onKeyUp={event => {
                  if (event.keyCode === 13) {
                    signals.workspace.sandboxInfoUpdated();
                  }
                }}
                placeholder="Title"
              />
            </WorkspaceInputContainer>

            <WorkspaceInputContainer>
              <textarea
                value={workspace.project.description}
                onChange={event => {
                  signals.workspace.valueChanged({
                    field: 'description',
                    value: event.target.value,
                  });
                }}
                type="text"
                onBlur={() => {
                  signals.workspace.sandboxInfoUpdated();
                }}
                onKeyUp={event => {
                  if (event.keyCode === 13) {
                    signals.workspace.sandboxInfoUpdated();
                  }
                }}
                rows="2"
                placeholder="Description"
              />
            </WorkspaceInputContainer>
          </React.Fragment>
        ) : (
          <Item style={{ marginTop: '.5rem', marginBottom: '1rem' }}>
            <Title>
              {workspace.project.title || sandbox.title || sandbox.id}
            </Title>
            <Description
              style={{
                fontStyle: sandbox.description ? 'normal' : 'italic',
              }}
            >
              {sandbox.description || 'No description, create one!'}
            </Description>
          </Item>
        )}

        {!!sandbox.author && (
          <Item style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <UserLink to={profileUrl(sandbox.author.username)}>
              <UserWithAvatar
                username={sandbox.author.username}
                avatarUrl={sandbox.author.avatarUrl}
                subscriptionSince={sandbox.author.subscriptionSince}
              />
            </UserLink>
          </Item>
        )}

        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <Tags />
        </div>

        <StatsContainer style={{ marginBottom: '1rem' }}>
          <Stats sandbox={sandbox} />
        </StatsContainer>

        {!!sandbox.git && (
          <div>
            <WorkspaceSubtitle>GitHub Repository</WorkspaceSubtitle>
            <GitContainer>
              <GithubBadge
                url={githubRepoUrl(sandbox.git)}
                username={sandbox.git.username}
                repo={sandbox.git.repo}
                branch={sandbox.git.branch}
              />
            </GitContainer>
          </div>
        )}

        {sandbox.forkedFromSandbox && (
          <div>
            <WorkspaceSubtitle>Forked from</WorkspaceSubtitle>

            <Item>
              <ConfirmLink
                enabled={store.editor.isAllModulesSynced}
                message="You have unsaved changes. Are you sure you want to navigate away?"
                to={sandboxUrl(sandbox.forkedFromSandbox)}
              >
                {sandbox.forkedFromSandbox.title ||
                  sandbox.forkedFromSandbox.id}
              </ConfirmLink>
            </Item>
          </div>
        )}

        {sandbox.privacy > 0 && (
          <div>
            <WorkspaceSubtitle>Privacy Status</WorkspaceSubtitle>
            <PrivacyContainer>
              <PrivacyStatus privacy={sandbox.privacy} />
            </PrivacyContainer>
          </div>
        )}

        <div>
          <WorkspaceSubtitle>Template</WorkspaceSubtitle>
          <Item>
            <a
              href={getTemplateDefinition(sandbox.template).url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: getTemplateDefinition(sandbox.template).color() }}
            >
              {sandbox.template}
            </a>
          </Item>
        </div>
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(Project));
