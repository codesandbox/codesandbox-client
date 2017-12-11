// @flow
import * as React from 'react';
import styled from 'styled-components';
import Media from 'react-media';
import { inject } from 'mobx-react';

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

function Header({ store, signals }) {
  const preferences = store.editor.preferences;
  const workspace = store.editor.workspace;
  const sandbox = store.editor.currentSandbox;

  return (
    <Container>
      <ModeIcons
        small
        dropdown
        showEditor={preferences.showEditor}
        showPreview={preferences.showPreview}
        setMixedView={() =>
          signals.editor.preferences.viewModeChanged({
            showEditor: true,
            showPreview: true,
          })
        }
        setEditorView={() =>
          signals.editor.preferences.viewModeChanged({
            showEditor: true,
            showPreview: false,
          })
        }
        setPreviewView={() =>
          signals.editor.preferences.viewModeChanged({
            showEditor: false,
            showPreview: true,
          })
        }
      />
      <Left>
        <Tooltip
          title={
            workspace.isWorkspaceHidden ? 'Open sidebar' : 'Collapse sidebar'
          }
        >
          <Chevron
            workspaceHidden={workspace.isWorkspaceHidden}
            onClick={isOpen =>
              signals.editor.workspace.workspaceToggled({ isOpen })
            }
          >
            <ChevronLeft />
          </Chevron>
        </Tooltip>
        {store.isLoggedIn &&
          (sandbox.userLiked ? (
            <Action
              tooltip="Undo like"
              title={sandbox.likeCount}
              Icon={FullHeartIcon}
              onClick={() => signals.editor.likeSandboxToggled()}
            />
          ) : (
            <Action
              tooltip="Like"
              title={sandbox.likeCount}
              Icon={HeartIcon}
              onClick={() => signals.editor.likeSandboxToggled()}
            />
          ))}
        <Action
          onClick={() => signals.editor.forkSandboxClicked()}
          tooltip="Fork sandbox"
          title="Fork"
          Icon={Fork}
        />
        <Action
          onClick={
            store.editor.isAllModulesSynced
              ? null
              : () => signals.editor.saveClicked()
          }
          placeholder={
            store.editor.isAllModulesSynced ? 'All modules are saved' : false
          }
          tooltip="Save sandbox"
          title="Save"
          Icon={Save}
        />
        <Action
          tooltip="Download sandbox"
          title="Download"
          Icon={Download}
          onClick={() => signals.editor.createZipClicked()}
        />
        {store.isLoggedIn &&
          sandbox.owned && (
            <Action
              tooltip="Deploy sandbox"
              title="Deploy"
              Icon={NowIcon}
              onClick={() => this.props.signals.modalOpened('deployment')}
            />
          )}
        <Action
          tooltip="Share sandbox"
          title="Share"
          Icon={ShareIcon}
          onClick={() => this.props.signals.modalOpened('shareModal')}
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

        {!store.isLoggedIn ||
          (!store.isPatron && (
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
          onClick={() => signals.modalOpened('newSandbox')}
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />
        <Action
          onClick={() => signals.modalOpened('preferences')}
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
          {store.isLoggedIn ? (
            <div style={{ fontSize: '.875rem', margin: '6px 0.5rem' }}>
              <UserMenu small />
            </div>
          ) : (
            <Action
              onClick={() => signals.signInClicked()}
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
export default inject('signals', 'store')(Header);

/*
class Header extends React.Component {


  deploySandbox = () => {
    const { sandboxId } = this.props;

    ;
    this.props.modalActions.openModal({
      width: 600,
      Body: <Deployment id={sandboxId} />,
    });
  };

  openShareView = () => {
    ;
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


  openPreferences = () => {
    ;
    this.props.modalActions.openModal({
      width: 900,
      Body: <Preferences />,
    });
  };

  openNewSandbox = () => {
    ;
    this.props.modalActions.openModal({
      width: 900,
      Body: <NewSandbox />,
    });
  };

  render() {

  }
}
*/
