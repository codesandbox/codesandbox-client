import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import VERSION from 'common/version';

import SocialInfo from 'app/components/SocialInfo';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import GitHub from './items/GitHub';
import Live from './items/Live';
import Deployment from './items/Deployment';
import ConfigurationFiles from './items/ConfigurationFiles';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';
// import DowntimeNotice from './DowntimeNotice';

import { Container, ContactContainer, ItemTitle } from './elements';

const idToItem = {
    project: ProjectInfo,
    files: Files,
    github: GitHub,
    deploy: Deployment,
    config: ConfigurationFiles,
    live: Live
};

const Workspace: React.SFC<WithCerebral> = ({ store }) => {
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;

    const currentItem = store.workspace.openedWorkspaceItem;

    if (!currentItem) {
        return null;
    }

    const Component = sandbox.owned ? idToItem[currentItem] : NotOwnedSandboxInfo;

    const item = store.workspace.items.get().find((i) => i.id === currentItem);
    return (
        <Container>
            {sandbox.owned && <ItemTitle>{item.name}</ItemTitle>}
            <div style={{ flex: 1 }}>
                <Component />
            </div>
            {!preferences.settings.zenMode && (
                <div>
                    {!store.isPatron && !sandbox.owned && <Advertisement />}
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
                            className="codesandbox-version"
                        >
                            {VERSION}
                        </div>
                    </ContactContainer>
                    {/* <DowntimeNotice /> */}
                    <ConnectionNotice />
                </div>
            )}
        </Container>
    );
};

export default connect()(Workspace);
