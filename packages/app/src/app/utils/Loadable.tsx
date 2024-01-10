import React from 'react';
import { Loading } from 'app/components/Loading';

type Unpacked<T> = T extends Promise<infer U> ? U : T;

export const Loadable: <T extends Promise<{ default: React.ComponentType }>>(
  loader: () => T
) => Unpacked<T>['default'] = loader =>
  class extends React.Component {
    state = {
      LoadedComponent: null,
      hasTimedOut: false,
    };

    timer: number;

    componentDidMount() {
      loader().then(module => {
        this.setState({
          LoadedComponent: module.default,
        });
      });
      this.timer = window.setTimeout(
        () =>
          this.setState({
            hasTimedOut: true,
          }),
        1000
      );
    }

    componentWillUnmount() {
      clearTimeout(this.timer);
    }

    render() {
      const { LoadedComponent, hasTimedOut } = this.state;

      if (LoadedComponent) {
        return <LoadedComponent {...this.props} />;
      }

      if (hasTimedOut) {
        return <Loading />;
      }

      return null;
    }
  };
