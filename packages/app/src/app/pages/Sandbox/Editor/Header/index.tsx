// @ts-ignore
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import { Button } from '@codesandbox/common/lib/components/Button';
import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  dashboardUrl,
  patronUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { LikeHeart } from 'app/pages/common/LikeHeart';
import { SignInButton } from 'app/pages/common/SignInButton';
import { UserMenu } from 'app/pages/common/UserMenu';
import { saveAllModules } from 'app/store/modules/editor/utils';
import { json } from 'overmind';
import * as React from 'react';
import PlusIcon from 'react-icons/lib/go/plus';
import Fork from 'react-icons/lib/go/repo-forked';
import SaveIcon from 'react-icons/lib/md/save';
import SettingsIcon from 'react-icons/lib/md/settings';
import ShareIcon from 'react-icons/lib/md/share';
import {useOvermind} from "app/overmind";
import PatronBadge from '-!svg-react-loader!@codesandbox/common/lib/utils/badges/svg/patron-4.svg';

import { Action } from './Buttons/Action';
import { CollectionInfo } from './CollectionInfo';
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

interface IButtonProps {
  style: React.CSSProperties;
  secondary?: boolean;
};

interface ILikeButtonProps extends IButtonProps{
  likeCount: number;
}
interface IForkButtonProps extends IButtonProps {
  isForking: boolean;
};

const LikeButton : React.FC<ILikeButtonProps> = ({ style, likeCount }) => {
  const {
    state : {
      editor
    }
  } = useOvermind();
  return (
    <LikeHeart
      colorless
      style={style}
      text={likeCount.toString()}
      sandbox={editor.currentSandbox}
      disableTooltip
      highlightHover
    />
  )
}
const ForkButton : React.FC<IForkButtonProps> = ({ secondary, style, isForking } ) => {
  const {
    actions: {
      editor
    }
  } = useOvermind();
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
    )
}

const PickButton : React.FC<IButtonProps> = ({ style, secondary }) => {
  const {
    state: {
      editor
    },
    actions: {
      explore
    }
  } = useOvermind();
  const { id, title, description } = editor.currentSandbox;
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
}
const ShareButton : React.FC<IButtonProps> = ({ secondary, style}) => {
  const {
    actions:{
      modalOpened
    }
  } = useOvermind();
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
    )
}

interface IProps {
  zenMode: boolean;
}

const HeaderComponent : React.FC<IProps> = ({ zenMode }) => {
  const {
    state: {
      editor,
      preferences,
      hasLogIn,
      isLoggedIn,
      updateStatus,
      user,
      isPatron
    },
    actions: {
      modalOpened
    }
  } = useOvermind();
  const sandbox = editor.currentSandbox;
  const vscode = preferences.settings.experimentVSCode;

  return (
    <Container zenMode={zenMode}>
      <Left>
        {hasLogIn ? (
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
                  editor.isAllModulesSynced
                    ? null
                    : () => saveAllModules()
                }
                placeholder={
                  editor.isAllModulesSynced
                    ? 'All modules are saved'
                    : false
                }
                blink={editor.changedModuleShortids.length > 2}
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
            isLoggedIn={isLoggedIn}
            // Passing a clone of observable requires it to be called in render of observer
            sandbox={json(sandbox)}
          />
        </Centered>
      )}

      <Right>
        {updateStatus === 'available' && (
          <Action
            onClick={() => document.location.reload()}
            Icon={UpdateFound}
            tooltip="Update Available! Click to Refresh."
          />
        )}

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

        {!isLoggedIn && (
          <Action
            onClick={() =>
              modalOpened({
                modal: 'preferences',
              })
            }
            tooltip="Preferences"
            Icon={SettingsIcon}
          />
        )}

        <Action
          onClick={() =>
            modalOpened({
              modal: 'newSandbox',
            })
          }
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />

        {isLoggedIn && (
          <LikeButton
            style={{ fontSize: '.75rem', margin: '0 0.5rem' }}
            secondary={!sandbox.owned}
            likeCount={editor.currentSandbox.likeCount}
          />
        )}

        {user && user.curatorAt && (
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
          isForking={editor.isForkingSandbox}
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
          {isLoggedIn ? (
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

export default HeaderComponent
