import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Fork from 'react-icons/lib/go/repo-forked';
import PlusIcon from 'react-icons/lib/go/plus';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import SaveIcon from 'react-icons/lib/md/save';
import { Button } from 'common/lib/components/Button';
import SignInButton from 'app/pages/common/SignInButton';

import { saveAllModules } from 'app/store/modules/editor/utils';

import { patronUrl, dashboardUrl } from 'common/lib/utils/url-generator';

// @ts-ignore
import PatronBadge from '-!svg-react-loader!common/lib/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'common/lib/components/spacing/Margin';

import LikeHeart from 'app/pages/common/LikeHeart';
import UserMenu from 'app/pages/common/UserMenu';

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

type ButtonProps = {
  store: any;
  signals: any;
  style: React.CSSProperties;
  secondary?: boolean;
};

const LikeButton = ({
  store,
  signals,
  style,
  likeCount,
}: ButtonProps & { likeCount: string }) => (
  <LikeHeart
    colorless
    style={style}
    text={likeCount}
    sandbox={store.editor.currentSandbox}
    store={store}
    signals={signals}
    disableTooltip
    highlightHover
  />
);

const ForkButton = ({ signals, secondary, style }: ButtonProps) => (
  <Button
    onClick={() => {
      signals.editor.forkSandboxClicked();
    }}
    style={style}
    secondary={secondary}
    small
  >
    <>
      <Fork style={{ marginRight: '.5rem' }} />
      Fork
    </>
  </Button>
);

const ShareButton = ({ signals, secondary, style }: ButtonProps) => (
  <Button
    onClick={() => {
      signals.modalOpened({ modal: 'share' });
    }}
    secondary={secondary}
    style={style}
    small
  >
    <>
      <ShareIcon style={{ marginRight: '.5rem' }} />
      Share
    </>
  </Button>
);

interface Props {
  store: any;
  signals: any;
  zenMode: boolean;
}

const Header = ({ store, signals, zenMode }: Props) => {
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
          <Logo />
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
        <Centered style={{ margin: '0 3rem' }}>
          <CollectionInfo isLoggedIn={store.isLoggedIn} sandbox={sandbox} />
        </Centered>
      )}

      <Right>
        {store.updateStatus === 'available' && (
          <Action
            onClick={() => document.location.reload()}
            Icon={UpdateFound}
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

        {store.isLoggedIn && (
          <LikeButton
            style={{ fontSize: '.75rem', margin: '0 0.5rem' }}
            signals={signals}
            secondary={!sandbox.owned}
            store={store}
            likeCount={store.editor.currentSandbox.likeCount}
          />
        )}
        <ShareButton
          style={{ fontSize: '.75rem', margin: '0 1rem' }}
          signals={signals}
          secondary={!sandbox.owned}
          store={store}
        />
        <ForkButton
          secondary={sandbox.owned}
          style={{ fontSize: '.75rem' }}
          signals={signals}
          store={store}
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
              <UserMenu store={store} signals={signals} />
            </div>
          ) : (
            <SignInButton style={{ fontSize: '.75rem' }} />
          )}
        </Margin>
      </Right>
    </Container>
  );
};

export default inject('signals', 'store')(observer(Header));
