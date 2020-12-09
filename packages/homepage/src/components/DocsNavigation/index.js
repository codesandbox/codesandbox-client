import React, { useEffect, useState } from 'react';
import { Link, Location } from '@reach/router';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import Button from '../Button';
import Logo from '../../assets/images/logo.svg';
import { Global } from '../../pages/docs/_global';
import { useLogin } from '../../hooks/useLogin';
import {
  Header,
  Nav,
  Wrapper,
  UserAvatar,
  LogoWrapper,
  LogoImage,
  List,
  SearchWrapper,
  Search,
  LogIn,
  OpenSearch,
} from './elements';

const DocsNavigation = () => {
  const [enabled, setEnabled] = useState(true);
  const [search, setSearch] = useState(false);
  const user = useLogin();

  useEffect(() => {
    // Initialize Algolia search.
    if (window.docsearch) {
      window.docsearch({
        apiKey: '45db7de01ac97a7c4c673846830c4117',
        debug: false,
        indexName: 'codesandbox',
        inputSelector: '#algolia-doc-search',
      });
    } else {
      // eslint-disable-next-line
      console.warn('Search has failed to load and now is being disabled');

      setEnabled(false);
    }
  }, []);

  return (
    <Location>
      {({ location: { pathname } }) => (
        <Header>
          <Global />
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
                <List className="hide-m">
                  <li>
                    <Link
                      className={
                        pathname.includes('/docs') &&
                        !pathname.includes('/docs/api') &&
                        !pathname.includes('/docs/faq') &&
                        'active'
                      }
                      to="/docs"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={pathname.includes('/docs/api') && 'active'}
                      to="/docs/api"
                    >
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/docs/faq"
                      className={pathname.includes('/docs/faq') && 'active'}
                    >
                      FAQ
                    </Link>
                  </li>
                </List>
              </div>
              <List>
                {enabled ? (
                  <>
                    <OpenSearch onClick={() => setSearch(s => !s)}>
                      <svg width={32} height={32} fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17.752 17.46a4.759 4.759 0 11.707-.707l4.895 4.893-.708.708-4.894-4.895zm.766-3.701a3.759 3.759 0 11-7.518 0 3.759 3.759 0 017.518 0z"
                          fill="#757575"
                        />
                      </svg>
                    </OpenSearch>
                    <SearchWrapper open={search}>
                      <div>
                        <Search
                          placeholder="Search documentation"
                          id="algolia-doc-search"
                        />
                      </div>
                    </SearchWrapper>
                  </>
                ) : null}
                {!user && (
                  <li>
                    <a href={signInPageUrl()}>Sign In</a>
                  </li>
                )}
                <LogIn>
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
        </Header>
      )}
    </Location>
  );
};

export default DocsNavigation;
