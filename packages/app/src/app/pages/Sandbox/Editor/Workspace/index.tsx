import * as React from 'react';
import { connect } from 'app/fluent';

import VERSION from 'common/version';

import SocialInfo from 'app/components/SocialInfo';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import GitHub from './items/GitHub';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';

import { Container, ContactContainer, ItemTitle } from './elements';

const idToItem = {
    project: ProjectInfo,
    files: Files,
    github: GitHub,
    deploy: Deployment,
    config: ConfigurationFiles
};

export default connect()
    .with(({ state }) => ({
        isPatron: state.isPatron,
        sandbox: state.editor.currentSandbox,
        workspaceItems: state.workspace.items.get(),
        zenMode: state.preferences.settings.zenMode,
        currentItem: state.workspace.openedWorkspaceItem
    }))
    .to(function Workspace({ workspaceItems, sandbox, zenMode, currentItem, isPatron }) {
        if (!currentItem) {
            return null;
        }

        const Component = sandbox.owned ? idToItem[currentItem] : NotOwnedSandboxInfo;

        const item = workspaceItems.find((i) => i.id === currentItem);
        return (
            <Container>
                {sandbox.owned && <ItemTitle>{item.name}</ItemTitle>}
                <div style={{ flex: 1 }}>
                    <Component />
                </div>
                {!zenMode && (
                    <div>
                        {!isPatron && !sandbox.owned && <Advertisement />}
                        <ContactContainer>
                            <SocialInfo style={{ display: 'inline-block' }} />
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    float: 'right',
                                    fontSize: '.6rem',
                                    height: 28,
                                    verticalAlign: 'middle',
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                {VERSION}
                            </div>
                        </ContactContainer>
                        <ConnectionNotice />
                    </div>
                )}
            </Container>
        );
    });
