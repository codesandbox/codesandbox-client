/* @flow */
import React from 'react';
import { Match } from 'react-router';
import styled from 'styled-components';

import Sandbox from './Sandbox';
import Create from './Create';

type Props = {
  params: {
    action: 'sandbox' | string;
  },
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex: auto;
  background-color: ${props => props.theme.background2};
`;

class SandboxView extends React.PureComponent {
  props: Props;

  getMatch = () => {
    const { params } = this.props;
    if (params.action === 'sandbox') {
      return (
        <Match
          pattern=":id" render={(matchProps) => {
            if (matchProps.params.id === 'new') return <Create />;
            return <Sandbox {...matchProps} />;
          }}
        />
      );
    }

    return (
      <Match pattern="/:username/:slug" component={Sandbox} />
    );
  };

  render() {
    return (
      <Container>
        {this.getMatch()}
      </Container>
    );
  }
}
export default SandboxView;
