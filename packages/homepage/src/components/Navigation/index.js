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
import IDEIcon from '../../assets/icons/Ide';
import EmbedIcon from '../../assets/icons/Embed';
import CIIcon from '../../assets/icons/Ci';
import TeamsIcon from '../../assets/icons/Teams';
import NewIcon from '../../assets/icons/New';
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
                  <button
                    onClick={() =>
                      setOpenedNav(openedNav === 'features' ? null : 'features')
                    }
                    type="button"
                  >
                    Features
                  </button>
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
                  <Link to="/explore">Explore</Link>
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
      <SubNav
        openedNav={openedNav}
        name="resources"
        components={[
          () => (
            <>
              <LearnIcon />
              <a>Learn</a>
            </>
          ),

          () => (
            <>
              <DocsIcon />
              <a>Documentation</a>
            </>
          ),
          () => (
            <>
              <Link to="/blog">
                <BlogIcon />
              </Link>
              <Link to="/blog">Blog</Link>
            </>
          ),
        ]}
      />
      <SubNav
        openedNav={openedNav}
        name="support"
        components={[
          () => (
            <>
              <a href="mailto:hello@codesandbox.io" title="Support">
                <SupportIcon />
              </a>
              <a href="mailto:hello@codesandbox.io">Contact Support</a>
            </>
          ),
          () => (
            <>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://status.codesandbox.io"
                title="Status"
              >
                <StatusIcon />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://status.codesandbox.io"
              >
                Status
              </a>
            </>
          ),
        ]}
      />
      <SubNav
        openedNav={openedNav}
        name="features"
        components={[
          () => (
            <>
              <a>
                <IDEIcon />
              </a>
              <a>IDE</a>
            </>
          ),
          () => (
            <>
              <Link to="/embeds">
                <EmbedIcon />
              </Link>
              <Link to="/embeds">Embed</Link>
            </>
          ),
          () => (
            <>
              <Link to="/ci">
                <CIIcon />
              </Link>
              <Link to="/ci">CodeSandbox CI</Link>
            </>
          ),
          () => (
            <>
              <Link to="/team">
                <TeamsIcon />
              </Link>
              <Link to="/team">Teams</Link>
            </>
          ),
          () => (
            <>
              <a>
                <NewIcon />
              </a>
              <a>What’s New</a>
            </>
          ),
        ]}
      />
    </>
  );
};

export default Navigation;
