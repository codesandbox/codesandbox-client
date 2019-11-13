import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@reach/router';
import Button from '../Button';
import Logo from '../../assets/images/logo.svg';
import SupportIcon from '../../assets/icons/Support';
import StatusIcon from '../../assets/icons/Status';
// import LearnIcon from '../../assets/icons/Learn';
import DocsIcon from '../../assets/icons/Docs';
import BlogIcon from '../../assets/icons/Blog';
// import IDEIcon from '../../assets/icons/Ide';
import EmbedIcon from '../../assets/icons/Embed';
import CIIcon from '../../assets/icons/Ci';
import TeamsIcon from '../../assets/icons/Teams';
import SearchIcon from '../../assets/icons/Search';
import HighlightedICon from '../../assets/icons/Highlighted';
// import NewIcon from '../../assets/icons/New';
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
import MobileNav from './MobileNav';

const DownButton = () => (
  <svg
    css={`
      margin-left: 0.25rem;
      top: -1px;
      position: relative;
    `}
    width={6}
    height={4}
    fill="none"
    viewBox="0 0 6 4"
  >
    <path
      fill="#999"
      d="M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z"
    />
  </svg>
);

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
                    <DownButton />
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
                    <DownButton />
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
                    <DownButton />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setOpenedNav(openedNav === 'explore' ? null : 'explore')
                    }
                    type="button"
                  >
                    Explore
                    <DownButton />
                  </button>
                </li>
                <li>
                  <Link to="/explore">Pricing</Link>
                </li>
                {!user && (
                  <li className="tablet-remove">
                    <a href="https://codesandbox.io/signin">Sign In</a>
                  </li>
                )}
                <LogIn>
                  <Button className="button" href="/s">
                    Create Sandbox
                  </Button>
                  {user && (
                    <UserAvatar
                      className="tablet-remove"
                      src={user.avatar_url}
                      alt={user.username}
                    />
                  )}
                </LogIn>
              </List>
            </Wrapper>
          </Nav>
          <MobileNav />
        </Header>
      </motion.div>
      <SubNav
        openedNav={openedNav}
        name="resources"
        components={[
          // {
          //   Icon: () => (
          //     <a>
          //       <LearnIcon />
          //     </a>
          //   ),
          //   Label: () => <a>Learn</a>,
          // },
          {
            Icon: () => (
              <a href="https://codesandbox.io/docs" title="Documentation">
                <DocsIcon />
              </a>
            ),
            Label: () => (
              <a href="https://codesandbox.io/docs">Documentation</a>
            ),
          },
          {
            Icon: () => (
              <Link to="/blog">
                <BlogIcon />
              </Link>
            ),
            Label: () => <Link to="/blog">Blog</Link>,
          },
        ]}
      />
      <SubNav
        openedNav={openedNav}
        name="support"
        components={[
          {
            Icon: () => (
              <a href="mailto:hello@codesandbox.io" title="Support">
                <SupportIcon />
              </a>
            ),
            Label: () => (
              <a href="mailto:hello@codesandbox.io">Contact Support</a>
            ),
          },
          {
            Icon: () => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://status.codesandbox.io"
                title="Status"
              >
                <StatusIcon />
              </a>
            ),
            Label: () => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://status.codesandbox.io"
              >
                Status
              </a>
            ),
          },
        ]}
      />
      <SubNav
        openedNav={openedNav}
        name="features"
        components={[
          // {
          //   Icon: () => (
          //     <a>
          //       <IDEIcon />
          //     </a>
          //   ),
          //   Label: () => <a>IDE</a>,
          // },
          {
            Icon: () => (
              <Link to="/embeds">
                <EmbedIcon />
              </Link>
            ),
            Label: () => <Link to="/embeds">Embed</Link>,
          },
          {
            Icon: () => (
              <Link to="/ci">
                <CIIcon />
              </Link>
            ),
            Label: () => <Link to="/ci">CodeSandbox CI</Link>,
          },
          {
            Icon: () => (
              <Link to="/team">
                <TeamsIcon />
              </Link>
            ),
            Label: () => <Link to="/team">Teams</Link>,
          },
          // {
          //   Icon: () => (
          //     <a>
          //       <NewIcon />
          //     </a>
          //   ),
          //   Label: () => <a>What’s New</a>,
          // },
        ]}
      />
      <SubNav
        openedNav={openedNav}
        name="explore"
        components={[
          {
            Icon: () => (
              <Link to="/explore">
                <HighlightedICon />
              </Link>
            ),
            Label: () => <Link to="/explore">Highlighted Sandboxes</Link>,
          },
          {
            Icon: () => (
              <Link to="/search">
                <SearchIcon />
              </Link>
            ),
            Label: () => <Link to="/search">Search Sandboxes</Link>,
          },
        ]}
      />
    </>
  );
};

export default Navigation;
