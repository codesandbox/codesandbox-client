import React from 'react';
import styled from 'styled-components';

import CrossIcon from 'react-icons/lib/md/clear';
import ChevronIcon from 'react-icons/lib/md/keyboard-arrow-right';
import Margin from 'app/components/spacing/Margin';
import Tooltip from 'app/components/Tooltip';

const Container = styled.div`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
`;

const IntegrationBlock = styled.div`
  display: inline-flex;

  align-items: center;

  background-color: ${props => props.bgColor};

  color: white;

  font-size: 1.25rem;

  padding: 1rem 1.5rem;
`;

const Details = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
      <Tooltip title="Sign in">
        <Action onClick={signIn}>
          <ChevronIcon />
        </Action>
      </Tooltip>
    )}
  </Details>
);

type Props = {
  Icon: React.CElement,
  name: string,
  color: string,
  description: string,
  loggedIn: boolean,
};

export default ({ Icon, name, description, color, loggedIn }: Props) => (
  <Container>
    <IntegrationBlock bgColor={color}>
      <Icon />
      <Name>{name}</Name>
    </IntegrationBlock>
    {!loggedIn ? (
      <DetailInfo
        signOut={() => {}}
        heading="Signed in as"
        info="ives.v.h@gmail.com"
      />
    ) : (
      <DetailInfo signIn={() => {}} heading="Enables" info={description} />
    )}
  </Container>
);
