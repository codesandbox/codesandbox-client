import {
  IAction,
  IConfig,
  IDerive,
  IOnInitialize,
  IOperator,
  IReaction,
  IState,
  Overmind,
} from 'overmind';
import { createHook } from 'overmind-react';
import { merge, namespaced } from 'overmind/config';
import { graphql } from '../overmind-graphql';
import * as actions from './actions';
import { createConnect } from './createConnect';
import * as effects from './effects';
import { createModals } from './factories';
import * as modals from './modals';
import * as dashboard from './namespaces/dashboard';
import * as deployment from './namespaces/deployment';
import * as editor from './namespaces/editor';
import * as explore from './namespaces/explore';
import * as files from './namespaces/files';
import * as git from './namespaces/git';
import * as live from './namespaces/live';
import * as patron from './namespaces/patron';
import * as preferences from './namespaces/preferences';
import * as profile from './namespaces/profile';
import * as server from './namespaces/server';
import * as userNotifications from './namespaces/userNotifications';
import * as workspace from './namespaces/workspace';
import { onInitialize } from './onInitialize';
import { state } from './state';
import * as collaboratorGql from './graphql/collaborators';

const baseConfig = merge(
  {
    onInitialize,
    effects,
    state,
    actions,
  },
  namespaced({
    preferences,
    userNotifications,
    patron,
    editor,
    live,
    workspace,
    dashboard,
    deployment,
    files,
    git,
    explore,
    profile,
    server,
    modals: createModals(modals),
  })
);

export const config = graphql(baseConfig, {
  endpoint: 'https://codesandbox.test/api/graphql',
  params: ({ jwt }) => ({
    // We get the state here to build the connection_init params
    Authorization: `Bearer ${jwt}`,
  }),
  headers: ({ jwt }) => ({
    Authorization: `Bearer ${jwt}`,
  }),
  subscriptions: {
    onCollaboratorAdded: collaboratorGql.onCollaboratorAdded,
    onCollaboratorChanged: collaboratorGql.onCollaboratorChanged,
    onCollaboratorRemoved: collaboratorGql.onCollaboratorRemoved,
  },
  queries: {
    collaborators: collaboratorGql.collaborators,
    invitations: collaboratorGql.invitations,
  },
  mutations: {
    addCollaborator: collaboratorGql.addCollaborator,
    removeCollaborator: collaboratorGql.removeCollaborator,
    changeCollaboratorAuthorization:
      collaboratorGql.changeCollaboratorAuthorization,
    inviteCollaorator: collaboratorGql.inviteCollaborator,
    revokeInvitation: collaboratorGql.revokeInvitation,
    changeSandboxInvitationAuthorization:
      collaboratorGql.changeInvitationAuthorization,
  },
});

export interface Config extends IConfig<typeof config> {}

export interface OnInitialize extends IOnInitialize<Config> {}

export interface Action<Input = void, Output = void>
  extends IAction<Config, Input, Output> {}

export interface AsyncAction<Input = void, Output = void>
  extends IAction<Config, Input, Promise<Output>> {}

export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> {}

export interface Derive<Parent extends IState, Output>
  extends IDerive<Config, Parent, Output> {}

export interface Reaction extends IReaction<Config> {}

export const connect = createConnect<typeof config>();

export const useOvermind = createHook<typeof config>();

export const Observer: React.FC<{
  children: <T>(overmind: {
    state: Overmind<Config>['state'];
    actions: Overmind<Config>['actions'];
  }) => T;
}> = ({ children }) => {
  const overmind = useOvermind();

  return children(overmind);
};
