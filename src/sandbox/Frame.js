import React from 'react';
import styled from 'styled-components';

import ErrorComponent from './Error';
import Navigator from './Navigator';
import evalModule from './eval-module';
import ReactMode from './modes/ReactMode';
import FunctionMode from './modes/FunctionMode';

const View = styled.div`
`;

export default class Frame extends React.Component {
  constructor() {
    super();
    this.mode = null;
    this.state = {
      error: null,
    };
  }

  initialize = (element) => {
    window.parent.postMessage('Ready!', '*');
    window.addEventListener('message', (message) => {
      const { modules, module } = message.data;
      try {
        const compiledModule = evalModule(module, modules);
        const mode = compiledModule.__mode__ || 'function'; // eslint-disable-line no-underscore-dangle

        if (mode === 'react') {
          if (this.mode == null || this.mode.type !== 'react') {
            this.mode = new ReactMode(element);
          }
          this.mode.render(compiledModule.default, !!this.state.error);
        } else if (mode === 'function') {
          if (this.mode == null || this.mode.type !== 'function') {
            this.mode = new FunctionMode(element);
          }
          this.mode.render(compiledModule);
        } else {
          this.mode = null;
        }

        if (this.state.error) {
          this.setState({ error: null });
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
        this.setState({ error: e });
      }
    });
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <Navigator />
        <View>
          <div ref={this.initialize} />
          <ErrorComponent error={error} />
        </View>
      </div>
    );
  }
}
