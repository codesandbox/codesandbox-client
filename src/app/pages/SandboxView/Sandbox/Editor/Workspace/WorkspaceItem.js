import React from 'react';
import styled from 'styled-components';

import ExpandIcon from 'react-icons/lib/md/keyboard-arrow-down';

const ChildContainer = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  margin: 0rem;
  padding: 0;
  border-bottom: 1px solid ${props => props.theme.background2};

  overflow: auto;
  height: ${props => props.open ? '100%' : 0};
`;

const WorkspaceTitle = styled.h3`
  position: relative;
  padding: 1rem 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  color: ${props => props.theme.white};
  cursor: pointer;
`;

const ExpandIconContainer = styled(ExpandIcon)`
  transition: 0.3s ease all;
  position: absolute;
  right: 0.5rem;
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
        <WorkspaceTitle onClick={this.toggleOpen}>
          {title}
          <ExpandIconContainer open={open} />
        </WorkspaceTitle>
        <ChildContainer open={open}>
          {children}
        </ChildContainer>
      </div>
    );
  }
}
