import { State as RootState } from 'app/fluent';

const PROJECT = {
    id: 'project',
    name: 'Project Info'
};

const FILES = {
    id: 'files',
    name: 'File Editor'
};

const GITHUB = {
    id: 'github',
    name: 'GitHub'
};

const DEPLOYMENT = {
    id: 'deploy',
    name: 'Deployment'
};

const CONFIGURATION = {
    id: 'config',
    name: 'Configuration Files'
};

const LIVE = {
    id: 'live',
    name: 'Live'
};

export const items = function getItems(_, rootState: RootState) {
    if (
        rootState.live.isLive &&
        !(
            rootState.live.isOwner ||
            (rootState.user &&
                rootState.live &&
                rootState.live.roomInfo &&
                rootState.live.roomInfo.ownerId === rootState.user.id)
        )
    ) {
        return [ FILES, LIVE ];
    }

    const returnedItems = [ PROJECT, FILES ];

    if (rootState.isLoggedIn && rootState.editor.currentSandbox && !rootState.editor.currentSandbox.git) {
        returnedItems.push(GITHUB);
    }

    if (rootState.isLoggedIn) {
        returnedItems.push(DEPLOYMENT);
    }

    returnedItems.push(CONFIGURATION);

    if (rootState.isLoggedIn) {
        returnedItems.push(LIVE);
    }

    return returnedItems;
};
