import * as React from 'react';
import { connect } from 'app/fluent';

import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/md/file-download';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';

import { patronUrl } from 'common/utils/url-generator';

// @ts-ignore
import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg';
import Margin from 'common/components/spacing/Margin';
import HeaderSearchBar from 'app/components/HeaderSearchBar';
import UserMenu from 'app/pages/common/UserMenu';

import Logo from './Logo';
import Action from './Action';

import { Container, Right, Left } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    sandbox: state.editor.currentSandbox,
    isLoggedIn: state.isLoggedIn,
    isPatron: state.isPatron,
    isAllModulesSynced: state.editor.isAllModulesSynced,
    signals: {
      likeSandboxToggled: signals.editor.likeSandboxToggled,
      forkSandboxClicked: signals.editor.forkSandboxClicked,
      modalOpened: signals.modalOpened,
      saveClicked: signals.editor.saveClicked,
      createZipClicked: signals.editor.createZipClicked,
      signInClicked: signals.signInClicked
    }
  }))
  .to(
    function Header({ sandbox, isLoggedIn, isPatron, isAllModulesSynced, signals }) {
      return (
        <Container>
          <Left>
            <Logo title={sandbox.title} />

            {isLoggedIn &&
              (sandbox.userLiked ? (
                <Action
                  tooltip="Undo like"
                  title="Like"
                  Icon={FullHeartIcon}
                  onClick={() =>
                    signals.likeSandboxToggled({ id: sandbox.id })
                  }
                />
              ) : (
                <Action
                  title="Like"
                  Icon={HeartIcon}
                  onClick={() =>
                    signals.likeSandboxToggled({ id: sandbox.id })
                  }
                />
              ))}
            <Action
              onClick={() => signals.forkSandboxClicked()}
              title="Fork"
              Icon={Fork}
            />

            <Action
              title="Share"
              Icon={ShareIcon}
              onClick={() =>
                signals.modalOpened({
                  modal: 'share',
                })
              }
            />

            {(sandbox.owned || !isAllModulesSynced) && (
              <Action
                onClick={
                  isAllModulesSynced
                    ? null
                    : () => signals.saveClicked()
                }
                placeholder={
                  isAllModulesSynced ? 'All modules are saved' : null
                }
                tooltip="Save"
                Icon={Save}
              />
            )}

            <Action
              tooltip="Download"
              Icon={Download}
              onClick={() => signals.createZipClicked()}
            />
          </Left>

          <Right>
            <div style={{ marginRight: '0.5rem', fontSize: '.875rem' }}>
              <HeaderSearchBar />
            </div>

            {!isLoggedIn ||
              (!isPatron && (
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
              onClick={() =>
                signals.modalOpened({
                  modal: 'newSandbox',
                })
              }
              tooltip="Create New Sandbox"
              Icon={PlusIcon}
            />
            {!isLoggedIn && (
              <Action
                onClick={() =>
                  signals.modalOpened({
                    modal: 'preferences',
                  })
                }
                tooltip="Preferences"
                Icon={SettingsIcon}
              />
            )}
            <Margin
              style={{
                zIndex: 20,
                height: '100%',
              }}
              left={1}
            >
              {isLoggedIn ? (
                <div style={{ fontSize: '.875rem', margin: '6px 0.5rem' }}>
                  <UserMenu small />
                </div>
              ) : (
                <Action
                  onClick={() => signals.signInClicked()}
                  title="Sign in with Github"
                  Icon={GithubIcon}
                />
              )}
            </Margin>
          </Right>
        </Container>
      );
    }
  )
