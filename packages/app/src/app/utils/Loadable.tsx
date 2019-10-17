import React from 'react';
import { Loading } from 'app/components/Loading';

export default (loader: () => Promise<{ default: React.ComponentType }>) =>
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
