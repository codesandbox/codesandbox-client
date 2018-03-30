import * as React from 'react';
import SplitPane from 'react-split-pane';
import { connect } from 'app/fluent';
import { ThemeProvider } from 'styled-components';

import Fullscreen from 'common/components/flex/Fullscreen';
import getTemplateDefinition from 'common/templates';

import Workspace from './Workspace';
import Content from './Content';
import Header from './Header';
import Navigation from './Navigation';

export default connect()
    .with(({ state, signals }) => ({
        sandbox: state.editor.currentSandbox,
        zenMode: state.preferences.settings.zenMode,
        openedWorkspaceItem: state.workspace.openedWorkspaceItem,
        resizingStarted: signals.editor.resizingStarted,
        resizingStopped: signals.editor.resizingStopped
    }))
    .to(function ContentSplit({ sandbox, openedWorkspaceItem, zenMode, resizingStarted, resizingStopped }) {
        const sandboxOwned = sandbox.owned;

        const hideNavigation = (zenMode && !openedWorkspaceItem) || !sandboxOwned;

        return (
            <ThemeProvider
                theme={{
                    templateColor: sandbox && getTemplateDefinition(sandbox.template).color
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }}
                >
                    {!zenMode && <Header />}

                    <Fullscreen>
                        {!hideNavigation && <Navigation />}

                        <div
                            style={{
                                position: 'fixed',
                                left: hideNavigation ? 0 : 'calc(4rem + 1px)',
                                top: zenMode ? 0 : '3rem',
                                right: 0,
                                bottom: 0
                            }}
                        >
                            <SplitPane
                                split="vertical"
                                defaultSize={sandboxOwned ? 16 * 16 : 18 * 16}
                                onDragStarted={() => resizingStarted()}
                                onDragFinished={() => resizingStopped()}
                                resizerStyle={{
                                    visibility: openedWorkspaceItem ? 'visible' : 'hidden'
                                }}
                                pane1Style={{
                                    visibility: openedWorkspaceItem ? 'visible' : 'hidden',
                                    maxWidth: openedWorkspaceItem ? 'inherit' : 0
                                }}
                                pane2Style={{
                                    height: '100%'
                                }}
                            >
                                {openedWorkspaceItem && <Workspace />}
                                <Content />
                            </SplitPane>
                        </div>
                    </Fullscreen>
                </div>
            </ThemeProvider>
        );
    });
