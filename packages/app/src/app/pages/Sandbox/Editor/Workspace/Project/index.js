import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';

import TeamIcon from 'react-icons/lib/md/people';

import { Button } from '@codesandbox/common/lib/components/Button';
import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import Stats from 'app/pages/common/Stats';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import PrivacyStatus from 'app/components/PrivacyStatus';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import EditableTags from 'app/components/EditableTags';
import Tags from '@codesandbox/common/lib/components/Tags';
import Switch from '@codesandbox/common/lib/components/Switch';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { WorkspaceInputContainer } from '../elements';

import {
  Item,
  UserLink,
  StatsContainer,
  PrivacyContainer,
  Title,
  Alias,
  Description,
  EditPen,
  PropertyValue,
  PropertyName,
  Icon,
  FreezeContainer,
} from './elements';

class Project extends React.Component {
  state = {
    editingTitle: false,
    editingDescription: false,
    editingAlias: false,
  };

  setTitleEditing = () => {
    this.setState({ editingTitle: true });
  };

  setAliasEditing = () => {
    this.setState({ editingAlias: true });
  };

  setDescriptionEditing = () => {
    this.setState({ editingDescription: true });
  };

  changeTags = (newTags, removedTags) => {
    const { tags } = this.props.store.editor.currentSandbox;

    if (tags.length > 5) {
      this.props.signals.notificationAdded(
        'You can have a maximum of 5 tags',
        'error'
      );
      return;
    }

    const tagRemoved = newTags.length < tags.length && removedTags.length === 1;
    if (tagRemoved) {
      removedTags.forEach(tag => {
        this.props.signals.workspace.tagRemoved({ tag });
      });
    } else {
      this.props.signals.workspace.tagAdded();
    }
  };

  updateFrozenState = () => {
    const frozen = !this.props.store.editor.currentSandbox.isFrozen;
    this.props.signals.editor.frozenUpdated({
      frozen,
    });
  };

  updateSandboxInfo = () => {
    this.props.signals.workspace.sandboxInfoUpdated();
    this.setState({
      editingTitle: false,
      editingDescription: false,
      editingAlias: false,
    });
  };

  renderInput = props => {
    const { onChange, value, addTag, ...other } = props;

    if (this.props.store.editor.currentSandbox.tags.length === 5) {
      return null;
    }

    return <input type="text" onChange={onChange} value={value} {...other} />;
  };

