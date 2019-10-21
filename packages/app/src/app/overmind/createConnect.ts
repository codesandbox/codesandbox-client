/* eslint-disable */

/*
  This file is temporary for the transition to Overmind
*/

import { IConfiguration, Overmind, EventType } from 'overmind';
import { Component, createElement, ComponentType } from 'react';
import { context } from './Provider';

export interface IConnect<Config extends IConfiguration> {
  overmind: {
    state: Overmind<Config>['state'];
    actions: Overmind<Config>['actions'];
    effects: Overmind<Config>['effects'];
    addMutationListener: Overmind<Config>['addMutationListener'];
  };
  store: Overmind<Config>['state'];
  signals: Overmind<Config>['actions'];
}

let nextComponentId = 0;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function createReaction(overmind: any) {
  return (reactionCb: any, updateCb: any) => {
    const tree = overmind.proxyStateTree.getTrackStateTree();
    const updateReaction = () => {
      tree.trackScope(
        () => reactionCb(tree.state),
        () => {
          updateCb(reactionCb(tree.state));
          updateReaction();
        }
      );
    };

    updateReaction();

    return () => {
      overmind.proxyStateTree.disposeTree(tree);
    };
  };
}

export const createConnect = <ThisConfig extends IConfiguration>(
  overmindInstance?: Overmind<ThisConfig>
) => <Props>(
  component: ComponentType<
    Props & {
      overmind: {
        state: Overmind<ThisConfig>['state'];
        actions: Overmind<ThisConfig>['actions'];
        reaction: (
          reactionCb: (state: Overmind<ThisConfig>['state']) => any,
          updateCb: () => void
        ) => void;
      };
    }
  >
): ComponentType<
  Omit<
    Props & IConnect<Overmind<ThisConfig>>,
    keyof IConnect<Overmind<ThisConfig>>
  >
> => {
  let componentInstanceId = 0;
  const name = component.name;
  const populatedComponent = component as any;
  populatedComponent.__componentId =
    typeof populatedComponent.__componentId === 'undefined'
      ? nextComponentId++
      : populatedComponent.__componentId;
  const isClassComponent =
    component.prototype && typeof component.prototype.render === 'function';

  if (isClassComponent) {
    const originalRender = component.prototype.render;
    component.prototype.render = function() {
      if (this.props.overmind) {
        return this.props.overmind.tree.trackScope(
          () => originalRender.call(this),
          this.props.overmind.onUpdate
        );
      }

      return originalRender.call(this);
    };
  }

  if (IS_PRODUCTION) {
    class HOC extends Component {
      tree: any;
      overmind: any;
      state: {
        overmind: any;
      };
      wrappedComponent: any;
      reaction: any;
      isUnmounting: boolean;
      static contextType = context;
      constructor(props, context) {
        super(props);
        this.overmind = overmindInstance || context;
        this.tree = this.overmind.proxyStateTree.getTrackStateTree();
        this.isUnmounting = false;
        this.state = {
          overmind: {
            state: this.tree.state,
            effects: this.overmind.effects,
            actions: this.overmind.actions,
            addMutationListener: this.overmind.addMutationListener,
            onUpdate: this.onUpdate,
            tree: this.tree,
          },
        };
        this.wrappedComponent = (...args) =>
          this.tree.trackScope(
            () => (component as any)(...args),
            this.onUpdate
          );
        this.reaction = createReaction(this.overmind);
      }
      componentWillUnmount() {
        this.isUnmounting = true;
        this.overmind.proxyStateTree.disposeTree(this.tree);
      }
      onUpdate = () => {
        if (this.isUnmounting) {
          return;
        }
        this.setState({
          overmind: {
            state: this.tree.state,
            effects: this.overmind.effects,
            actions: this.overmind.actions,
            addMutationListener: this.overmind.addMutationListener,
            onUpdate: this.onUpdate,
            tree: this.tree,
          },
        });
      };
      render() {
        if (isClassComponent) {
          return createElement(component, {
            ...this.props,
            overmind: this.state.overmind,
            store: this.state.overmind.state,
            signals: this.state.overmind.actions,
            reaction: this.reaction,
          } as any);
        }

        return createElement(this.wrappedComponent, {
          ...this.props,
          overmind: this.state.overmind,
          store: this.state.overmind.state,
          signals: this.state.overmind.actions,
          reaction: this.reaction,
        } as any);
      }
    }

    return HOC as any;
  }

  class HOC extends Component {
    tree: any;
    overmind: any;
    componentInstanceId = componentInstanceId++;
    currentFlushId = 0;
    state: {
      overmind: any;
    };
    isUpdating: boolean;
    wrappedComponent: any;
    isUnmounting: boolean;
    reaction: any;
    static contextType = context;
    constructor(props, context) {
      super(props);
      this.overmind = overmindInstance || context;
      this.tree = this.overmind.proxyStateTree.getTrackStateTree();
      this.isUnmounting = false;
      this.state = {
        overmind: {
          state: this.tree.state,
          effects: this.overmind.effects,
          actions: this.overmind.actions,
          addMutationListener: this.overmind.addMutationListener,
          onUpdate: this.onUpdate,
          tree: this.tree,
        },
      };
      this.wrappedComponent = (...args) =>
        this.tree.trackScope(() => (component as any)(...args), this.onUpdate);
      this.reaction = createReaction(this.overmind);
    }
    componentDidMount() {
      this.overmind.eventHub.emitAsync(EventType.COMPONENT_ADD, {
        componentId: populatedComponent.__componentId,
        componentInstanceId: this.componentInstanceId,
        name,
        paths: Array.from(this.tree.pathDependencies) as any,
      });
    }
    componentDidUpdate() {
      if (this.isUpdating) {
        this.overmind.eventHub.emitAsync(EventType.COMPONENT_UPDATE, {
          componentId: populatedComponent.__componentId,
          componentInstanceId: this.componentInstanceId,
          name,
          flushId: this.currentFlushId,
          paths: Array.from(this.tree.pathDependencies as Set<string>),
        });
        this.isUpdating = false;
      }
    }
    componentWillUnmount() {
      this.isUnmounting = true;
      this.overmind.proxyStateTree.disposeTree(this.tree);
      this.overmind.eventHub.emitAsync(EventType.COMPONENT_REMOVE, {
        componentId: populatedComponent.__componentId,
        componentInstanceId: this.componentInstanceId,
        name,
      });
    }
    onUpdate = (mutatons, paths, flushId) => {
      if (this.isUnmounting) {
        return;
      }
      this.currentFlushId = flushId;
      this.isUpdating = true;
      this.setState({
        overmind: {
          state: this.tree.state,
          effects: this.overmind.effects,
          actions: this.overmind.actions,
          addMutationListener: this.overmind.addMutationListener,
          onUpdate: this.onUpdate,
          tree: this.tree,
        },
      });
    };
    render() {
      if (isClassComponent) {
        return createElement(component, {
          ...this.props,
          overmind: this.state.overmind,
          store: this.state.overmind.state,
          signals: this.state.overmind.actions,
          reaction: this.reaction,
        } as any);
      }

      return createElement(this.wrappedComponent, {
        ...this.props,
        overmind: this.state.overmind,
        store: this.state.overmind.state,
        signals: this.state.overmind.actions,
        reaction: this.reaction,
      } as any);
    }
  }

  Object.defineProperties(HOC, {
    name: {
      value: 'Connect' + (component.displayName || component.name || ''),
    },
  });

  return HOC as any;
};
