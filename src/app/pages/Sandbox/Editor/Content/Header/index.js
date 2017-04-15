// @flow
import React from 'react';
import styled from 'styled-components';
import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';

import type { Sandbox, CurrentUser } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import userActionCreators from 'app/store/user/actions';

import ModeIcons from 'app/components/sandbox/ModeIcons';

import Action from './Action';
import UserView from './User';
import FeedbackView from './FeedbackView';
import ShareView from './ShareView';
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

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
  user: CurrentUser,
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
          <ShareView sandbox={sandbox} />
        </Left>

        <ModeIcons
          showEditor={sandbox.showEditor}
          showPreview={sandbox.showPreview}
          setMixedView={this.setMixedView}
          setEditorView={this.setEditorView}
          setPreviewView={this.setPreviewView}
        />

        <Right>
          <FeedbackView sendMessage={userActions.sendFeedback} />
          <Action href={newSandboxUrl()} title="New" Icon={PlusIcon} />
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
                highlight
              />}
        </Right>
      </Container>
    );
  }
}
