import React from 'react';
import styled, { css } from 'styled-components';

import CrossIcon from 'react-icons/lib/md/clear';

import Margin from 'common/components/spacing/Margin';
import Tooltip from 'common/components/Tooltip';
import Button from '../buttons/Button';

const Container = styled.div`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);

  ${props => props.loading && css`opacity: 0.5;`};
`;

const IntegrationBlock = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.bgColor};
  flex: 1;
  color: white;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
`;

const Details = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  flex: 3;
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Name = styled.span`
  margin-left: 0.75rem;
  font-size: 1.375rem;
`;

const Heading = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const Info = styled.div`font-weight: 400;`;

const Action = styled.div`
  display: flex;
  transition: 0.3s ease all;
  border: 1px solid
    ${props => (props.red ? 'rgba(255, 0, 0, 0.4)' : props.theme.secondary)};
  border-radius: 4px;

  justify-content: center;
  align-items: center;

  color: ${props => (props.red ? 'rgba(255, 0, 0, 0.6)' : 'white')};

  background-color: ${props =>
    props.red ? 'transparent' : props.theme.secondary};

  opacity: 0.8;
  cursor: pointer;

  height: 1.5rem;
  width: 1.5rem;

  &:hover {
    opacity: 1;

    color: white;
    background-color: ${props =>
      props.red ? 'rgba(255, 0, 0, 0.6)' : props.theme.secondary};
  }
`;

type DetailProps = {
  heading: string,
  info: string,
  signOut: ?Function,
  signIn: ?Function,
};

const DetailInfo = ({ heading, info, signOut, signIn }: DetailProps) => (
  <Details>
    <Margin right={2}>
      <Heading>{heading}</Heading>
      <Info>{info}</Info>
    </Margin>

    {signOut ? (
      <Tooltip title="Sign out">
        <Action onClick={signOut} red>
          <CrossIcon />
        </Action>
      </Tooltip>
    ) : (
      <Button small onClick={signIn}>
        Sign in
      </Button>
    )}
  </Details>
);

type Props = {
  Icon: React.CElement,
  name: string,
  color: string,
  description: string,
  signOut: Function,
  signIn: Function,
  userInfo: ?{
    token: string,
    email: string,
    [key: string]: string,
  },
  loading: boolean,
};

export default ({
  Icon,
  name,
  signOut,
  signIn,
  description,
  color,
  userInfo,
  loading,
}: Props) => (
  <Container loading={loading}>
    <IntegrationBlock bgColor={color}>
      <Icon />
      <Name>{name}</Name>
    </IntegrationBlock>
    {userInfo ? (
      <DetailInfo
        signOut={signOut}
        heading="Signed in as"
        info={userInfo.email || 'Loading...'}
      />
    ) : (
      <DetailInfo signIn={signIn} heading="Enables" info={description} />
    )}
  </Container>
);
