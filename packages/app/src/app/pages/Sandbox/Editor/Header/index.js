import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Media from 'react-media';

import Save from 'react-icons/lib/md/save';
import SearchIcon from 'react-icons/lib/go/search';
import Fork from 'react-icons/lib/go/repo-forked';
import FlameIcon from 'react-icons/lib/go/flame';
import Download from 'react-icons/lib/md/file-download';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import Button from 'app/components/Button';

import {
  patronUrl,
  dashboardUrl,
  searchUrl,
  exploreUrl,
} from 'common/lib/utils/url-generator';

import PatronBadge from '-!svg-react-loader!common/lib/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/lib/components/spacing/Margin';

import UserMenu from 'app/pages/common/UserMenu';
import theme from 'common/lib/theme';
import { saveAllModules } from 'app/store/modules/editor/utils';

import Logo from './Logo';
import Action from './Action';
import CollectionInfo from './CollectionInfo';

import { Container, Right, Left, Centered, DashboardIcon } from './elements';

import UpdateFound from './UpdateFound';
import { MenuBarContainer } from './MenuBar';

const ForkButton = ({ signals, secondary, style }) => (
  <Button
    onClick={() => {
      signals.editor.forkSandboxClicked();
    }}
    style={style}
    secondary={secondary}
    small
  >
    <Fork style={{ marginRight: '.5rem' }} />
    Fork
  </Button>
);

const ShareButton = ({ signals, secondary, style }) => (
  <Button
    onClick={() => {
      signals.modalOpened({ modal: 'share' });
    }}
    secondary={secondary}
    style={style}
    small
  >
    <ShareIcon style={{ marginRight: '.5rem' }} />
    Share
  </Button>
);

const Header = ({ store, signals, zenMode }) => {
  const sandbox = store.editor.currentSandbox;

  return (
    <Container zenMode={zenMode}>
      <Left>
        {store.hasLogIn ? <DashboardIcon /> : <Logo />}

        <MenuBarContainer />
      </Left>

      {sandbox.owned && (
        <Centered css={{ margin: '0 3rem' }}>
          <CollectionInfo isLoggedIn={store.isLoggedIn} sandbox={sandbox} />
        </Centered>
      )}

      <Right>
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
              modal: 'newSandbox',
            })
          }
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />

        {sandbox.owned ? (
          <>
            <ForkButton
              style={{ fontSize: '.75rem' }}
              signals={signals}
              secondary
            />
            <ShareButton
              style={{ fontSize: '.75rem', margin: '0 1rem' }}
              signals={signals}
            />
          </>
        ) : (
          <>
            <ShareButton
              style={{ fontSize: '.75rem' }}
              signals={signals}
              secondary
            />
            <ForkButton
              style={{ fontSize: '.75rem', margin: '0 1rem' }}
              signals={signals}
            />
          </>
        )}

        <Margin
          style={{
            zIndex: 20,
            height: '100%',
          }}
          left={1}
        >
          {store.isLoggedIn ? (
            <div
              style={{
                fontSize: '0.8rem',
                margin: '5px 0',
                marginRight: '1rem',
              }}
            >
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
