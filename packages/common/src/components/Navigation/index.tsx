import React from 'react';
import styled, { css } from 'styled-components';
import GithubIcon from 'react-icons/lib/go/mark-github';
import Logo from '../Logo';
import MaxWidth from '../flex/MaxWidth';
import { Button } from '../Button';

import media from '../../utils/media';

const Container = styled.div`
  display: flex;
  align-items: center;
  font-family: Poppins, Roboto, sans-serif;
  padding: 1rem 0;
  width: 1440px;
  max-width: 100%;
  color: white;
  z-index: 5;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
`;

const StyledLogo = styled(Logo)`
  color: white;
  ${media.phone`
    width: 38px;
    height: 38px;
  `};
`;

const Item = styled.a<{
  button?: boolean;
  hidePhone?: boolean;
  hideOn?: number;
}>`
  display: inline-flex;
  align-items: center;
  transition: 0.2s ease color;
  font-size: 18px;
  text-decoration: none;
  color: white;

  margin: 0 1rem;

  &:hover {
    color: ${props => props.theme.secondary};
  }

  ${media.phone`
    font-size: 1rem;
    margin: 0 .5rem;
  `};

  ${props =>
    props.hidePhone &&
    css`
      ${media.phone`
      display: none;
    `};
    `};

  ${props =>
    props.hideOn &&
    css`
      @media (max-width: ${props.hideOn}px) {
        display: none;
      }
    `};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  width: 45px;
  height: 45px;
  margin-bottom: 0;
  border: 2px solid ${props => props.theme.secondary};
  box-sizing: border-box;
  border-radius: 4px;
`;

export default class Navigation extends React.PureComponent {
  state = {
    user: null,
  };

  fetchCurrentUser = () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));

    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    window
      .fetch(BASE + '/api/v1/users/current', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then(x => x.json())
      .then(({ data }) => this.setState({ user: data }))
      .catch(() => {
        /* do nothing */
      });
  };

  componentDidMount() {
    if (localStorage.getItem('jwt')) {
      this.fetchCurrentUser();
    }
  }

  render() {
    const { user } = this.state;
    return (
      <MaxWidth width={1440}>
        <Container>
          <Left>
            <a href="/">
              <StyledLogo
                width={40}
                height={40}
                style={{ marginRight: '1rem' }}
              />
            </a>

            <Item href="/explore">Explore</Item>
            <Item href="/features">Features</Item>
            <Item href="/pricing">Pricing</Item>

            <Item href="/about-us">About us</Item>
          </Left>

          <Right>
            <Button
              style={{
                marginRight: 16,
              }}
              small
              secondary={!user}
              href="/s"
            >
              Create Sandbox
            </Button>

            {!user && (
              <Button small href="/signin">
                <>
                  <GithubIcon
                    width="15"
                    style={{
                      marginRight: 5,
                    }}
                  />{' '}
                  Sign in with GitHub
                </>
              </Button>
            )}

            {user && (
              <Item
                style={{ margin: 0 }}
                hidePhone
                href={`/dashboard`}
                rel="noopener noreferrer"
              >
                <Image alt={user.username} src={user.avatar_url} />
              </Item>
            )}
          </Right>
        </Container>
      </MaxWidth>
    );
  }
}
