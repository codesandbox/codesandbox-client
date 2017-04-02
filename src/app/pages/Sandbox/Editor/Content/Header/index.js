// @flow
import React from 'react';
import styled from 'styled-components';
import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import Import from 'react-icons/lib/go/package';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import type { User } from 'app/store/user/reducer';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import userActionCreators from 'app/store/user/actions';
import Tooltip from 'app/components/Tooltip';

import Action from './Action';
import UserView from './User';
import FeedbackView from './FeedbackView';
import { newSandboxUrl } from '../../../../../utils/url-generator';

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  background-color: ${props => props.theme.background2};
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  z-index: 40;
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

const Right = styled.div`
  display: flex;
  height: 100%;
`;

const Left = styled.div`
  display: flex;
  height: 100%;
`;

const Tooltips = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Icon = styled.div`
  display: inline-block;
  width: ${props => props.half ? 1.5 : 3}rem;
  border: 1px solid rgba(0,0,0,0.1);
`;

const ViewIcon = styled.div`
  display: flex;
  height: 1.5rem;
  transition: 0.3s ease all;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;

  &:after {
    transition: 0.3s ease all;
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0; top: 0;
    background-color: rgba(0,0,0,0.6);
    opacity: ${props => props.active ? 0 : 1};
    border-radius: 2px;
    overflow: hidden;
  }
  &:hover::after {
    opacity: 0;
  }
`;

const EditorIcon = styled(Icon)`
  background-color: ${props => props.theme.secondary};
`;

const PreviewIcon = styled(Icon)`
  background-color: ${props => props.theme.primary};
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
  user: User,
};

export default class Header extends React.PureComponent {
  props: Props;

  massUpdateModules = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.massUpdateModules(sandbox.id);
  };

  zipSandbox = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.createZip(sandbox.id);
  };

  forkSandbox = () => {
    const { sandbox, sandboxActions } = this.props;

    const shouldFork = sandbox.owned
      ? confirm('Do you want to fork your own sandbox?')
      : true;
    if (shouldFork) {
      sandboxActions.forkSandbox(sandbox.id);
    }
  };

  setEditorView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, false);
  };

  setMixedView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, true);
  };

  setPreviewView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, false, true);
  };

  render() {
    const { sandbox, userActions, user } = this.props;
    const canSave = sandbox.modules.some(m => m.isNotSynced);
    return (
      <Container>
        <Left>
          <Action onClick={this.forkSandbox} title="Fork" Icon={Fork} />
          <Action
            onClick={canSave && this.massUpdateModules}
            placeholder={canSave ? false : 'All modules are saved'}
            title="Save"
            Icon={Save}
          />
          <Action title="Download" Icon={Download} onClick={this.zipSandbox} />
          <Action
            title="Publish"
            Icon={Import}
            placeholder="Library publishing is coming soon!"
          />
        </Left>

        <Tooltips>
          <Tooltip message="Editor view">
            <ViewIcon
              onClick={this.setEditorView}
              active={sandbox.showEditor && !sandbox.showPreview}
            >
              <EditorIcon />
            </ViewIcon>
          </Tooltip>
          <Tooltip message="Split view">
            <ViewIcon
              onClick={this.setMixedView}
              active={sandbox.showEditor && sandbox.showPreview}
            >
              <EditorIcon half />
              <PreviewIcon half />
            </ViewIcon>
          </Tooltip>
          <Tooltip message="Preview view">
            <ViewIcon
              onClick={this.setPreviewView}
              active={!sandbox.showEditor && sandbox.showPreview}
            >
              <PreviewIcon />
            </ViewIcon>
          </Tooltip>
        </Tooltips>

        <Right>
          <FeedbackView sendMessage={userActions.sendFeedback} />
          <Action href={newSandboxUrl()} title="Create" Icon={PlusIcon} />
          {user.jwt
            ? <UserView
                signOut={userActions.signOut}
                sandbox={sandbox}
                loadUserSandboxes={userActions.loadUserSandboxes}
                user={user}
              />
            : <Action
                onClick={userActions.signIn}
                title="Sign in with Github"
                Icon={GithubIcon}
              />}
        </Right>
      </Container>
    );
  }
}
