import React from 'react';
import styled from 'styled-components';

import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Button from 'app/components/buttons/Button';

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 10%;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;

  > button {
    margin: 1rem;
  }
`;

const TokenContainer = styled.input`
  color: white;

  width: 100%;
  max-width: 20em;
  border: none;
  outline: none;
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  margin: auto;

  border-radius: 2px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);

  background-color: rgba(0, 0, 0, 0.5);
`;

type Props = {
  error: ?string,
  token: ?string,
  loading: boolean,
  username: ?string,
  signIn: () => void,
};

const select = event => event.target.select();

export default ({ error, token, loading, username, signIn }: Props) => {
  if (error) {
    return (
      <Container>
        <Title>An error occured:</Title>
        <SubTitle>{error}</SubTitle>
        <Buttons>
          <Button href="/">Go to homepage</Button>
        </Buttons>
      </Container>
    );
  }

  if (!username) {
    return (
      <Container>
        <Title>Welcome to CodeSandbox!</Title>
        <SubTitle>
          You need to sign in with your GitHub account to use the CLI.
        </SubTitle>
        <Buttons>
          <Button onClick={signIn}>Sign in with Github</Button>
        </Buttons>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Title>Fetching authorization key...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Hello {username}!</Title>
      <SubTitle>
        The CLI needs authorization to work.
        <br />Please paste the following code in the CLI:
      </SubTitle>
      <TokenContainer onClick={select} value={token} />
    </Container>
  );
};
