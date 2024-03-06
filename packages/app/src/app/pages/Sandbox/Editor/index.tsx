import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import VERSION from '@codesandbox/common/lib/version';
import {
  ThemeProvider as ComponentsThemeProvider,
  Element,
  Stack,
} from '@codesandbox/components';
import { GenericCreate } from 'app/components/Create/GenericCreate';
import {
  RestrictedSandbox,
  PaymentPending,
} from 'app/components/StripeMessages';
import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import { useActions, useReaction, useEffects, useAppState } from 'app/overmind';
import { templateColor } from 'app/utils/template-color';
import React, { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import styled, { ThemeProvider } from 'styled-components';

import { SubscriptionStatus } from 'app/graphql/types';
import { UpgradeSSEToV2Stripe } from 'app/components/StripeMessages/UpgradeSSEToV2';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { CreateBox } from 'app/components/Create/CreateBox';
import { MainWorkspace as Content } from './Content';
import { Container } from './elements';
import ForkFrozenSandboxModal from './ForkFrozenSandboxModal';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { ContentSkeleton } from './Skeleton';
import getVSCodeTheme from './utils/get-vscode-theme';
import { Workspace } from './Workspace';
import { CommentsAPI } from './Workspace/screens/Comments/API';
import { FixedSignInBanner } from './FixedSignInBanner';

type EditorTypes = {
  showModalOnTop?: 'newSandbox' | 'newDevbox' | 'new';
};

const STATUS_BAR_SIZE = 22;

const StatusBar = styled.div`
  a {
    color: inherit;
  }
`;

export const Editor = ({ showModalOnTop }: EditorTypes) => {
  const state = useAppState();
  const actions = useActions();
  const effects = useEffects();
  const reaction = useReaction();
  const statusbarEl = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(
    !state.editor.hasLoadedInitialModule
  );
  const [localState, setLocalState] = useState({
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: null,
  });
  const { subscription } = useWorkspaceSubscription();

  useEffect(() => {
    let timeout;
    const dispose = reaction(
      reactionState => reactionState.editor.hasLoadedInitialModule,
      () => {
        timeout = setTimeout(() => setShowSkeleton(false), 500);
      }
    );
    return () => {
      dispose();
      clearTimeout(timeout);
    };
  }, [reaction]);

  useEffect(() => {
    async function loadTheme() {
      const vsCodeTheme = state.preferences.settings.customVSCodeTheme;

      try {
        const t = await getVSCodeTheme('', vsCodeTheme);
        setLocalState({ theme: t, customVSCodeTheme: vsCodeTheme });
      } catch (e) {
        console.error(e);
      }
    }
    if (
      localState.customVSCodeTheme !==
      state.preferences.settings.customVSCodeTheme
    ) {
      loadTheme();
    }
  }, [
    localState.customVSCodeTheme,
    state.preferences.settings.customVSCodeTheme,
  ]);

  useEffect(() => {
    statusbarEl.current.appendChild(effects.vscode.getStatusbarElement());
  }, [effects.vscode]);

  const sandbox = state.editor.currentSandbox;
  const sandboxFromActiveWorkspace = sandbox?.team?.id === state.activeTeam;
  const showRestrictedBanner =
    sandboxFromActiveWorkspace && sandbox?.restricted;

  const hideNavigation =
    state.preferences.settings.zenMode && state.workspace.workspaceHidden;
  const { statusBar } = state.editor;

  const templateDef = sandbox && getTemplateDefinition(sandbox.template);
  const showCloudSandboxConvert =
    !state.environment.isOnPrem && state.hasLogIn && sandbox?.isSse;

  const getTopOffset = () => {
    if (state.preferences.settings.zenMode) {
      return 0;
    }

    if (!state.hasLogIn && state.sandboxesLimits) {
      // Header + Signin banner + border
      return 5.5 * 16 + 2;
    }

    // Has MessageStripe
    if (
      subscription?.status === SubscriptionStatus.Unpaid ||
      showRestrictedBanner ||
      showCloudSandboxConvert
    ) {
      // Header height + MessageStripe
      return 3 * 16 + 44;
    }

    // Header height
    return 3 * 16;
  };

  const bottomOffset = STATUS_BAR_SIZE;

  return (
    <ThemeProvider
      theme={{
        templateColor: templateColor(sandbox, templateDef as any),
        templateBackgroundColor: templateDef && templateDef.backgroundColor,
        ...localState.theme,
      }}
    >
      <Container
        style={{ lineHeight: 'initial', backgroundColor: 'transparent' }}
        className="monaco-workbench"
      >
        {state.preferences.settings.zenMode ? null : (
          <ComponentsThemeProvider theme={localState.theme.vscodeTheme}>
            {!state.hasLogIn && <FixedSignInBanner />}

            {subscription?.status === SubscriptionStatus.Unpaid ||
              (subscription?.status === SubscriptionStatus.Incomplete && (
                <PaymentPending status={subscription?.status} />
              ))}

            {showRestrictedBanner ? <RestrictedSandbox /> : null}
            {showCloudSandboxConvert ? <UpgradeSSEToV2Stripe /> : null}
            <Header />
          </ComponentsThemeProvider>
        )}

        <Fullscreen style={{ width: 'initial' }}>
          {!hideNavigation && (
            <ComponentsThemeProvider theme={localState.theme.vscodeTheme}>
              <Navigation
                topOffset={getTopOffset()}
                bottomOffset={bottomOffset}
              />
            </ComponentsThemeProvider>
          )}

          <div
            key={getTopOffset()} // Force re-render when topOffset changes to avoid weird positioning.
            style={{
              position: 'fixed',
              left: hideNavigation ? 0 : 'calc(3.5rem + 1px)',
              top: getTopOffset(),
              right: 0,
              bottom: bottomOffset,
              height: statusBar ? 'auto' : 'calc(100% - 3.5rem)',
              zIndex: 9,
            }}
          >
            <SplitPane
              split="vertical"
              defaultSize={17 * 16}
              minSize={0}
              resizerStyle={state.editor.isLoading ? { display: 'none' } : null}
              onDragStarted={() => actions.editor.resizingStarted()}
              onDragFinished={() => actions.editor.resizingStopped()}
              onChange={size => {
                if (size > 0 && state.workspace.workspaceHidden) {
                  actions.workspace.setWorkspaceHidden({ hidden: false });
                } else if (size === 0 && !state.workspace.workspaceHidden) {
                  actions.workspace.setWorkspaceHidden({ hidden: true });
                }
              }}
              pane1Style={{
                minWidth: state.workspace.workspaceHidden ? 0 : 190,
                visibility: state.workspace.workspaceHidden
                  ? 'hidden'
                  : 'visible',
                maxWidth: state.workspace.workspaceHidden ? 0 : 400,
              }}
              pane2Style={{
                height: '100%',
              }}
              style={{
                overflow: 'visible', // For VSCode Context Menu
              }}
            >
              {state.workspace.workspaceHidden ? <div /> : <Workspace />}
              <Content theme={localState.theme} />
            </SplitPane>
            {showSkeleton || showModalOnTop ? (
              <ComponentsThemeProvider theme={localState.theme.vscodeTheme}>
                <ContentSkeleton
                  style={
                    state.editor.hasLoadedInitialModule && !showModalOnTop
                      ? {
                          opacity: 0,
                        }
                      : {
                          opacity: 1,
                        }
                  }
                />
                {showModalOnTop ? (
                  <Element
                    css={css({
                      width: '100vw',
                      height: '100vh',
                      overflow: 'hidden',
                      position: 'fixed',
                      zIndex: 10,
                      top: 0,
                      left: 0,
                    })}
                  >
                    <Element
                      css={css({
                        background: 'rgba(0,0,0,0.4)',
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Element
                        css={css({
                          backgroundColor: 'sideBar.background',
                          maxWidth: '100%',
                          width: 950,
                          position: 'relative',
                          marginTop: '-200px',
                          borderRadius: '8px',

                          '@media screen and (max-width: 950)': {
                            width: 'auto',
                            margin: 0,
                          },
                        })}
                      >
                        {showModalOnTop === 'newSandbox' && (
                          <CreateBox isModal={false} type="sandbox" />
                        )}
                        {showModalOnTop === 'newDevbox' && (
                          <CreateBox isModal={false} type="devbox" />
                        )}
                        {showModalOnTop === 'new' && (
                          <GenericCreate isModal={false} />
                        )}
                      </Element>
                    </Element>
                  </Element>
                ) : null}
              </ComponentsThemeProvider>
            ) : null}
          </div>

          <ComponentsThemeProvider theme={localState.theme.vscodeTheme}>
            <Stack
              justify="space-between"
              align="center"
              className=".monaco-workbench"
              css={css({
                backgroundColor: 'statusBar.background',
                color: 'statusBar.foreground',
                position: 'fixed',
                display: statusBar ? 'flex' : 'none',
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                height: STATUS_BAR_SIZE,
              })}
            >
              <FakeStatusBarText>{VERSION.split('-').pop()}</FakeStatusBarText>
              <StatusBar
                className="monaco-workbench mac nopanel"
                ref={statusbarEl}
                style={{ width: 'calc(100% - 126px)' }}
              />
            </Stack>
          </ComponentsThemeProvider>
        </Fullscreen>

        <ForkFrozenSandboxModal />
      </Container>
      <ComponentsThemeProvider theme={localState.theme.vscodeTheme}>
        <CommentsAPI />
      </ComponentsThemeProvider>
    </ThemeProvider>
  );
};

/** To use the same styles + behavior of the vscode status bar,
 *  we recreate the html structure outside of the status bar
 *  the code is garbage
 */
/* eslint-disable */
const FakeStatusBarText = props => {
  const [copied, setCopied] = React.useState(false);

  const copyText = () => {
    const inputElement = document.querySelector('#status-bar-version');
    // @ts-ignore it's not even a button!
    inputElement.select();
    document.execCommand('copy');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Element
      as="span"
      className="part statusbar"
      css={css({
        width: 'auto !important',
        minWidth: '120px',
        color: 'statusBar.foreground',
      })}
      {...props}
    >
      <span className="statusbar-item" style={{ paddingLeft: '10px' }}>
        <a
          title="Copy version"
          style={{ color: 'inherit', padding: '0 5px' }}
          onClick={copyText}
        >
          {copied ? 'Copied!' : props.children}
        </a>

        <VisuallyHidden>
          <input id="status-bar-version" defaultValue={props.children} />
        </VisuallyHidden>
      </span>
    </Element>
  );
};
/* eslint-enable */
