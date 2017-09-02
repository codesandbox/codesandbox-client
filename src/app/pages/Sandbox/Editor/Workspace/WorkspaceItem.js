import React from 'react';
import styled from 'styled-components';

import ExpandIcon from 'react-icons/lib/md/keyboard-arrow-down';

const ChildContainer = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.background2};
  overflow: ${props => (props.open ? 'inherit' : 'hidden')};
  height: ${props => (props.open ? '100%' : 0)};

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;

    &:after {
      content: "${disabled || ''}";
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
  `};
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

  transform: rotateZ(${props => (props.open ? 0 : 90)}deg);
`;

type Props = {
  title: string,
  children: React.Element,
  defaultOpen: ?boolean,
  disabled: ?string,
};

export default class WorkspaceItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.defaultOpen,
    };
  }

  props: Props;

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title, disabled } = this.props;
    const { open } = this.state;

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <Title>{title}</Title>
          <ExpandIconContainer open={open} />
        </ItemHeader>
        <ChildContainer disabled={disabled} open={open}>
          {children}
        </ChildContainer>
      </div>
    );
  }
}
