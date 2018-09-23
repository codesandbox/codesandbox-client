import React from 'react';
import Loading from '../components/Loading';

export default loader =>
  class extends React.Component {
    state = {
      LoadedComponent: null,
    };
    componentDidMount() {
      loader().then(module => {
        this.setState({
          LoadedComponent: module.default,
        });
      });
    }
    render() {
      const { LoadedComponent } = this.state;

      if (LoadedComponent) {
        return <LoadedComponent />;
      }

      return <Loading />;
    }
  };
