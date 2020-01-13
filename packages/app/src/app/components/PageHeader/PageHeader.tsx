import React from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { Logo } from '@codesandbox/common/lib/components';
import { UserMenu } from '../UserMenu';
import {
  Container,
  Content,
  Left,
  Home,
  Separator,
  Right,
  Button,
} from './elements';

interface IPageHeaderProps {
  title: string;
  children: {
    left: React.ReactChildren;
    right: React.ReactChildren;
  };
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
  title = '',
  children,
}) => {
  const {
    actions: { signInClicked },
    state: { isLoggedIn, isAuthenticating },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
  };

  return (
    <Container>
      <Helmet>
        <title>{title ? `${title} - CodeSandbox` : `CodeSandbox`}</title>
      </Helmet>
      <Content>
        <Left>
          <Home to="/">
            <Logo width={38} height={38} />
          </Home>
          <Separator />
        </Left>
        <Right>
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button block onClick={handleSignIn} disabled={isAuthenticating}>
              Sign In
            </Button>
          )}
        </Right>
      </Content>
    </Container>
  );
};
