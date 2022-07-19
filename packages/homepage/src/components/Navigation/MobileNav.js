/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { Link } from 'gatsby';

import { motion, AnimatePresence } from 'framer-motion';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import Logo from '../../assets/logo';
import {
  MobileNav,
  LogoWrapper,
  PopUpNav,
  Headers,
  Items,
  LinkButton,
  UserAvatar,
  IconWrapper,
} from './elements';
import SupportIcon from '../../assets/icons/Support';
import StatusIcon from '../../assets/icons/Status';
import PricingIcon from '../../assets/icons/Pricing';
import DocsIcon from '../../assets/icons/Docs';
import BlogIcon from '../../assets/icons/Blog';
import CodeSandbox from '../../assets/icons/CodeSandbox';
import FeedbackIcon from '../../assets/icons/Feedback';
// import PrototypeIcon from "../../assets/icons/Prototype";
// import TeamsIcon from "../../assets/icons/Teams";

import SandpackIcon from '../../assets/icons/Sandpack';

import SearchIcon from '../../assets/icons/Search';
import HighlightedICon from '../../assets/icons/Highlighted';
import JobsIcon from '../../assets/icons/Jobs';
import Button from '../Button';
import { useLogin } from '../../hooks/useLogin';
import { OPEN_JOBS_COUNT } from '../../config/hiring';
import { JobBadge } from '../JobBadge';

export default () => {
  const user = useLogin();
  const [open, setOpen] = useState(false);
  return (
    <>
      <MobileNav>
        <LogoWrapper to="/">
          <Logo />
        </LogoWrapper>
        <div>
          {!user ? (
            <LinkButton as="a" href={signInPageUrl()}>
              Sign In
            </LinkButton>
          ) : (
            <a style={{ display: 'flex' }} href="/dashboard">
              <UserAvatar
                className="tablet-remove"
                src={user.avatar_url}
                alt={user.username}
              />
            </a>
          )}
          {open ? (
            <svg
              onClick={() => setOpen(!open)}
              width="19"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.77698 8.7747L14.1421 15.1399L14.9524 14.3296L8.5872 7.96448L15.0711 1.48059L14.2609 0.670365L7.77698 7.15425L0.810227 0.1875L0 0.997727L6.96675 7.96448L0.118729 14.8125L0.928955 15.6227L7.77698 8.7747Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              onClick={() => setOpen(!open)}
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 2.14193H0V0.996094H19V2.14193ZM19 8.57552H0V7.42969H19V8.57552ZM0 15.0013H19V13.8555H0V15.0013Z"
                fill="white"
              />
            </svg>
          )}
        </div>
      </MobileNav>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ height: 'calc(100vh - 48px)' }}
            initial={{
              height: 0,
              overflow: 'auto',
              position: 'relative',
              zIndex: 999,
            }}
            exit={{ height: 0 }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
          >
            <PopUpNav>
              <Headers>Product</Headers>
              <Items>
                <li>
                  <a
                    href="https://projects.codesandbox.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Projects"
                  >
                    <IconWrapper>
                      <CodeSandbox />
                    </IconWrapper>
                    <span>Projects</span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://codesandbox.io/ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="CodeSandbox for iOS"
                  >
                    <IconWrapper>
                      <CodeSandbox />
                    </IconWrapper>
                    <span>CodeSandbox for iOS</span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://sandpack.codesandbox.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Sandpack"
                  >
                    <IconWrapper>
                      <SandpackIcon />
                    </IconWrapper>
                    <span>Sandpack</span>
                  </a>
                </li>
                <li>
                  <Link to="/feedback">
                    <IconWrapper>
                      <FeedbackIcon />
                    </IconWrapper>
                    <span>Feedback</span>
                  </Link>
                </li>
              </Items>
              <Headers>Explore</Headers>
              <Items>
                <li>
                  <Link to="/explore">
                    <IconWrapper>
                      <HighlightedICon />
                    </IconWrapper>
                    <span>Featured Sandboxes</span>
                  </Link>
                </li>
                <li>
                  <a href="/search">
                    <IconWrapper>
                      <SearchIcon />
                    </IconWrapper>
                    <span>Search Sandboxes</span>
                  </a>
                </li>
              </Items>
              <Headers>Support</Headers>
              <Items>
                <li>
                  <a href="mailto:support@codesandbox.io" title="Support">
                    <IconWrapper>
                      <SupportIcon />
                    </IconWrapper>
                    <span>Contact Support</span>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://status.codesandbox.io"
                    title="Status"
                  >
                    <IconWrapper>
                      <StatusIcon />
                    </IconWrapper>
                    <span>Status</span>
                  </a>
                </li>
                <Headers>Resources</Headers>
                <Items>
                  <li>
                    <Link to="/pricing">
                      <IconWrapper>
                        <PricingIcon />
                      </IconWrapper>
                      <span>Pricing</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://codesandbox.io/docs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconWrapper>
                        <DocsIcon />
                      </IconWrapper>
                      <span>Documentation</span>
                    </a>
                  </li>
                  <li>
                    <Link to="/blog">
                      <IconWrapper>
                        <BlogIcon />
                      </IconWrapper>
                      <span>Blog</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobs">
                      <IconWrapper>
                        <JobsIcon />
                      </IconWrapper>
                      <span>
                        Jobs{' '}
                        {OPEN_JOBS_COUNT && (
                          <JobBadge>{OPEN_JOBS_COUNT}</JobBadge>
                        )}
                      </span>
                    </Link>
                  </li>
                </Items>
              </Items>
              <div
                css={`
                  padding: 4rem 1rem 0 1rem;
                `}
              >
                <Button
                  big
                  css={`
                    display: block;
                  `}
                  className="button"
                  href="/s"
                >
                  Create Sandbox
                </Button>
              </div>
            </PopUpNav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
