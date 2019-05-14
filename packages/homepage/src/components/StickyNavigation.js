import theme from '@codesandbox/common/lib/theme';
import slugify from '@codesandbox/common/lib/utils/slugify';
import { Router } from '@reach/router';
import { Link } from 'gatsby';
import React from 'react';
import styled, { css } from 'styled-components';
import media from '../utils/media';
import getScrollPos from '../utils/scroll';

const Navigation = styled.nav`
  padding-top: 2rem;
  margin-right: 1rem;
  width: 300px;

  ${props =>
    props.fixed &&
    css`
      position: fixed;
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
    position: relative;
    padding-top: 0;
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

type Doc = {
  frontmatter: {
    title: string,
  },
  fields: {
    url: string,
  },
  headings: { value: string }[],
};
type Props = {
  docs: Doc[],
};

const SubLink = ({ node: { fields, headings } }: { node: Doc }) => (
  <ul style={{ marginTop: '.5rem' }} path={fields.url}>
    {headings.map(({ value }) => (
      <li key={value}>
        <SecondaryNavigationLink to={`${fields.url}#${slugify(value)}`}>
          {value}
        </SecondaryNavigationLink>
      </li>
    ))}
  </ul>
);

const activeStyle = {
  color: theme.secondary(),
  fontWeight: 700,
};

export default class StickyNavigation extends React.PureComponent<Props> {
  state = {
    fixed: false,
  };

  componentDidMount() {
    // To prevent jumping
    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll);
      this.handleScroll();
    }, 500);
    const { y } = getScrollPos(Date.now(), false);

    const { top, height } = document
      .getElementById('navigation')
      .getBoundingClientRect();

    this.top = y + top;
    this.height = height;
    this.footerTop =
      y + document.getElementById('footer').getBoundingClientRect().top;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { y } = getScrollPos(Date.now(), false);

    if (y + this.height + 32 > this.footerTop) {
      this.setState({
        absoluteTop: this.footerTop - 32 - this.height,
        fixed: false,
      });
    } else if (y > this.top && !this.state.fixed) {
      this.setState({ fixed: true, absoluteTop: null });
    } else if (y < this.top && this.state.fixed) {
      this.setState({ fixed: false, absoluteTop: null });
    }
  };

  render() {
    const { docs } = this.props;
    const { absoluteTop, fixed } = this.state;

    return (
      <Navigation absoluteTop={absoluteTop} fixed={fixed} id="navigation">
        <ul>
          {docs.map(node => (
            <NavigationItem key={node.frontmatter.title}>
              <PrimaryNavigationLink
                activeStyle={activeStyle}
                to={node.fields.url}
              >
                {node.frontmatter.title}
              </PrimaryNavigationLink>

              <Router>
                <SubLink node={node} path={node.fields.url} />
              </Router>
            </NavigationItem>
          ))}
        </ul>

        <MissingNotice
          href="https://github.com/codesandbox/codesandbox-client/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          Missing documentation?
          <br />
          Open an issue here!
        </MissingNotice>
      </Navigation>
    );
  }
}
