import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Description } from '../../elements';
import ZeitDeployments from './Zeit';
import NetlifyDeployments from './Netlify';
import { More } from '../More';

class Deployment extends Component {
  componentDidMount = () => {
    this.props.signals.deployment.getDeploys();
  };

  render() {
    const { store } = this.props;

    const showPlaceHolder =
      !store.editor.currentSandbox.owned || !store.isLoggedIn;

    if (showPlaceHolder) {
      const message = store.isLoggedIn ? (
        <>
          You need to own this sandbox to deploy this sandbox to Netlify or
          ZEIT. <p>Fork this sandbox to make a deploy!</p>
        </>
      ) : (
        <>You need to be signed in to deploy this sandbox to Netlify or ZEIT.</>
      );

      return <More message={message} id="github" />;
    }

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
