import { Button } from '@codesandbox/common/lib/components/Button';
import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
// @ts-ignore
import PatronBadge from '-!svg-react-loader!@codesandbox/common/lib/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import {
  dashboardUrl,
  patronUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import PlusIcon from 'react-icons/lib/go/plus';
import Fork from 'react-icons/lib/go/repo-forked';
import SaveIcon from 'react-icons/lib/md/save';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';

import LikeHeart from 'app/pages/common/LikeHeart';
import SignInButton from 'app/pages/common/SignInButton';
import UserMenu from 'app/pages/common/UserMenu';
import { useStore, useSignals } from 'app/store';
import { saveAllModules } from 'app/store/modules/editor/utils';

import { Action } from './Buttons/Action';
import CollectionInfo from './CollectionInfo';
import {
  Centered,
  Container,
  DashboardIcon,
  DashboardLink,
  Left,
  Right,
} from './elements';
import { Logo } from './Logo';
import { MenuBar } from './MenuBar';
import UpdateFound from './UpdateFound';

type ButtonProps = {
  style: React.CSSProperties;
  secondary?: boolean;
};

type ForkButtonProps = ButtonProps & {
  isForking: boolean;
};

const LikeButton = ({
  style,
  likeCount,
}: ButtonProps & { likeCount: string }) => {
  const { editor } = useStore();

  return (
    <LikeHeart
      colorless
      style={style}
      text={likeCount}
      sandbox={editor.currentSandbox}
      disableTooltip
      highlightHover
    />
  );
};

const ForkButton = ({ secondary, isForking, style }: ForkButtonProps) => {
  const { editor } = useSignals();

  return (
    <ProgressButton
      onClick={editor.forkSandboxClicked}
      style={style}
      secondary={secondary}
      loading={isForking}
      small
    >
      <>
        <Fork style={{ marginRight: '.5rem' }} />
        {isForking ? 'Forking...' : 'Fork'}
      </>
    </ProgressButton>
  );
};

const PickButton = ({ secondary, style }: ButtonProps) => {
  const { editor } = useStore();
  const { id, title, description } = editor.currentSandbox;
  const { explore } = useSignals();

  return (
    <Button
      onClick={() =>
        explore.pickSandboxModal({
          details: {
            id,
            title,
            description,
          },
        })
      }
      style={style}
      secondary={secondary}
      small
    >
      Pick
    </Button>
  );
};

const ShareButton = ({ secondary, style }: ButtonProps) => {
  const { modalOpened } = useSignals();

  return (
    <Button
      onClick={() => modalOpened({ modal: 'share' })}
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
};

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
          <MenuBar />
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
          <CollectionInfo
            isLoggedIn={store.isLoggedIn}
            // Passing a clone of observable requires it to be called in render of observer
            sandbox={toJS(sandbox)}
          />
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
            secondary={!sandbox.owned}
            likeCount={store.editor.currentSandbox.likeCount}
          />
        )}

        {store.user && store.user.curatorAt && (
          <PickButton
            style={{ fontSize: '.75rem', marginLeft: '0.5rem' }}
            secondary={sandbox.owned}
          />
        )}

        <ShareButton
          style={{ fontSize: '.75rem', margin: '0 1rem' }}
          secondary={!sandbox.owned}
        />

        <ForkButton
          secondary={sandbox.owned}
          isForking={store.editor.isForkingSandbox}
          style={{ fontSize: '.75rem' }}
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
              <UserMenu />
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
