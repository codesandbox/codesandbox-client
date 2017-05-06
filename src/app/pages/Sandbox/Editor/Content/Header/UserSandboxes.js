import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { User } from 'app/store/user/reducer';
import { sandboxUrl } from 'app/utils/url-generator';

const Container = styled.div`
  width: 250px;
  max-height: 400px;
  overflow: auto;
  border-radius: 4px;
`;

const Item = styled(Link)`
  display: block;
  transition: 0.3s ease all;
  cursor: pointer;
  border-left: 2px solid transparent;
  padding: 0 1rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.secondary};
  }
`;

type Props = {
  user: User,
  loadUserSandboxes: () => void,
};
export default class UserSandboxes extends React.PureComponent {
  props: Props;

  componentDidMount() {
    const { loadUserSandboxes } = this.props;

    loadUserSandboxes();
  }

  render() {
    const { user } = this.props;
    if (user.sandboxes == null) return <Item to="#">Loading...</Item>;

    return (
      <Container>
        {user.sandboxes.map(s => (
          <Item to={sandboxUrl(s)} key={s.id}>{s.title || s.id}</Item>
        ))}
      </Container>
    );
  }
}
