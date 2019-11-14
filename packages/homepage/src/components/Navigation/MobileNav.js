import React, { useState } from 'react';
import { Link } from 'gatsby';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/images/logo.svg';
import {
  MobileNav,
  LogoWrapper,
  LogoImage,
  PopUpNav,
  Headers,
  Items,
  Pricing,
} from './elements';
import SupportIcon from '../../assets/icons/Support';
import StatusIcon from '../../assets/icons/Status';
import PricingIcon from '../../assets/icons/Pricing';
// import LearnIcon from '../../assets/icons/Learn';
import DocsIcon from '../../assets/icons/Docs';
import BlogIcon from '../../assets/icons/Blog';
// import IDEIcon from '../../assets/icons/Ide';
import EmbedIcon from '../../assets/icons/Embed';
import CIIcon from '../../assets/icons/Ci';
import TeamsIcon from '../../assets/icons/Teams';
import SearchIcon from '../../assets/icons/Search';
import HighlightedICon from '../../assets/icons/Highlighted';
import Button from '../Button';
// import NewIcon from '../../assets/icons/New';

export default () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MobileNav>
        <LogoWrapper to="/">
          <LogoImage src={Logo} alt="CodeSandbox Logo" />
          CodeSandbox
        </LogoWrapper>
        <div>
          <a href="https://codesandbox.io/signin">Sign In</a>
          {open ? (
            <svg
              onClick={() => setOpen(!open)}
              width="16"
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
            animate={{ y: -48 }}
            initial={{
              y: '100vh',
              position: 'absolute',
              width: '100%',
              zIndex: 2,
            }}
            exit={{ y: '-150vh' }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
          >
            <PopUpNav>
              <Headers>Features</Headers>
              <Items>
                <li>
                  <Link to="/embeds">
                    <section>
                      <EmbedIcon />
                    </section>
                    <span>Embed</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ci">
                    <section>
                      <CIIcon />
                    </section>
                    <span>CodeSandbox CI</span>
                  </Link>
                </li>
                <li>
                  <Link to="/teams">
                    <section>
                      <TeamsIcon />
                    </section>
                    <span>Teams</span>
                  </Link>
                </li>
              </Items>
              <Headers>Explore</Headers>
              <Items>
                <li>
                  <Link to="/explore">
                    <section>
                      <HighlightedICon />
                    </section>
                    <span>Highlighted Sandboxes</span>
                  </Link>
                </li>
                <li>
                  <Link to="/search">
                    <section>
                      <SearchIcon />
                    </section>
                    <span>Search Sandboxes</span>
                  </Link>
                </li>
              </Items>
              <Headers>Resources</Headers>
              <Items>
                <li>
                  <Link to="/docs">
                    <section>
                      <DocsIcon />
                    </section>
                    <span>Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog">
                    <section>
                      <BlogIcon />
                    </section>
                    <span>Blog</span>
                  </Link>
                </li>
              </Items>
              <Headers>Support</Headers>
              <Items>
                <li>
                  <a href="mailto:hello@codesandbox.io" title="Support">
                    <section>
                      <SupportIcon />
                    </section>
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
                    <section>
                      <StatusIcon />
                    </section>
                    <span>Status</span>
                  </a>
                </li>
                <Pricing>
                  <section>
                    <PricingIcon />
                  </section>
                  <span>Pricing</span>
                </Pricing>
              </Items>
              <Button
                css={`
                  margin-top: 4rem;
                  display: block;
                  padding: 6px 21px;
                `}
                className="button"
                href="/s"
              >
                Create Sandbox
              </Button>
            </PopUpNav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
