// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';

import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from 'common/utils/url-generator';

import UserWithAvatar from 'app/components/user/UserWithAvatar';
import Stats from 'app/components/sandbox/Stats';
import PrivacyStatus from 'app/components/sandbox/PrivacyStatus';
import ConfirmLink from 'app/components/ConfirmLink';
import GithubBadge from 'app/components/sandbox/GithubBadge';

import getTemplateDefinition from 'common/templates';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

import {
  Item,
  GitContainer,
  UserLink,
  StatsContainer,
  PrivacyContainer,
} from './elements';

function Project({ store, signals }) {
  const sandbox = store.editor.currentSandbox;
  const workspace = store.editor.workspace;

  return (
    <div>
      <WorkspaceInputContainer>
        <input
          value={workspace.project.title}
          onChange={event => {
            signals.editor.workspace.valueChanged({
              field: 'title',
              value: event.target.value,
            });
          }}
          type="text"
          onBlur={() => {
            signals.editor.workspace.sandboxInfoUpdated();
          }}
          onKeyUp={event => {
            if (event.keyCode === 13) {
              signals.editor.workspace.sandboxInfoUpdated();
            }
          }}
          placeholder="Title"
        />
      </WorkspaceInputContainer>

      <WorkspaceInputContainer>
        <textarea
          value={workspace.project.description}
          onChange={event => {
            signals.editor.workspace.valueChanged({
              field: 'description',
              value: event.target.value,
            });
          }}
          type="text"
          onBlur={() => {
            signals.editor.workspace.sandboxInfoUpdated();
          }}
          onKeyUp={event => {
            if (event.keyCode === 13) {
              signals.editor.workspace.sandboxInfoUpdated();
            }
          }}
          rows="2"
          placeholder="Description"
        />
      </WorkspaceInputContainer>
      {!!sandbox.author && (
        <div>
          <WorkspaceSubtitle>Author</WorkspaceSubtitle>
          <Item>
            <UserLink to={profileUrl(sandbox.author.username)}>
              <UserWithAvatar
                username={sandbox.author.username}
                avatarUrl={sandbox.author.avatarUrl}
                subscriptionSince={sandbox.author.subscriptionSince}
              />
            </UserLink>
          </Item>
        </div>
      )}

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
              {sandbox.forkedFromSandbox.title || sandbox.forkedFromSandbox.id}
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
      <StatsContainer>
        <Stats
          sandboxId={sandbox.id}
          viewCount={sandbox.viewCount}
          likeCount={sandbox.likeCount}
          forkCount={sandbox.forkCount}
        />
      </StatsContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(Project));
