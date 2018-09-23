import React from 'react';
import Loading from '../components/Loading';

export default loader =>
  class extends React.Component {
    state = {
      LoadedComponent: null,
      hasTimedOut: false,
    };
    timer;
    componentDidMount() {
      loader().then(module => {
        this.setState({
          LoadedComponent: module.default,
        });
      });
      this.timer = setTimeout(
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
        return <LoadedComponent />;
      }

      if (hasTimedOut) {
        return <Loading />;
      }

      return null;
    }
  };
