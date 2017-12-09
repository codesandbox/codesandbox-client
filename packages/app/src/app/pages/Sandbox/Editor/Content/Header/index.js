// @flow
import * as React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';
import ChevronLeft from 'react-icons/lib/md/chevron-left';
import NowIcon from 'app/components/NowLogo';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import SearchIcon from 'react-icons/lib/go/search';
import FeedbackIcon from 'react-icons/lib/go/comment-discussion';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import { Tooltip } from 'react-tippy';

import type { CurrentUser } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import userActionCreators from 'app/store/user/actions';
import modalActionCreators from 'app/store/modal/actions';
import { searchUrl, patronUrl } from 'common/utils/url-generator';
import ModeIcons from 'app/components/sandbox/ModeIcons';

// $FlowIssue
import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/components/spacing/Margin';
import HeaderSearchBar from 'app/components/HeaderSearchBar';
import UserMenu from 'app/containers/UserMenu';
import NewSandbox from 'app/containers/modals/NewSandbox';
import ShareModal from 'app/containers/modals/ShareModal';

import Deployment from 'app/containers/Deployment';

import Action from './Action';

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
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
  align-items: center;
  height: 100%;
`;

const Left = styled.div`
  display: flex;
  height: 100%;
`;

const Chevron = styled.div`
  svg {
    transition: 0.3s ease all;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    z-index: 20;

    cursor: pointer;
    &:hover {
      transform: rotateZ(
        ${props => (props.workspaceHidden ? '135deg' : '45deg')}
      );
      color: white;
    }

    transform: rotateZ(${props => (props.workspaceHidden ? '180deg' : '0')});
  }
`;

type Props = {
  toggleWorkspace: () => void,
  workspaceHidden: boolean,
  modules: Array<string>,
  directories: Array<string>,
  sandboxId: string,
  owned: string,
  showEditor: boolean,
  showPreview: boolean,
  sandboxLiked: boolean,
  sandboxLikeCount: number,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
  modalActions: typeof modalActionCreators,
  user: CurrentUser,
  canSave: boolean,
};

const CHECKED_FIELDS = [
  'workspaceHidden',
  'sandboxId',
  'owned',
  'showEditor',
  'showPreview',
  'sandboxLiked',
  'sandboxLikeCount',
  'user',
  'canSave',
  'modules',
  'directories',
];

export default class Header extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return CHECKED_FIELDS.some(field => nextProps[field] !== this.props[field]);
  }

  massUpdateModules = () => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.massUpdateModules(sandboxId);
  };

  deploySandbox = () => {
    const { sandboxId } = this.props;

    this.props.modalActions.openModal({
      width: 600,
      Body: <Deployment id={sandboxId} />,
    });
  };

  zipSandbox = () => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.createZip(sandboxId);
  };

  forkSandbox = () => {
    const { owned, sandboxId, sandboxActions } = this.props;

    const shouldFork = owned
      ? confirm('Do you want to fork your own sandbox?') // eslint-disable-line no-alert
      : true;
    if (shouldFork) {
      sandboxActions.forkSandbox(sandboxId);
    }
  };

  openShareView = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: (
        <ShareModal
          modules={this.props.modules}
          directories={this.props.directories}
          id={this.props.sandboxId}
        />
      ),
    });
  };

  setEditorView = () => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandboxId, true, false);
  };

  setMixedView = () => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandboxId, true, true);
  };

  setPreviewView = () => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandboxId, false, true);
  };

  toggleLike = () => {
    const { sandboxId, sandboxLiked, sandboxActions } = this.props;

    if (sandboxLiked) {
      sandboxActions.unLikeSandbox(sandboxId);
    } else {
      sandboxActions.likeSandbox(sandboxId);
    }
  };

  openPreferences = () => {
    this.props.modalActions.openPreferences();
  };

  openNewSandbox = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: <NewSandbox />,
    });
  };

  render() {
    const {
      showEditor,
      showPreview,
      sandboxLiked,
      sandboxLikeCount,
      owned,
      userActions,
      user,
      toggleWorkspace,
      workspaceHidden,
      canSave,
    } = this.props;

    return (
      <Container>
        <ModeIcons
          small
          dropdown
          showEditor={showEditor}
          showPreview={showPreview}
          setMixedView={this.setMixedView}
          setEditorView={this.setEditorView}
          setPreviewView={this.setPreviewView}
        />
        <Left>
          <Tooltip
            title={workspaceHidden ? 'Open sidebar' : 'Collapse sidebar'}
          >
            <Chevron
              workspaceHidden={workspaceHidden}
              onClick={toggleWorkspace}
            >
              <ChevronLeft />
            </Chevron>
          </Tooltip>
          {user.jwt &&
            (sandboxLiked ? (
              <Action
                tooltip="Undo like"
                title={sandboxLikeCount}
                Icon={FullHeartIcon}
                onClick={this.toggleLike}
              />
            ) : (
              <Action
                tooltip="Like"
                title={sandboxLikeCount}
                Icon={HeartIcon}
                onClick={this.toggleLike}
              />
            ))}
          <Action
            onClick={this.forkSandbox}
            tooltip="Fork sandbox"
            title="Fork"
            Icon={Fork}
          />
          <Action
            onClick={canSave ? this.massUpdateModules : null}
            placeholder={canSave ? false : 'All modules are saved'}
            tooltip="Save sandbox"
            title="Save"
            Icon={Save}
          />
          <Action
            tooltip="Download sandbox"
            title="Download"
            Icon={Download}
            onClick={this.zipSandbox}
          />
          {user.jwt &&
            owned && (
              <Action
                tooltip="Deploy sandbox"
                title="Deploy"
                Icon={NowIcon}
                onClick={this.deploySandbox}
              />
            )}
          <Action
            tooltip="Share sandbox"
            title="Share"
            Icon={ShareIcon}
            onClick={this.openShareView}
          />
        </Left>

        <Right>
          <Media query="(max-width: 1560px)">
            {matches =>
              matches ? (
                <Action
                  href={searchUrl()}
                  Icon={SearchIcon}
                  tooltip="Search"
                  title="Search"
                />
              ) : (
                <div style={{ marginRight: '0.5rem', fontSize: '.875rem' }}>
                  <HeaderSearchBar />
                </div>
              )
            }
          </Media>

          {!user ||
            (!user.subscription && (
              <Action
                href={patronUrl()}
                tooltip="Support CodeSandbox"
                Icon={PatronBadge}
                iconProps={{
                  width: 16,
                  height: 32,
                  transform: 'scale(1.5, 1.5)',
                }}
              />
            ))}
          <Action
            href="https://twitter.com/CompuIves"
            a
            tooltip="Contact"
            Icon={TwitterIcon}
          />
          <Action
            href="https://discord.gg/FGeubVt"
            a
            tooltip="Chat on Discord"
            Icon={FeedbackIcon}
          />
          <Action
            onClick={this.openNewSandbox}
            tooltip="New Sandbox"
            Icon={PlusIcon}
          />
          <Action
            onClick={this.openPreferences}
            tooltip="Preferences"
            Icon={SettingsIcon}
          />
          <Margin
            style={{
              zIndex: 20,
              height: '100%',
            }}
            left={1}
          >
            {user.jwt ? (
              <div style={{ fontSize: '.875rem', margin: '6px 0.5rem' }}>
                <UserMenu small />
              </div>
            ) : (
              <Action
                onClick={userActions.signIn}
                title="Sign in with Github"
                Icon={GithubIcon}
                highlight
                unresponsive
              />
            )}
          </Margin>
        </Right>
      </Container>
    );
  }
}
