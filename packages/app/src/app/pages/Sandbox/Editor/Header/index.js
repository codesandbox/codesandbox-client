import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Fork from 'react-icons/lib/go/repo-forked';
import PlusIcon from 'react-icons/lib/go/plus';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import SaveIcon from 'react-icons/lib/md/save';
import { Button } from 'app/components/Button';
import SignInButton from 'app/pages/common/SignInButton';

import { saveAllModules } from 'app/store/modules/editor/utils';

import { patronUrl, dashboardUrl } from 'common/lib/utils/url-generator';

import PatronBadge from '-!svg-react-loader!common/lib/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/lib/components/spacing/Margin';

import UserMenu from 'app/pages/common/UserMenu';
import theme from 'common/lib/theme';

import Logo from './Logo';
import Action from './Action';
import CollectionInfo from './CollectionInfo';

import {
  Container,
  Right,
  Left,
  Centered,
  DashboardIcon,
  DashboardLink,
} from './elements';

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
  const vscode = store.preferences.settings.experimentVSCode;

  return (
    <Container zenMode={zenMode}>
      <Left>
        {store.hasLogIn ? (
          <DashboardLink to={dashboardUrl()}>
            <DashboardIcon />
          </DashboardLink>
        ) : (
          <Logo marginRight={0} />
        )}

        {vscode ? (
          <MenuBarContainer />
        ) : (
          <>
            {
              <Action
                onClick={
                  store.editor.isAllModulesSynced
                    ? null
                    : () => saveAllModules(store, signals)
                }
                placeholder={
                  store.editor.isAllModulesSynced
                    ? 'All modules are saved'
                    : false
                }
                blink={store.editor.changedModuleShortids.length > 2}
                title="Save"
                Icon={SaveIcon}
              />
            }
          </>
        )}
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

        {!store.isLoggedIn && (
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

        <Action
          onClick={() =>
            signals.modalOpened({
              modal: 'newSandbox',
            })
          }
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />

        <ShareButton
          style={{ fontSize: '.75rem', margin: '0 1rem' }}
          signals={signals}
          secondary={!sandbox.owned}
        />
        <ForkButton
          secondary={sandbox.owned}
          style={{ fontSize: '.75rem' }}
          signals={signals}
        />

        <Margin
          style={{
            zIndex: 20,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
          left={1}
          right={1}
        >
          {store.isLoggedIn ? (
            <div
              style={{
                fontSize: '0.8rem',
                margin: '5px 0',
                marginRight: 0,
              }}
            >
              <UserMenu small />
            </div>
          ) : (
            <SignInButton style={{ fontSize: '.76rem' }} />
          )}
        </Margin>
      </Right>
    </Container>
  );
};

export default inject('signals', 'store')(observer(Header));
