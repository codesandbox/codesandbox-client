import * as React from 'react';
import Media from 'react-media';
import { inject, observer } from 'mobx-react';

import Modal from 'app/components/Modal';
import Preferences from 'app/pages/common/Preferences';
import NewSandbox from 'app/components/NewSandbox';
import ShareModal from 'app/pages/Sandbox/ShareModal';
import DeploymentModal from 'app/pages/Sandbox/DeploymentModal';
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

import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/components/spacing/Margin';
import HeaderSearchBar from 'app/components/HeaderSearchBar';
import UserMenu from 'app/pages/common/UserMenu';

import Logo from './Logo';
import Action from './Action';

import { Container, Right, Left, Chevron } from './elements';

// {store.isLoggedIn &&
//   sandbox.owned && (
//     <Action
//       tooltip="Deploy sandbox"
//       title="Deploy"
//       Icon={NowIcon}
//       onClick={() => signals.editor.deploymentModalOpened()}
//     >
//       <Modal
//         isOpen={store.editor.showDeploymentModal}
//         width={750}
//         onClose={() => signals.editor.deploymentModalClosed()}
//       >
//         <DeploymentModal />
//       </Modal>
//     </Action>
//   )}

function Header({ store, signals }) {
  const preferences = store.preferences;
  const workspace = store.workspace;
  const sandbox = store.editor.currentSandbox;

  return (
    <Container>
      <Left>
        <Logo />

        <Tooltip
          title={
            workspace.isWorkspaceHidden ? 'Open sidebar' : 'Collapse sidebar'
          }
        />
        {store.isLoggedIn &&
          (sandbox.userLiked ? (
            <Action
              tooltip="Undo like"
              title="Like"
              Icon={FullHeartIcon}
              onClick={() =>
                signals.editor.likeSandboxToggled({ id: sandbox.id })
              }
            />
          ) : (
            <Action
              tooltip="Like"
              title="Like"
              Icon={HeartIcon}
              onClick={() =>
                signals.editor.likeSandboxToggled({ id: sandbox.id })
              }
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
          tooltip="Share sandbox"
          title="Share"
          Icon={ShareIcon}
          onClick={() => signals.editor.shareModalOpened()}
        >
          <Modal
            isOpen={store.editor.showShareModal}
            width={900}
            onClose={() => signals.editor.shareModalClosed()}
          >
            <ShareModal />
          </Modal>
        </Action>
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
          onClick={() => signals.editor.newSandboxModalOpened()}
          tooltip="New Sandbox"
          Icon={PlusIcon}
        >
          <Modal
            isOpen={store.editor.showNewSandboxModal}
            width={900}
            onClose={() => signals.editor.newSandboxModalClosed()}
          >
            <NewSandbox />
          </Modal>
        </Action>
        {!store.isLoggedIn && (
          <Action
            onClick={() => signals.preferences.modalOpened()}
            tooltip="Preferences"
            Icon={SettingsIcon}
          >
            <Modal
              isOpen={store.preferences.showModal}
              width={900}
              onClose={() => signals.preferences.modalClosed()}
            >
              <Preferences />
            </Modal>
          </Action>
        )}
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

export default inject('signals', 'store')(observer(Header));
