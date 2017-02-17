// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import type { Module } from '../../../../store/entities/modules';
import type { Sandbox } from '../../../../store/entities/sandboxes';
import type { SandboxState as ViewState } from '../../../../store/reducers/views/sandbox';

import View from './View';
import { modulesBySandboxSelector } from '../../../../store/entities/modules/selector';
import { sandboxViewSelector } from '../../../../store/selectors/views/sandbox-selector';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  width: 100%;
  height: 100%;
`;

type Props = {
  modules: Array<Module>;
  sandbox: Sandbox;
  view: ViewState;
};
type State = {
  resizing: boolean;
};

const mapStateToProps = (state, props) => ({
  view: sandboxViewSelector(state),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
});
class Content extends React.PureComponent {
  componentDidMount() {
    window.onbeforeunload = () => {
      const { modules } = this.props;
      const notSynced = modules.some(m => m.isNotSynced);

      if (notSynced) {
        return 'You have not saved all your modules, are you sure you want to close this tab?';
      }

      return null;
    };
  }

  props: Props;
  state: State;

  render() {
    const { view, sandbox } = this.props;
    return (
      <Frame>
        <View sandbox={sandbox} tab={view.tabs.find(t => t.id === view.currentTab)} />
      </Frame>
    );
  }
}

export default connect(mapStateToProps)(Content);
