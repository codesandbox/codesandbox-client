import React from 'react';
import styled from 'styled-components';

import ExpandIcon from 'react-icons/lib/md/keyboard-arrow-down';
import ReactShow from 'react-show';

const ChildContainer = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;

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
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  vertical-align: middle;
  height: 2.5rem;
  margin: 0;
  font-size: 0.875rem;
  color: ${props => props.theme.white};
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  margin: 0;
  font-weight: 400;
`;

const ExpandIconContainer = styled(ExpandIcon)`
  transition: 0.3s ease all;
  font-size: 1rem;
  margin-right: 0.5rem;

  transform: rotateZ(${props => (props.open ? 0 : -90)}deg);
`;

const Actions = styled.div`
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
`;

type Props = {
  title: string,
  children: React.Element,
  defaultOpen: ?boolean,
  disabled: ?string,

  // this determines whether we need to keep the child component mounted when
  // the item is collapsed
  keepState: ?boolean,

  actions: React.Element,
};

export default class WorkspaceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.defaultOpen,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.open !== this.state.open ||
      nextProps.disabled !== this.props.disabled ||
      this.props.children !== nextProps.children
    );
  }

  props: Props;

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title, keepState, disabled, actions } = this.props;
    const { open } = this.state;

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <ExpandIconContainer open={open} />
          <Title>{title}</Title>

          {open && <Actions>{actions}</Actions>}
        </ItemHeader>
        <ReactShow show={open} duration={250} unmountOnHide={!keepState}>
          <ChildContainer disabled={disabled}>{children}</ChildContainer>
        </ReactShow>
      </div>
    );
  }
}
