import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Location } from '@reach/router';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
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

const DocsNavigation = () => {
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
    <Location>
      {({ location: { pathname } }) => (
        <motion.div
          initial={{
            opacity: pathname === '/' ? 0 : 1,
            y: pathname === '/' ? -20 : 0,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeIn',
          }}
        >
          <Header>
            <Nav>
              <Wrapper>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LogoWrapper to="/">
                    <LogoImage src={Logo} alt="CodeSandbox Logo" />
                  </LogoWrapper>
                  <List>
                    <li>
                      <Link
                        className={pathname === '/docs/' && 'active'}
                        to="/docs"
                      >
                        {' '}
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={pathname === '/docs/api' && 'active'}
                        to="/docs/api"
                      >
                        API Reference
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/docs/faq"
                        className={pathname === '/docs/faq' && 'active'}
                      >
                        FAQ
                      </Link>
                    </li>
                  </List>
                </div>
                <List>
                  {!user && (
                    <li className="tablet-remove">
                      <a href={signInPageUrl()}>Sign In</a>
                    </li>
                  )}
                  <LogIn>
                    <Button className="button" href="/s">
                      Create Sandbox
                    </Button>
                    {user && (
                      <a style={{ display: 'flex' }} href="/dashboard">
                        <UserAvatar
                          className="tablet-remove"
                          src={user.avatar_url}
                          alt={user.username}
                        />
                      </a>
                    )}
                  </LogIn>
                </List>
              </Wrapper>
            </Nav>
          </Header>
        </motion.div>
      )}
    </Location>
  );
};

export default DocsNavigation;
