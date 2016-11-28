import React from 'react';
import styled from 'styled-components';

import PlusIcon from 'react-icons/lib/go/plus';
import EditIcon from 'react-icons/lib/go/pencil';

const Container = styled.div`
  transition: 0.3s ease all;
  position: absolute;
  top: 0; bottom: 0;
  right: 0.5rem;
  display: flex;

  justify-content: center;
  flex-direction: column;

  z-index: 5;
  cursor: pointer;
  opacity: ${props => (props.show ? 1 : 0)};

`;

const Icon = styled.div`
  transition: 0.3s ease all;
  display: inline-block;
  color: ${props => props.theme.background3.lighten(0.8)};
  margin: 0.2rem;
  &:hover {
    color: ${props => props.theme.background.lighten(5)};
  }
`;

type Props = {
  show: boolean;
  startEditing: () => void;
};

export default class Actions extends React.Component {
  props: Props;
  render() {
    const { show, startEditing } = this.props;
    return (
      <Container show={show}>
        <div>
          <Icon onClick={startEditing}><EditIcon /></Icon>
          <Icon><PlusIcon /></Icon>
        </div>
      </Container>
    );
  }
}
