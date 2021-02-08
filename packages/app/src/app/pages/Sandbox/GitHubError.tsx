import React from 'react';
import { Button, Grid, Text, Element } from '@codesandbox/components';
import { GithubIntegration } from 'app/pages/common/GithubIntegration';
import { Link } from 'react-router-dom';

export const GitHubError = ({ error, isLoggedIn, isGithub, signIn }) => {
  let errorMessage = null;
  const notLoggedIn = error.status === 404 && !isLoggedIn && isGithub;

  if (notLoggedIn) {
    errorMessage = (
      <Element marginTop={9} style={{ maxWidth: 400, width: '100%' }}>
        <Text size={4} block align="center" marginBottom={4}>
          Did you try to open a private GitHub repository and are you a{' '}
          <Link to="/pro">pro</Link>? Then you might need to sign in:
        </Text>
        <Button onClick={signIn}>Sign in</Button>
      </Element>
    );
  }

  if (isLoggedIn && isGithub && error.status !== 422) {
    errorMessage = (
      <Element marginTop={9} style={{ maxWidth: 400, width: '100%' }}>
        <Text size={4} block align="center" marginBottom={4}>
          Did you try to open a private GitHub repository and are you a{' '}
          <Link to="/pro">pro</Link>? Then you might need to get private access:
        </Text>
        <GithubIntegration small />
        <Text size={4} block align="center" marginTop={4}>
          If you{"'"}re importing a sandbox from an organization, make sure to
          enable organization access{' '}
          <a
            href="https://github.com/settings/connections/applications/c07a89833b557afc7be2"
            target="_blank"
            rel="noreferrer noopener"
          >
            here
          </a>
          .
        </Text>
      </Element>
    );
  }
  return (
    <>
      <Text weight="bold" size={6} marginBottom={4}>
        Something went wrong
      </Text>
      <Text size={4}>{error.message}</Text>

      <Grid
        marginTop={4}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: 400,
          width: '100%',
          gridGap: 8,
        }}
      >
        <a href="/s" style={{ textDecoration: 'none' }}>
          <Button>Create Sandbox</Button>
        </a>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Button>{isLoggedIn ? 'Dashboard' : 'Homepage'}</Button>
        </a>
      </Grid>

      {errorMessage}
    </>
  );
};
