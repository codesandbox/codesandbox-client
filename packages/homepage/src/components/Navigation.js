import React from 'react';
import styled, { css } from 'styled-components';

import Link from 'gatsby-link';

import Logo from 'common/components/Logo';
import MaxWidth from 'common/components/flex/MaxWidth';

import media from '../utils/media';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  color: white;
  z-index: 5;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
`;

const StyledLogo = styled(Logo)`
  ${media.phone`
    width: 38px;
    height: 38px;
  `};
`;

const Item = styled.a`
  display: inline-flex;
  align-items: center;
  transition: 0.2s ease color;
  font-size: 1.125rem;
  text-decoration: none;
  color: white;

  margin: 0 1rem;
  font-weight: 400;

  &:hover {
    color: ${props => props.theme.secondary};
  }

  ${props =>
    props.button &&
    css`
      transition: 0.3s ease all;
      padding: 0.35rem 0.8rem;
      border-radius: 4px;
      box-shadow: 0 3px 4px rgba(0, 0, 0, 0.3);
      background-image: linear-gradient(
        45deg,
        ${p => p.theme.secondary.darken(0.1)} 0%,
        ${p => p.theme.secondary} 100%
      );

      &:hover {
        transform: translateY(-3px);
        color: white;
      }
    `};

  ${props =>
    props.hidePhone &&
    css`
      ${media.phone`
      display: none;
    `};
    `};

  ${media.phone`
    font-size: 1rem;
    margin: 0 .5rem;
  `};
`;

const ItemLink = Item.withComponent(Link);

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  width: 1.75em;
  height: 1.75em;
  border-radius: 4px;
  margin-left: 0.75rem;
  margin-bottom: 0;
`;

export default class Navigation extends React.PureComponent {
  state = {
    user: null,
  };

  fetchCurrentUser = async () => {
    try {
      const jwt = JSON.parse(localStorage.getItem('jwt'));

      const BASE =
        process.env.NODE_ENV === 'development' ? 'https://codesandbox.dev' : '';

      const { data } = await window
        .fetch(BASE + '/api/v1/users/current', {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then(x => x.json());

      this.setState({ user: data });
    } catch (e) {
      // fail silently
    }
  };

  componentDidMount() {
    if (localStorage.getItem('jwt')) {
      this.fetchCurrentUser();
    }
  }

  render() {
    const { user } = this.state;
    return (
      <MaxWidth width={1280}>
        <Container>
          <Left>
            <Link to="/">
              <StyledLogo title="CodeSandbox" width={50} height={50} />
            </Link>
          </Left>
          <Right>
            <Item
              href="https://medium.com/@compuives"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </Item>
            <Item
              href="https://github.com/CompuIves/codesandbox-client"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Item>
            <ItemLink to="/changelog">Updates</ItemLink>
            <ItemLink to="/docs">Docs</ItemLink>
            <Item hidePhone href="/s" rel="noopener noreferrer" button={!user}>
              Create Sandbox
            </Item>
            {user && (
              <Item
                hidePhone
                href={`/u/${user.username}`}
                rel="noopener noreferrer"
              >
                {user.username}
                <Image alt={user.username} src={user.avatar_url} />
              </Item>
            )}
          </Right>
        </Container>
      </MaxWidth>
    );
  }
}
