import React from 'react';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/go/plus';

import Row from 'app/components/flex/Row';
import HoverMenu from 'app/components/HoverMenu';

import Action from './Action';
import NewSandboxMenu from './NewSandboxMenu';

const Container = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  vertical-align: middle;
`;

export default class NewSandboxAction extends React.PureComponent {
  state = {
    menuOpen: false,
  };

  closeMenu = () => this.setState({ menuOpen: false });
  openMenu = () => this.setState({ menuOpen: true });

  render() {
    const { menuOpen } = this.state;

    return (
      <Container>
        <Action
          onClick={menuOpen ? this.closeMenu : this.openMenu}
          tooltip="New Sandbox"
          Icon={PlusIcon}
        />
        {menuOpen &&
          <HoverMenu onClose={this.closeMenu}>
            <NewSandboxMenu />
          </HoverMenu>}
      </Container>
    );
  }
}
