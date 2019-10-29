import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import Button from '../Button';
import Logo from '../../assets/images/logo.svg';
import {
  Header,
  Nav,
  Wrapper,
  UserAvatar,
  LogoWrapper,
  LogoImage,
  List,
  LogIn,
} from './elements';

const Navigation = () => {
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));

    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    const { data } = await fetch(BASE + '/api/v1/users/current', {
      headers: { Authorization: `Bearer ${jwt}` },
    }).then(x => x.json());

    setUser(data);
  };

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <Header>
      <Nav>
        <Wrapper>
          <LogoWrapper to="/">
            <LogoImage src={Logo} alt="CodeSandbox Logo" />
            CodeSandbox
          </LogoWrapper>
          <List>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
            <li>
              <Link to="/explore">Support</Link>
            </li>
            <li>
              <Link to="/explore">Pricing</Link>
            </li>
            {!user && (
              <li>
                <a href="https://codesandbox.io/signin">Sign In</a>
              </li>
            )}
            <LogIn>
              <Button href="/s">Create Sandbox</Button>
              {user && <UserAvatar src={user.avatar_url} alt={user.username} />}
            </LogIn>
          </List>
        </Wrapper>
      </Nav>
    </Header>
  );
};

export default Navigation;
