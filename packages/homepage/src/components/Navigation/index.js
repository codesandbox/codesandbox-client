import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@reach/router';
import Button from '../Button';
import Logo from '../../assets/images/logo.svg';
import SupportIcon from '../../assets/icons/Support';
import StatusIcon from '../../assets/icons/Status';
import LearnIcon from '../../assets/icons/Learn';
import DocsIcon from '../../assets/icons/Docs';
import BlogIcon from '../../assets/icons/Blog';
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
import SubNav from './SubNav';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [openedNav, setOpenedNav] = useState(null);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: 'easeIn',
        }}
      >
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
                  <button
                    onClick={() =>
                      setOpenedNav(
                        openedNav === 'resources' ? null : 'resources'
                      )
                    }
                    type="button"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setOpenedNav(openedNav === 'support' ? null : 'support')
                    }
                    type="button"
                  >
                    Support
                  </button>
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
                  {user && (
                    <UserAvatar src={user.avatar_url} alt={user.username} />
                  )}
                </LogIn>
              </List>
            </Wrapper>
          </Nav>
        </Header>
      </motion.div>
      <SubNav openedNav={openedNav} name="resources">
        <li>
          <LearnIcon />
          <a>Learn</a>
        </li>
        <li>
          <DocsIcon />
          <a>Documentation</a>
        </li>
        <li>
          <Link to="/blog">
            <BlogIcon />
          </Link>
          <Link to="/blog">Blog</Link>
        </li>
      </SubNav>
      <SubNav openedNav={openedNav} name="support">
        <li>
          <a href="mailto:hello@codesandbox.io" title="Support">
            <SupportIcon />
          </a>
          <a href="mailto:hello@codesandbox.io">Contact Support</a>
        </li>
        <li>
          <a href="https://status.codesandbox.io" title="Status">
            <StatusIcon />
          </a>
          <a href="https://status.codesandbox.io">Status</a>
        </li>
      </SubNav>
    </>
  );
};

export default Navigation;
