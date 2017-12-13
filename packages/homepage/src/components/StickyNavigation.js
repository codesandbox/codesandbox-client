import React from 'react';
import styled, { css } from 'styled-components';
import theme from 'common/theme';

import Link from 'gatsby-link';
import slugify from 'common/utils/slugify';

import media from '../utils/media';
import getScrollPos from '../utils/scroll';

const Navigation = styled.nav`
  padding-top: 2rem;
  margin-right: 1rem;
  width: 250px;

  ${props =>
    props.fixed &&
    css`
      position: fixed;
      top: 0;
      height: 100vh;
    `};

  ${media.phone`
    padding-bottom: 1rem;
    position: relative;
    padding-top: 0;
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
    color: white;
  }
`;

const SecondaryNavigationLink = styled(Link)`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  margin-left: 1rem;

  &:hover {
    color: white;
  }
`;

const MissingNotice = styled.a`
  transition: 0.3s ease color;
  display: block;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  &:hover {
    color: white;
  }
`;

type Props = {
  docs: Array<{
    frontmatter: {
      title: string,
    },
    fields: {
      url: string,
    },
    headings: Array<{ value: string }>,
  }>,
};

export default class StickyNavigation extends React.PureComponent<Props> {
  state = {
    fixed: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    const { y } = getScrollPos(Date.now(), false);
    this.top =
      y + document.getElementById('navigation').getBoundingClientRect().top;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { y } = getScrollPos(Date.now(), false);

    if (y > this.top && !this.state.fixed) {
      this.setState({ fixed: true });
    } else if (y < this.top && this.state.fixed) {
      this.setState({ fixed: false });
    }
  };

  render() {
    const { docs } = this.props;

    const activeStyle = {
      color: theme.secondary(),
      fontWeight: 700,
    };

    return (
      <Navigation fixed={this.state.fixed} id="navigation">
        <ul>
          {docs.map(({ node }) => (
            <NavigationItem key={node.frontmatter.title}>
              <PrimaryNavigationLink
                to={node.fields.url}
                exact
                activeStyle={activeStyle}
              >
                {node.frontmatter.title}
              </PrimaryNavigationLink>
              <ul>
                {node.headings.map(({ value }) => (
                  <li key={value}>
                    <SecondaryNavigationLink
                      to={node.fields.url + `#${slugify(value)}`}
                      exact
                      activeStyle={activeStyle}
                    >
                      {value}
                    </SecondaryNavigationLink>
                  </li>
                ))}
              </ul>
            </NavigationItem>
          ))}
        </ul>

        <MissingNotice
          href="https://github.com/CompuIves/codesandbox-client/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Missing documentation?<br />Open an issue here!
        </MissingNotice>
      </Navigation>
    );
  }
}
