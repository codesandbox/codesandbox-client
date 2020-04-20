import React from 'react';
import styled, { css } from 'styled-components';
import theme from '@codesandbox/common/lib/theme';

import { Link } from 'gatsby';
import { Router } from '@reach/router';
import slugify from '@codesandbox/common/lib/utils/slugify';

import media from '../utils/media';

const Navigation = styled.nav`
  padding-top: 2rem;
  margin-right: 1rem;
  width: 250px;

  ${props =>
    props.fixed &&
    css`
      position: sticky;
      top: 0;
      height: 100vh;
    `};

  ${props =>
    props.absoluteTop &&
    css`
      position: absolute;
      top: ${props.absoluteTop}px;
    `};

  ${media.phone`
    padding-bottom: 1rem;
    padding-top: 2rem;
    position: relative;
    top: 0;
  `};

  overflow-y: auto;

  ul {
    margin-left: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
  }
`;

const NavigationItem = styled.li`
  margin-bottom: 1rem;
  padding: 0;
  border: 0;
`;

const PrimaryNavigationLink = styled(Link)`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.homepage.white};
  }
`;

const SecondaryNavigationLink = styled(Link)`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.homepage.white};
  }
`;

const MissingNotice = styled.a`
  transition: 0.3s ease color;
  display: block;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  &:hover {
    color: ${props => props.theme.homepage.white};
  }
`;

const SubLink = ({
  node: {
    fields: { slug },
    headings,
  },
}) => (
  <ul style={{ marginTop: '.5rem' }}>
    {headings.map(({ value }) => (
      <li key={value} style={{ marginLeft: '1rem' }}>
        <SecondaryNavigationLink to={`docs${slug}#${slugify(value)}`}>
          {value}
        </SecondaryNavigationLink>
      </li>
    ))}
  </ul>
);

export default class StickyNavigation extends React.PureComponent {
  state = {
    fixed: false,
  };

  render() {
    const { docs } = this.props;

    const activeStyle = {
      color: theme.secondary(),
      fontWeight: 700,
    };

    return (
      <Navigation
        fixed={this.state.fixed}
        absoluteTop={this.state.absoluteTop}
        id="navigation"
      >
        <ul>
          {docs.map(({ node }) => (
            <NavigationItem key={node.fields.title}>
              <PrimaryNavigationLink
                to={`docs${node.fields.slug}`}
                activeStyle={activeStyle}
              >
                {node.fields.title}
              </PrimaryNavigationLink>
              <Router>
                <SubLink node={node} path={`docs${node.fields.slug}`} />
              </Router>
            </NavigationItem>
          ))}
        </ul>

        <MissingNotice
          href="https://github.com/codesandbox/codesandbox-client/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Missing documentation?
          <br />
          Open an issue here!
        </MissingNotice>
      </Navigation>
    );
  }
}
