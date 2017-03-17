// @flow
import React from 'react';
import styled from 'styled-components';

import type { Sandbox } from '../../../../../store/entities/sandboxes/entity';

import EditorPreview from './View/EditorPreview';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  width: 100%;
  height: 100%;
`;

type Props = {
  sandbox: Sandbox,
};
type State = {
  resizing: boolean,
};

export default class Content extends React.PureComponent {
  componentDidMount() {
    window.onbeforeunload = () => {
      const { sandbox } = this.props;
      const notSynced = sandbox.modules.some(m => m.isNotSynced);

      if (notSynced) {
        return 'You have not saved all your modules, are you sure you want to close this tab?';
      }

      return null;
    };
  }

  props: Props;
  state: State;

  render() {
    const { sandbox } = this.props;
    return (
      <Frame>
        <EditorPreview sandbox={sandbox} />
      </Frame>
    );
  }
}
