import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Description } from '../../elements';
import ZeitDeployments from './Zeit';
import NetlifyDeployments from './Netlify';

class Deployment extends Component {
  componentDidMount = () => {
    this.props.signals.deployment.getDeploys();
  };

  render() {
    return (
      <div>
        <Description>
          You can deploy a production version of your sandbox using one our
          supported providers.
        </Description>
        <ZeitDeployments />
        <NetlifyDeployments />
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(Deployment));
