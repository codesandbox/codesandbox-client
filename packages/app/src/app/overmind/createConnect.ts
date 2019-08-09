import { context } from './Provider';
import { IConfiguration, Overmind, EventType } from 'overmind';
import {
  StatelessComponent,
  ComponentClass,
  ClassicComponentClass,
  Component,
  createElement,
} from 'react';

export type IReactComponent<P = any> =
  | StatelessComponent<P>
  | ComponentClass<P>
  | ClassicComponentClass<P>;

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } &
    { [P in K]: never } & { [x: string]: never; [x: number]: never })[keyof T]
>;

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

export const createConnect = <ThisConfig extends IConfiguration>(
  overmindInstance?: Overmind<ThisConfig>
) => <Props>(
  component: IReactComponent<
    Props & {
      overmind: {
        state: Overmind<ThisConfig>['state'];
        actions: Overmind<ThisConfig>['actions'];
      };
    }
  >
): IReactComponent<
  Omit<
    Props & IConnect<Overmind<ThisConfig>>,
    keyof IConnect<Overmind<ThisConfig>>
  >
> => {
  if (overmindInstance) {
    console.warn(
      'DEPRECATION - Do not pass the overmind instance to "createConnect", but use the provider. Please read docs for more information'
    );
  }

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
      static contextType = context;
      constructor(props, context) {
        super(props);
        this.overmind = overmindInstance || context;
        this.tree = this.overmind.proxyStateTree.getTrackStateTree();
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
      }
      componentWillUnmount() {
        this.overmind.proxyStateTree.disposeTree(this.tree);
      }
      onUpdate = () => {
        console.log('GOT THE CHANGE!');
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
          } as any);
        }

        return createElement(
          (...args) =>
            this.tree.trackScope(
              () => (component as any)(...args),
              this.onUpdate
            ),
          {
            ...this.props,
            overmind: this.state.overmind,
          } as any
        );
      }
    }

    return HOC as any;
  } else {
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
      static contextType = context;
      constructor(props, context) {
        super(props);
        this.overmind = overmindInstance || context;
        this.tree = this.overmind.proxyStateTree.getTrackStateTree();
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
        this.overmind.proxyStateTree.disposeTree(this.tree);
        this.overmind.eventHub.emitAsync(EventType.COMPONENT_REMOVE, {
          componentId: populatedComponent.__componentId,
          componentInstanceId: this.componentInstanceId,
          name,
        });
      }
      onUpdate = (mutatons, paths, flushId) => {
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
          } as any);
        }

        return createElement(this.wrappedComponent, {
          ...this.props,
          overmind: this.state.overmind,
          store: this.state.overmind.state,
          signals: this.state.overmind.actions,
        } as any);
      }
    }

    Object.defineProperties(HOC, {
      name: {
        value: 'Connect' + (component.displayName || component.name || ''),
      },
    });

    return HOC as any;
  }
};
