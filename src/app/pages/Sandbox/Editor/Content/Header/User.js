import React from 'react';
import styled from 'styled-components';
import type { User } from 'app/store/user/reducer';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import Tooltip from 'app/components/Tooltip';

import DownIcon from 'react-icons/lib/go/chevron-down';
import UserSandboxes from './UserSandboxes';

const Container = styled.div`
  position: relative;
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  line-height: 3rem;
  vertical-align: middle;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  z-index: 2;

  &:hover {
    color: white;
    border-color: ${props => props.theme.secondary};
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  line-height: 1;
  vertical-align: middle;
`;

const ProfileImage = styled.img`
  margin: 0 0.75rem;
`;

const Name = styled.div`
  padding-right: 0.5rem;
`;

const Menu = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background2};
  top: 100%;
  right: 0;
  left: 0;
  z-index: 2;
  border-radius: 2px;
`;

const Item = styled.div`
  transition: 0.3s ease all;
  padding: 0 1rem;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  overflow: hidden;
  border-left: 2px solid transparent;
  ${props => props.disabled && 'color: rgba(255, 255, 255, 0.3);'}

  &:hover {
    color: ${props => (props.disabled ? 'inherit' : props.theme.secondary)};
    border-color: ${props => props.theme.secondary};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Sandboxes = styled.div`
  position: absolute;
  right: 100%;
  top: 0;
  z-index: 3;
  padding: 0;
  background-color: ${props => props.theme.background2};
`;

type Props = {
  user: User,
  sandbox: Sandbox,
  signOut: () => void,
  loadUserSandboxes: () => void,
};

type State = {
  open: boolean,
};

export default class UserView extends React.PureComponent {
  props: Props;

  state: State = {
    open: false,
    sandboxesOpen: false,
  };

  toggleMenu = () =>
    (this.state.open ? this.closeMenu() : this.setState({ open: true }));
  closeMenu = () => this.setState({ open: false, sandboxesOpen: false });

  toggleSandboxesMenu = () => {
    this.setState({ sandboxesOpen: !this.state.sandboxesOpen });
  };

  sandboxesMenu = () => {
    const { user, loadUserSandboxes } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <Item onClick={this.toggleSandboxesMenu}>My sandboxes</Item>
        {this.state.sandboxesOpen &&
          <Sandboxes>
            <UserSandboxes user={user} loadUserSandboxes={loadUserSandboxes} />
          </Sandboxes>}
      </div>
    );
  };

  profileView = () => {
    const { user } = this.props;

    if (!user.id) return <span>Logging in...</span>;

    return (
      <Profile onClick={this.toggleMenu}>
        <ProfileImage
          style={{ borderRadius: '4px' }}
          height="32"
          src={user.avatarUrl}
          alt={user.username}
        />
        <Name>{user.username}</Name>
        <DownIcon />
      </Profile>
    );
  };

  signOut = () => {
    const { signOut } = this.props;
    const yes = confirm('Are you sure you want to sign out?');
    if (yes) {
      signOut();
    }
  };

  menuView = () => (
    <Menu>
      <Tooltip offset={-20} left message="Coming soon">
        <Item disabled>Profile</Item>
      </Tooltip>
      {this.sandboxesMenu()}
      <Item onClick={this.signOut}>Sign out</Item>
    </Menu>
  );

  render() {
    return (
      <Container>
        {this.profileView()}
        {this.state.open && this.menuView()}
      </Container>
    );
  }
}
