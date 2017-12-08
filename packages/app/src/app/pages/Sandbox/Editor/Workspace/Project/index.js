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
import type { User, GitInfo } from 'common/types';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

import {
  Item,
  GitContainer,
  UserLink,
  StatsContainer,
  PrivacyContainer,
} from './elements';

export default inject('store', 'signals')(
  observer(
    ({
      store,
      signals,
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
    }) => (
      <div>
        <WorkspaceInputContainer>
          <input
            value={store.editor.workspace.project.title}
            onChange={event => {
              signals.editor.workspace.valueChanged({
                field: 'title',
                value: event.target.value,
              });
            }}
            type="text"
            onBlur={() => {
              signals.editor.workspace.updateSandboxInfo();
            }}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                signals.editor.workspace.updateSandboxInfo();
              }
            }}
            placeholder="Title"
          />
        </WorkspaceInputContainer>

        <WorkspaceInputContainer>
          <textarea
            value={store.editor.workspace.project.description}
            onChange={event => {
              signals.editor.workspace.valueChanged({
                field: 'description',
                value: event.target.value,
              });
            }}
            type="text"
            onBlur={() => {
              signals.editor.workspace.updateSandboxInfo();
            }}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                signals.editor.workspace.updateSandboxInfo();
              }
            }}
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
    )
  )
);
