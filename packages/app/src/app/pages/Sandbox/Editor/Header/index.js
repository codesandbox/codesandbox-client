import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Media from 'react-media';

import Save from 'react-icons/lib/md/save';
import SearchIcon from 'react-icons/lib/go/search';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/md/file-download';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';

import { patronUrl, dashboardUrl, searchUrl } from 'common/utils/url-generator';

import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/components/spacing/Margin';
import HeaderSearchBar from 'app/components/HeaderSearchBar';
import UserMenu from 'app/pages/common/UserMenu';
import theme from 'common/theme';
import { saveAllModules } from 'app/store/modules/editor/utils';

import Logo from './Logo';
import Action from './Action';
import CollectionInfo from './CollectionInfo';

import { Container, Right, Left, Centered } from './elements';

import UpdateFound from './UpdateFound';

const Header = ({ store, signals }) => {
  const sandbox = store.editor.currentSandbox;

  return (
    <Container>
      <Left>
        <Logo />

        <Action
          onClick={() => signals.editor.forkSandboxClicked()}
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

        {store.user && store.user.curatorAt ? (
          <Action
            title="Pick"
            Icon={() => (
              <span role="img" aria-label="star">
                ✨
              </span>
            )}
            onClick={() => {
              signals.explore.pickSandboxModal({
                details: {
                  id: sandbox.id,
                  title: sandbox.title,
                  description: sandbox.description,
                },
              });
            }}
          />
        ) : null}

        {(sandbox.owned || !store.editor.isAllModulesSynced) && (
          <Action
            onClick={
              store.editor.isAllModulesSynced
                ? null
                : () => saveAllModules(store, signals)
            }
            placeholder={
              store.editor.isAllModulesSynced ? 'All modules are saved' : false
            }
            blink={store.editor.changedModuleShortids.length > 2}
            title="Save"
            tooltip="Save Modified Files"
            Icon={Save}
          />
        )}

        <Action
          tooltip="Download"
          Icon={Download}
          onClick={() => signals.editor.createZipClicked()}
        />

        {store.isLoggedIn &&
          (sandbox.userLiked ? (
            <Action
              tooltip="Undo like"
              Icon={FullHeartIcon}
              onClick={() =>
                signals.editor.likeSandboxToggled({ id: sandbox.id })
              }
            />
          ) : (
            <Action
              tooltip="Like"
              Icon={HeartIcon}
              onClick={() =>
                signals.editor.likeSandboxToggled({ id: sandbox.id })
              }
            />
          ))}
      </Left>

      {sandbox.owned && (
        <Centered>
          <CollectionInfo isLoggedIn={store.isLoggedIn} sandbox={sandbox} />
        </Centered>
      )}

      <Right>
        <Media query="(max-width: 960px)">
          {matches =>
            matches ? (
              <Action
                tooltip="Search All Sandboxes"
                Icon={SearchIcon}
                href={searchUrl()}
              />
            ) : (
              <div style={{ marginRight: '0.5rem', fontSize: '.875rem' }}>
                <HeaderSearchBar />
              </div>
            )
          }
        </Media>

        {store.updateStatus === 'available' && (
          <Action
            onClick={() => document.location.reload()}
            Icon={UpdateFound}
            style={{
              color: theme.green(),
              fontSize: '1rem',
            }}
            tooltip="Update Available! Click to Refresh."
          />
        )}

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
          onClick={() =>
            signals.modalOpened({
              modal: 'preferences',
            })
          }
          tooltip="Preferences"
          Icon={SettingsIcon}
        />

        <Action
          onClick={() =>
            signals.modalOpened({
              modal: 'newSandbox',
            })
          }
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />

        {store.isLoggedIn && (
          <Action
            style={{ marginTop: 2 }}
            href={dashboardUrl()}
            tooltip="Dashboard"
            Icon={InfoIcon}
          />
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
              title="Sign in with GitHub"
              Icon={GithubIcon}
              highlight
              unresponsive
            />
          )}
        </Margin>
      </Right>
    </Container>
  );
};

export default inject('signals', 'store')(observer(Header));