  render() {
    const { store, signals, editable } = this.props;
    const sandbox = store.editor.currentSandbox;
    const workspace = store.workspace;

    const template = getTemplateDefinition(sandbox.template);
    return (
      <div style={{ marginBottom: '1rem' }}>
        <Item style={{ marginTop: '.5rem' }}>
          {this.state.editingTitle ? (
            <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
              <input
                value={workspace.project.title}
                onChange={event => {
                  signals.workspace.valueChanged({
                    field: 'title',
                    value: event.target.value,
                  });
                }}
                type="text"
                onBlur={this.updateSandboxInfo}
                onKeyUp={event => {
                  if (event.keyCode === 13) {
                    this.updateSandboxInfo();
                  }
                }}
                ref={el => {
                  if (el) {
                    el.focus();
                  }
                }}
                placeholder="Title"
              />
            </WorkspaceInputContainer>
          ) : (
            <Title>
              {workspace.project.title || getSandboxName(sandbox)}
              {editable && <EditPen onClick={this.setTitleEditing} />}
            </Title>
          )}
          {this.state.editingDescription ? (
            <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
              <textarea
                value={workspace.project.description}
                onChange={event => {
                  signals.workspace.valueChanged({
                    field: 'description',
                    value: event.target.value,
                  });
                }}
                type="text"
                onBlur={this.updateSandboxInfo}
                onKeyDown={event => {
                  if (event.keyCode === 13) {
                    if (!event.shiftKey) {
                      event.preventDefault();
                      event.stopPropagation();
                      this.updateSandboxInfo();
                    }
                  }
                }}
                ref={el => {
                  if (el) {
                    el.focus();
                  }
                }}
                rows="2"
                placeholder="Description"
              />
            </WorkspaceInputContainer>
          ) : (
            <Description
              style={{
                fontStyle: sandbox.description ? 'normal' : 'italic',
              }}
            >
              {sandbox.description ||
                (editable ? 'No description, create one!' : '')}
              {editable && <EditPen onClick={this.setDescriptionEditing} />}
            </Description>
          )}
          {/* Disable until we also moved SSE over */}
          {store.isPatron && false ? (
            <>
              {this.state.editingAlias ? (
                <WorkspaceInputContainer>
                  <input
                    value={workspace.project.alias}
                    onChange={event => {
                      signals.workspace.valueChanged({
                        field: 'alias',
                        value: event.target.value,
                      });
                    }}
                    type="text"
                    onBlur={this.updateSandboxInfo}
                    onKeyUp={event => {
                      if (event.keyCode === 13) {
                        this.updateSandboxInfo();
                      }
                    }}
                    ref={el => {
                      if (el) {
                        el.focus();
                      }
                    }}
                    placeholder="Alias"
                  />
                </WorkspaceInputContainer>
              ) : (
                <Alias>
                  {workspace.project.alias || sandbox.alias}
                  {editable && <EditPen onClick={this.setAliasEditing} />}
                </Alias>
              )}
            </>
          ) : null}
        </Item>

        {!sandbox.team &&
          !!sandbox.author && (
            <Item>
              <UserLink
                title={sandbox.author.username}
                to={profileUrl(sandbox.author.username)}
              >
                <UserWithAvatar
                  username={sandbox.author.username}
                  avatarUrl={sandbox.author.avatarUrl}
                  subscriptionSince={sandbox.author.subscriptionSince}
                />
              </UserLink>
            </Item>
          )}

        {!!sandbox.team && (
          <Tooltip content="This sandbox is owned by this team">
            <Item style={{ color: 'white', display: 'flex' }}>
              <TeamIcon style={{ fontSize: '1.125em', marginRight: '.5rem' }} />
              <div>{sandbox.team.name}</div>
            </Item>
          </Tooltip>
        )}
        {!!sandbox.git && (
          <Item>
            <GithubBadge
              url={githubRepoUrl(sandbox.git)}
              username={sandbox.git.username}
              repo={sandbox.git.repo}
              branch={sandbox.git.branch}
            />
          </Item>
        )}
        <StatsContainer>
          <Stats sandbox={sandbox} />
        </StatsContainer>
        <Item>
          {editable ? (
            <EditableTags
              template={template}
              value={sandbox.tags.toJS()}
              onChange={this.changeTags}
              onChangeInput={value => {
                signals.workspace.tagChanged({
                  tagName: value,
                });
              }}
              maxTags={5}
              inputValue={store.workspace.tags.tagName}
              renderInput={this.renderInput}
              onlyUnique
            />
          ) : (
            <Tags style={{ fontSize: 13 }} tags={sandbox.tags} />
          )}
        </Item>

        {sandbox.forkedFromSandbox && (
          <Item flex>
            <PropertyName>Forked From</PropertyName>
            <PropertyValue>
              <Link to={sandboxUrl(sandbox.forkedFromSandbox)}>
                {sandbox.forkedFromSandbox.title ||
                  sandbox.forkedFromSandbox.id}
              </Link>
            </PropertyValue>
          </Item>
        )}
        <Item flex>
          <PropertyName>Privacy</PropertyName>
          <PropertyValue>
            <PrivacyContainer>
              <PrivacyStatus privacy={sandbox.privacy} />
            </PrivacyContainer>
          </PropertyValue>
        </Item>
        <Item flex>
          <PropertyName>Template</PropertyName>
          <PropertyValue>
            <a
              href={template.url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: template.color() }}
            >
              {sandbox.template}
            </a>
          </PropertyValue>
        </Item>
        {sandbox.owned ? (
          <>
            <Item style={{ marginTop: 5 }} flex>
              <PropertyName>
                Frozen
                <Tooltip content="When true this sandbox will fork on edit">
                  <Icon />
                </Tooltip>
              </PropertyName>
              <PropertyValue>
                <FreezeContainer>
                  <Switch
                    small
                    right={sandbox.isFrozen}
                    onClick={this.updateFrozenState}
                    offMode
                    secondary
                  />
                </FreezeContainer>
              </PropertyValue>
            </Item>
            <Item style={{ marginTop: 5, alignItems: 'center' }} flex>
              <PropertyName>
                Starter
                <Tooltip content="Set a template as a starter to get started with it more easily">
                  <Icon />
                </Tooltip>
              </PropertyName>
              <PropertyValue>
                <Button
                  small
                  secondary
                  css={`
                  font-size: 10px;
                  line-height: 1;
                  `}
                  onClick={() => {
                    signals.modalOpened({ modal: 'starter' });
                  }}
                >
                  Make Stater
                </Button>
              </PropertyValue>
            </Item>
          </>
        ) : null}
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(Project));
