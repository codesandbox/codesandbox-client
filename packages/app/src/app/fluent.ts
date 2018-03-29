import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent';
import { State as StoreState } from './store/types';
import { State as PatronState } from './store/modules/patron/types';
import { State as ProfileState } from './store/modules/profile/types';
import { State as EditorState } from './store/modules/editor/types';
import { State as PreferencesState } from './store/modules/preferences/types';
import { State as WorkspaceState } from './store/modules/workspace/types';
import { State as GitState } from './store/modules/git/types';
import { State as DeploymentState } from './store/modules/deployment/types';

export type State = StoreState & {
    patron: PatronState;
    profile: ProfileState;
    editor: EditorState;
    preferences: PreferencesState;
    workspace: WorkspaceState;
    git: GitState;
    deployment: DeploymentState;
};

// Create an interface where you compose your providers together
interface Providers {
    state: State;
}

// Create a type used with your sequences and actions
export type Context<Props = {}> = IContext<Props> & Providers;

// This type is used when you define actions that returns a path
export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> & Providers;

// This function is used to connect components to Cerebral
export const connect = ConnectFactory<State, any>();

// This function is used to define sequences
export const sequence = SequenceFactory<Context>();

// This function is used to define sequences that expect to receive some initial
// props
export const sequenceWithProps = SequenceWithPropsFactory<Context>();
