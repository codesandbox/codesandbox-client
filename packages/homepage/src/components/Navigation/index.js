import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Location } from '@reach/router';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useTheme } from '../layout';
import Button from '../Button';
import Logo from '../../assets/images/logo.svg';
import SupportIcon from '../../assets/icons/Support';
import StatusIcon from '../../assets/icons/Status';
// import LearnIcon from '../../assets/icons/Learn';
import DocsIcon from '../../assets/icons/Docs';
import BlogIcon from '../../assets/icons/Blog';
import IDEIcon from '../../assets/icons/Ide';
import EmbedIcon from '../../assets/icons/Embed';
import CIIcon from '../../assets/icons/Ci';
import TeamsIcon from '../../assets/icons/Teams';
import SearchIcon from '../../assets/icons/Search';
import HighlightedICon from '../../assets/icons/Highlighted';
import NewIcon from '../../assets/icons/New';
import { useLogin } from '../../hooks/useLogin';
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

const Navigation = () => {
  const user = useLogin();
  const [openedNav, setOpenedNav] = useState();
  const [hasOpened, setHasOpened] = useState(false);
  const muted = useTheme().homepage.muted;

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
        fill={muted}
        d="M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z"
      />
    </svg>
  );

  useEffect(() => {
    if (openedNav) {
      setHasOpened(true);
    } else {
      setHasOpened(false);
    }
  }, [openedNav]);

  return (
    <Location>
      {({ location: { pathname } }) => (
        <div onMouseLeave={() => setOpenedNav(null)}>
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
                  <LogoWrapper to="/">
                    <LogoImage src={Logo} alt="CodeSandbox Logo" />
                    CodeSandbox
                  </LogoWrapper>
                  <List>
                    <li>
                      <button
                        onMouseEnter={() => setOpenedNav('features')}
                        type="button"
                      >
                        Features
                        <DownButton />
                      </button>
                    </li>
                    <li>
                      <button
                        onMouseEnter={() => setOpenedNav('explore')}
                        type="button"
                      >
                        Explore
                        <DownButton />
                      </button>
                    </li>
                    <li>
                      <button
                        onMouseEnter={() => setOpenedNav('resources')}
                        type="button"
                      >
                        Resources
                        <DownButton />
                      </button>
                    </li>
                    <li>
                      <button
                        onMouseEnter={() => setOpenedNav('support')}
                        type="button"
                      >
                        Support
                        <DownButton />
                      </button>
                    </li>

                    <li>
                      <Link
                        to="/pricing"
                        onMouseEnter={() => setOpenedNav(null)}
                      >
                        Pricing
                      </Link>
                    </li>
                  </List>
                  <List>
                    {!user && (
                      <li className="tablet-remove">
                        <a
                          onMouseEnter={() => setOpenedNav(null)}
                          href={signInPageUrl()}
                        >
                          Sign In
                        </a>
                      </li>
                    )}
                    <LogIn onMouseEnter={() => setOpenedNav(null)}>
                      <Button
                        css={`
                          background: #5962df;
                        `}
                        className="button"
                        href="/s"
                      >
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
              <MobileNav />
            </Header>
          </motion.div>
          <AnimatePresence initial={false}>
            {openedNav ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 109 }}
                exit={{ opacity: 0, height: 0 }}
                css={`
                  position: absolute;
                  width: 100%;
                  background: #151515;
                  overflow: hidden;
                  z-index: 99;
                  box-shadow: 0, 8px, 1rem rgba(0, 0, 0, 0.12), 0, 4px,
                    2px rgba(0, 0, 0, 0.24);
                  display: flex;
                  align-items: center;
                `}
                transition={{
                  duration: 0.2,
                  ease: 'easeIn',
                }}
              >
                <SubNav
                  openedNav={openedNav}
                  hasOpened={hasOpened}
                  name="resources"
                  components={[
                    {
                      Icon: () => (
                        <Link to="/docs/start" title="Documentation">
                          <DocsIcon />
                        </Link>
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
                  hasOpened={hasOpened}
                  name="support"
                  components={[
                    {
                      Icon: () => (
                        <a href="mailto:hello@codesandbox.io" title="Support">
                          <SupportIcon />
                        </a>
                      ),
                      Label: () => (
                        <a href="mailto:hello@codesandbox.io">
                          Contact Support
                        </a>
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
                  hasOpened={hasOpened}
                  name="features"
                  components={[
                    {
                      Icon: () => (
                        <Link to="/ide">
                          <IDEIcon />
                        </Link>
                      ),
                      Label: () => <Link to="/ide">IDE</Link>,
                    },
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
                      Label: () => <Link to="/ci">CI</Link>,
                    },
                    {
                      Icon: () => (
                        <Link to="/team">
                          <TeamsIcon />
                        </Link>
                      ),
                      Label: () => <Link to="/team">Teams</Link>,
                    },
                    {
                      Icon: () => (
                        <Link to="/changelog">
                          <NewIcon />
                        </Link>
                      ),
                      Label: () => <Link to="/changelog">What's New</Link>,
                    },
                  ]}
                />
                <SubNav
                  openedNav={openedNav}
                  hasOpened={hasOpened}
                  name="explore"
                  components={[
                    {
                      Icon: () => (
                        <Link to="/explore">
                          <HighlightedICon />
                        </Link>
                      ),
                      Label: () => (
                        <Link to="/explore">Featured Sandboxes</Link>
                      ),
                    },
                    {
                      Icon: () => (
                        <a href="/search">
                          <SearchIcon />
                        </a>
                      ),
                      Label: () => <a href="/search">Search Sandboxes</a>,
                    },
                  ]}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </Location>
  );
};

export default Navigation;
