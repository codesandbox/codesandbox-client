import React from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { Logo } from '@codesandbox/common/lib/components/Logo';
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
    state: {
      isLoggedIn,
      isAuthenticating,
    },
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
          {children.left}
        </Left>
        <Right>
          {children.right}
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button block onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </Right>
      </Content>
    </Container>
  );
};
