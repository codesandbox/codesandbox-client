import { Computed } from '@cerebral/fluent';
import { State as RootState } from 'app/fluent';

export const items = Computed((_, rootState: RootState) => {
    return [
        {
            id: 'project',
            name: 'Project Info'
        },
        {
            id: 'files',
            name: 'File Editor'
        },
        {
            id: 'github',
            name: 'GitHub',
            show: rootState.isLoggedIn && rootState.editor.currentSandbox && !rootState.editor.currentSandbox.git
        },
        {
            id: 'deploy',
            name: 'Deployment',
            show: rootState.isLoggedIn
        },
        {
            id: 'config',
            name: 'Configuration Files'
        }
    ];
});
