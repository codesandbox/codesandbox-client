import React from 'react';
import styled from 'styled-components';

import ExpandIcon from 'react-icons/lib/md/keyboard-arrow-down';

const ChildContainer = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  margin: 0;
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.background2};

  height: ${props => props.open ? '100%' : 0};
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  vertical-align: middle;
  height: calc(3rem - 1px);
  margin: 0;
  color: ${props => props.theme.white};
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

const ExpandIconContainer = styled(ExpandIcon)`
  transition: 0.3s ease all;
  position: absolute;
  right: 1rem;
  font-size: 1rem;

  transform: rotateZ(${props => props.open ? 0 : 90}deg);
`;

type Props = {
  title: string,
  children: React.Element,
  defaultOpen: ?boolean,
};

export default class WorkspaceItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.defaultOpen,
      contentHeight: 0,
    };
  }

  props: Props;

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title } = this.props;
    const { open } = this.state;

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <Title>{title}</Title>
          <ExpandIconContainer open={open} />
        </ItemHeader>
        <ChildContainer open={open}>
          {children}
        </ChildContainer>
      </div>
    );
  }
}
